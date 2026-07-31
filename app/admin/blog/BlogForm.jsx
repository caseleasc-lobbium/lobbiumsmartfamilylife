"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "finanzen-spartipps", label: "💰 Finanzen & Spartipps" },
  { value: "familienleben", label: "🌳 Familienleben" },
  { value: "kinder-bildung", label: "🎓 Kinder & Bildung" },
  { value: "lifestyle", label: "✨ Lifestyle" },
];

export default function BlogForm({ initial = null, postId = null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    title: initial?.title || "",
    slug: initial?.slug || "",
    locale: initial?.locale || "de",
    category: initial?.category || "familienleben",
    excerpt: initial?.excerpt || "",
    content: initial?.content || "",
    image_url: initial?.image_url || "",
    translation_key: initial?.translation_key || "",
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
    setSaving(true);
    try {
      const res = await fetch(postId ? `/api/admin/blog/${postId}` : "/api/admin/blog", {
        method: postId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.error || "Speichern fehlgeschlagen.");
        setSaving(false);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Netzwerkfehler.");
      setSaving(false);
    }
  };

  const input = "w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const label = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <form onSubmit={submit} className="max-w-3xl bg-white p-6 sm:p-8 rounded-3xl shadow space-y-5">
      {error && <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>}

      <div>
        <label className={label}>Titel *</label>
        <input className={input} value={f.title} onChange={set("title")} placeholder="z. B. Clevere Spartipps für Familien" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Slug (URL)</label>
          <input className={input} value={f.slug} onChange={set("slug")} placeholder="leer lassen = automatisch aus Titel" />
        </div>
        <div>
          <label className={label}>Sprache</label>
          <select className={input} value={f.locale} onChange={set("locale")}>
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Rubrik</label>
          <select className={input} value={f.category} onChange={set("category")}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Titelbild-URL (optional)</label>
          <input className={input} value={f.image_url} onChange={set("image_url")} placeholder="https://…" />
        </div>
      </div>

      <div>
        <label className={label}>Kurzbeschreibung (excerpt)</label>
        <textarea className={input} rows={2} value={f.excerpt} onChange={set("excerpt")} placeholder="1–2 Sätze, erscheinen in der Übersicht und bei Google." />
      </div>

      <div>
        <label className={label}>Inhalt (HTML)</label>
        <textarea className={`${input} font-mono text-sm`} rows={16} value={f.content} onChange={set("content")}
          placeholder="<p>Text…</p>&#10;<h2>Zwischenüberschrift</h2>&#10;<ul><li>Punkt</li></ul>" />
        <p className="text-xs text-gray-400 mt-1">
          Erlaubt: &lt;h2&gt; &lt;h3&gt; &lt;p&gt; &lt;ul&gt;/&lt;li&gt; &lt;strong&gt; &lt;a href&gt;. Formatierung wie in den bestehenden Artikeln.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Übersetzungs-Schlüssel (optional)</label>
          <input className={input} value={f.translation_key} onChange={set("translation_key")} placeholder="verbindet DE/EN/FR desselben Artikels" />
        </div>
        <label className="flex items-center gap-3 mt-6">
          <input type="checkbox" checked={f.published} onChange={set("published")} className="w-5 h-5 accent-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Veröffentlicht (sonst Entwurf)</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl">
          {saving ? "Speichern…" : postId ? "Änderungen speichern" : "Artikel anlegen"}
        </button>
        <button type="button" onClick={() => router.push("/admin/blog")}
          className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
