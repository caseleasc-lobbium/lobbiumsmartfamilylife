"use client";

export default function SettingsPage() {
  return (
    <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-3xl">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        ⚙️ Einstellungen
      </h1>
      <p className="text-gray-600 mb-6">
        Hier kannst du später Admin-Konten, Rechte, API-Keys und Systemoptionen verwalten.
      </p>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <span>Admin-Konten verwalten</span>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
            Öffnen
          </button>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span>API-Keys konfigurieren</span>
          <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
            Öffnen
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span>System-Backup & Wartung</span>
          <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
            Jetzt sichern
          </button>
        </div>
      </div>
    </div>
  );
}