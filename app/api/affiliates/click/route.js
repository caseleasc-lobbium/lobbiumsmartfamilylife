export const dynamic = "force-dynamic";

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

    // Klick speichern
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

    return NextResponse.redirect(targetUrl);
  } catch (err) {
    console.error("Affiliate Click Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// -----------------------------
// GET → Klicks abrufen (für Dashboard)
// -----------------------------
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // "today" | "yesterday" | "all"

    let query = supabase
      .from("affiliate_clicks")
      .select("*")
      .order("clicked_at", { ascending: false });

    let { data, error } = await query;

    if (error) {
      console.error("Supabase GET Error:", error);
      return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
    }

    // Wenn kein Filter → alles zurück
    if (!filter || filter === "all") {
      return NextResponse.json(data, { status: 200 });
    }

    // Filter: Heute
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      const todayClicks = data.filter((c) =>
        c.clicked_at.startsWith(today)
      );
      return NextResponse.json(todayClicks, { status: 200 });
    }

    // Filter: Gestern
    if (filter === "yesterday") {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const yesterday = d.toISOString().split("T")[0];
      const yesterdayClicks = data.filter((c) =>
        c.clicked_at.startsWith(yesterday)
      );
      return NextResponse.json(yesterdayClicks, { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Affiliate Click GET Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}