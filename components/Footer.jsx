"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    const loadFooter = async () => {
      try {
        const res = await fetch("/api/footer");
        const data = await res.json();
        setFooter(data);
      } catch (err) {
        console.error("Footer Load Error:", err);
      }
    };
    loadFooter();
  }, []);

  if (!footer) return null;

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-20">
      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* LOGO + DESC */}
        <div>
          <img
            src={footer.logo}
            className="h-12 w-auto mb-4"
            alt="Lobbium Logo"
          />
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            {footer.description}
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Navigation</h3>

          <ul className="flex flex-col gap-2">
            {footer.links.map((l, i) => (
              <li key={i}>
                <Link
                  href={l.url}
                  className="text-gray-600 hover:text-blue-600 transition text-sm"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* NEWSLETTER BUTTON */}
        <div>
          <h3 className="text-gray-800 font-semibold mb-4">
            Newsletter
          </h3>

          <Link
            href={footer.newsletter_button.url}
            className="
              px-5 py-3 rounded-xl
              bg-blue-600 text-white
              hover:bg-blue-700 transition
              text-sm font-semibold
            "
          >
            {footer.newsletter_button.label}
          </Link>

          <p className="text-gray-500 text-xs mt-3 max-w-xs">
            Keine Werbung. Kein Spam. Jederzeit kündbar.
          </p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Lobbium – Smart Family Life
      </div>
    </footer>
  );
}