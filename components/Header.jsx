"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/site/header");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Header load error", e);
      }
    }
    load();
  }, []);

  if (!data) {
    return (
      <div className="p-4 text-center text-gray-400">
        Lade Header...
      </div>
    );
  }

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img
            src={data.logo_url}
            alt="Lobbium Logo"
            className="h-10"
          />
        </a>

        {/* Navigation */}
        <nav className="flex gap-6">
          {data.navigation?.items?.map((item, i) => (
            <a
              key={i}
              href={item.url}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Newsletter Button */}
        <a
          href={data.newsletter_link}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold"
        >
          {data.newsletter_text}
        </a>

      </div>
    </header>
  );
}