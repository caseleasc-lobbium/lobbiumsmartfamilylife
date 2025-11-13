"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthorSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // 🔄 Damit clientseitige Navigation erst nach Mount startet
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const menuItems = [
    { name: "Dashboard", path: "/author/dashboard" },
    { name: "Neuer Beitrag", path: "/author/dashboard/new" },
    { name: "Meine Beiträge", path: "/author/dashboard/posts" },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem("authorToken");
      router.push("/author/login");
    } catch (error) {
      console.error("Logout-Fehler:", error);
    }
  };

  return (
    <aside className="flex flex-col justify-between bg-white border-r border-gray-200 shadow-xl w-64 min-h-screen">
      {/* 🔹 Kopfbereich */}
      <div>
        <div className="p-6 border-b border-gray-100 text-2xl font-bold text-gray-800">
          ✍️ Autoren Menü
        </div>

        {/* 🔸 Navigation */}
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`text-left px-4 py-2 rounded-lg transition duration-200 ${
                  isActive
                    ? "bg-[#e6f0ff] text-[#2b6cb0] font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 🔻 Logout & Footer */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 w-full rounded-lg shadow transition duration-200"
        >
          Logout
        </button>
        <div className="text-center text-sm text-gray-500 mt-3">
          © {new Date().getFullYear()} Lobbium
        </div>
      </div>
    </aside>
  );
}