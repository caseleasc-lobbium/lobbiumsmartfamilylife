"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "finanzen-spartipps", label: "💰 Finanzen & Spartipps" },
  { value: "familienleben", label: "🌳 Familienleben" },
  { value: "kinder-bildung", label: "🎓 Kinder & Bildung" },
  { value: "lifestyle", label: "✨ Lifestyle" },
];

export default function DealForm({ initial = null, dealId = null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    title: initial?.title || "",
    partner: initial?.partner || "",
    url: initial?.url || "",
    hook: initial?.hook || "",
    category: initial?.category || "familienleben",
    image_url: initial?.image_url || "",
    valid_until: initial?.valid_until || "",
    description: initial?.description || "",
    affiliate_id: initial?.affiliate_id || "",
    published: initial?.published ?? true,
  });
  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setF((p) => ({ ...p, [k]: v }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!f.title.trim()) return setError("Bitte einen Titel eingeben.");
    if (!f.url.trim()) return setError("Bitte einen Link (URL) angeben – z. B. /api/affiliates/95 oder https://…");
    setSaving(true);
    try {
      const res = await fetch(dealId ? `/api/admin/deals/${dealId}` : "/api/admin/deals", {
        method: dealId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Speichern fehlgeschlagen."); setSaving(false); return; }
      router.push("/admin/deals");
      router.refresh();
    } catch {
      setError("Netzwerkfehler."); setSaving(false);
    }
  };

  const input = "w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const label = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <form onSubmit={submit} className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl shadow space-y-5">
      {error && <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}

      <div>
        <label className={label}>Titel *</label>
        <input className={input} value={f.title} onChange={set("title")} placeholder="z. B. Trip.com – Familienurlaub günstig buchen" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Partner</label>
          <input className={input} value={f.partner} onChange={set("partner")} placeholder="z. B. Trip.com" />
        </div>
        <div>
          <label className={label}>Hook / Badge</label>
          <input className={input} value={f.hook} onChange={set("hook")} placeholder="z. B. -20%, Neu, Top-Deal" />
        </div>
      </div>

      <div>
        <label className={label}>Link (URL) *</label>
        <input className={input} value={f.url} onChange={set("url")} placeholder="/api/affiliates/95  (getrackt)  oder  https://…" />
        <p className="text-xs text-gray-400 mt-1">Tipp: <code>/api/affiliates/&lt;ID&gt;</code> nutzt den Provisions-Link eines Partners. Sonst direkte Deal-URL.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Rubrik</label>
          <select className={input} value={f.category} onChange={set("category")}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Gültig bis (optional)</label>
          <input type="date" className={input} value={f.valid_until || ""} onChange={set("valid_until")} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Bild-URL (optional)</label>
          <input className={input} value={f.image_url} onChange={set("image_url")} placeholder="Logo/Bild – sonst Platzhalter" />
        </div>
        <div>
          <label className={label}>Partner-ID (optional)</label>
          <input className={input} value={f.affiliate_id} onChange={set("affiliate_id")} placeholder="Affiliate-ID, z. B. 95" />
        </div>
      </div>

      <div>
        <label className={label}>Beschreibung</label>
        <textarea className={input} rows={3} value={f.description} onChange={set("description")} placeholder="1–2 Sätze zum Angebot." />
      </div>

      <label className="flex items-center gap-3">
        <input type="checkbox" checked={f.published} onChange={set("published")} className="w-5 h-5 accent-blue-600" />
        <span className="text-sm font-semibold text-gray-700">Veröffentlicht</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl">
          {saving ? "Speichern…" : dealId ? "Änderungen speichern" : "Deal anlegen"}
        </button>
        <button type="button" onClick={() => router.push("/admin/deals")} className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
