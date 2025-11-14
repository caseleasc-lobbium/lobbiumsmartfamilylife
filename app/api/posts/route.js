import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "posts.json");

// Datei laden
function loadPosts() {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error("Fehler beim Lesen von posts.json:", err);
    return [];
  }
}

// Datei speichern
function savePosts(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const posts = loadPosts();

    // Sortieren nach Datum DESC
    const sorted = posts.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Serverfehler beim Laden" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const posts = loadPosts();

    const newPost = {
      id: Date.now(),
      title: data.title,
      content: data.content,
      author: data.author || "Unbekannt",
      createdAt: new Date().toISOString(),
    };

    posts.push(newPost);
    savePosts(posts);

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern", detail: error.message },
      { status: 500 }
    );
  }
}