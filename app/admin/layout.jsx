"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Alle Login-Pfade korrekt erkennen
  const isLoginPage =
    pathname === "/admin/login" || pathname.startsWith("/admin/login");

  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    // 🚫 Nur Admin geschützte Seiten blockieren
    const isProtected = pathname.startsWith("/admin") && !isLoginPage;

    if (isProtected && auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    // ⏳ Session Timeout (30 min)
    if (auth === "true" && loginTime) {
      const now = Date.now();
      const diff = now - parseInt(loginTime);

      if (diff > 30 * 60 * 1000) {
        localStorage.removeItem("lobbiumAdminAuth");
        localStorage.removeItem("lobbiumLoginTime");
        alert("⏳ Sitzung abgelaufen. Bitte erneut einloggen.");
        router.replace("/admin/login");
      }
    }
  }, [pathname, router, isLoginPage]);

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #ffffff, #ffffff)",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
      }}
      className="flex"
    >
      {/* Sidebar nur zeigen, wenn NICHT auf der Login-Seite */}
      {!isLoginPage && <Sidebar />}

      <main className="flex-1 flex justify-center items-start p-4">
        {children}
      </main>
    </div>
  );
}