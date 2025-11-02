import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { name: "Startseite", path: "/" },
    {
      name: "Finanzen & Spartipps",
      path: "/finanzen-spartipps",
      sub: [
        { name: "Geld sparen", path: "/finanzen-spartipps/geld-sparen" },
        { name: "Versicherungen", path: "/finanzen-spartipps/versicherungen" },
        { name: "Geld anlegen", path: "/finanzen-spartipps/geld-anlegen" },
        { name: "Familienbudget", path: "/finanzen-spartipps/familienbudget" },
      ],
    },
    {
      name: "Familienleben",
      path: "/familienleben-alltag",
      sub: [
        { name: "Alltag & Organisation", path: "/familienleben/alltag" },
        { name: "Beziehung & Erziehung", path: "/familienleben/erziehung" },
        { name: "Haushalt", path: "/familienleben/haushalt" },
      ],
    },
    {
      name: "Kinder & Bildung",
      path: "/kinder-bildung",
      sub: [
        { name: "Lern-Apps", path: "/kinder-bildung/lernapps" },
        { name: "Schulbedarf", path: "/kinder-bildung/schulbedarf" },
        { name: "Freizeit & Entwicklung", path: "/kinder-bildung/freizeit" },
      ],
    },
    {
      name: "Lifestyle",
      path: "/lifestyle",
      sub: [
        { name: "Smart Home", path: "/lifestyle/smart-home" },
        { name: "Nachhaltigkeit", path: "/lifestyle/nachhaltigkeit" },
        { name: "Ernährung & Rezepte", path: "/lifestyle/rezepte" },
      ],
    },
    { name: "Blog", path: "/blog" },
    { name: "Kontakt", path: "/kontakt" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Lobbium Logo" width={90} height={90} priority />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          {menuItems.map((item) => (
            <div key={item.name} className="relative group">
              <Link href={item.path} className="hover:text-blue-600 transition">
                {item.name}
              </Link>
              {item.sub && (
                <div className="absolute hidden group-hover:block bg-white border border-gray-100 rounded-lg shadow-md mt-2 p-2">
                  {item.sub.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.path}
                      className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Newsletter Button */}
        <Link
          href="/newsletter"
          className="hidden md:inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          Newsletter
        </Link>

        {/* Mobile Menü Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü öffnen oder schließen"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menü */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 flex flex-col p-4 space-y-3 text-sm">
          {menuItems.map((item) => (
            <div key={item.name}>
              <Link href={item.path} className="font-medium hover:text-blue-600">
                {item.name}
              </Link>
              {item.sub && (
                <div className="pl-4 mt-1 space-y-1 text-gray-600">
                  {item.sub.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.path}
                      className="block hover:text-blue-600"
                    >
                      • {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
