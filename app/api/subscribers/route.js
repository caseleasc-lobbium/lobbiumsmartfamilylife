import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { encrypt, decrypt } from "@/lib/encryption";

// Datei-Pfad
const filePath = path.join(process.cwd(), "data", "subscribers.json");

// Datei laden
function loadSubscribers() {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error("subscribers.json laden Fehler:", err);
    return [];
  }
}

// Datei speichern
function saveSubscribers(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// --------------------------------------------------
// POST → neuen Subscriber anlegen
// --------------------------------------------------
export async function POST(req) {
  try {
    const { name, email, consent } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-Mail ist erforderlich" },
        { status: 400 }
      );
    }

    const subscribers = loadSubscribers();

    // 🔐 Verschlüsselung
    const encryptedEmail = encrypt(email);
    const encryptedName = name ? encrypt(name) : null;

    const newSubscriber = {
      id: Date.now(),
      name: encryptedName,
      email: encryptedEmail,
      consent: consent || false,
      date_consent: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    subscribers.push(newSubscriber);
    saveSubscribers(subscribers);

    return NextResponse.json({ success: true, id: newSubscriber.id });
  } catch (err) {
    console.error("POST /subscribers error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// --------------------------------------------------
// GET → alle Subscriber abrufen (entschlüsselt)
// --------------------------------------------------
export async function GET() {
  try {
    const subscribers = loadSubscribers();

    const decrypted = subscribers.map((s) => ({
      ...s,
      name: s.name ? decrypt(s.name) : "",
      email: s.email ? decrypt(s.email) : "",
    }));

    // Sortieren nach Datum DESC
    decrypted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json(decrypted);
  } catch (err) {
    console.error("GET /subscribers error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}