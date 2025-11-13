import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // 🟦 wichtig für Netlify & SSR

// Datei wird im Projekt root gespeichert
const filePath = path.join(process.cwd(), "data_settings.json");

// Lesen
function readSettings() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(
        filePath,
        JSON.stringify(
          {
            siteName: "",
            siteDescription: "",
            contactEmail: ""
          },
          null,
          2
        )
      );
    }

    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data || "{}");
  } catch (err) {
    console.error("Fehler beim Lesen:", err);
    return {};
  }
}

// Schreiben
function writeSettings(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fehler beim Schreiben:", err);
  }
}

// GET: Settings abrufen
export async function GET() {
  const settings = readSettings();
  return NextResponse.json(settings);
}

// POST: Settings speichern (Admin only)
export async function POST(req) {
  const auth = req.headers.get("authorization");

  // Auth-Check
  if (auth !== "lobbiumAdminAuth:true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  writeSettings(data);

  return NextResponse.json({ success: true });
}
