import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -----------------------------
// POST → Klick speichern + Weiterleiten
// -----------------------------
export async function POST(req) {
  try {
    const { partnerId, targetUrl, category, locale } = await req.json();

    if (!partnerId || !targetUrl) {
      return NextResponse.json(
        { error: "partnerId und targetUrl sind erforderlich" },
        { status: 400 }
      );
    }

    // IP & User-Agent lesen
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    // Klick speichern in Supabase
    const { error } = await supabase.from("affiliate_clicks").insert({
      partner_id: Number(partnerId),
      ip_address: ip,
      user_agent: userAgent,
      category: category || null,
      locale: locale || null,
    });

    if (error) {
      console.error("Supabase Click Insert Error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    // Weiterleitung zum Affiliate-Link
    return NextResponse.redirect(targetUrl);
  } catch (err) {
    console.error("❌ Affiliate Click Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}