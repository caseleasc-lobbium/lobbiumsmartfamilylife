export const dynamic = "force-dynamic";

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
