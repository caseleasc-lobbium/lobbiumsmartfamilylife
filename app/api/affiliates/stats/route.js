import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Alle Affiliates
    const affiliates = await prisma.affiliates.findMany({
      orderBy: { id: "asc" }
    });

    // Alle Klicks
    const clicks = await prisma.affiliate_clicks.findMany({
      orderBy: { clicked_at: "desc" }
    });

    // Klicks pro Affiliate gruppieren
    const stats = affiliates.map((a) => {
      const filtered = clicks.filter((c) => c.partner_id === a.id);
      return {
        id: a.id,
        title: a.title,
        totalClicks: filtered.length,
        lastClick: filtered.length > 0 ? filtered[0].clicked_at : null,
      };
    });

    // Letzte 50 Klicks
    const latestClicks = clicks.slice(0, 50).map((c) => ({
      id: c.id,
      partner_id: c.partner_id,
      ip_address: c.ip_address,
      user_agent: c.user_agent,
      clicked_at: c.clicked_at,
    }));

    return NextResponse.json({
      totalPartners: affiliates.length,
      totalClicks: clicks.length,
      stats,
      latestClicks,
    });

  } catch (err) {
    console.error("Stats Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}