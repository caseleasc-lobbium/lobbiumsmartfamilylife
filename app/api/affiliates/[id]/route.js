import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data_affiliates.json");

// 🔧 Hilfsfunktionen zum Lesen und Schreiben
function readAffiliates() {
  try {
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("❌ Fehler beim Lesen:", err);
    return [];
  }
}

function writeAffiliates(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("❌ Fehler beim Schreiben:", err);
  }
}

// 🔐 Sicherheitsprüfung (ENV-basiert)
function isAuthorized(request) {
  const authHeader = request.headers.get("authorization") || "";
  const serverSecret = process.env.ADMIN_SECRET || "lobbium_secure_key_2025_V6.1";
  const expected = `Bearer ${serverSecret}`;

  if (authHeader !== expected) {
    console.warn("🚫 Nicht autorisiert. Erhalten:", authHeader);
    return false;
  }
  return true;
}

// 🗑️ DELETE – Affiliate löschen
export async function DELETE(request, { params }) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Fehlende ID" }, { status: 400 });
    }

    const affiliates = readAffiliates();
    const updated = affiliates.filter((a) => a.id !== Number(id));

    if (affiliates.length === updated.length) {
      return NextResponse.json({ error: "Partner nicht gefunden" }, { status: 404 });
    }

    writeAffiliates(updated);
    console.log(`✅ Partner ${id} gelöscht`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}