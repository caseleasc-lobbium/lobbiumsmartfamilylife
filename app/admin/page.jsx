"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  if (!isReady) return null;

  return (
    <div className="flex h-screen bg-white">


      {/* Dashboard-Hauptbereich */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-[90%] h-[85vh] bg-white border border-gray-200 shadow-xl rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-300">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            🔧 Admin Dashboard
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Willkommen im Administrationsbereich von{" "}
            <b>Lobbium Smart Family Life</b>.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              router.push("/admin/login");
            }}
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-10 rounded-2xl text-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Abmelden
          </button>
        </div>
      </div>
    </div>
  );
}