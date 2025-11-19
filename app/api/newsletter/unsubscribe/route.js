export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ----------------------------------
// Supabase Client (Service Role Key)
// ----------------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ----------------------------------
// GET → Nutzer will sich abmelden
// ----------------------------------
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token fehlt" }, { status: 400 });
    }

    // 🔍 Nutzer anhand des Tokens finden
    const { data: user, error: findError } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("token", token)
      .single();

    if (findError || !user) {
      return NextResponse.json(
        { error: "Newsletter-Eintrag nicht gefunden" },
        { status: 404 }
      );
    }

    // 🚨 Nutzer in "newsletter_unsubscribed" verschieben (Backup)
    await supabase.from("newsletter_unsubscribed").insert({
      email: user.email,
      name: user.name,
      locale: user.locale,
      unsubscribed_at: new Date().toISOString(),
    });

    // ❌ Original-Eintrag löschen
    const { error: deleteError } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Fehler beim Entfernen" },
        { status: 500 }
      );
    }

    // 🌍 Sprache des Nutzers nutzen
    const locale = user.locale || "en";

    // ✔ Weiterleitung auf Abmelde-Seite
    return NextResponse.redirect(
      `https://lobbium.com/${locale}/newsletter/abgemeldet`
    );

  } catch (err) {
    console.error("❌ Fehler bei UNSUBSCRIBE:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}