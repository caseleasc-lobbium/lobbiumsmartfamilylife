import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -----------------------------
// POST → Affiliate-Klick speichern
// -----------------------------
export async function POST(req) {
  try {
    const { partnerId, targetUrl } = await req.json();

    if (!partnerId || !targetUrl) {
      return NextResponse.json(
        { error: "Partner ID oder Ziel-URL fehlt" },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    // 📌 Klick in DB speichern
    const { error } = await supabase.from("affiliate_clicks").insert({
      partner_id: partnerId,
      ip_address: ip,
      user_agent: userAgent,
      clicked_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Speichern" },
        { status: 500 }
      );
    }

    // 🔁 Weiterleitung zum Partnerlink
    return NextResponse.redirect(targetUrl);

  } catch (err) {
    console.error("Affiliate Click Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}