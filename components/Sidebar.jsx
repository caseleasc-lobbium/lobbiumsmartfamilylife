"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // ⏳ Clientseitige Initialisierung für Next.js 14
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Benutzer", path: "/admin/users" },
    { name: "Statistiken", path: "/admin/stats" },
    { name: "Newsletter", path: "/admin/newsletter" },
    { name: "Affiliates", path: "/admin/affiliates" }, // ✅ NEU
    { name: "Einstellungen", path: "/admin/settings" },
  ];

  return (
    <div className="w-64 h-full bg-white border border-gray-200 shadow-xl rounded-3xl flex flex-col justify-between">
      <div>
        {/* 🧩 Kopfbereich */}
        <div className="p-6 text-2xl font-bold text-gray-800 border-b border-gray-100">
          ⚙️ Admin Menü
        </div>

        {/* 📋 Navigation */}
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`text-left px-4 py-2 rounded-xl transition duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 📆 Footer */}
      <div className="p-4 border-t border-gray-100 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Lobbium
      </div>
    </div>
  );
}