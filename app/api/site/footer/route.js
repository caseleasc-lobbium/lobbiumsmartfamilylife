import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from("site_footer")
    .select("*")
    .single();

  if (error) {
    console.error("Footer Load Error:", error);
    return NextResponse.json(
      { error: "Failed loading footer" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}