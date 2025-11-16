"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [data, setData] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Header laden aus Supabase API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/header");
        const d = await res.json();
        setData(d);
      } catch (e) {
        console.error("Header Load Error:", e);
      }
    };
    load();
  }, []);

  if (!data) {
    return null; // Header nicht anzeigen, bis geladen
  }

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* ----------------------------------------- */}
        {/* LOGO */}
        {/* ----------------------------------------- */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src={data.logo}
            alt="Lobbium Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* ----------------------------------------- */}
        {/* DESKTOP NAVIGATION */}
        {/* ----------------------------------------- */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          {data.menu.map((m, i) => (
            <Link
              key={i}
              href={m.url}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              {m.label}
            </Link>
          ))}
        </nav>

        {/* ----------------------------------------- */}
        {/* NEWSLETTER BUTTON */}
        {/* ----------------------------------------- */}
        <div className="hidden md:block">
          <Link
            href={data.newsletter_button.url}
            className="
              px-5 py-2 rounded-xl
              bg-blue-600 text-white
              hover:bg-blue-700 transition
              text-sm font-semibold
            "
          >
            {data.newsletter_button.label}
          </Link>
        </div>

        {/* ----------------------------------------- */}
        {/* MOBILE MENU BUTTON */}
        {/* ----------------------------------------- */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-700"
        >
          <span className="text-3xl">☰</span>
        </button>
      </div>

      {/* ----------------------------------------- */}
      {/* MOBILE MENU OVERLAY */}
      {/* ----------------------------------------- */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 shadow-xl">
          <nav className="flex flex-col gap-4 text-lg font-medium">
            {data.menu.map((m, i) => (
              <Link
                key={i}
                href={m.url}
                className="text-gray-700 hover:text-blue-600"
                onClick={() => setMobileOpen(false)}
              >
                {m.label}
              </Link>
            ))}

            <Link
              href={data.newsletter_button.url}
              onClick={() => setMobileOpen(false)}
              className="
                mt-3 px-5 py-3 rounded-xl
                bg-blue-600 text-white text-center
                font-semibold
              "
            >
              {data.newsletter_button.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}