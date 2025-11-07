"use client";

import { useState } from "react";

export default function KontaktClient() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Alte Kontakte laden
    const stored = localStorage.getItem("lobbium_contacts");
    const existingContacts = stored ? JSON.parse(stored) : [];

    // Neuen Kontakt hinzufügen
    const newContacts = [...existingContacts, form];
    localStorage.setItem("lobbium_contacts", JSON.stringify(newContacts));

    // Formular leeren
    setForm({ name: "", email: "", message: "" });
    setSubmitted(true);
  };

  return (
    <section className="max-w-lg mx-auto bg-white p-8 mt-8 rounded-xl shadow-md border border-gray-200">
      <h1 className="text-3xl font-bold text-[#1c3d6c] mb-4">📩 Kontakt</h1>
      <p className="text-gray-700 mb-6">
        Schreib uns bei Fragen, Kooperationen oder Feedback – wir melden uns persönlich.
      </p>

      {submitted ? (
        <div className="text-green-600 font-semibold text-center">
          ✅ Nachricht erfolgreich gesendet!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full border border-gray-300 p-3 rounded-lg"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="E-Mail-Adresse"
            required
            className="w-full border border-gray-300 p-3 rounded-lg"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Nachricht"
            required
            className="w-full border border-gray-300 p-3 rounded-lg h-32"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-[#2b6cb0] hover:bg-[#1c3d6c] text-white py-3 rounded-lg font-semibold transition"
          >
            Nachricht senden
          </button>
        </form>
      )}
    </section>
  );
}