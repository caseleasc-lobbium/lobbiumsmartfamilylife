"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Benutzer", path: "/admin/users" },
    { name: "Statistiken", path: "/admin/stats" },
    { name: "Einstellungen", path: "/admin/settings" },
  ];

  return (
    <div className="w-64 h-full bg-white border border-gray-200 shadow-xl rounded-3xl flex flex-col justify-between">
      <div>
        <div className="p-6 text-2xl font-bold text-gray-800 border-b border-gray-100">
          ⚙️ Admin Menü
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`text-left px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-blue-500 text-white font-semibold"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 text-center text-sm text-gray-500">
        © 2025 Lobbium
      </div>
    </div>
  );
}