"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "../../BlogForm";

export default function EditBlogPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/blog/${id}`);
        if (!res.ok) return setState("error");
        setPost(await res.json());
        setState("ok");
      } catch {
        setState("error");
      }
    })();
  }, [id]);

  if (state === "loading") return <div className="p-10 text-center text-gray-500">🔄 Lade Artikel…</div>;
  if (state === "error") return <div className="p-10 text-center text-red-500">Artikel nicht gefunden.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-4">
      <h1 className="text-2xl font-bold mb-5 px-1">Artikel bearbeiten</h1>
      <BlogForm initial={post} postId={id} />
    </div>
  );
}
