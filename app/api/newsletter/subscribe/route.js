import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { encrypt } from "@/lib/encryption";

const prisma = new PrismaClient();
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req) {
  try {
    const { name, email } = await req.json();
    if (!email) return NextResponse.json({ error: "E-Mail fehlt" }, { status: 400 });

    // 🔐 E-Mail verschlüsseln
    const encryptedEmail = encrypt(email);
    const encryptedName = name ? encrypt(name) : null;

    // 🔑 Einmaliger Token
    const token = Math.random().toString(36).substring(2, 12);

    // In Datenbank speichern (noch nicht bestätigt)
    await prisma.subscriber.create({
      data: {
        name: encryptedName,
        email: encryptedEmail,
        consent: false,
        date_consent: new Date(),
        createdAt: new Date(),
      },
    });

    // ✉️ Bestätigungs-E-Mail
    const confirmUrl = `${BASE_URL}/newsletter/confirm?token=${token}&email=${encodeURIComponent(email)}`;

    const message = {
      from: "Lobbium <info@lobbium.com>",
      to: email,
      subject: "Bitte bestätige dein Newsletter-Abo",
      html: `
        <h2>Willkommen bei Lobbium Smart Family Life 💌</h2>
        <p>Bitte bestätige dein Abonnement, indem du auf den folgenden Link klickst:</p>
        <p><a href="${confirmUrl}" target="_blank">Newsletter bestätigen</a></p>
        <p>Wenn du dich nicht angemeldet hast, kannst du diese E-Mail ignorieren.</p>
        <br/>
        <p>© ${new Date().getFullYear()} Lobbium Smart Family Life</p>
      `,
    };

    // E-Mail mit Resend senden
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    return NextResponse.json({ success: true, message: "Bestätigungs-E-Mail gesendet" });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}