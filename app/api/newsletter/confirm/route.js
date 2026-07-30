export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// -----------------------------
// Supabase Client
// -----------------------------
const supabase = getSupabase();

// -----------------------------
// GET → Newsletter bestätigen
// -----------------------------
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token fehlt" }, { status: 400 });
    }

    // 🔍 Token in newsletter_subscribers finden
    const { data: user, error: findError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("token", token)
      .single();

    if (findError || !user) {
      return NextResponse.json(
        { error: "Abo nicht gefunden" },
        { status: 404 }
      );
    }

    // 🚀 Bestätigung setzen
    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        confirmed: true,
        consent: true,
        date_consent: new Date().toISOString()
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Supabase Update Error:", updateError);
      return NextResponse.json(
        { error: "Fehler beim Bestätigen" },
        { status: 500 }
      );
    }

    // 🔁 Weiterleitung auf Erfolg-Seite (Origin aus dem Request)
    const host = req.headers.get("host");
    const proto =
      req.headers.get("x-forwarded-proto") ||
      (host && host.includes("localhost") ? "http" : "https");
    const origin = host
      ? `${proto}://${host}`
      : process.env.NEXT_PUBLIC_SITE_URL || "https://www.lobbium.com";

    return NextResponse.redirect(`${origin}/newsletter/bestaetigt`);

  } catch (err) {
    console.error("❌ Bestätigung Fehler:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}