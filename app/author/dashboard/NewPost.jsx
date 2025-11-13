"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  async function handleSave() {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      alert("Beitrag gespeichert!");
      router.push("/author/dashboard");
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">📝 Neuer Beitrag</h2>
      <input
        type="text"
        placeholder="Titel des Beitrags"
        className="border p-2 w-full mb-3 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        rows="10"
        placeholder="Beitrag schreiben..."
        className="border p-2 w-full rounded mb-3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Speichern
      </button>
    </div>
  );
}