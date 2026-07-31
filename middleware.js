import { NextResponse } from "next/server";

// Edge-kompatible Verifikation des signierten Session-Tokens (Web Crypto).
function toB64Url(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64Url(s) {
  let t = s.replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  return atob(t);
}
async function verifyEdgeToken(token) {
  try {
    if (!token) return false;
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return false;
    const secret =
      process.env.ADMIN_SESSION_SECRET ||
      process.env.ENCRYPTION_KEY ||
      "dev-only-insecure-secret-change-me";
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
    if (toB64Url(new Uint8Array(sigBuf)) !== sig) return false;
    const json = JSON.parse(fromB64Url(payload));
    return typeof json.exp === "number" && Date.now() < json.exp;
  } catch {
    return false;
  }
}

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const pathname = url.pathname;

  // 🛡️ Security Headers für alle Responses
  const response = NextResponse.next();
  
  // Security Headers hinzufügen
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  // CSP Header (Content Security Policy)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://pvmehyinztpqasothxro.supabase.co https://api.brevo.com",
    "frame-ancestors 'none'"
  ].join("; ");
  
  response.headers.set("Content-Security-Policy", csp);

  // 1️⃣ DEV und Preview erlauben
  if (host.includes("localhost") || host.includes("vercel.app")) {
    return response;
  }

  // 3️⃣ Admin-Bereich schützen – signiertes Token verifizieren
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("lobbium_admin_auth")?.value;
    if (!(await verifyEdgeToken(token))) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // 4️⃣ Öffentliche Dateien erlauben
  const PUBLIC_FILE = /\.(.*)$/;
  if (PUBLIC_FILE.test(pathname)) return response;

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};