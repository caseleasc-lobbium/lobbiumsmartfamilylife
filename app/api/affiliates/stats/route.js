import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    // 📌 Alle Partner laden
    const { data: affiliates, error: affiliatesError } = await supabase
      .from("affiliates")
      .select("*")
      .order("id", { ascending: true });

    if (affiliatesError) {
      console.error("Affiliate Load Error:", affiliatesError);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // 📌 Alle Klicks laden
    const { data: clicks, error: clicksError } = await supabase
      .from("affiliate_clicks")
      .select("*")
      .order("clicked_at", { ascending: false });

    if (clicksError) {
      console.error("Clicks Load Error:", clicksError);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // 📌 Klicks gruppieren pro Partner
    const stats = affiliates.map((a) => {
      const filtered = clicks.filter((c) => c.partner_id === a.id);
      return {
        id: a.id,
        title: a.title,
        totalClicks: filtered.length,
        lastClick: filtered[0]?.clicked_at || null,
      };
    });

    // 📌 Letzte 50 Klicks
    const latestClicks = clicks.slice(0, 50);

    // 📌 Heute & Gestern berechnen
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    const todayClicks = clicks.filter((c) =>
      c.clicked_at.startsWith(today)
    ).length;

    const yesterdayClicks = clicks.filter((c) =>
      c.clicked_at.startsWith(yesterday)
    ).length;

    // 📌 Ranking
    const rankingMap = {};
    clicks.forEach((c) => {
      rankingMap[c.partner_id] = (rankingMap[c.partner_id] || 0) + 1;
    });

    const ranking = Object.entries(rankingMap)
      .map(([partner_id, count]) => ({
        partner_id: Number(partner_id),
        count,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      totalPartners: affiliates.length,
      totalClicks: clicks.length,
      today: todayClicks,
      yesterday: yesterdayClicks,
      stats,
      ranking,
      latestClicks,
    });
  } catch (err) {
    console.error("Stats Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}