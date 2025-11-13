'use client';
import { useState } from 'react';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        author: 'Sergino', // später dynamisch
      }),
    });

    if (res.ok) {
      setMessage('✅ Beitrag erfolgreich gespeichert!');
      setTitle('');
      setContent('');
    } else {
      setMessage('❌ Fehler beim Speichern des Beitrags.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">✍️ Neuen Beitrag erstellen</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Titel eingeben"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Inhalt eingeben"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded min-h-[150px]"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Beitrag speichern
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}