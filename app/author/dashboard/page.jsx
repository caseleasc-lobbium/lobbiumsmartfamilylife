'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthorDashboard() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Beiträge aus der Datenbank abrufen
    async function loadPosts() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Fehler beim Laden der Beiträge:', err);
      }
    }
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Willst du diesen Beitrag wirklich löschen?')) return;
    await fetch('/api/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Kopfzeile */}
      <div className="flex justify-between items-center border-b pb-3">
        <h1 className="text-2xl font-bold text-gray-800">
          ✍️ Autoren Dashboard
        </h1>
        <button
          onClick={() => router.push('/author/dashboard/new')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          + Neuer Beitrag
        </button>
      </div>

      {/* Begrüßung */}
<div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm text-center">
  <p className="text-gray-700 text-lg leading-relaxed">
    Willkommen im Autorenbereich von <b>Lobbium Smart Family Life</b>.
    <br />
    Hier kannst du deine Beiträge verwalten und neue Artikel erstellen.
  </p>
</div>

      {/* Beiträge */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <p className="text-gray-500 italic">
            Du hast noch keine Beiträge erstellt.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
            >
              <div>
                <h2 className="font-semibold text-gray-800">{post.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Löschen
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}