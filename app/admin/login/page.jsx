"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Wenn bereits eingeloggt → direkt weiterleiten
  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    if (auth === "true") {
      router.push("/admin");
    }
  }, [router]);

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/check-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      // Auth speichern
      localStorage.setItem("lobbiumAdminAuth", "true");

      // Login-Timestamp speichern (für Timeout)
      const loginTime = new Date().getTime();
      localStorage.setItem("lobbiumLoginTime", loginTime.toString());

      setError("");
      router.push("/admin");
    } else {
      setError("❌ Falsches Passwort. Bitte versuche es erneut.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-[90%] max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">🔒 Admin Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Passwort eingeben"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl font-semibold transition"
          >
            Einloggen
          </button>
        </form>
      </div>
    </div>
  );
}