"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
  const auth = localStorage.getItem("lobbiumAdminAuth");
  const loginTime = localStorage.getItem("lobbiumLoginTime");

  // Falls nicht eingeloggt → zurück zur Login-Seite
  if (auth !== "true" || !loginTime) {
    router.push("/admin/login");
    return;
  }

  // Session-Timeout nach 30 Minuten (1800000 ms)
  const now = new Date().getTime();
  const timeDiff = now - parseInt(loginTime);

  if (timeDiff > 1800000) { // 30 Minuten
    localStorage.removeItem("lobbiumAdminAuth");
    localStorage.removeItem("lobbiumLoginTime");
    alert("⏰ Sitzung abgelaufen. Bitte erneut einloggen.");
    router.push("/admin/login");
  }
}, [router]);

  const handleLogout = () => {
  localStorage.removeItem("lobbiumAdminAuth");
  localStorage.removeItem("lobbiumLoginTime");
  router.push("/admin/login");
};

  return (
    <div className="bg-white p-10 rounded-3xl shadow-lg w-[90%] max-w-3xl text-center">
      <h1 className="text-2xl font-bold mb-4">🛠️ Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Willkommen im Administrationsbereich von <b>Lobbium Smart Family Life</b>.
      </p>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition"
      >
        Abmelden
      </button>
    </div>
  );
}