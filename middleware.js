import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();

  // 🧠 Wenn du lokal entwickelst (localhost), wird die Middleware deaktiviert
  if (req.headers.get("host")?.includes("localhost")) {
    return NextResponse.next();
  }

  // ✅ Erlaubte Seiten: Logo-Test & Maintenance
  if (
    url.pathname.startsWith("/logo-test") ||
    url.pathname.startsWith("/maintenance") ||
    url.pathname.startsWith("/logo.png") ||
    url.pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // 🚫 Alle anderen Anfragen auf Maintenance umleiten
  url.pathname = "/maintenance";
  return NextResponse.redirect(url);
}
