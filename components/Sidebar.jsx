"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Newsletter", path: "/admin/newsletter" },
    { name: "Affiliates", path: "/admin/affiliates" },
    { name: "Affiliate Statistik", path: "/admin/affiliates/stats" }, // ✔ G8
    { name: "Blog / Ratgeber", path: "/admin/blog" },
    { name: "Deal-Radar", path: "/admin/deals" },
    { name: "Fehler-Log", path: "/admin/logs" },
    { name: "Einstellungen", path: "/admin/settings" },
  ];

  const isActive = (itemPath) =>
    pathname === itemPath || pathname.startsWith(itemPath + "/");

  const handleLogout = async () => {
    localStorage.removeItem("lobbiumAdminAuth");
    localStorage.removeItem("lobbiumLoginTime");
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    router.push("/admin/login");
  };

  return (
    <div className="w-64 h-full bg-white border border-gray-200 shadow-xl rounded-3xl flex flex-col justify-between overflow-hidden">
      <div>
        <div className="p-6 text-2xl font-bold text-gray-800 border-b border-gray-100">
          ⚙️ Admin Menü
        </div>

        <nav className="flex flex-col p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`text-left px-4 py-2 rounded-xl transition duration-200 ${
                isActive(item.path)
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-xl text-left text-gray-700 hover:bg-gray-50 transition"
        >
          🚪 Logout
        </button>

        <div className="text-center text-sm text-gray-500 mt-3">
          © {new Date().getFullYear()} Lobbium
        </div>
      </div>
    </div>
  );
}