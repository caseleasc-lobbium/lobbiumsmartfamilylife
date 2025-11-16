"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    const loadFooter = async () => {
      try {
        const res = await fetch("/api/site/footer");
        const data = await res.json();
        if (!data || data.error) {
          console.error("Footer API error:", data?.error);
          return;
        }
        setFooter(data);
      } catch (err) {
        console.error("Footer fetch error:", err);
      }
    };

    loadFooter();
  }, []);

  return (
    <footer className="w-full border-t border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col md:flex-row md:justify-between gap-8 text-sm text-gray-600">
        {/* Linke Seite */}
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-8 w-8 rounded-full bg-blue-600 items-center justify-center text-white text-xs font-bold">
              💡
            </span>
            <span className="font-semibold text-gray-800">
              Smart Family Life by Lobbium
            </span>
          </div>
          <p className="text-gray-500">
            Spartipps, Alltag & Bildungsideen für Familien. Dein Begleiter für
            Organisation, Sparen und entspanntes Familienleben.
          </p>
        </div>

        {/* Themen & Rechtliches */}
        <div className="flex-1 grid grid-cols-2 gap-8 max-w-md">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Themen</h4>
            <ul className="space-y-1">
              <li>
                <a href="/finanzen-spartipps" className="text-blue-600 hover:underline">
                  Finanzen & Spartipps
                </a>
              </li>
              <li>
                <a href="/familienleben" className="text-blue-600 hover:underline">
                  Familienleben & Alltag
                </a>
              </li>
              <li>
                <a href="/kinder-bildung" className="text-blue-600 hover:underline">
                  Kinder & Bildung
                </a>
              </li>
              <li>
                <a href="/lifestyle" className="text-blue-600 hover:underline">
                  Lifestyle
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Rechtliches</h4>
            <ul className="space-y-1">
              <li>
                <a href="/impressum" className="text-blue-600 hover:underline">
                  Impressum
                </a>
              </li>
              <li>
                <a href="/datenschutz" className="text-blue-600 hover:underline">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="/kontakt" className="text-blue-600 hover:underline">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © 2025 Smart Family Life by Lobbium. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}