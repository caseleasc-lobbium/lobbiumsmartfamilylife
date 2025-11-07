"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Nur im Browser aktivieren
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Während Server-Render nichts anzeigen
    return null;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "lobbium2025lob") {
      document.cookie = "isAdmin=true; path=/; max-age=86400";
      alert("✅ Login erfolgreich!");
      router.push("/admin/dashboard");
    } else {
      alert("❌ Falsches Passwort!");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full"
      style={{
        background: "linear-gradient(to bottom right, #f8faff, #e6eefb)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🔐 Admin Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Passwort eingeben"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition"
          >
            Einloggen
          </button>
        </form>
      </div>
    </div>
  );
}