"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Header() {
  const pathname = usePathname();
  const [data, setData] = useState(null);

  // Header aus Supabase laden
  useEffect(() => {
    async function loadHeader() {
      const { data, error } = await supabase
        .from("site_header")
        .select("*")
        .single();

      if (!error) setData(data);
    }
    loadHeader();
  }, []);

  if (!data) return null;

  const { logo_url, navigation, newsletter_text, newsletter_link } = data;

  return (
    <header className="w-full bg-white py-4 shadow-none border-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">

        {/* Logo */}
        <Link href="/">
          <img
            src={logo_url}
            alt="Logo"
            className="h-10 w-auto cursor-pointer"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex gap-3 ml-10">
          {navigation.items.map((item) => {
            const active = pathname === item.url;
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition
                  ${active
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"}
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Newsletter Button */}
        <Link
          href={newsletter_link}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700"
        >
          {newsletter_text}
        </Link>
      </div>
    </header>
  );
}