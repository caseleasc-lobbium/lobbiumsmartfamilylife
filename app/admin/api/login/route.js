import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "meinGeheimesPasswort123";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      // Cookie setzen
      cookies().set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 4, // 4 Stunden gültig
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Falsches Passwort." }, { status: 401 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Serverfehler." }, { status: 500 });
  }
}