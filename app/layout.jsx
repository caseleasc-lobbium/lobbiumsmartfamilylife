"use client";
import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <html lang="de">
      <body
        style={{
          fontFamily: "Inter, sans-serif",
          backgroundColor: "#f8faff",
          color: "#1a1a1a",
        }}
      >
        {!isAdmin && <Header />}
        <main style={{ minHeight: "80vh" }}>{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}