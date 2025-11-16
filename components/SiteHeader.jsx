"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [header, setHeader] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();

  // ❗ Startseite → KEIN Header
  if (pathname === "/") return null;

  // Header laden
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/header");
        const data = await res.json();
        setHeader(data);
      } catch (err) {
        console.error("Header Load Error:", err);
      }
    };
    load();
  }, []);

  // Sticky-Effekt
  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!header) return null;

  return (
    <>
      {/* HEADER */}
      <header
        className={`w-full bg-white border-b border-gray-100 z-50 transition-all duration-300 ${
          isSticky ? "sticky top-0 shadow-sm" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link href="/">
            <img
              src={header.logo_url}
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {header.nav_items?.map((item) => {
              const active = pathname.startsWith(item.url);
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className={`text-sm font-medium transition ${
                    active
                      ? "text-[#0F1C3F] font-semibold"
                      : "text-gray-600 hover:text-[#0F1C3F]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Button */}
          <button
            className="md:hidden text-[#0F1C3F] text-3xl"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center px-10 animate-fade">
          
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-3xl text-[#0F1C3F]"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          {/* Navigation */}
          <nav className="flex flex-col items-center gap-6 text-xl text-[#0F1C3F] font-semibold">
            {header.nav_items?.map((item) => (
              <button
                key={item.url}
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = item.url;
                }}
                className="hover:text-blue-600 transition"
              >
                {item.label}
              </button>
            ))}
          </nav>

        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
}