"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Prüfen, ob bereits eingeloggt
  useEffect(() => {
    const cookieCheck = document.cookie.includes("lobbium_admin_auth=true");
    if (cookieCheck) {
      router.replace("/admin");
    }
  }, [router]);

  // Login-Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("lobbiumAdminAuth", "true");
        localStorage.setItem("lobbiumLoginTime", Date.now().toString());
        router.replace("/admin");
      } else {
        setError("❌ Falsches Passwort. Bitte versuche es erneut.");
      }
    } catch (err) {
      setError("❌ Serverfehler – bitte später erneut probieren.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-[90%] max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">🔒 Admin Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Passwort eingeben"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 mb-3 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 
                       rounded-xl font-semibold transition"
          >
            {loading ? "⏳ Einloggen..." : "Einloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}