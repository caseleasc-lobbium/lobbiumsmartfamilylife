import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { encrypt } from "@/lib/encryption";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) return NextResponse.json({ error: "E-Mail fehlt" }, { status: 400 });

  try {
    const encryptedEmail = encrypt(email);

    // Abonnenten aktivieren
    const updated = await prisma.subscriber.updateMany({
      where: { email: encryptedEmail },
      data: { consent: true, date_consent: new Date() },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Kein Abonnent gefunden" }, { status: 404 });
    }

    return NextResponse.redirect("https://lobbium.com/newsletter/bestaetigt");
  } catch (err) {
    console.error("Confirm error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}