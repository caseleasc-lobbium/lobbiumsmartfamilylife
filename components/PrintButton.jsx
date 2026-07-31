"use client";

export default function PrintButton({ label = "🖨️ Drucken / als PDF speichern" }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
    >
      {label}
    </button>
  );
}
