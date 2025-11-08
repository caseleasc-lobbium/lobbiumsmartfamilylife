"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      setSuccess(true);
      setTimeout(() => router.push("/admin"), 1000);
    } else {
      alert("Falsches Passwort!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-bg-white-10 to-bg-white-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          🔐 Admin Login
        </h2>

        <input
          type="password"
          placeholder="Passwort eingeben"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Einloggen
        </button>

        {success && (
          <p className="mt-4 text-center text-green-600 font-semibold">
            ✅ Login erfolgreich! Weiterleitung...
          </p>
        )}
      </form>
    </div>
  );
}