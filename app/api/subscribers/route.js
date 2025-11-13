import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { encrypt, decrypt } from "@/lib/encryption";

const prisma = new PrismaClient();

// ✅ POST → neuen Subscriber anlegen
export async function POST(req) {
  try {
    const { name, email, consent } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-Mail ist erforderlich" }, { status: 400 });
    }

    // 🔐 Verschlüsselung vor dem Speichern
    const encryptedEmail = encrypt(email);
    const encryptedName = name ? encrypt(name) : null;

    const subscriber = await prisma.subscriber.create({
      data: {
        name: encryptedName,
        email: encryptedEmail,
        consent: consent || false,
        date_consent: new Date(),
      },
    });

    return NextResponse.json({ success: true, id: subscriber.id });
  } catch (err) {
    console.error("POST /subscribers error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// ✅ GET → alle Subscriber abrufen (automatisch entschlüsselt)
export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    // 🔓 Entschlüsselung beim Anzeigen
    const decrypted = subscribers.map((s) => ({
      ...s,
      name: s.name ? decrypt(s.name) : "",
      email: s.email ? decrypt(s.email) : "",
    }));

    return NextResponse.json(decrypted);
  } catch (err) {
    console.error("GET /subscribers error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}