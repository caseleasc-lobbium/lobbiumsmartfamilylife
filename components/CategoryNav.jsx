"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryNav() {
  const pathname = usePathname();

  const nav = [
    { name: "Startseite", slug: "/" },
    { name: "Finanzen & Spartipps", slug: "/finanzen-spartipps" },
    { name: "Familienleben", slug: "/familienleben" },
    { name: "Kinder & Bildung", slug: "/kinder-bildung" },
    { name: "Lifestyle", slug: "/lifestyle" },
  ];

  const isActive = (slug) =>
    pathname === slug;

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {nav.map((item) => (
        <Link
          key={item.slug}
          href={item.slug}
          className={`px-5 py-2 rounded-full text-sm font-medium transition ${
            isActive(item.slug)
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}