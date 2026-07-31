import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getClientIp, SECURITY_HEADERS } from "@/lib/security";
import { rateLimitDb } from "@/lib/ratelimit";
import { verifyPassword } from "@/lib/password";
import { createSessionToken } from "@/lib/session";
import { loginSchema, parseBody } from "@/lib/validation";

export async function POST(req) {
  try {
    // 🛡️ Durables Rate Limiting: Max 5 Login-Versuche pro Minute
    const clientIp = getClientIp(req);
    const rateLimitResult = await rateLimitDb(`login:${clientIp}`, 5, 60);

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

    const parsed = parseBody(loginSchema, await req.json());
    if (!parsed.ok) {
      return NextResponse.json(
        { success: false, error: "Passwort fehlt" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }
    const { password } = parsed.data;

    // 🔐 Bevorzugt gehashtes Passwort (scrypt); Klartext nur als Legacy-Fallback
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD_HASH && !ADMIN_PASSWORD) {
      console.error("❌ ERROR: ADMIN_PASSWORD_HASH/ADMIN_PASSWORD fehlt in ENV!");
      return NextResponse.json(
        { success: false, error: "Serverfehler" },
        { status: 500, headers: SECURITY_HEADERS }
      );
    }

    // Passwort prüfen (Timing-Safe via scrypt + timingSafeEqual)
    const isValid = ADMIN_PASSWORD_HASH
      ? verifyPassword(password, ADMIN_PASSWORD_HASH)
      : password === ADMIN_PASSWORD;

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
    
    response.cookies.set("lobbium_admin_auth", createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 Stunden
      path: "/",
    });

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