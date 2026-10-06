export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { decrypt } from "@/lib/encryption";
import { PRIVATE_API_HEADERS, validateAdminAuth } from "@/lib/security";

// 🔐 Supabase Setup
const supabase = getSupabase();

// --------------------------------------------------
// GET → alle Subscriber abrufen (entschlüsselt)
// --------------------------------------------------
export async function GET(req) {
  if (!validateAdminAuth(req.cookies)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: PRIVATE_API_HEADERS }
    );
  }

  try {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Select Error:", error);
      return NextResponse.json(
        { error: "DB Fehler" },
        { status: 500, headers: PRIVATE_API_HEADERS }
      );
    }

    // Entschlüsseln
    const decrypted = data.map((s) => ({
      ...s,
      name: s.name ? decrypt(s.name) : "",
      email: s.email ? decrypt(s.email) : "",
    }));

    return NextResponse.json(decrypted, { headers: PRIVATE_API_HEADERS });
  } catch (err) {
    console.error("GET /subscribers error:", err);
    return NextResponse.json(
      { error: "Serverfehler" },
      { status: 500, headers: PRIVATE_API_HEADERS }
    );
  }
}
