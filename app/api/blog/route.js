import { promises as fs } from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "data", "blog_posts");

export async function GET() {
  try {
    await fs.mkdir(BLOG_DIR, { recursive: true });
    const files = await fs.readdir(BLOG_DIR);
    const posts = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(path.join(BLOG_DIR, file), "utf-8");
        return JSON.parse(content);
      })
    );
    return new Response(JSON.stringify(posts.reverse()), { status: 200 });
  } catch {
    return new Response(JSON.stringify([]), { status: 200 });
  }
}

export async function POST(req) {
  try {
    const { title, desc } = await req.json();
    if (!title || !desc)
      return new Response(JSON.stringify({ error: "Alle Felder sind erforderlich." }), { status: 400 });

    await fs.mkdir(BLOG_DIR, { recursive: true });
    const file = path.join(BLOG_DIR, `post_${Date.now()}.json`);
    const data = { id: Date.now(), title, desc, date: new Date() };
    await fs.writeFile(file, JSON.stringify(data, null, 2));

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: "Fehler beim Speichern." }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const file = path.join(BLOG_DIR, `post_${id}.json`);
    await fs.unlink(file);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Beitrag nicht gefunden." }), { status: 404 });
  }
}