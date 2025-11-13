"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Dummy-Daten (später API)
  const [users] = useState([
    { id: 1, name: "Max Mustermann", email: "max@lobbium.com", role: "Admin", status: "Aktiv" },
    { id: 2, name: "Sophie Müller", email: "sophie@lobbium.com", role: "Editor", status: "Inaktiv" },
    { id: 3, name: "Jonas Becker", email: "jonas@lobbium.com", role: "User", status: "Aktiv" },
    { id: 4, name: "Laura Schmidt", email: "laura@lobbium.com", role: "Manager", status: "Aktiv" }
  ]);

  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    if (auth !== "true") {
      router.push("/admin/login");
      return;
    }

    // Session Timeout prüfen
    const now = Date.now();
    const diff = now - parseInt(loginTime);

    if (diff > 30 * 60 * 1000) {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      alert("⏳ Sitzung abgelaufen. Bitte erneut einloggen.");
      router.push("/admin/login");
      return;
    }

    setAuthenticated(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Lade Benutzerdaten...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-3xl shadow-lg w-[90%] max-w-5xl">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        👥 Benutzerverwaltung
      </h1>

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
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="p-4 text-gray-800">{u.name}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4">
                  <span className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      u.status === "Aktiv"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}