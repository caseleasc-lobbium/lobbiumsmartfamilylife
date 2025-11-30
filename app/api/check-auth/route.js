import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // ✅ Konsistenter Cookie-Name: lobbium_admin_auth
  const session = cookies().get("lobbium_admin_auth");
  const authorized = session?.value === "true";
  return NextResponse.json({ authorized });
}