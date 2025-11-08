"use client";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-[90%] h-[85vh] bg-white shadow-2xl rounded-3xl border border-gray-200 flex flex-col items-center justify-center text-center transition-all duration-500 hover:shadow-xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">⚙️ Einstellungen</h1>
        <p className="text-gray-600 text-lg mb-6">
          Hier kannst du später Admin-Konten, Rechte, API-Keys und Systemoptionen verwalten.
        </p>
      </div>
    </div>
  );
}