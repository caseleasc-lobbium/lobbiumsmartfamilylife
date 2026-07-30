"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      try {
        await fetch("/api/admin/logout", { method: "POST" });
      } catch {}
      router.push("/admin/login");
    }
    doLogout();
  }, [router]);

  return <div className="p-10 text-center">Wird abgemeldet...</div>;
}