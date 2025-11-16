export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ------------------------------------------------------
// POST → Klick speichern & User weiterleiten
// ------------------------------------------------------
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get("partnerId");
    const targetUrl = searchParams.get("targetUrl");

    if (!partnerId || !targetUrl) {
      return NextResponse.json(
        { error: "partnerId oder targetUrl fehlt" },
        { status: 400 }
      );
    }

    // IP & User Agent erfassen
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const ua = request.headers.get("user-agent") || "unknown";

    // Klick speichern
    const { error } = await supabase.from("affiliate_clicks").insert({
      partner_id: Number(partnerId),
      ip_address: ip,
      user_agent: ua,
    });

    if (error) {
      console.error("Supabase CLICK ERROR:", error);
      return NextResponse.redirect(targetUrl);
    }

    // Weiterleitung zum Affiliate Link
    return NextResponse.redirect(targetUrl);
  } catch (err) {
    console.error("CLICK ROUTE ERROR:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}