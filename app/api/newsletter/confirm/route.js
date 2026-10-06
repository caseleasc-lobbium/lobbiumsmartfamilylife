export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { decrypt } from "@/lib/encryption";
import { sendTemplateEmail } from "@/lib/email";
import { PRIVATE_API_HEADERS } from "@/lib/security";
import { logError } from "@/lib/errorlog";

const supabase = getSupabase();

const TEMPLATE_WELCOME = 5; // "Lobbium – Willkommen"

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

function redirect(url) {
  return NextResponse.redirect(url, { headers: PRIVATE_API_HEADERS });
}

// GET → Newsletter bestätigen (Double-Opt-In)
export async function GET(req) {
  const origin = getOrigin(req);
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token || token.length < 10 || token.length > 128) {
      return redirect(`${origin}/`);
    }

    // Token finden
    const { data: user, error: findError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("token", token)
      .single();

    if (findError || !user) {
      // Ungültiger/abgelaufener Link → freundlich zur Startseite statt roher 404
      return redirect(`${origin}/`);
    }

    const wasConfirmed = user.confirmed === true;

    // Bestätigung setzen
    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        confirmed: true,
        consent: true,
        date_consent: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      await logError("newsletter.confirm-update", updateError.message, {});
      return redirect(`${origin}/newsletter/?error=confirmation`);
    }

    // Willkommens-Mail (Brevo-Template) nur bei der ERSTEN Bestätigung
    if (!wasConfirmed) {
      try {
        const email = decrypt(user.email);
        const name = user.name ? decrypt(user.name) : "";
        if (email && email.includes("@")) {
          const unsubUrl = user.unsub_token
            ? `${origin}/api/newsletter/unsubscribe?token=${user.unsub_token}`
            : `${origin}/newsletter`;
          const welcome = await sendTemplateEmail({
            to: email,
            templateId: TEMPLATE_WELCOME,
            params: { SITE_URL: origin, NAME: name, LOCALE: user.locale || "de", UNSUB_URL: unsubUrl },
          });
          if (!welcome.success) {
            await logError(
              "newsletter.brevo-welcome",
              welcome.error || "Send failed",
              {}
            );
          }
        }
      } catch (e) {
        await logError("newsletter.welcome", e.message, {});
      }
    }

    const lang = user.locale || "de";
    return redirect(`${origin}/newsletter/bestaetigt/?lang=${lang}`);
  } catch (err) {
    await logError("newsletter.confirm", err, {});
    return redirect(`${origin}/`);
  }
}
