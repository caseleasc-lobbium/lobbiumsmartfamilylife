import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const MESSAGES_DIR = path.join(process.cwd(), "data", "contact_fallbacks");

// 🔒 Admin-Cookie prüfen
function isAuthorized() {
  const cookie = cookies().get("admin_auth");
  return cookie?.value === "true";
}

// 📬 GET – Nachrichten abrufen
export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    if (!fs.existsSync(MESSAGES_DIR)) {
      return NextResponse.json({ messages: [] });
    }

    const files = fs.readdirSync(MESSAGES_DIR);
    const messages = files.map((file) => {
      const filePath = path.join(MESSAGES_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return { filename: file, ...data };
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Fehler beim Lesen:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden der Nachrichten" },
      { status: 500 }
    );
  }
}

// 🗑 DELETE – Nachricht löschen
export async function DELETE(request) {
  if (!isAuthorized()) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const { filename } = await request.json();
    if (!filename) {
      return NextResponse.json({ error: "Dateiname fehlt" }, { status: 400 });
    }

    const filePath = path.join(MESSAGES_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen der Nachricht" },
      { status: 500 }
    );
  }
}