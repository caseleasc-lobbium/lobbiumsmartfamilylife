import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 📁 Speicherort für Affiliates (lokale JSON-Datei)
const filePath = path.join(process.cwd(), "data_affiliates.json");

// 🧩 Lesen & Schreiben – sicher
function readAffiliates() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData || "[]");
  } catch (err) {
    console.error("❌ Fehler beim Lesen:", err);
    return [];
  }
}

function writeAffiliates(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Fehler beim Schreiben:", err);
  }
}

// 🔄 Hilfsfunktion: tägliche Rotation (gleicher Shuffle pro Tag)
function dailyShuffle(array) {
  const today = new Date().toISOString().slice(0, 10);
  const seed = today.split("-").join("");
  return [...array].sort(
    (a, b) => ((a.id * seed.length) % 7) - ((b.id * seed.length) % 7)
  );
}

// 📦 GET – Affiliates abrufen (mit Filter, Limit & täglicher Rotation)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    let affiliates = readAffiliates();

    // Kategorie filtern
    if (category && category !== "all") {
      affiliates = affiliates.filter(
        (a) => a.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // 🔄 Tägliche Rotation
    affiliates = dailyShuffle(affiliates);

    // Limitieren, wenn nötig
    if (limit > 0) affiliates = affiliates.slice(0, limit);

    return new NextResponse(JSON.stringify(affiliates, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
      status: 200,
    });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}

// 💾 POST – neuen Affiliate speichern (mit Admin-Schutz)
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

    const affiliates = readAffiliates();
    const newAffiliate = {
      id: Date.now(),
      title,
      category,
      imageUrl,
      link,
      description,
      createdAt: new Date().toISOString(),
    };

    affiliates.push(newAffiliate);
    writeAffiliates(affiliates);

    return NextResponse.json(newAffiliate, { status: 200 });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern" },
      { status: 500 }
    );
  }
}

// 🗑 DELETE – Affiliate löschen (Admin-Schutz)
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

    const affiliates = readAffiliates();
    const updated = affiliates.filter((a) => a.id !== Number(id));
    writeAffiliates(updated);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen" },
      { status: 500 }
    );
  }
}