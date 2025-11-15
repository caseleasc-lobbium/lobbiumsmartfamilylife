import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --------------------------------------------------
// Admin Auth
// --------------------------------------------------
function isAuthorized(request) {
  const authHeader = request.headers.get("authorization") || "";
  const expected = "lobbiumAdminAuth:true";
  return authHeader === expected;
}

// --------------------------------------------------
// GET → Einzelnen Partner abrufen
// --------------------------------------------------
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const affiliate = await prisma.affiliates.findUnique({
      where: { id: Number(id) },
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: "Partner nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(affiliate);
  } catch (err) {
    console.error("GET /affiliates/[id] Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// --------------------------------------------------
// PUT → Partner bearbeiten
// --------------------------------------------------
export async function PUT(request, { params }) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const updated = await prisma.affiliates.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        category: body.category,
        imageUrl: body.imageUrl,
        link: body.link,
        description: body.description,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /affiliates/[id] Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// --------------------------------------------------
// DELETE → Partner löschen
// --------------------------------------------------
export async function DELETE(request, { params }) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.affiliates.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /affiliates/[id] Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}