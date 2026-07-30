export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateAdminAuth } from "@/lib/security";

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

    // Klick speichern (Spalte clicked_at hat DB-Default now(); KEIN created_at!)
    const { error: clickError } = await supabase.from("affiliate_clicks").insert({
      partner_id: id,
      ip_address:
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown",
      user_agent: req.headers.get("user-agent") || "unknown",
    });
    if (clickError) {
      // Klick-Tracking darf die Weiterleitung nie blockieren – nur loggen.
      console.error("Klick-Insert Fehler:", clickError.message);
    }

    // Weiterleiten zum Partner
    return NextResponse.redirect(affiliateUrl);
  } catch (err) {
    console.error("Click Route Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// ------------------------------------------------------
// PUT – Partner bearbeiten (Admin)
// ------------------------------------------------------
export async function PUT(req, { params }) {
  try {
    if (!validateAdminAuth(req.cookies)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params.id);
    if (!id) {
      return NextResponse.json({ error: "Ungültige Partner-ID" }, { status: 400 });
    }

    const body = await req.json();
    const updates = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.category !== undefined)
      updates.category = (body.category || "").trim().toLowerCase();
    // Formular sendet imageUrl/link; alternativ image_url/affiliate_url
    const image_url = body.image_url ?? body.imageUrl;
    const affiliate_url = body.affiliate_url ?? body.link;
    if (image_url !== undefined) updates.image_url = image_url;
    if (affiliate_url !== undefined) updates.affiliate_url = affiliate_url;

    const { data, error } = await supabase
      .from("affiliates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PUT Error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("PUT /affiliates/[id] ERROR:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}