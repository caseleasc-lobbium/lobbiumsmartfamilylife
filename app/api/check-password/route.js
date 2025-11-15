import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // für Next.js 14 wichtig

export async function POST(request) {
  try {
    const body = await request.json();
    const password = body?.password?.trim();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Passwort fehlt" },
        { status: 400 }
      );
    }

    // 🔐 Passwort NUR aus ENV – sicher!
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      console.error("❌ ERROR: ADMIN_PASSWORD fehlt in .env!");
      return NextResponse.json(
        { success: false, error: "Serverfehler" },
        { status: 500 }
      );
    }

    // ❗ Vergleich
    const isCorrect = password === ADMIN_PASSWORD;

    if (!isCorrect) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🎉 Login erfolgreich
    const response = NextResponse.json({ success: true });

    // 🔒 Sicherer Cookie (24 Stunden gültig)
    response.cookies.set("lobbium_admin_auth", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("❌ Login API Error:", err);
    return NextResponse.json(
      { success: false, error: "Serverfehler" },
      { status: 500 }
    );
  }
}