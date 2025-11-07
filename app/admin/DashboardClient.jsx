"use client";
import { useState, useEffect } from "react";

export default function DashboardClient({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [messages, setMessages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", desc: "" });

  // Daten holen
  useEffect(() => {
    if (activeTab === "contacts") {
      fetch("/api/contact").then(r => r.json()).then(setMessages).catch(() => setMessages([]));
    }
    if (activeTab === "blog") {
      fetch("/api/blog").then(r => r.json()).then(setPosts).catch(() => setPosts([]));
    }
  }, [activeTab]);

  // Blog hinzufügen
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.desc) return;
    await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    setNewPost({ title: "", desc: "" });
    fetch("/api/blog").then(r => r.json()).then(setPosts);
  };

  // Blog löschen
  const handleDelete = async (id) => {
    await fetch("/api/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPosts(posts.filter(p => p.id !== id));
  };

  // Tabs-Inhalt
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div>
            <h2 className="text-xl font-bold text-[#1c3d6c] mb-4">Übersicht</h2>
            <p>Willkommen im Admin-Bereich von <b>Lobbium</b>.</p>
          </div>
        );

      case "contacts":
        return (
          <div>
            <h2 className="text-xl font-bold text-[#1c3d6c] mb-6">📬 Kontaktanfragen</h2>
            {messages.length === 0 ? (
              <p className="text-gray-500">Keine Nachrichten vorhanden.</p>
            ) : (
              <table className="min-w-full border border-[#e1e5ee] bg-white/80 rounded-xl overflow-hidden">
                <thead className="bg-[#f0f4ff] text-[#1c3d6c]">
                  <tr>
                    <th className="p-3 text-left">Datum</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">E-Mail</th>
                    <th className="p-3 text-left">Nachricht</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m, i) => (
                    <tr key={i} className="border-t border-[#e1e5ee] hover:bg-[#f9faff]">
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(m.date).toLocaleString("de-DE")}
                      </td>
                      <td className="p-3 text-sm">{m.name}</td>
                      <td className="p-3 text-sm">{m.email}</td>
                      <td className="p-3 text-sm">{m.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case "blog":
        return (
          <div>
            <h2 className="text-xl font-bold text-[#1c3d6c] mb-6">📰 Blog-Beiträge</h2>

            {/* Formular */}
            <form onSubmit={handleAddPost} className="mb-6 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Titel"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="flex-1 border border-[#ccd3e0] rounded-md px-4 py-2"
              />
              <input
                type="text"
                placeholder="Kurzbeschreibung"
                value={newPost.desc}
                onChange={(e) => setNewPost({ ...newPost, desc: e.target.value })}
                className="flex-1 border border-[#ccd3e0] rounded-md px-4 py-2"
              />
              <button
                type="submit"
                className="bg-[#2b6cb0] hover:bg-[#1c3d6c] text-white px-5 py-2 rounded-md font-semibold"
              >
                Hinzufügen
              </button>
            </form>

            {/* Tabelle */}
            {posts.length === 0 ? (
              <p className="text-gray-500">Noch keine Blog-Beiträge vorhanden.</p>
            ) : (
              <table className="min-w-full border border-[#e1e5ee] bg-white/80 rounded-xl overflow-hidden">
                <thead className="bg-[#f0f4ff] text-[#1c3d6c]">
                  <tr>
                    <th className="p-3 text-left">Titel</th>
                    <th className="p-3 text-left">Beschreibung</th>
                    <th className="p-3 text-left">Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id} className="border-t border-[#e1e5ee] hover:bg-[#f9faff]">
                      <td className="p-3">{p.title}</td>
                      <td className="p-3">{p.desc}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Löschen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f4ff] to-[#f8faff]">
<header className="backdrop-blur-md bg-white/30 border-b border-white/40 shadow-sm sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
  <h1 className="text-lg font-semibold text-[#1c3d6c] drop-shadow-sm">
    ⚙️ Lobbium Admin
  </h1>
  <div className="flex items-center gap-3">
    <a
      href="/"
      className="bg-[#2b6cb0] hover:bg-[#1c3d6c] text-white px-4 py-1 rounded-md font-semibold transition"
    >
      🔙 Zur Website
    </a>
    <button
      onClick={onLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md font-semibold"
    >
      Logout
    </button>
  </div>
</header>

      <nav className="backdrop-blur-lg bg-white/40 border-b border-white/30 flex justify-center gap-4 py-3 sticky top-[64px] z-40">
        {[
          { id: "overview", label: "Übersicht" },
          { id: "contacts", label: "Kontakte" },
          { id: "blog", label: "Blog" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-md font-medium ${
              activeTab === tab.id
                ? "bg-[#2b6cb0]/90 text-white"
                : "text-[#1c3d6c] hover:bg-[#eaf0ff]/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="backdrop-blur-xl bg-white/60 rounded-2xl p-8 border border-white/40 shadow-md">
          {renderContent()}
        </div>
      </main>
    </section>
  );
}