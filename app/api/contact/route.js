import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Resend } from "resend";

// Daten-Datei
const filePath = path.join(process.cwd(), "data_contact.json");

// Hilfsfunktion: Datei lesen
function loadMessages() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return [];
  }
}

// Speichern
function saveMessages(messages) {
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich." },
        { status: 400 }
      );
    }

    const messages = loadMessages();

    const newMessage = {
      id: Date.now(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    saveMessages(messages);

    // Admin-Mail
    if (process.env.CONTACT_RECEIVER) {
      await resend.emails.send({
        from: "Lobbium <no-reply@lobbium.com>",
        to: process.env.CONTACT_RECEIVER,
        subject: `Neue Nachricht von ${name}`,
        html: `
          <h2>Neue Nachricht</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>E-Mail:</strong> ${email}</p>
          <p>${message}</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Kontakt API Fehler:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = loadMessages();
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}