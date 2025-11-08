"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login"; // <– Prüft, ob Login-Seite aktiv ist

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #ffffff, #ffffff)",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        padding: "2rem",
      }}
      className="flex items-start justify-center"
    >
      {/* Sidebar nur anzeigen, wenn NICHT auf der Login-Seite */}
      {!isLoginPage && <Sidebar />}

      <main className={`flex-1 ${!isLoginPage ? "ml-6" : ""} flex justify-center items-center`}>
        {children}
      </main>
    </div>
  );
}