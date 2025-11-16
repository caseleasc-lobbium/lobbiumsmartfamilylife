"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [header, setHeader] = useState(null);
  const pathname = usePathname();

  // ❗ Startseite → KEIN Header
  if (pathname === "/") return null;

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

  if (!header) return null;

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/">
          <img
            src={header.logo_url}
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Navigation */}
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

      </div>
    </header>
  );
}