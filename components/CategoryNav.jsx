"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryNav() {
  const pathname = usePathname();

  const nav = [
    { name: "Finanzen & Spartipps", path: "/finanzen-spartipps" },
    { name: "Familienleben", path: "/familienleben" },
    { name: "Kinder & Bildung", path: "/kinder-bildung" },
    { name: "Lifestyle", path: "/lifestyle" }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {nav.map((item) => {
        const active = pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`
              px-5 py-3 rounded-2xl text-sm font-semibold border transition
              ${active
                ? "bg-blue-600 border-blue-700 text-white shadow-lg"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}