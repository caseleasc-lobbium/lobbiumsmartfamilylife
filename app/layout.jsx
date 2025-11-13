"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Nur Admin-/Auth-Seiten isolieren
  const isInternal =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/login");

  return (
    <html lang="de">
      <body
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          overflowY: "auto", // ✅ Scroll wieder aktiv
        }}
      >
        {!isInternal && <Header />}
        <main style={{ minHeight: "80vh" }}>{children}</main>
        {!isInternal && <Footer />}
      </body>
    </html>
  );
}
