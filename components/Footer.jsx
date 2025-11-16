"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  if (!footer) return null;

  const { sections, copyright } = footer;

  return (
    <footer className="w-full border-t border-gray-200 bg-white mt-20">
      
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Themen */}
          <div>
            <h4 className="text-[#0F1C3F] text-sm font-semibold mb-3">
              Themen
            </h4>

            <ul className="space-y-2">
              {sections?.themen?.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.url}
                    className="text-gray-600 hover:text-[#0F1C3F] transition text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="text-[#0F1C3F] text-sm font-semibold mb-3">
              Rechtliches
            </h4>

            <ul className="space-y-2">
              {sections?.rechtliches?.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.url}
                    className="text-gray-600 hover:text-[#0F1C3F] transition text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Copy */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-xs">{copyright}</p>
        </div>

      </div>
    </footer>
  );
}