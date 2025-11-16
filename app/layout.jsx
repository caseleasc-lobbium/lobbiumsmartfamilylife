"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
import TopTabs from "../components/TopTabs";   // ⬅️ Neu hinzufügen
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isInternal =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/login");

  const isHome = pathname === "/";

  const showFrame = !isInternal;           // Öffentliche Seiten
  const showHeader = showFrame && !isHome; // Header NICHT auf Startseite
  const showTabs = showFrame;              // Tabs auf ALLEN öffentlichen Seiten (inkl. Home)
  const showFooter = showFrame;            // Footer überall außer Admin

  return (
    <html lang="de">
      <body
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        {/* HEADER (nicht auf Home) */}
        {showHeader && <Header />}

        {/* NAVIGATION TABS – immer sichtbar auf public Seiten */}
        {showTabs && <TopTabs />}

        {/* CONTENT */}
        <main style={{ minHeight: "80vh" }}>{children}</main>

        {/* FOOTER */}
        {showFooter && <SiteFooter />}
      </body>
    </html>
  );
}