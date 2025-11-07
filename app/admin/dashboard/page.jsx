"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ").find((row) => row.startsWith("isAdmin="));
    const isAdmin = cookies?.split("=")[1];
    if (isAdmin === "true") {
      setIsReady(true);
    } else {
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = "isAdmin=; path=/; max-age=0";
    router.push("/admin");
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Wird geladen...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}