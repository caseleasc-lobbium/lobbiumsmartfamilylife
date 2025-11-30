export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sendEmail } from "@/lib/email";
import { rateLimit, getClientIp, isValidEmail, sanitizeInput, SECURITY_HEADERS } from "@/lib/security";

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

/* ============================================================================= */
/*                                  POST – Nachricht speichern                   */
/* ============================================================================= */

export async function POST(req) {
  try {
    // 🛡️ Rate Limiting: Max 3 Kontaktanfragen pro Stunde
    const clientIp = getClientIp(req);
    const rateLimitResult = rateLimit(`contact:${clientIp}`, 3, 3600000);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte warten Sie eine Stunde." },
        { status: 429, headers: SECURITY_HEADERS }
      );
    }

    const { name, email, message } = await req.json();

    // Input Validierung
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich." },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // Email Validierung
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Ungültige E-Mail-Adresse." },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // Längen-Validierung (gegen Missbrauch)
    if (name.length > 100 || email.length > 100 || message.length > 5000) {
      return NextResponse.json(
        { error: "Eingabe zu lang." },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // XSS Protection durch Sanitizing
    const safeName = sanitizeInput(name);
    const safeEmail = sanitizeInput(email);
    const safeMessage = sanitizeInput(message);

    if (!safeName || !safeEmail || !safeMessage) {
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

    // Admin-Notification via Brevo
    if (process.env.CONTACT_RECEIVER) {
      await sendEmail({
        from: { name: "Lobbium Kontaktformular", email: "info@lobbium.com" },
        to: process.env.CONTACT_RECEIVER,
        subject: `Neue Nachricht von ${safeName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
              <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📬 Neue Kontaktanfrage</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>E-Mail:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
                <p><strong>Nachricht:</strong></p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 10px;">
                  ${safeMessage}
                </div>
              </div>
              <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
                Lobbium Smart Family Life - Kontaktformular
              </p>
            </div>
          </body>
          </html>
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