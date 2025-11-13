import { NextResponse } from "next/server";

export async function POST(request) {
  const { password } = await request.json();
  const adminPass = process.env.ADMIN_PASSWORD || "lobbium2!#025tNLmWwui9";

  if (password === adminPass) {
    const response = NextResponse.json({ success: true });
    // ✅ Cookie für 24h setzen
    response.cookies.set("lobbium_admin_auth", "true", {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}