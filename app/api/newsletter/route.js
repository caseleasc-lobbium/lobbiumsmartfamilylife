export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sendTemplateEmail } from "@/lib/email";
import { encrypt, emailHash } from "@/lib/encryption";
import { getSupabase } from "@/lib/supabase";
import { newsletterSchema, parseBody } from "@/lib/validation";
import { getClientIp } from "@/lib/security";
import { rateLimitDb } from "@/lib/ratelimit";
import { logError } from "@/lib/errorlog";

const supabase = getSupabase();

// Brevo-Template-IDs (in Brevo gepflegt)
const TEMPLATE_DOUBLE_OPT_IN = 1; // "Default Template Double opt-in confirmation"

// Basis-URL zuverlässig aus dem Request ableiten (funktioniert lokal & live).
function getOrigin(req) {
  const host = req.headers.get("host");
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL || "https://www.lobbium.com";
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/* ============================================================================= */
/*                         POST – New Subscriber (Queue + Email)                 */
/* ============================================================================= */

export async function POST(req) {
  try {
    // 🛡️ Rate-Limit gegen Spam-Anmeldungen: max 5 / Stunde je IP
    const rl = await rateLimitDb(`newsletter:${getClientIp(req)}`, 5, 3600);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Zu viele Anmeldungen. Bitte später erneut versuchen." },
        { status: 429 }
      );
    }

    const parsed = parseBody(newsletterSchema, await req.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { email, name, locale } = parsed.data;

    // 🔐 Verschlüsseln + deterministischer Hash für Dubletten-Prüfung
    const encryptedEmail = encrypt(email);
    const encryptedName = name ? encrypt(name) : null;
    const hash = emailHash(email);

    // 🔎 Bereits registriert?
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, confirmed")
      .eq("email_hash", hash)
      .limit(1)
      .maybeSingle();

    if (existing) {
      if (existing.confirmed) {
        // Schon bestätigt → klar ablehnen
        return NextResponse.json({ code: "already_subscribed" }, { status: 409 });
      }
      // Angemeldet, aber noch nicht bestätigt → Bestätigungsmail erneut senden
      const token2 = Math.random().toString(36).substring(2, 12);
      await supabase.from("newsletter_subscribers").update({ token: token2, locale: locale || "de" }).eq("id", existing.id);
      const confirmUrl2 = `${getOrigin(req)}/api/newsletter/confirm?token=${token2}&lang=${locale}`;
      await sendTemplateEmail({
        to: email,
        templateId: TEMPLATE_DOUBLE_OPT_IN,
        params: { CONFIRM_URL: confirmUrl2, NAME: name || "", LOCALE: locale },
      });
      return NextResponse.json({ success: true, code: "pending_resent" });
    }

    // 🔑 Token für Double-Opt-In
    const token = Math.random().toString(36).substring(2, 12);

    // 1) Speichern in newsletter_subscribers
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: encryptedEmail,
        email_hash: hash,
        name: encryptedName,
        token,
        locale: locale || "de",
        confirmed: false,
      });

    if (insertError) {
      // Unique-Verletzung (Race) ebenfalls als „schon angemeldet" behandeln
      if (insertError.code === "23505") {
        return NextResponse.json({ code: "already_subscribed" }, { status: 409 });
      }
      console.error("Supabase Insert ERROR:", insertError);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    // 2) Email in Queue einfügen (Protokoll)
    await supabase.from("newsletter_queue").insert({
      email: encryptedEmail,
      payload: JSON.stringify({ type: "confirm", token, locale: locale || "de", name }),
      status: "pending",
    });

    // 3) Double-Opt-In Mail über Brevo-Template versenden
    const confirmUrl = `${getOrigin(req)}/api/newsletter/confirm?token=${token}&lang=${locale}`;

    await sendTemplateEmail({
      to: email,
      templateId: TEMPLATE_DOUBLE_OPT_IN,
      params: {
        CONFIRM_URL: confirmUrl,
        NAME: name || "",
        LOCALE: locale,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    await logError("newsletter.POST", error);
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}

/* ============================================================================= */
/*                                 GET – Admin View                              */
/* ============================================================================= */

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // today | all | recent

    let { data: entries, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET Error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      entries = entries.filter(
        (n) => n.created_at && n.created_at.startsWith(today)
      );
    }

    if (filter === "recent") {
      entries = entries.slice(0, 10);
    }

    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error("❌ Fehler bei GET /api/newsletter:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}
