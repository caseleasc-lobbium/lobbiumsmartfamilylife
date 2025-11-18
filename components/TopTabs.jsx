"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopTabs() {
  const pathname = usePathname();

  const activeKey =
    pathname === "/" ? "all" :
    pathname.startsWith("/finanzen-spartipps") ? "finanzen" :
    pathname.startsWith("/familienleben") ? "familie" :
    pathname.startsWith("/kinder-bildung") ? "bildung" :
    pathname.startsWith("/lifestyle") ? "lifestyle" :
    null;

  const categories = [
    { key: "all", label: "Home", url: "/" },
    { key: "finanzen", label: "Finanzen & Spartipps", url: "/finanzen-spartipps" },
    { key: "familie", label: "Familienleben", url: "/familienleben" },
    { key: "bildung", label: "Kinder & Bildung", url: "/kinder-bildung" },
    { key: "lifestyle", label: "Lifestyle", url: "/lifestyle" },
  ];

  return (
    <nav className="hidden md:flex flex-wrap justify-center gap-3 mb-12 px-4">
      {categories.map((cat) => {
        const isActive = cat.key === activeKey;

        return (
          <Link
            key={cat.key}
            href={cat.url}
            className={`
              px-6 py-3 rounded-xl text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {cat.label}
          </Link>
        );
      })}
    </nav>
  );
}