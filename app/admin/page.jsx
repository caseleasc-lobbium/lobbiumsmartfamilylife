"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      router.push("/admin/login");
    } else {
      setIsReady(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/admin/login");
  };

  if (!isReady) return null;

  return (
    <div className="flex flex-col items-center justify-center bg-white p-10 rounded-3xl shadow-lg w-[90%] max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">🔧 Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Willkommen im Administrationsbereich von{" "}
        <strong>Lobbium Smart Family Life</strong>.
      </p>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
      >
        Abmelden
      </button>
    </div>
  );
}