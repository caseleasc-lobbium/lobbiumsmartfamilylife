import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const TOKENS_FILE = path.join(process.cwd(), "data", "magic_tokens.json");

// Token laden und validieren
function validateToken(token) {
  if (!fs.existsSync(TOKENS_FILE)) {
    return { valid: false, error: "Token nicht gefunden" };
  }

  const tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8"));
  const tokenData = tokens[token];

  if (!tokenData) {
    return { valid: false, error: "Ungültiger oder abgelaufener Token" };
  }

  // Prüfen ob Token abgelaufen ist
  if (Date.now() > tokenData.expiresAt) {
    // Token löschen
    delete tokens[token];
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
    return { valid: false, error: "Token ist abgelaufen" };
  }

  // Token löschen nach einmaliger Verwendung
  delete tokens[token];
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));

  return { valid: true, email: tokenData.email };
}

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token fehlt" },
        { status: 400 }
      );
    }

    const validation = validateToken(token);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 401 }
      );
    }

    // Token ist gültig - Supabase-kompatibles Cookie setzen
    const response = NextResponse.json({ 
      success: true, 
      message: "Login erfolgreich" 
    });

    // Original Cookie-Name für Middleware-Kompatibilität
    response.cookies.set("sb-access-token", "logged-in", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 Stunden
      path: "/",
    });

    console.log("✅ Magic Link Login erfolgreich für:", validation.email);
    return response;

  } catch (err) {
    console.error("❌ Token Verification Error:", err);
    return NextResponse.json(
      { error: "Serverfehler bei der Verifizierung" },
      { status: 500 }
    );
  }
}
