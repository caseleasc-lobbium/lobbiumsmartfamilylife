"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    // ❌ Nicht eingeloggt
    if (auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    // ⏳ Session Timeout 30 min
    const now = Date.now();
    if (!loginTime || now - parseInt(loginTime) > 30 * 60 * 1000) {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      alert("⏳ Sitzung abgelaufen. Bitte erneut einloggen.");
      router.replace("/admin/login");
      return;
    }
  }, [router]);


  return (
    <div className="bg-white p-10 rounded-3xl shadow-lg w-[90%] max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">
        📩 Gespeicherte Kontakt-Nachrichten
      </h2>

      <p className="text-gray-600">
        Keine gespeicherten Nachrichten vorhanden ✔️
      </p>
    </div>
  );
}
