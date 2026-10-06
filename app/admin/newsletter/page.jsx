"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  { id: "all", label: "Alle" },
  { id: "confirmed", label: "Bestätigt" },
  { id: "pending", label: "Offen" },
];

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Aktion fehlgeschlagen");
  return data;
}

export default function NewsletterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const loadSubscribers = async () => {
    const response = await fetch("/api/admin/newsletter/subscribers", {
      cache: "no-store",
    });
    if (response.status === 401) {
      router.replace("/admin/login");
      throw new Error("Sitzung abgelaufen");
    }
    const data = await readResponse(response);
    setSubscribers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const auth = localStorage.getItem("lobbiumAdminAuth");
    const loginTime = Number(localStorage.getItem("lobbiumLoginTime"));
    if (auth !== "true" || !loginTime || Date.now() - loginTime > 30 * 60 * 1000) {
      localStorage.removeItem("lobbiumAdminAuth");
      localStorage.removeItem("lobbiumLoginTime");
      router.replace("/admin/login");
      return;
    }

    loadSubscribers()
      .catch((error) => setNotice(error.message))
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = subscribers.filter((subscriber) => {
    if (filter === "confirmed") return subscriber.confirmed === true;
    if (filter === "pending") return subscriber.confirmed !== true;
    return true;
  });
  const selectedIds = [...selected];
  const pendingCount = subscribers.filter((subscriber) => !subscriber.confirmed).length;
  const confirmedCount = subscribers.filter((subscriber) => subscriber.confirmed).length;
  const allVisibleSelected =
    filtered.length > 0 && filtered.every((subscriber) => selected.has(subscriber.id));

  const toggleOne = (id) => {
    setSelected((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleVisible = () => {
    setSelected((current) => {
      const next = new Set(current);
      if (allVisibleSelected) {
        filtered.forEach((subscriber) => next.delete(subscriber.id));
      } else {
        filtered.forEach((subscriber) => next.add(subscriber.id));
      }
      return next;
    });
  };

  const refreshAfterAction = async () => {
    await loadSubscribers();
    setSelected(new Set());
  };

  const deleteSubscribers = async (ids) => {
    if (!ids.length) return;
    if (!window.confirm(`${ids.length} ausgewählte Adresse(n) dauerhaft löschen?`)) return;
    setBusy("delete");
    setNotice("");
    try {
      const data = await readResponse(
        await fetch("/api/admin/newsletter/subscribers", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ids }),
        })
      );
      await refreshAfterAction();
      setNotice(`${data.deleted} Adresse(n) gelöscht.`);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy("");
    }
  };

  const sendNewsletter = async (ids) => {
    if (!ids.length) return;
    if (!window.confirm(`Newsletter an die bestätigten Empfänger dieser ${ids.length} Auswahl senden?`)) return;
    setBusy("newsletter");
    setNotice("");
    try {
      const data = await readResponse(
        await fetch("/api/admin/newsletter/send", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ids, mode: "newsletter" }),
        })
      );
      setNotice(`Newsletter gesendet: ${data.sent}; übersprungen: ${data.skipped}; Fehler: ${data.failed}.`);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy("");
    }
  };

  const sendCustom = async () => {
    if (!selectedIds.length || !subject.trim() || !message.trim()) return;
    if (!window.confirm(`Eigene E-Mail an die bestätigten Empfänger dieser ${selectedIds.length} Auswahl senden?`)) return;
    setBusy("custom");
    setNotice("");
    try {
      const data = await readResponse(
        await fetch("/api/admin/newsletter/send", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            ids: selectedIds,
            mode: "custom",
            subject: subject.trim(),
            message: message.trim(),
          }),
        })
      );
      setNotice(`E-Mail gesendet: ${data.sent}; übersprungen: ${data.skipped}; Fehler: ${data.failed}.`);
      setComposerOpen(false);
      setSubject("");
      setMessage("");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy("");
    }
  };

  const sendReminder = async ({ ids = null, all = false }) => {
    const count = all ? pendingCount : ids?.length || 0;
    if (!count) return;
    if (!window.confirm(`Double-Opt-in-Erinnerung an ${count} offene Anmeldung(en) senden? Es wird kein Newsletter versendet.`)) return;
    setBusy("reminder");
    setNotice("");
    try {
      const data = await readResponse(
        await fetch("/api/admin/newsletter/remind", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(all ? { all: true } : { ids }),
        })
      );
      setNotice(`Bestätigungs-Erinnerungen gesendet: ${data.sent}; Fehler: ${data.failed}.`);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusy("");
    }
  };

  const openComposerFor = (id) => {
    setSelected(new Set([id]));
    setComposerOpen(true);
    setNotice("");
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Lade Newsletter-Abonnenten...</div>;
  }

  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg w-[94%] max-w-6xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-2">Newsletter-Verwaltung</p>
          <h1 className="text-2xl font-bold text-[#0F1C3F]">Abonnenten und Versand</h1>
          <p className="text-gray-500 mt-1">{confirmedCount} bestätigt · {pendingCount} Bestätigung offen</p>
        </div>
        <button
          onClick={() => sendReminder({ all: true })}
          disabled={busy !== "" || pendingCount === 0}
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
        >
          Offene Anmeldungen erinnern
        </button>
      </div>

      {notice && (
        <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900" role="status">
          {notice}
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3">
        <div className="flex gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                filter === item.id ? "bg-[#0F1C3F] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-500">{selectedIds.length} ausgewählt</div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => sendNewsletter(selectedIds)}
          disabled={busy !== "" || selectedIds.length === 0}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Newsletter an Auswahl
        </button>
        <button
          onClick={() => setComposerOpen(true)}
          disabled={busy !== "" || selectedIds.length === 0}
          className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
        >
          Eigene E-Mail verfassen
        </button>
        <button
          onClick={() => deleteSubscribers(selectedIds)}
          disabled={busy !== "" || selectedIds.length === 0}
          className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Auswahl löschen
        </button>
      </div>

      {composerOpen && (
        <div className="mb-6 rounded-2xl border border-blue-100 bg-[#f8faff] p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-bold text-[#0F1C3F]">Eigene E-Mail</h2>
              <p className="text-sm text-gray-500">Versand nur an bestätigte Adressen der aktuellen Auswahl.</p>
            </div>
            <button onClick={() => setComposerOpen(false)} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Schließen</button>
          </div>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={160}
            placeholder="Betreff"
            className="mb-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={10000}
            rows={7}
            placeholder="Nachricht"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={sendCustom}
              disabled={busy !== "" || !subject.trim() || !message.trim()}
              className="rounded-xl bg-[#0F1C3F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#162957] disabled:opacity-50"
            >
              E-Mail senden
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  aria-label="Alle sichtbaren Adressen auswählen"
                  checked={allVisibleSelected}
                  onChange={toggleVisible}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </th>
              <th className="p-4 text-left font-semibold text-gray-700">Name</th>
              <th className="p-4 text-left font-semibold text-gray-700">E-Mail</th>
              <th className="p-4 text-left font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left font-semibold text-gray-700">Erstellt</th>
              <th className="p-4 text-right font-semibold text-gray-700">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">Keine Einträge in diesem Status.</td></tr>
            )}
            {filtered.map((subscriber) => (
              <tr key={subscriber.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    aria-label={`${subscriber.email} auswählen`}
                    checked={selected.has(subscriber.id)}
                    onChange={() => toggleOne(subscriber.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </td>
                <td className="p-4 font-medium text-gray-900">{subscriber.name || "–"}</td>
                <td className="p-4 text-gray-600">{subscriber.email}</td>
                <td className="p-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                    subscriber.confirmed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {subscriber.confirmed ? "Bestätigt" : "Bestätigung offen"}
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                  {subscriber.created_at ? new Date(subscriber.created_at).toLocaleDateString("de-DE") : "–"}
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {subscriber.confirmed ? (
                      <>
                        <button onClick={() => sendNewsletter([subscriber.id])} disabled={busy !== ""} className="text-sm font-semibold text-blue-700 hover:underline disabled:opacity-50">Newsletter</button>
                        <button onClick={() => openComposerFor(subscriber.id)} disabled={busy !== ""} className="text-sm font-semibold text-gray-700 hover:underline disabled:opacity-50">E-Mail</button>
                      </>
                    ) : (
                      <button onClick={() => sendReminder({ ids: [subscriber.id] })} disabled={busy !== ""} className="text-sm font-semibold text-amber-700 hover:underline disabled:opacity-50">Erinnern</button>
                    )}
                    <button onClick={() => deleteSubscribers([subscriber.id])} disabled={busy !== ""} className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-50">Löschen</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
