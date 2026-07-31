export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateAdminAuth } from "@/lib/security";

const supabase = getSupabase();

// GET – letzte Fehler-Log-Einträge (nur Admin)
export async function GET(req) {
  if (!validateAdminAuth(req.cookies)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("error_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// DELETE – Log leeren (nur Admin)
export async function DELETE(req) {
  if (!validateAdminAuth(req.cookies)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { error } = await supabase.from("error_logs").delete().neq("id", 0);
  if (error) {
    return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
