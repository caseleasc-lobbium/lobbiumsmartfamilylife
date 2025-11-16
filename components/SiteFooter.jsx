"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SiteFooter() {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    const loadFooter = async () => {
      try {
        const res = await fetch("/api/site/footer");
        const data = await res.json();
        setFooter(data);
      } catch (err) {
        console.error("Footer Load Error:", err);
      }
    };
    loadFooter();
  }, []);

  if (!footer) return null;

  const safeLinks = Array.isArray(footer.links) ? footer.links : [];
  const btn = footer.newsletter_button || { label: "Newsletter", url: "/newsletter" };

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-20">

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          {footer.logo && (
            <img src={footer.logo} className="h-12 w-auto mb-4" alt="Lobbium Logo" />
          )}
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            {footer.description || ""}
          </p>
        </div>

        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Navigation</h3>
          <ul className="flex flex-col gap-2">
            {safeLinks.map((l, i) => (
              <li key={i}>
                <Link href={l.url} className="text-gray-600 hover:text-blue-600 transition text-sm">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Newsletter</h3>

          <Link
            href={btn.url}
            className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-semibold"
          >
            {btn.label}
          </Link>

          <p className="text-gray-500 text-xs mt-3 max-w-xs">
            Keine Werbung. Kein Spam. Jederzeit kündbar.
          </p>
        </div>

      </div>

      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Lobbium – Smart Family Life
      </div>
    </footer>
  );
}