export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function isAuthorized(req) {
  const auth = req.headers.get("authorization");
  const key = process.env.ADMIN_SECRET || "lobbium_secure_key_2025_V6.1";
  return auth === `Bearer ${key}`;
}

export async function POST(req) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { partnerId, amount, currency, clickId } = await req.json();

    if (!partnerId || !amount) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("affiliate_revenue").insert({
      partner_id: partnerId,
      amount,
      currency: currency || "EUR",
      click_id: clickId || null,
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