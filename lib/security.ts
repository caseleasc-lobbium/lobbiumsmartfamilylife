// Security Utilities
import { verifySessionToken } from "./session";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
}

// Rate Limiting Store (In-Memory – für Production Redis/Upstash verwenden)
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Rate Limiting
 * @param identifier IP oder User ID
 * @param maxRequests Max Requests pro Zeitfenster
 * @param windowMs Zeitfenster in Millisekunden
 */
export function rateLimit(
  identifier: string,
  maxRequests = 5,
  windowMs = 60000
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  // Alte Einträge bereinigen
  rateLimitStore.forEach((v, k) => {
    if (now - v.resetTime > windowMs) {
      rateLimitStore.delete(k);
    }
  });

  const record = rateLimitStore.get(key);

  if (!record) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { allowed: true, remaining: maxRequests - 1 };
  }

  record.count++;

  if (record.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  return { allowed: true, remaining: maxRequests - record.count };
}

// Minimaler Typ für Objekte mit lesbaren Headern (Request / NextRequest).
type WithHeaders = { headers: { get(name: string): string | null } };

/** Client-IP aus dem Request extrahieren. */
export function getClientIp(request: WithHeaders): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded
    ? forwarded.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "unknown";
}

/** Einfache XSS-Bereinigung von String-Eingaben. */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return input;
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/** E-Mail-Format validieren. */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Minimaler Typ für Cookie-Stores (RequestCookies / next/headers cookies()).
type CookieStore = { get(name: string): { value?: string } | undefined };

/** Admin-Cookie validieren (signiertes, ablaufendes Session-Token). */
export function validateAdminAuth(cookies: CookieStore): boolean {
  const authCookie = cookies.get("lobbium_admin_auth");
  return verifySessionToken(authCookie?.value ?? null);
}

/** Standard-Security-Header. */
export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

/** Restriktive CORS-Header für erlaubte Origins. */
export function getCorsHeaders(origin: string): Record<string, string> {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    "http://localhost:3000",
    "https://lobbium.com",
  ].filter(Boolean) as string[];

  if (allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };
  }

  return {};
}

/** Fehlerantwort ohne sensible Details. */
export function safeErrorResponse(
  error: Error,
  isDevelopment = false
): { error: string; details?: string } {
  if (isDevelopment) {
    return {
      error: error.message || "Ein Fehler ist aufgetreten",
      details: error.stack,
    };
  }
  return {
    error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
  };
}
