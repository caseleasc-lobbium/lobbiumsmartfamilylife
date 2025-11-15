export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Lokale Affiliate-Daten
const affiliatesPath = path.join(process.cwd(), "data_affiliates.json");
function loadAffiliates() {
  if (!fs.existsSync(affiliatesPath)) return [];
  return JSON.parse(fs.readFileSync(affiliatesPath, "utf8"));
}

export async function GET() {
  try {
    const affiliates = loadAffiliates();

    const todayISO = new Date().toISOString().slice(0, 10);
    const todayStart = todayISO + "T00:00:00.000Z";
    const todayEnd = todayISO + "T23:59:59.999Z";

    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);
    const yesterdayStart = yesterday + "T00:00:00.000Z";
    const yesterdayEnd = yesterday + "T23:59:59.999Z";

    // Alle Klicks laden
    const { data: clicks } = await supabase
      .from("affiliate_clicks")
      .select("partner_id, clicked_at");

    if (!clicks) {
      return NextResponse.json({
        error: "Keine Klickdaten gefunden",
      });
    }

    // Kategorien vorbereiten
    const categories = ["finanzen", "familie", "bildung", "lifestyle"];

    const stats = {};

    categories.forEach((cat) => {
      stats[cat] = {
        today: 0,
        yesterday: 0,
        total: 0,
        topPartner: null,
      };
    });

    // Klicks durchgehen
    clicks.forEach((c) => {
      const partner = affiliates.find((a) => a.id === c.partner_id);
      if (!partner) return;

      const category = partner.category?.toLowerCase();
      if (!category || !stats[category]) return;

      const time = c.clicked_at;

      // heute
      if (time >= todayStart && time <= todayEnd) {
        stats[category].today++;
      }

      // gestern
      if (time >= yesterdayStart && time <= yesterdayEnd) {
        stats[category].yesterday++;
      }

      // total
      stats[category].total++;

      // Ranking
      if (!stats[category].ranking) stats[category].ranking = {};
      stats[category].ranking[c.partner_id] =
        (stats[category].ranking[c.partner_id] || 0) + 1;
    });

    // Top Partner je Kategorie bestimmen
    categories.forEach((cat) => {
      const r = stats[cat].ranking;
      if (!r) return;

      const top = Object.entries(r).sort((a, b) => b[1] - a[1])[0];
      if (top) {
        stats[cat].topPartner = {
          partner_id: top[0],
          clicks: top[1],
        };
      }
    });

    return NextResponse.json(stats);
  } catch (err) {
    console.error("CATEGORY STATS ERROR:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}