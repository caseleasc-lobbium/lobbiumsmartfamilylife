"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StatsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    // ❌ Nicht eingeloggt → redirect
    if (auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    // ⏳ Session Timeout
    const now = Date.now();
    const diff = now - parseInt(loginTime);

    if (!loginTime || diff > 30 * 60 * 1000) {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      alert("⏳ Sitzung abgelaufen. Bitte erneut einloggen.");
      router.replace("/admin/login");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Lade Statistiken...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center justify-center gap-2 mb-4">
        📊 Statistiken
      </h1>

      <p className="text-gray-600 mb-8 text-center">
        Hier erscheinen später Auswertungen und Datenanalysen zu Lobbium Smart Family Life.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-blue-50 rounded-2xl p-4 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-blue-600">1.245</h2>
          <p className="text-gray-600 text-sm">Registrierte Benutzer</p>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-green-600">87%</h2>
          <p className="text-gray-600 text-sm">Aktivitätsrate</p>
        </div>

        <div className="bg-yellow-50 rounded-2xl p-4 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-yellow-600">+12%</h2>
          <p className="text-gray-600 text-sm">Wachstum (Monat)</p>
        </div>

      </div>
    </div>
  );
}