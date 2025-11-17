import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./app/i18n";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const pathname = url.pathname;

  // -------------------------------------------------
  // 1️⃣ DEVELOPMENT & PREVIEW FREIGEBEN
  // -------------------------------------------------
  if (
    host.includes("localhost") ||
    host.includes("vercel.app")
  ) {
    return NextResponse.next();
  }

  // -------------------------------------------------
  // 2️⃣ MAINTENANCE-MODUS DEAKTIVIERT
  // (nur kommentiert – jederzeit wieder aktivierbar)
  // -------------------------------------------------
  /*
  if (host.includes("lobbium.com") && !pathname.startsWith("/maintenance")) {
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }
  */

  // -------------------------------------------------
  // 3️⃣ ADMIN-BEREICH SCHÜTZEN (Supabase Session)
  // -------------------------------------------------
  if (pathname.startsWith("/admin")) {
    const sbAccessToken = req.cookies.get("sb-access-token")?.value;

    // Nicht eingeloggt → weiterleiten zum Admin Login
    if (!sbAccessToken && !pathname.startsWith("/admin/login")) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // -------------------------------------------------
  // 4️⃣ ÖFFENTLICHE SEITEN
  // -------------------------------------------------
  if (
    pathname.startsWith("/logo-test") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo.png")
  ) {
    return NextResponse.next();
  }

  // -------------------------------------------------
  // 5️⃣ i18n AUTO-REDIRECT (DE / FR / EN…)
  // -------------------------------------------------
  const PUBLIC_FILE = /\.(.*)$/;
  if (PUBLIC_FILE.test(pathname)) return NextResponse.next();

  const hasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    const langHeader = req.headers.get("accept-language") || "";
    const detectedLocale =
      locales.find((locale) => langHeader.includes(locale)) || defaultLocale;

    const redirectUrl = new URL(`/${detectedLocale}${pathname}`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// -------------------------------------------------
// 6️⃣ MIDDLEWARE MATCHER
// -------------------------------------------------
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};