"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Login-Seite korrekt erkennen
  const isLoginPage =
    pathname === "/admin/login" || pathname.startsWith("/admin/login");

  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    // Nur Admin-Seiten schützen, aber NICHT die Login-Seite
    const isProtected = pathname.startsWith("/admin") && !isLoginPage;

    if (isProtected && auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    // Session Timeout (30 Minuten)
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

  // ❗ LOGIN – KEIN LAYOUT, KEIN BACKGROUND, KEINE SIDEBAR
  if (isLoginPage) {
    return <>{children}</>;
  }

  // ❗ ALLE ADMIN-SEITEN (Sidebar + Layout)
  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #ffffff, #ffffff)",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
      }}
      className="flex"
    >
      <Sidebar />

      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}