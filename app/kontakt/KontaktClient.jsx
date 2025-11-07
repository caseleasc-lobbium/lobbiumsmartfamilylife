"use client";
import { useState } from "react";

export default function Kontakt() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [status, setStatus] = useState({
    sent: false,
    error: null,
    loading: false,
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.honeypot) return;

    setStatus({ sent: false, error: null, loading: true });

    try {
      // Nachricht an API senden → speichert in Prisma
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!res.ok) throw new Error("Fehler beim Speichern der Nachricht.");

      // Falls du zusätzlich lokal behalten willst (optional)
      const existing = JSON.parse(localStorage.getItem("lobbium_messages") || "[]");
      existing.push({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem("lobbium_messages", JSON.stringify(existing));

      setStatus({ sent: true, error: null, loading: false });
      setFormData({ name: "", email: "", message: "", honeypot: "" });
    } catch (err) {
      console.error(err);
      setStatus({ sent: false, error: err.message, loading: false });
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#eaf0ff] via-[#f3f6fb] to-[#f8faff] text-center py-16 md:py-20 px-6 mt-28">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1c3d6c] mb-3">
          📩 Kontakt
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Schreib uns bei Fragen, Kooperationen oder Feedback – wir melden uns
          persönlich.
        </p>
      </section>

      {/* Formular */}
      <section className="flex justify-center items-center px-4 sm:px-6 md:px-10 py-16">
        <div
          className="w-full max-w-3xl sm:max-w-4xl md:max-w-5xl 
          bg-[rgba(255,255,255,0.85)] backdrop-blur-md 
          bg-gradient-to-br from-[rgba(234,240,255,0.8)] via-[rgba(248,250,255,0.85)] to-[rgba(255,255,255,0.9)]
          border border-[#e4e8f0] rounded-2xl p-6 sm:p-8 md:p-12"
        >
          {status.sent ? (
            <div className="text-center text-green-600 font-semibold py-8 text-lg">
              ✅ Vielen Dank! Deine Nachricht wurde gesendet.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 mx-auto w-full max-w-2xl"
            >
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: "none" }}
                autoComplete="off"
              />

              <div>
                <label className="block text-sm font-semibold text-[#1c3d6c] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#cfd7e6] rounded-md focus:ring-2 focus:ring-[#2b6cb0] focus:border-[#2b6cb0] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1c3d6c] mb-1">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#cfd7e6] rounded-md focus:ring-2 focus:ring-[#2b6cb0] focus:border-[#2b6cb0] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1c3d6c] mb-1">
                  Nachricht
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                  className="w-full px-4 py-3 border border-[#cfd7e6] rounded-md focus:ring-2 focus:ring-[#2b6cb0] focus:border-[#2b6cb0] outline-none transition"
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={status.loading}
                  className={`px-10 py-3 rounded-md font-semibold text-white transition ${
                    status.loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#2b6cb0] hover:bg-[#1c3d6c]"
                  }`}
                >
                  {status.loading ? "Senden..." : "Nachricht senden"}
                </button>
              </div>
            </form>
          )}

          {status.error && (
            <p className="text-center text-red-600 mt-6 font-medium">
              ⚠️ {status.error}
            </p>
          )}
        </div>
      </section>
    </>
  );
}