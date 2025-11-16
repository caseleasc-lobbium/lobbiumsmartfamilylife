"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isInternal =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/login");

  const isHome = pathname === "/";

  const showFrame = !isInternal;          // Rahmen = Header + Footer
  const showHeader = showFrame && !isHome; // Header NICHT auf Startseite
  const showFooter = showFrame;           // Footer überall außer Admin/Auth

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
        {showHeader && <Header />}
        <main style={{ minHeight: "80vh" }}>{children}</main>
        {showFooter && <SiteFooter />}
      </body>
    </html>
  );
}