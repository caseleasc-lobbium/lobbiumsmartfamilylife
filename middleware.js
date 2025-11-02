import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();

  // ✅ Erlaubte Seiten: Logo-Test + Maintenance
  if (url.pathname.startsWith("/logo-test") || url.pathname.startsWith("/maintenance")) {
    return NextResponse.next();
  }

  // ❌ Alle anderen Anfragen umleiten
  if (
    !url.pathname.startsWith("/_next") &&
    !url.pathname.startsWith("/api") &&
    !url.pathname.startsWith("/static") &&
    !url.pathname.startsWith("/favicon") &&
    !url.pathname.startsWith("/logo.png")
  ) {
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
