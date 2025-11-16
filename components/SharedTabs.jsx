"use client";

export default function SharedTabs({ active, onChange }) {
  const categories = [
    { key: "all", label: "Home" },
    { key: "finanzen", label: "Finanzen & Spartipps" },
    { key: "familie", label: "Familienleben" },
    { key: "bildung", label: "Kinder & Bildung" },
    { key: "lifestyle", label: "Lifestyle" },
  ];

  return (
    <nav className="flex flex-wrap justify-center gap-4 mb-12 px-4">
      {categories.map(cat => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
            active === cat.key
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}