"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "lobbium2025lob") {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin/dashboard");
    } else {
      alert("❌ Falsches Passwort!");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
      style={{
        minHeight: "80vh",
      }}
    >
      <div
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          🔒 Admin Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
          >
            Einloggen
          </button>
        </form>
      </div>
    </div>
  );
}