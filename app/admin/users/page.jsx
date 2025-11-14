"use client";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return <div>Dashboard</div>;
}

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [users] = useState([
    { id: 1, name: "Max Mustermann", email: "max@lobbium.com", role: "Admin", status: "Aktiv" },
    { id: 2, name: "Sophie Müller", email: "sophie@lobbium.com", role: "Editor", status: "Inaktiv" },
    { id: 3, name: "Jonas Weber", email: "jonas@lobbium.com", role: "User", status: "Aktiv" },
    { id: 4, name: "Laura Schmidt", email: "laura@lobbium.com", role: "Manager", status: "Aktiv" },
  ]);

  // 🔐 Auth-Check
  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    if (auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    const now = Date.now();
    const diff = now - parseInt(loginTime);

    if (!loginTime || diff > 30 * 60 * 1000) {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      alert("⏳ Sitzung abgelaufen. Bitte erneut einloggen.");
      router.replace("/admin/login");
      return;
    }

    setLoading(false);
  }, [router]);


  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Lade Benutzer...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-3xl shadow-lg w-[90%] max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">👥 Benutzerverwaltung</h1>

      <p className="text-gray-600 mb-6">
        Hier werden künftig alle registrierten Benutzer angezeigt und verwaltet.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">Name</th>
              <th className="text-left p-4 font-semibold text-gray-700">E-Mail</th>
              <th className="text-left p-4 font-semibold text-gray-700">Rolle</th>
              <th className="text-left p-4 font-semibold text-gray-700">Status</th>
              <th className="text-left p-4 font-semibold text-gray-700">Aktionen</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="p-4">{user.name}</td>
                <td className="p-4 text-gray-600">{user.email}</td>
                <td className="p-4">
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      user.status === "Aktiv"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-blue-600 hover:underline mr-3">
                    Bearbeiten
                  </button>
                  <button className="text-red-600 hover:underline">
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}