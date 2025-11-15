export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Resend } from "resend";

// Datei-Pfad
const filePath = path.join(process.cwd(), "data_contact.json");

// Sicheres Lesen
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

// Sicheres Schreiben
function saveMessages(messages) {
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
}

const resend = new Resend(process.env.RESEND_API_KEY);

/* ============================================================================= */
/*                                  POST – Nachricht speichern                   */
/* ============================================================================= */

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

    // Admin-Notification
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

/* ============================================================================= */
/*                                  GET – Nachrichten abrufen                    */
/* ============================================================================= */

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // today | recent | all

    let messages = loadMessages()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

    // HEUTE
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      messages = messages.filter((m) =>
        m.createdAt.startsWith(today)
      );
    }

    // LETZTE 5
    if (filter === "recent") {
      messages = messages.slice(0, 5);
    }

    return NextResponse.json(messages, { status: 200 });
  } catch (err) {
    console.error("Contact GET Error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}