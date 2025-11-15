import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.affiliate_categories.findMany({
      orderBy: { name: "asc" }
    });

    return NextResponse.json(categories);
  } catch (err) {
    console.error("GET categories error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name fehlt" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/ /g, "-");

    const newCategory = await prisma.affiliate_categories.create({
      data: { name, slug }
    });

    return NextResponse.json(newCategory);
  } catch (err) {
    console.error("POST categories error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID fehlt" }, { status: 400 });
    }

    await prisma.affiliate_categories.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE categories error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}