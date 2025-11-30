"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    setLoading(true);
    const res = await fetch("/api/admin/magic-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.error) {
      setMessage(data.error);
    } else {
      setMessage("Magic-Link wurde gesendet. Bitte E-Mail prüfen.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#eaf0ff] to-[#f8faff]">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">

        <h1 className="text-2xl font-bold mb-6">🔐 Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Admin E-Mail eingeben"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl shadow hover:bg-blue-700 transition"
          >
            {loading ? "Senden..." : "Magic Link anfordern"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-gray-700 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}