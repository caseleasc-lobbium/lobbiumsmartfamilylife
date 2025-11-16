"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/footer");
        const data = await res.json();
        setFooter(data);
      } catch (err) {
        console.error("Footer Load Error:", err);
      }
    };
    load();
  }, []);

  if (!footer) {
    return null;
  }

  return (
    <footer className="w-full border-t border-gray-200 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Spalte: Themen */}
          <div>
            <h3 className="text-sm font-semibold text-[#0F1C3F] mb-3">
              Themen
            </h3>
            <ul className="space-y-2">
              {footer.sections?.themen?.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.url}
                    className="text-gray-600 hover:text-[#0F1C3F] transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Spalte: Rechtliches */}
          <div>
            <h3 className="text-sm font-semibold text-[#0F1C3F] mb-3">
              Rechtliches
            </h3>
            <ul className="space-y-2">
              {footer.sections?.rechtliches?.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.url}
                    className="text-gray-600 hover:text-[#0F1C3F] transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Spalte: Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-[#0F1C3F] mb-3">
              Newsletter
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Erhalte regelmäßig Tipps, Spartools & Inspirationen für deinen Alltag.
            </p>
            <a
              href="/newsletter"
              className="inline-block bg-[#0F1C3F] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-opacity-90"
            >
              Jetzt abonnieren
            </a>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-100 pt-6 text-sm text-gray-500 text-center">
          {footer?.copyright || "© 2025 Lobbium – Smart Family Life"}
        </div>
      </div>
    </footer>
  );
}