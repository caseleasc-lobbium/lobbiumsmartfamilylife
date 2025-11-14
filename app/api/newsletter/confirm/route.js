import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "subscribers.json");

// 🟦 Datei laden
function loadSubscribers() {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error("Fehler beim Lesen von subscribers.json:", err);
    return [];
  }
}

// 🟩 Datei speichern
function saveSubscribers(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email && !token) {
      return NextResponse.json({ error: "Parameter fehlt" }, { status: 400 });
    }

    let subscribers = loadSubscribers();

    // 🔍 Finden über Token ODER über E-Mail
    const userIndex = subscribers.findIndex(
      (s) =>
        (token && s.token === token) ||
        (email && s.email === email)
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "Abo nicht gefunden" },
        { status: 404 }
      );
    }

    // 🚀 Bestätigung setzen
    subscribers[userIndex].confirmed = true;
    subscribers[userIndex].date_consent = new Date().toISOString();

    saveSubscribers(subscribers);

    // 🔁 Weiterleitung auf deine Erfolgs-Seite
    return NextResponse.redirect(
      "https://lobbium.com/newsletter/bestaetigt"
    );
  } catch (err) {
    console.error("Bestätigung Fehler:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}