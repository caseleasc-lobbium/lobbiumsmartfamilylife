import { NextResponse } from "next/server";

export function middleware(req) {
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

  // 3️⃣ Admin-Bereich schützen - VERBESSERT
  if (pathname.startsWith("/admin")) {
    // Prüfe admin_auth Cookie (konsistent mit unserem System)
    const adminAuth = req.cookies.get("lobbium_admin_auth")?.value;

    // Allow login page and verify page
    if (!adminAuth && 
        !pathname.startsWith("/admin/login") && 
        !pathname.startsWith("/admin/verify")) {
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