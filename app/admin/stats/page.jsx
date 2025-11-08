"use client";

export default function StatsPage() {
  return (
    <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-3xl text-center">
      <h1 className="text-2xl font-bold flex items-center justify-center gap-2 mb-4">
        📈 Statistiken
      </h1>
      <p className="text-gray-600 mb-6">
        Hier erscheinen später Auswertungen und Datenanalysen zu Lobbium Smart Family Life.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-4">
          <h2 className="text-xl font-semibold text-blue-600">1.245</h2>
          <p className="text-gray-500 text-sm">Registrierte Benutzer</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4">
          <h2 className="text-xl font-semibold text-green-600">87%</h2>
          <p className="text-gray-500 text-sm">Aktivitätsrate</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4">
          <h2 className="text-xl font-semibold text-yellow-600">+12%</h2>
          <p className="text-gray-500 text-sm">Wachstum (Monat)</p>
        </div>
      </div>
    </div>
  );
}