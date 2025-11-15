import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { data, error } = await supabase.from("site_header").select("*").eq("active", true).single();

  if (error) {
    console.error("Header Load Error:", error);
    return NextResponse.json({ error: "Failed loading header" }, { status: 500 });
  }

  return NextResponse.json(data);
}