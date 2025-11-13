import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Wichtig: relativer Import korrekt?

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
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

    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        author: data.author || "Unbekannt",
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern", detail: error.message },
      { status: 500 }
    );
  }
}