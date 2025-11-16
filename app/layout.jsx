"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // ✨ A2: Startseite ohne Header/Footer
  const isHome = pathname === "/";

  // Admin-/Auth-Bereich ohne Header/Footer
  const isInternal =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/login");

  const hideHeaderFooter = isHome || isInternal;

  return (
    <html lang="de">
      <body
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {!hideHeaderFooter && <Header />}
        <main style={{ minHeight: "80vh" }}>{children}</main>
        {!hideHeaderFooter && <Footer />}
      </body>
    </html>
  );
}