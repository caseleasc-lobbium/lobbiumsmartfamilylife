export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lobbium.com";

/* ============================================================================= */
/*                                  POST – Subscribe                              */
/* ============================================================================= */

export async function POST(req) {
  try {
    const { email, name, locale } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-Mail fehlt" }, { status: 400 });
    }

    const encryptedEmail = encrypt(email);
    const encryptedName = name ? encrypt(name) : null;
    const token = Math.random().toString(36).substring(2, 12);

    await prisma.newsletter.create({
      data: {
        email: encryptedEmail,
        name: encryptedName,
        token,
        locale: locale || "en",
        confirmed: false,
        createdAt: new Date(),
      },
    });

    const confirmUrl = `${BASE_URL}/${locale}/newsletter/confirm?token=${token}`;

    const texts = {
      de: {
        subject: "Bitte bestätige deine Anmeldung bei Lobbium",
        body: `
          <h2>Hallo ${name || ""},</h2>
          <p>Bitte bestätige dein Newsletter-Abo:</p>
          <p><a href="${confirmUrl}">👉 Jetzt bestätigen</a></p>
        `,
      },
      fr: {
        subject: "Veuillez confirmer votre inscription à Lobbium",
        body: `
          <h2>Bonjour ${name || ""},</h2>
          <p>Merci de confirmer ton inscription :</p>
          <p><a href="${confirmUrl}">👉 Confirmer maintenant</a></p>
        `,
      },
      en: {
        subject: "Please confirm your subscription to Lobbium",
        body: `
          <h2>Hello ${name || ""},</h2>
          <p>Please confirm your subscription:</p>
          <p><a href="${confirmUrl}">👉 Confirm now</a></p>
        `,
      },
    };

    const t = texts[locale] || texts.en;

    await resend.emails.send({
      from: "Lobbium <info@lobbium.com>",
      to: email,
      subject: t.subject,
      html: t.body,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Fehler in POST /api/newsletter:", error);
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}

/* ============================================================================= */
/*                                  GET – Fetch Newsletter                        */
/* ============================================================================= */

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // today | all | recent

    // 🔄 Basis-Abfrage
    let entries = await prisma.newsletter.findMany({
      orderBy: { createdAt: "desc" },
    });

    // 📌 HEUTE
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      entries = entries.filter((n) =>
        n.createdAt.toISOString().startsWith(today)
      );
    }

    // 📌 LETZTE 10
    if (filter === "recent") {
      entries = entries.slice(0, 10);
    }

    return NextResponse.json(entries, { status: 200 });

  } catch (error) {
    console.error("❌ Fehler bei GET /api/newsletter:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}