"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SiteFooter() {
  const [footer, setFooter] = useState(null);

  const loadFooter = async () => {
    try {
      const res = await fetch("/api/site/footer");
      const data = await res.json();
      setFooter(data);
    } catch (err) {
      console.error("Footer Load Error:", err);
    }
  };

  useEffect(() => {
    loadFooter();
  }, []);

  if (!footer) return null;

  return (
    <footer className="w-full bg-white border-t border-gray-200 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">

          {/* Themen */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Themen</h3>
            <ul className="space-y-2">
              {footer.sections.themen.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="text-gray-600 hover:text-blue-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Rechtliches</h3>
            <ul className="space-y-2">
              {footer.sections.rechtliches.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="text-gray-600 hover:text-blue-600">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          {footer.copyright}
        </div>
      </div>
    </footer>
  );
}