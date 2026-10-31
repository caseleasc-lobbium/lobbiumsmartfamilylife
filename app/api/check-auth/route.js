import { NextResponse } from "next/server";
import { PRIVATE_API_HEADERS, validateAdminAuth } from "@/lib/security";

export async function GET(request) {
  const authorized = validateAdminAuth(request.cookies);
  return NextResponse.json(
    { authorized },
    { headers: PRIVATE_API_HEADERS }
  );
}
