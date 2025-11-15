"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SiteHeader() {
  const [header, setHeader] = useState(null);

  const loadHeader = async () => {
    try {
      const res = await fetch("/api/site/header");
      const data = await res.json();
      setHeader(data);
    } catch (err) {
      console.error("Header Load Error:", err);
    }
  };

  useEffect(() => {
    loadHeader();
  }, []);

  if (!header) {
    return null; // oder Loading Skeleton später
  }

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <img
            src={header.logo_url}
            alt="Logo"
            className="h-9 w-auto cursor-pointer"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8">
          {header.navigation.items.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="text-gray-700 hover:text-blue-600 text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Newsletter Button */}
        <Link
          href={header.newsletter_link}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition text-sm font-semibold"
        >
          {header.newsletter_text}
        </Link>
      </div>
    </header>
  );
}