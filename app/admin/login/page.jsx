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
    <div className="flex items-center justify-center min-h-screen bg-[#f5f7fa]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        {/* Branding */}
        <h1 className="text-center text-3xl font-semibold mb-2 text-gray-900">
          Lobbium Admin
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Smart Family Life – Zugriff für Administrator
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-left">
            <label className="block text-gray-700 font-medium mb-1">
              Admin E-Mail
            </label>
            <input
              type="email"
              placeholder="info@lobbium.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? "Senden…" : "Magic-Link anfordern"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center text-gray-700 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}