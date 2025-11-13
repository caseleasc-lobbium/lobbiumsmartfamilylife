"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    // ❌ Nicht eingeloggt → Login
    if (auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    // ⏳ Session Timeout prüfen
    const now = Date.now();
    if (!loginTime || now - parseInt(loginTime) > 30 * 60 * 1000) {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      alert("⏳ Sitzung abgelaufen. Bitte erneut einloggen.");
      router.replace("/admin/login");
      return;
    }

    // ✔️ Alles OK → Dashboard zeigen
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("lobbiumAdminAuth");
    localStorage.removeItem("lobbiumLoginTime");
    router.replace("/admin/login");
  };

  if (loading) {
    return (
      <div className="text-center p-10">
        <p className="text-gray-500">Lade Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-3xl shadow-lg w-[90%] max-w-3xl text-center">
      <h1 className="text-2xl font-bold mb-4">🛡 Admin Dashboard</h1>

      <p className="text-gray-600 mb-6">
        Willkommen im Administrationsbereich von{" "}
        <b>Lobbium Smart Family Life</b>.
      </p>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3
                   rounded-xl font-semibold transition"
      >
        Abmelden
      </button>
    </div>
  );
}