import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const pathname = url.pathname;

  // 1️⃣ DEV und Preview erlauben
  if (host.includes("localhost") || host.includes("vercel.app")) {
    return NextResponse.next();
  }

  // 2️⃣ Maintenance AUSGESCHALTET (weiterleiten NICHT mehr)
  // -> wir entfernen die Maintenance-Redirect Zeile komplett
  // -> Seite ist offiziell öffentlich

  // 3️⃣ Admin-Bereich schützen
  if (pathname.startsWith("/admin")) {
    const sbAccessToken = req.cookies.get("sb-access-token")?.value;

    if (!sbAccessToken && !pathname.startsWith("/admin/login")) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // 4️⃣ Öffentliche Dateien erlauben
  const PUBLIC_FILE = /\.(.*)$/;
  if (PUBLIC_FILE.test(pathname)) return NextResponse.next();

  // ❌ 5️⃣ i18n Redirect wurde entfernt – KEIN "/de/" mehr
  // (Frontend bleibt original, URLs bleiben sauber)

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};