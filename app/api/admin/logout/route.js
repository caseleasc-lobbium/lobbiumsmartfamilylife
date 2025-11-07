import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // ✅ Cookie löschen
  res.cookies.set("admin_auth", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return res;
}