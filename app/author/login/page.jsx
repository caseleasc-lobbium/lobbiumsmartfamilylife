"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 Zugangsdaten prüfen
    if (email === "author@lobbium.com" && password === "lobbium2025") {
      // 🟢 Login speichern (Token)
      localStorage.setItem("authorToken", "ok");

      // ✅ Weiterleitung
      router.push("/author/dashboard");
    } else {
      alert("❌ Falsche Zugangsdaten!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Autoren Login
        </h2>

        <input
          type="email"
          placeholder="E-Mail"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Passwort"
          className="border p-2 w-full mb-5 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 w-full rounded"
        >
          Einloggen
        </button>
      </form>
    </div>
  );
}