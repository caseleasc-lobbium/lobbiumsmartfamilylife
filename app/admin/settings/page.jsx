"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // 🔐 ADMIN LOGIN / SESSION SCHUTZ
  // -----------------------------
  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = localStorage.getItem("lobbiumLoginTime");

    // Nicht eingeloggt → Redirect
    if (auth !== "true") {
      router.replace("/admin/login");
      return;
    }

    // Timeout → 30 Min
    const now = Date.now();
    if (!loginTime || now - parseInt(loginTime) > 30 * 60 * 1000) {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      alert("⏳ Sitzung abgelaufen. Bitte erneut einloggen.");
      router.replace("/admin/login");
      return;
    }

    setLoading(false);
  }, [router]);

  // -----------------------------
  // 📦 EINSTELLUNGEN LADEN
  // -----------------------------
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
  });

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      const data = await res.json();
      setSettings(data);
    } catch {
      console.warn("⚠️ Konnte Settings nicht laden.");
      setSettings({
        siteName: "",
        siteDescription: "",
        contactEmail: "",
      });
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // -----------------------------
  // 💾 SPEICHERN
  // -----------------------------
  const handleSave = async () => {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "lobbiumAdminAuth:true",
      },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      alert("✅ Einstellungen erfolgreich gespeichert");
    } else {
      alert("❌ Fehler beim Speichern");
    }
  };

  // -----------------------------
  // 🚀 Ladebildschirm
  // -----------------------------
  if (loading) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Lade Admin...</p>
      </div>
    );
  }

  // -----------------------------
  // 🎨 UI – LOBBIUM DESIGN
  // -----------------------------
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">⚙️ Einstellungen</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 max-w-xl">

        <label className="block mb-4">
          <span className="font-medium text-gray-700">Seitenname</span>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-xl"
            value={settings.siteName}
            onChange={(e) =>
              setSettings({ ...settings, siteName: e.target.value })
            }
            placeholder="z.B. Lobbium Smart Family Life"
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium text-gray-700">Kurzbeschreibung</span>
          <textarea
            rows={3}
            className="w-full mt-1 p-2 border rounded-xl"
            value={settings.siteDescription}
            onChange={(e) =>
              setSettings({ ...settings, siteDescription: e.target.value })
            }
            placeholder="Beschreibung für SEO & Startseite"
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium text-gray-700">Kontakt E-Mail</span>
          <input
            type="email"
            className="w-full mt-1 p-2 border rounded-xl"
            value={settings.contactEmail}
            onChange={(e) =>
              setSettings({ ...settings, contactEmail: e.target.value })
            }
            placeholder="z.B. kontakt@lobbium.com"
          />
        </label>

        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow mt-3"
        >
          Speichern
        </button>

      </div>
    </div>
  );
}