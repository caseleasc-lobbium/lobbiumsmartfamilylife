import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("site_footer")
      .select("sections, copyright")
      .single();

    if (error) {
      console.error("Footer API error:", error);
      return NextResponse.json({ error: "Load error" }, { status: 500 });
    }

    // Rückgabe sauber strukturiert
    return NextResponse.json({
      sections: data.sections || {},
      copyright: data.copyright || "",
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}