"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) router.push("/admin");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin");
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100"
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-10 text-center w-full max-w-md border border-gray-100"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
          <span>📊</span> Admin Dashboard
        </h1>

        <p className="text-gray-500 mb-8">
          Willkommen im internen Bereich von <strong>Lobbium</strong>.
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}