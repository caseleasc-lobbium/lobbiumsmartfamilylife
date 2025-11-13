import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Beispielhafte Login-Logik
    if (username === "admin" && password === "lobbium123") {
      const response = NextResponse.json({ success: true });
      response.cookies.set("lobbiumAdminAuth", "true", {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 1 Tag
      });
      return response;
    }

    return NextResponse.json({ success: false, error: "Ungültige Zugangsdaten" }, { status: 401 });
  } catch (err) {
    console.error("Login-Fehler:", err);
    return NextResponse.json({ error: "Serverfehler beim Login" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Admin-Login-API aktiv" });
}