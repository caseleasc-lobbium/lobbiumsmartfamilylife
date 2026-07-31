"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "./i18n/LanguageProvider";
import LanguageSwitcher from "./i18n/LanguageSwitcher";

export default function TopNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const tabs = [
    { key: "home", url: "/" },
    { key: "finanzen", url: "/finanzen-spartipps" },
    { key: "familie", url: "/familienleben" },
    { key: "bildung", url: "/kinder-bildung" },
    { key: "lifestyle", url: "/lifestyle" },
    { key: "tools", url: "/tools" },
  ];

  const getActive = () => {
    if (pathname === "/") return "home";
    if (pathname.includes("finanzen")) return "finanzen";
    if (pathname.includes("familien")) return "familie";
    if (pathname.includes("kinder")) return "bildung";
    if (pathname.includes("lifestyle")) return "lifestyle";
    if (pathname.includes("tools")) return "tools";
    return null;
  };

  const active = getActive();

  return (
    <div
      className="
        fixed top-0 left-0 w-full z-50 
        bg-white/80 backdrop-blur-xl 
        border-b border-gray-200
        justify-start md:justify-center

        overflow-x-auto md:overflow-visible
        scrollbar-hide 
        flex
      "
    >
      <nav
        className="
          flex gap-3 py-3 px-4
          md:gap-4 md:py-4 md:px-6
        "
      >
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.url}
            className={`
              px-4 py-2 md:px-6 md:py-3 
              rounded-xl text-sm font-medium transition-all
              whitespace-nowrap

              ${
                active === tab.key
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {t("nav", tab.key)}
          </Link>
        ))}
        <div className="flex items-center pl-2 ml-1 border-l border-gray-200">
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  );
}