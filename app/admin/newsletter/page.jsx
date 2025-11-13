"use client";
import { useEffect, useState } from "react";

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    fetch("/api/subscribers")
      .then((res) => res.json())
      .then((data) => setSubscribers(data))
      .catch(() => setSubscribers([]));
  }, []);

  return (
    <div className="bg-white p-10 rounded-3xl shadow-lg w-[90%] max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">📬 Newsletter-Abonnenten</h1>
      <p className="text-gray-600 mb-6">
        Hier siehst du aktuell alle Test-Abonnenten (lokale Dummy-Daten).
      </p>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">Name</th>
              <th className="text-left p-4 font-semibold text-gray-700">E-Mail</th>
              <th className="text-left p-4 font-semibold text-gray-700">Einwilligung</th>
              <th className="text-left p-4 font-semibold text-gray-700">Erstellt am</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4">{s.name}</td>
                <td className="p-4 text-gray-600">{s.email}</td>
                <td className="p-4">{s.consent ? "✅ Ja" : "❌ Nein"}</td>
                <td className="p-4 text-gray-500">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}