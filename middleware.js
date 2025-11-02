import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();

  // Ausnahme: Logo-Test und Maintenance-Seite selbst
  if (url.pathname.startsWith("/logo-test") || url.pathname.startsWith("/maintenance")) {
    return NextResponse.next();
  }

  // Alle anderen Seiten → Maintenance-Redirect
  if (!url.pathname.startsWith("/_next") && !url.pathname.startsWith("/api") && !url.pathname.startsWith("/static")) {
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
