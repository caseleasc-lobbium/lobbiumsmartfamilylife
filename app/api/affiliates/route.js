import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Prisma Client

// -----------------------------
// Tägliche Rotation (wie bei dir!)
// -----------------------------
function dailyShuffle(array) {
  const today = new Date().toISOString().slice(0, 10);
  const seed = Number(today.split("-").join(""));

  return [...array].sort(
    (a, b) => ((a.id * seed) % 7) - ((b.id * seed) % 7)
  );
}

// -----------------------------
// GET – Affiliates abrufen
// -----------------------------
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    let affiliates = await prisma.affiliates.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Kategorie-Filter
    if (category && category !== "all") {
      affiliates = affiliates.filter(
        (a) => a.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Tägliche Rotation (wie in deiner alten Logik)
    affiliates = dailyShuffle(affiliates);

    // Limit
    if (limit > 0) affiliates = affiliates.slice(0, limit);

    return NextResponse.json(affiliates, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}

// -----------------------------
// POST – Affiliate speichern (Admin)
// -----------------------------
export async function POST(request) {
  try {
    const auth = request.headers.get("authorization");
    if (auth !== "lobbiumAdminAuth:true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, imageUrl, link, description } = body;

    if (!title || !link) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen" },
        { status: 400 }
      );
    }

    const newAffiliate = await prisma.affiliates.create({
      data: {
        title,
        category,
        imageUrl,
        link,
        description,
      },
    });

    return NextResponse.json(newAffiliate, { status: 200 });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern" },
      { status: 500 }
    );
  }
}

// -----------------------------
// DELETE – Affiliate löschen (Admin)
// -----------------------------
export async function DELETE(request) {
  try {
    const auth = request.headers.get("authorization");
    if (auth !== "lobbiumAdminAuth:true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Fehlende ID" }, { status: 400 });
    }

    await prisma.affiliates.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen" },
      { status: 500 }
    );
  }
}