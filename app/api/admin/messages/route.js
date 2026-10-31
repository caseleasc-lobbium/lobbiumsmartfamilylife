import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { PRIVATE_API_HEADERS, validateAdminAuth } from "@/lib/security";

const MESSAGES_DIR = path.join(process.cwd(), "data", "contact_fallbacks");

// 📬 GET – Nachrichten abrufen
export async function GET(request) {
  if (!validateAdminAuth(request.cookies)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: PRIVATE_API_HEADERS }
    );
  }

  try {
    if (!fs.existsSync(MESSAGES_DIR)) {
      return NextResponse.json(
        { messages: [] },
        { headers: PRIVATE_API_HEADERS }
      );
    }

    const files = fs.readdirSync(MESSAGES_DIR).filter((file) => file.endsWith(".json"));
    const messages = files.map((file) => {
      const filePath = path.join(MESSAGES_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return { filename: file, ...data };
    });

    return NextResponse.json({ messages }, { headers: PRIVATE_API_HEADERS });
  } catch (error) {
    console.error("Fehler beim Lesen:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Nachrichten" },
      { status: 500, headers: PRIVATE_API_HEADERS }
    );
  }
}

// 🗑 DELETE – Nachricht löschen
export async function DELETE(request) {
  if (!validateAdminAuth(request.cookies)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: PRIVATE_API_HEADERS }
    );
  }

  try {
    const { filename } = await request.json();
    const safeFilename = typeof filename === "string" ? path.basename(filename) : "";
    if (
      !safeFilename ||
      safeFilename !== filename ||
      !/^[A-Za-z0-9_.-]+\.json$/.test(safeFilename)
    ) {
      return NextResponse.json(
        { error: "Ungültiger Dateiname" },
        { status: 400, headers: PRIVATE_API_HEADERS }
      );
    }

    const filePath = path.join(MESSAGES_DIR, safeFilename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true }, { headers: PRIVATE_API_HEADERS });
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen der Nachricht" },
      { status: 500, headers: PRIVATE_API_HEADERS }
    );
  }
}
