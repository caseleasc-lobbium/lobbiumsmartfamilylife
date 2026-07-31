export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { decrypt } from "@/lib/encryption";
import { sendTemplateEmail } from "@/lib/email";

const supabase = getSupabase();

const TEMPLATE_WELCOME = 5; // "Lobbium – Willkommen"

function getOrigin(req) {
  const host = req.headers.get("host");
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL || "https://www.lobbium.com";
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// GET → Newsletter bestätigen (Double-Opt-In)
export async function GET(req) {
  const origin = getOrigin(req);
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(`${origin}/`);
    }

    // Token finden
    const { data: user, error: findError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("token", token)
      .single();

    if (findError || !user) {
      // Ungültiger/abgelaufener Link → freundlich zur Startseite statt roher 404
      return NextResponse.redirect(`${origin}/`);
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
      console.error("Supabase Update Error:", updateError);
    }

    // Willkommens-Mail (Brevo-Template) nur bei der ERSTEN Bestätigung
    if (!wasConfirmed) {
      try {
        const email = decrypt(user.email);
        const name = user.name ? decrypt(user.name) : "";
        if (email && email.includes("@")) {
          await sendTemplateEmail({
            to: email,
            templateId: TEMPLATE_WELCOME,
            params: { SITE_URL: origin, NAME: name, LOCALE: user.locale || "de" },
          });
        }
      } catch (e) {
        console.warn("⚠️ Willkommens-Mail übersprungen:", e.message);
      }
    }

    const lang = user.locale || "de";
    return NextResponse.redirect(`${origin}/newsletter/bestaetigt/?lang=${lang}`);
  } catch (err) {
    console.error("❌ Bestätigung Fehler:", err);
    return NextResponse.redirect(`${origin}/`);
  }
}
