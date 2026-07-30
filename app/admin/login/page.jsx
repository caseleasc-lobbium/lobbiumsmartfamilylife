"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login fehlgeschlagen");
        setLoading(false);
        return;
      }

      // Client-Guards (Layout/Dashboard) lesen diese Marker.
      // Der eigentliche Schutz läuft serverseitig über den httpOnly-Cookie
      // lobbium_admin_auth (gesetzt von /api/admin/login, geprüft in middleware.js).
      localStorage.setItem("lobbiumAdminAuth", "true");
      localStorage.setItem("lobbiumLoginTime", Date.now().toString());

      router.replace("/admin");
    } catch {
      setError("Serverfehler. Bitte später erneut versuchen.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#eaf0ff] to-[#f8faff]">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">🔐 Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="password"
            placeholder="Admin-Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Anmelden…" : "Einloggen"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
