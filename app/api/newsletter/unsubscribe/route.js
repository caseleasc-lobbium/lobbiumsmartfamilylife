export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const supabase = getSupabase();

// GET → Ein-Klick-Abmeldung (Link aus dem Newsletter). Matcht unsub_token ODER token.
export async function GET(req) {
  const origin = new URL(req.url).origin;
  try {
    const token = new URL(req.url).searchParams.get("token");
    if (!token) return NextResponse.redirect(`${origin}/newsletter/abgemeldet`);

    let { data: user } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("unsub_token", token)
      .maybeSingle();

    if (!user) {
      const alt = await supabase.from("newsletter_subscribers").select("*").eq("token", token).maybeSingle();
      user = alt.data;
    }

    if (user) {
      // Backup + aus der aktiven Liste entfernen
      try {
        await supabase.from("newsletter_unsubscribed").insert({
          email: user.email, name: user.name, locale: user.locale, unsubscribed_at: new Date().toISOString(),
        });
      } catch {}
      await supabase.from("newsletter_subscribers").delete().eq("id", user.id);
    }

    return NextResponse.redirect(`${origin}/newsletter/abgemeldet`);
  } catch (err) {
    console.error("❌ UNSUBSCRIBE:", err);
    return NextResponse.redirect(`${origin}/newsletter/abgemeldet`);
  }
}
