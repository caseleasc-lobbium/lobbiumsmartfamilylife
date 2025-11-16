export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// -----------------------------
// Supabase Client
// -----------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

    // 🔍 Eintrag über Token finden
    const { data: user, error: findError } = await supabase
      .from("newsletter")
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
      .from("newsletter")
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

    // 🌍 Sprache erkennen (Fallback = deutsch)
    const locale = user.locale || "de";

    // 🔁 Weiterleitung auf Erfolg-Seite je nach Sprache
    return NextResponse.redirect(
      `https://lobbium.com/${locale}/newsletter/bestaetigt`
    );

  } catch (err) {
    console.error("❌ Bestätigung Fehler:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}