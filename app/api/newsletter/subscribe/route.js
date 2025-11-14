import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { encrypt } from "@/lib/encryption";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// -----------------------------
// JSON-Datei laden / speichern
// -----------------------------
const filePath = path.join(process.cwd(), "data", "subscribers.json");

function loadSubscribers() {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return [];
  }
}

function saveSubscribers(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// -----------------------------
// POST → Newsletter abonnieren
// -----------------------------
export async function POST(req) {
  try {
    const { name, email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-Mail fehlt" }, { status: 400 });
    }

    // 🔐 Verschlüsseln
    const encryptedEmail = encrypt(email);
    const encryptedName = name ? encrypt(name) : null;

    // 🔑 Token generieren
    const token = Math.random().toString(36).substring(2, 12);

    const subscribers = loadSubscribers();

    // 📝 Speichern (noch nicht bestätigt)
    const entry = {
      id: Date.now(),
      name: encryptedName,
      email: encryptedEmail,
      token,
      consent: false,
      date_consent: null,
      createdAt: new Date().toISOString(),
    };

    subscribers.push(entry);
    saveSubscribers(subscribers);

    // 🔗 URL zur Bestätigung
    const confirmUrl = `${BASE_URL}/newsletter/confirm?token=${token}&email=${encodeURIComponent(
      email
    )}`;

    // 📧 E-Mail-Inhalt
    const message = {
      from: "Lobbium <info@lobbium.com>",
      to: email,
      subject: "Bitte bestätige dein Newsletter-Abo",
      html: `
        <h2>Willkommen bei Lobbium Smart Family Life 💌</h2>
        <p>Bitte bestätige dein Abonnement, indem du auf den folgenden Link klickst:</p>
        <p><a href="${confirmUrl}" target="_blank">👉 Newsletter bestätigen</a></p>
        <p>Wenn du dich nicht angemeldet hast, kannst du diese E-Mail ignorieren.</p>
        <br/>
        <p>© ${new Date().getFullYear()} Lobbium Smart Family Life</p>
      `,
    };

    // ✉️ E-Mail senden über Resend API
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    return NextResponse.json({
      success: true,
      message: "Bestätigungs-E-Mail gesendet",
    });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}