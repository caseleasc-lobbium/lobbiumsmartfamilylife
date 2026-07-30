import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const supabase = getSupabase();

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

    // Kategorie je Partner (für Kategorie-Aggregation)
    const catByPartner = {};
    affiliates.forEach((a) => {
      catByPartner[a.id] = (a.category || "").trim().toLowerCase();
    });

    // 📌 Klicks gruppieren pro Partner (nach Klicks absteigend sortiert)
    const stats = affiliates
      .map((a) => {
        const filtered = clicks.filter((c) => c.partner_id === a.id);
        return {
          id: a.id,
          title: a.title,
          category: catByPartner[a.id],
          totalClicks: filtered.length,
          lastClick: filtered[0]?.clicked_at || null,
        };
      })
      .sort((a, b) => b.totalClicks - a.totalClicks);

    // 📌 Zeitreihe: Klicks der letzten 7 Tage
    const perDay = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      const count = clicks.filter((c) => String(c.clicked_at).startsWith(day)).length;
      perDay.push({ day, count });
    }

    // 📌 Klicks pro Kategorie (über den Partner gejoint)
    const perCategory = {};
    clicks.forEach((c) => {
      const cat = catByPartner[c.partner_id] || "unbekannt";
      perCategory[cat] = (perCategory[cat] || 0) + 1;
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
      perDay,
      perCategory,
      ranking,
      latestClicks,
    });
  } catch (err) {
    console.error("Stats Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}