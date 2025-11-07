"use client";

import { useState, useEffect } from "react";

export default function KontaktePage() {
  const [contacts, setContacts] = useState([]);

  // Kontakte aus localStorage laden
  useEffect(() => {
    const stored = localStorage.getItem("lobbium_contacts");
    if (stored) setContacts(JSON.parse(stored));
  }, []);

  // Kontakt löschen
  const handleDelete = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
    localStorage.setItem("lobbium_contacts", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#f8faff] p-8">
      <nav className="flex justify-center gap-6 mb-8">
        <a href="/admin" className="text-[#1c3d6c] hover:text-[#2b6cb0]">
          Übersicht
        </a>
        <a href="/admin/kontakte" className="text-[#1c3d6c] font-bold">
          Kontakte
        </a>
        <a href="/admin/blog" className="text-[#1c3d6c] hover:text-[#2b6cb0]">
          Blog
        </a>
      </nav>

      <section className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-[#1c3d6c] mb-4">📬 Kontaktanfragen</h1>

        {contacts.length === 0 ? (
          <p className="text-gray-600">Keine Nachrichten vorhanden.</p>
        ) : (
          <ul className="space-y-4">
            {contacts.map((contact, index) => (
              <li
                key={index}
                className="border border-gray-200 p-4 rounded-lg shadow-sm bg-[#f9fbff]"
              >
                <p>
                  <strong>Name:</strong> {contact.name}
                </p>
                <p>
                  <strong>E-Mail:</strong> {contact.email}
                </p>
                <p>
                  <strong>Nachricht:</strong> {contact.message}
                </p>
                <button
                  onClick={() => handleDelete(index)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Löschen
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}