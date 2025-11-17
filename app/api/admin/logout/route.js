import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Supabase Session-Cookies löschen
  res.cookies.set("sb-access-token", "", { maxAge: 0 });
  res.cookies.set("sb-refresh-token", "", { maxAge: 0 });

  return res;
}