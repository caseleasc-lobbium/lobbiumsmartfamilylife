"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Startseite", href: "/" },
    {
      label: "Finanzen & Spartipps",
      href: "/finanzen-spartipps",
      submenu: [
        { label: "Geld sparen", href: "/finanzen-spartipps/geld-sparen" },
        { label: "Versicherungen", href: "/finanzen-spartipps/versicherungen" },
        { label: "Geld anlegen", href: "/finanzen-spartipps/geld-anlegen" },
        { label: "Familienbudget", href: "/finanzen-spartipps/familienbudget" },
      ],
    },
    {
      label: "Familienleben",
      href: "/familienleben",
      submenu: [
        { label: "Alltag & Organisation", href: "/familienleben/alltag" },
        { label: "Beziehung & Erziehung", href: "/familienleben/erziehung" },
        { label: "Haushalt", href: "/familienleben/haushalt" },
      ],
    },
    {
      label: "Kinder & Bildung",
      href: "/kinder-bildung",
      submenu: [
        { label: "Lern-Apps", href: "/kinder-bildung/lernapps" },
        { label: "Schulbedarf", href: "/kinder-bildung/schulbedarf" },
        { label: "Freizeit & Entwicklung", href: "/kinder-bildung/freizeit" },
      ],
    },
    {
      label: "Lifestyle",
      href: "/lifestyle",
      submenu: [
        { label: "Smart Home", href: "/lifestyle/smart-home" },
        { label: "Nachhaltigkeit", href: "/lifestyle/nachhaltigkeit" },
        { label: "Ernährung & Rezepte", href: "/lifestyle/rezepte" },
      ],
    },
    { label: "Blog", href: "/blog" },
    { label: "Kontakt", href: "/kontakt" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-gradient-to-b from-[#e8f2ff]/80 to-white/70 backdrop-blur-md shadow-sm py-2"
          : "bg-gradient-to-b from-[#e8f2ff]/60 to-[#f7fbff]/50 backdrop-blur-sm py-4"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 transition-all duration-500">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-all duration-500">
          <Image
            src="/logo.png"
            alt="Smart Family Life Logo"
            width={isScrolled ? 70 : 90}
            height={isScrolled ? 70 : 90}
            priority
            className="object-contain transition-all duration-500"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6 text-[#1c3d6c] font-medium transition-all duration-500">
          {navItems.map((item, index) => (
            <li key={index} className="relative group">
              <Link
                href={item.href}
                className="hover:text-[#2b6cb0] transition-colors duration-200"
              >
                {item.label}
              </Link>

              {item.submenu && (
                <div className="absolute left-0 mt-2 hidden group-hover:block bg-white/90 backdrop-blur-md border border-[#e1e5ee] rounded-lg shadow-lg w-56 py-2 z-50">
                  {item.submenu.map((sub, subIndex) => (
                    <Link
                      key={subIndex}
                      href={sub.href}
                      className="block px-4 py-2 text-sm text-[#1c3d6c] hover:bg-[#f0f4ff] hover:text-[#2b6cb0] transition-colors duration-150"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}

          <li>
            <Link
              href="/newsletter"
              className="ml-4 bg-[#2b6cb0] hover:bg-[#1c3d6c] text-white font-semibold px-4 py-2 rounded-md transition duration-200"
            >
              Newsletter
            </Link>
          </li>
        </ul>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#1c3d6c] text-3xl focus:outline-none"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menü */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-[#e1e5ee] shadow-md">
          <ul className="flex flex-col p-4 space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="block text-[#1c3d6c] font-medium hover:text-[#2b6cb0]"
                >
                  {item.label}
                </Link>
                {item.submenu && (
                  <div className="pl-4 mt-1 space-y-1">
                    {item.submenu.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        href={sub.href}
                        className="block text-sm text-[#1c3d6c] hover:text-[#2b6cb0]"
                      >
                        • {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}

            <li>
              <Link
                href="/newsletter"
                className="block text-center bg-[#2b6cb0] text-white font-semibold py-2 rounded-md hover:bg-[#1c3d6c]"
              >
                Newsletter
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
