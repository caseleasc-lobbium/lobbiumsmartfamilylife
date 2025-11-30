export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const partnerId = Number(body.partnerId);

    if (!partnerId) {
      return NextResponse.json({ error: "partnerId fehlt" }, { status: 400 });
    }

    const { error } = await supabase.from("affiliate_clicks").insert({
      partner_id: partnerId,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("CLICK LOG ERROR:", error);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("LOG API ERROR:", e);
    return NextResponse.json({ error: true });
  }
}