export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { PRIVATE_API_HEADERS, validateAdminAuth } from "@/lib/security";

// Supabase
const supabase = getSupabase();

export async function GET(request) {
  if (!validateAdminAuth(request.cookies)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: PRIVATE_API_HEADERS }
    );
  }

  try {
    const todayISO = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
    const todayStart = todayISO + "T00:00:00.000Z";
    const todayEnd = todayISO + "T23:59:59.999Z";

    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);
    const yesterdayStart = yesterday + "T00:00:00.000Z";
    const yesterdayEnd = yesterday + "T23:59:59.999Z";

    // 🔹 Heute
    const { count: todayCount } = await supabase
      .from("affiliate_clicks")
      .select("*", { count: "exact", head: true })
      .gte("clicked_at", todayStart)
      .lte("clicked_at", todayEnd);

    // 🔸 Gestern
    const { count: yesterdayCount } = await supabase
      .from("affiliate_clicks")
      .select("*", { count: "exact", head: true })
      .gte("clicked_at", yesterdayStart)
      .lte("clicked_at", yesterdayEnd);

    // 🔥 Gesamt
    const { count: totalCount } = await supabase
      .from("affiliate_clicks")
      .select("*", { count: "exact", head: true });

    // 📊 Ranking (Partner-ID → Anzahl Klicks)
    const { data: allClicks } = await supabase
      .from("affiliate_clicks")
      .select("partner_id");

    const ranking = {};
    allClicks.forEach((c) => {
      ranking[c.partner_id] = (ranking[c.partner_id] || 0) + 1;
    });

    const sortedRanking = Object.entries(ranking)
      .map(([partner_id, count]) => ({ partner_id, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(
      {
        today: todayCount || 0,
        yesterday: yesterdayCount || 0,
        total: totalCount || 0,
        ranking: sortedRanking,
      },
      { headers: PRIVATE_API_HEADERS }
    );
  } catch (err) {
    console.error("AFFILIATE ANALYTICS ERROR:", err);
    return NextResponse.json(
      { error: "Serverfehler" },
      { status: 500, headers: PRIVATE_API_HEADERS }
    );
  }
}
