"use client";

import { usePathname } from "next/navigation";
import TopNav from "../components/TopNav";
import SiteFooter from "../components/SiteFooter";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isInternal =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/login");

  const showFrame = !isInternal;
  const showFooter = showFrame;

  return (
    <html lang="de">
      <body
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {showFrame && <TopNav />}

        <main className="pt-28" style={{ minHeight: "80vh" }}>
          {children}
        </main>

        {showFooter && <SiteFooter />}
      </body>
    </html>
  );
}