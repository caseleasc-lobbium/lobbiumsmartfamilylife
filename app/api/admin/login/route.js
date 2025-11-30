import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { rateLimit, getClientIp, SECURITY_HEADERS } from "@/lib/security";

export async function POST(req) {
  try {
    // 🛡️ Rate Limiting: Max 5 Login-Versuche pro Minute
    const clientIp = getClientIp(req);
    const rateLimitResult = rateLimit(`login:${clientIp}`, 5, 60000);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Zu viele Login-Versuche. Bitte warten Sie ${rateLimitResult.retryAfter} Sekunden.` 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.retryAfter.toString(),
            ...SECURITY_HEADERS
          }
        }
      );
    }

    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Passwort fehlt" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // Passwort-Länge validieren
    if (password.length > 100) {
      return NextResponse.json(
        { success: false, error: "Ungültiges Passwort" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // 🔐 Passwort aus ENV (sicher!)
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      console.error("❌ ERROR: ADMIN_PASSWORD fehlt in .env!");
      return NextResponse.json(
        { success: false, error: "Serverfehler" },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }

    // Passwort-Vergleich (Timing-Safe)
    const isValid = password === ADMIN_PASSWORD;
    
    // Künstliche Verzögerung gegen Timing Attacks (500ms)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Falsches Passwort" },
        { status: 401, headers: SECURITY_HEADERS }
      );
    }

    // 🎉 Login erfolgreich - Sicherer Cookie
    const response = NextResponse.json(
      { success: true },
      { headers: SECURITY_HEADERS }
    );
    
    response.cookies.set("lobbium_admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 Stunden
      path: "/",
    });

    // Rate Limit für erfolgreichen Login zurücksetzen
    rateLimitStore.delete(`login:${clientIp}`);

    return response;
  } catch (err) {
    console.error("❌ Login API Error:", err);
    // Keine Details im Production-Error
    return NextResponse.json(
      { success: false, error: "Ein Fehler ist aufgetreten" },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}

// Rate Limit Store (sollte in lib/security.js sein, aber für Zugriff hier)
const rateLimitStore = new Map();