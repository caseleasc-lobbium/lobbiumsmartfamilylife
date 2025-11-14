"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    // 🚫 Schutz für alle Admin-Seiten außer Login
    if (!isLoginPage && auth !== "true") {
      router.push("/admin/login");
      return;
    }

    // ⏳ Session Timeout (30 Minuten)
    if (auth === "true" && loginTime) {
      const now = Date.now();
      const diff = now - parseInt(loginTime);

      if (diff > 30 * 60 * 1000) {
        localStorage.removeItem("lobbiumAdminAuth");
        localStorage.removeItem("lobbiumLoginTime");
        alert("⏳ Sitzung abgelaufen. Bitte erneut einloggen.");
        router.push("/admin/login");
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
      className="flex items-start"
    >
      {!isLoginPage && <Sidebar />}

      <main
        className={`flex-1 ${
          !isLoginPage ? "ml-6" : ""
        } flex justify-center items-center`}
      >
        {children}
      </main>
    </div>
  );
}