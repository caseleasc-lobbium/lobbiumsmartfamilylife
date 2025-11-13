import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./app/i18n";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const pathname = url.pathname;

  // 1️⃣ Entwicklungs- & Preview-Umgebungen freigeben
  if (
    host.includes("localhost") || 
    host.includes("vercel.app") // 🔓 Vercel Dev/Preview frei
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Maintenance-Schutz für Hauptdomain (nur lobbium.com)
  if (host.includes("lobbium.com") && !pathname.startsWith("/maintenance")) {
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Admin- & API-Schutz (nur bei aktiver Seite)
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/affiliates")) {
    const isAdmin = req.cookies.get("lobbiumAdminAuth")?.value === "true";

    if (!isAdmin && !pathname.startsWith("/admin/login")) {
      // Für API-Anfragen: JSON-Fehler zurückgeben
      if (pathname.startsWith("/api/")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Für normale Seiten: Weiterleitung auf Login
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // 4️⃣ Autoren-Schutz (optional)
  if (pathname.startsWith("/author")) {
    const isAuthor = req.cookies.get("isAuthor")?.value === "true";
    if (!isAuthor && !pathname.startsWith("/author/login")) {
      url.pathname = "/author/login";
      return NextResponse.redirect(url);
    }
  }

  // 5️⃣ Erlaubte öffentliche Seiten / Assets
  if (
    pathname.startsWith("/logo-test") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo.png")
  ) {
    return NextResponse.next();
  }

  // 6️⃣ Automatische Sprachweiterleitung (i18n)
  const PUBLIC_FILE = /\.(.*)$/;
  if (PUBLIC_FILE.test(pathname)) return NextResponse.next();

  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
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

// ✅ Nur relevante Pfade prüfen
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};