import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// -----------------------------
// POST → Klick speichern + Weiterleiten
// -----------------------------
export async function POST(req) {
  try {
    const { partnerId, targetUrl, category, locale } = await req.json();

    if (!partnerId || !targetUrl) {
      return NextResponse.json(
        { error: "partnerId und targetUrl sind erforderlich" },
        { status: 400 }
      );
    }

    // IP & User-Agent aus Header lesen
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    // Klick speichern
    await prisma.affiliate_clicks.create({
      data: {
        partner_id: Number(partnerId),
        ip_address: ip,
        user_agent: userAgent,
        category: category || null,
        locale: locale || null,
      },
    });

    // Weiterleitung zum Affiliate-Link
    return NextResponse.redirect(targetUrl);
  } catch (err) {
    console.error("❌ Affiliate Click Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}