"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/errorlogs");
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Log-Fehler:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Client-Guard wie in den anderen Admin-Seiten
    if (localStorage.getItem("lobbiumAdminAuth") !== "true") {
      router.replace("/admin/login");
      return;
    }
    load();
  }, []);

  const clearLogs = async () => {
    if (!confirm("Fehler-Log wirklich leeren?")) return;
    await fetch("/api/admin/errorlogs", { method: "DELETE" });
    load();
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-8 rounded-3xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0F1C3F]">🩺 Fehler-Log (Monitoring)</h1>
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            className="text-sm text-red-600 hover:text-red-800 border border-red-200 rounded-lg px-3 py-1.5"
          >
            Log leeren
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Lade…</p>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-gray-600">Keine Fehler protokolliert — alles läuft sauber.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
            <thead className="bg-gray-100 text-[#1c3d6c]">
              <tr>
                <th className="p-3 text-left">Zeit</th>
                <th className="p-3 text-left">Quelle</th>
                <th className="p-3 text-left">Meldung</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-t hover:bg-gray-50 align-top">
                  <td className="p-3 whitespace-nowrap text-gray-500">
                    {l.created_at ? new Date(l.created_at).toLocaleString("de-DE") : "–"}
                  </td>
                  <td className="p-3 font-mono text-xs text-blue-700 whitespace-nowrap">
                    {l.source}
                  </td>
                  <td className="p-3 text-gray-800">{l.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
