export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase";

const supabase = getSupabase();

function isAuthorized(req) {
  const auth = req.headers.get("authorization");
  const key = process.env.AFFILIATE_REVENUE_SECRET;
  if (!key || !auth?.startsWith("Bearer ")) return false;

  const provided = Buffer.from(auth.slice(7));
  const expected = Buffer.from(key);
  return (
    provided.length === expected.length &&
    crypto.timingSafeEqual(provided, expected)
  );
}

export async function POST(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const partnerId = Number(body.partnerId);
    const amount = Number(body.amount);
    const currency = String(body.currency || "EUR").trim().toUpperCase();
    const clickId = body.clickId ?? null;

    if (
      !Number.isInteger(partnerId) ||
      partnerId <= 0 ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !/^[A-Z]{3}$/.test(currency)
    ) {
      return NextResponse.json(
        { error: "Ungültige Umsatzdaten" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("affiliate_revenue").insert({
      partner_id: partnerId,
      amount,
      currency: currency || "EUR",
      click_id: clickId,
    });

    if (error) {
      console.error("Revenue Insert Error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Revenue Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
