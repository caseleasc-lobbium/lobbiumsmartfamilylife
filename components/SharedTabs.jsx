"use client";

import { usePathname, useRouter } from "next/navigation";

export default function SharedTabs({ active, onChange }) {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";

  const categories = [
    { key: "all", label: "Home", url: "/" },
    { key: "finanzen", label: "Finanzen & Spartipps", url: "/finanzen-spartipps" },
    { key: "familie", label: "Familienleben", url: "/familienleben" },
    { key: "bildung", label: "Kinder & Bildung", url: "/kinder-bildung" },
    { key: "lifestyle", label: "Lifestyle", url: "/lifestyle" },
  ];

  const handleClick = (cat) => {
    if (isHome) {
      onChange(cat.key);
    } else {
      router.push(cat.url);
    }
  };

  return (
    <nav
      className="
        shared-tabs 
        flex flex-wrap justify-center 
        gap-2 sm:gap-4 
        mb-8 sm:mb-12 
        px-2 sm:px-4
      "
    >
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => handleClick(cat)}
          className={`
            px-3 py-2 sm:px-6 sm:py-3 
            rounded-xl 
            text-xs sm:text-sm font-medium 
            transition-all 
            whitespace-nowrap

            ${
              active === cat.key
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}