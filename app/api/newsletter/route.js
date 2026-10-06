export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendTemplateEmail } from "@/lib/email";
import { encrypt, emailHash } from "@/lib/encryption";
import { getSupabase } from "@/lib/supabase";
import { newsletterSchema, parseBody } from "@/lib/validation";
import {
  getClientIp,
  PRIVATE_API_HEADERS,
  validateAdminAuth,
} from "@/lib/security";
import { rateLimitDb } from "@/lib/ratelimit";
import { logError } from "@/lib/errorlog";

const supabase = getSupabase();

const TEMPLATE_DOUBLE_OPT_IN = 1;

function createToken() {
  return crypto.randomBytes(32).toString("base64url");
}

// Basis-URL zuverlässig aus dem Request ableiten (funktioniert lokal & live).
function getOrigin(req) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
    } catch {}
  }
  const host = req.headers.get("host");
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL || "https://www.lobbium.com";
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function sendConfirmation({
  email,
  encryptedEmail,
  name,
  token,
  locale,
  origin,
}) {
  const payload = JSON.stringify({ type: "confirm", token, locale, name });
  const { data: queued, error: queueError } = await supabase
    .from("newsletter_queue")
    .insert({ email: encryptedEmail, payload, status: "pending" })
    .select("id")
    .maybeSingle();

  if (queueError) {
    await logError("newsletter.queue", queueError.message, {});
  }

  const result = await sendTemplateEmail({
    to: email,
    templateId: TEMPLATE_DOUBLE_OPT_IN,
    params: {
      CONFIRM_URL: `${origin}/api/newsletter/confirm?token=${token}&lang=${locale}`,
      NAME: name || "",
      LOCALE: locale,
    },
  });

  if (queued?.id) {
    const { error: statusError } = await supabase
      .from("newsletter_queue")
      .update({ status: result.success ? "sent" : "failed" })
      .eq("id", queued.id);
    if (statusError) {
      await logError("newsletter.queue-status", statusError.message, {});
    }
  }

  if (!result.success) {
    await logError("newsletter.brevo-confirm", result.error || "Send failed", {});
  }

  return result;
}

/* ============================================================================= */
/*                         POST – New Subscriber (Queue + Email)                 */
/* ============================================================================= */

export async function POST(req) {
  try {
    const parsed = parseBody(newsletterSchema, await req.json());
    if (!parsed.ok) {
      return NextResponse.json(
        { error: parsed.error },
        { status: 400, headers: PRIVATE_API_HEADERS }
      );
    }

    const rl = await rateLimitDb(`newsletter:${getClientIp(req)}`, 5, 3600);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Zu viele Anmeldungen. Bitte später erneut versuchen." },
        { status: 429, headers: PRIVATE_API_HEADERS }
      );
    }
    const { email, name, locale } = parsed.data;
    const origin = getOrigin(req);

    // 🔐 Verschlüsseln + deterministischer Hash für Dubletten-Prüfung
    const encryptedEmail = encrypt(email);
    const encryptedName = name ? encrypt(name) : null;
    const hash = emailHash(email);

    // 🔎 Bereits registriert?
    const { data: existing, error: existingError } = await supabase
      .from("newsletter_subscribers")
      .select("id, confirmed")
      .eq("email_hash", hash)
      .limit(1)
      .maybeSingle();

    if (existingError) {
      await logError("newsletter.lookup", existingError.message, {});
      return NextResponse.json(
        { error: "DB Fehler" },
        { status: 500, headers: PRIVATE_API_HEADERS }
      );
    }

    if (existing) {
      if (existing.confirmed) {
        // Schon bestätigt → klar ablehnen
        return NextResponse.json(
          { code: "already_subscribed" },
          { status: 409, headers: PRIVATE_API_HEADERS }
        );
      }
      const token2 = createToken();
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({ token: token2, locale })
        .eq("id", existing.id);
      if (updateError) {
        await logError("newsletter.pending-update", updateError.message, {});
        return NextResponse.json(
          { error: "DB Fehler" },
          { status: 500, headers: PRIVATE_API_HEADERS }
        );
      }

      const resent = await sendConfirmation({
        email,
        encryptedEmail,
        name,
        token: token2,
        locale,
        origin,
      });
      if (!resent.success) {
        return NextResponse.json(
          { error: "Bestaetigungs-E-Mail konnte nicht gesendet werden" },
          { status: 502, headers: PRIVATE_API_HEADERS }
        );
      }
      return NextResponse.json(
        { success: true, code: "pending_resent" },
        { headers: PRIVATE_API_HEADERS }
      );
    }

    const token = createToken();
    const unsubToken = createToken();

    // 1) Speichern in newsletter_subscribers
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: encryptedEmail,
        email_hash: hash,
        name: encryptedName,
        token,
        unsub_token: unsubToken,
        locale,
        confirmed: false,
      });

    if (insertError) {
      // Unique-Verletzung (Race) ebenfalls als „schon angemeldet" behandeln
      if (insertError.code === "23505") {
        return NextResponse.json(
          { code: "already_subscribed" },
          { status: 409, headers: PRIVATE_API_HEADERS }
        );
      }
      console.error("Supabase Insert ERROR:", insertError);
      return NextResponse.json(
        { error: "DB Fehler" },
        { status: 500, headers: PRIVATE_API_HEADERS }
      );
    }

    const sent = await sendConfirmation({
      email,
      encryptedEmail,
      name,
      token,
      locale,
      origin,
    });

    if (!sent.success) {
      return NextResponse.json(
        { error: "Bestaetigungs-E-Mail konnte nicht gesendet werden" },
        { status: 502, headers: PRIVATE_API_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true },
      { headers: PRIVATE_API_HEADERS }
    );
  } catch (error) {
    await logError("newsletter.POST", error);
    return NextResponse.json(
      { error: "Interner Fehler" },
      { status: 500, headers: PRIVATE_API_HEADERS }
    );
  }
}

/* ============================================================================= */
/*                                 GET – Admin View                              */
/* ============================================================================= */

export async function GET(req) {
  if (!validateAdminAuth(req.cookies)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: PRIVATE_API_HEADERS }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // today | all | recent

    let { data: entries, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET Error:", error);
      return NextResponse.json(
        { error: "DB Fehler" },
        { status: 500, headers: PRIVATE_API_HEADERS }
      );
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

    return NextResponse.json(entries, {
      status: 200,
      headers: PRIVATE_API_HEADERS,
    });
  } catch (error) {
    console.error("❌ Fehler bei GET /api/newsletter:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden" },
      { status: 500, headers: PRIVATE_API_HEADERS }
    );
  }
}
