import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// -----------------------------
// Admin Authorization
// -----------------------------
function isAuthorized(request) {
  const authHeader = request.headers.get("authorization") || "";
  const serverSecret =
    process.env.ADMIN_SECRET || "lobbium_secure_key_2025_V6.1";

  const expected = `Bearer ${serverSecret}`;
  return authHeader === expected;
}

// -----------------------------
// GET – Einzelner Affiliate
// -----------------------------
export async function GET(request, { params }) {
  try {
    const id = Number(params.id);

    const affiliate = await prisma.affiliates.findUnique({
      where: { id },
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: "Partner nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(affiliate);
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { error: "Serverfehler" },
      { status: 500 }
    );
  }
}

// -----------------------------
// PUT – Affiliate bearbeiten
// -----------------------------
export async function PUT(request, { params }) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params.id);
    const body = await request.json();

    const updated = await prisma.affiliates.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category,
        imageUrl: body.imageUrl,
        link: body.link,
        description: body.description,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern" },
      { status: 500 }
    );
  }
}

// -----------------------------
// DELETE – Affiliate löschen
// -----------------------------
export async function DELETE(request, { params }) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params.id);

    const existing = await prisma.affiliates.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Partner nicht gefunden" },
        { status: 404 }
      );
    }

    await prisma.affiliates.delete({
      where: { id },
    });

    console.log(`✅ Affiliate ${id} gelöscht`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen" },
      { status: 500 }
    );
  }
}