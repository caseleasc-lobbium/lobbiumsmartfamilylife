export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const supabase = getSupabase();

// ------------------------------------------------------
// FINAL CLEAN CLICK-ROUTE
// ------------------------------------------------------
export async function GET(req, { params }) {
  try {
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json({ error: "Ungültige Partner-ID" }, { status: 400 });
    }

    // Partner-LInk holen
    const { data, error } = await supabase
      .from("affiliates")
      .select("affiliate_url")
      .eq("id", id)
      .single();

    if (error || !data?.affiliate_url) {
      return NextResponse.json(
        { error: "Affiliate-Link nicht vorhanden" },
        { status: 400 }
      );
    }

    const affiliateUrl = data.affiliate_url;

    // Klick speichern
    await supabase.from("affiliate_clicks").insert({
      partner_id: id,
      ip_address:
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown",
      user_agent: req.headers.get("user-agent") || "unknown",
      created_at: new Date().toISOString()
    });

    // Weiterleiten zum Partner
    return NextResponse.redirect(affiliateUrl);
  } catch (err) {
    console.error("Click Route Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}