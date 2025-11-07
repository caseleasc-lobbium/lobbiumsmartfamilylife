import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Alle Felder sind erforderlich." }),
        { status: 400 }
      );
    }

    // Nachricht in Prisma speichern
    const savedMessage = await prisma.message.create({
      data: {
        name,
        email,
        message,
      },
    });

    console.log("✅ Neue Nachricht gespeichert:", savedMessage);

    // ✉️ E-Mail an dich (Admin)
    if (process.env.RESEND_API_KEY && process.env.CONTACT_RECEIVER) {
      try {
        await resend.emails.send({
          from: "Lobbium Kontakt <no-reply@lobbium.com>",
          to: process.env.CONTACT_RECEIVER,
          subject: `Neue Nachricht von ${name}`,
          html: `
            <h2>Neue Nachricht über das Kontaktformular</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>E-Mail:</strong> ${email}</p>
            <p><strong>Nachricht:</strong></p>
            <p>${message}</p>
            <hr/>
            <small>Diese Nachricht wurde automatisch über lobbium.com gesendet.</small>
          `,
        });
      } catch (mailError) {
        console.error("⚠️ Fehler beim Senden an Admin:", mailError);
      }
    }

    // 🤖 Auto-Reply an den Absender
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Lobbium Team <no-reply@lobbium.com>",
          to: email,
          subject: "Danke für Ihre Nachricht an Lobbium",
          html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2>Hallo ${name},</h2>
              <p>vielen Dank für Ihre Nachricht an <strong>Lobbium</strong>.</p>
              <p>Wir haben Ihre Anfrage erhalten und melden uns so bald wie möglich persönlich bei Ihnen.</p>
              <p>Herzliche Grüße,<br>
              <strong>Ihr Lobbium Team</strong></p>
              <hr/>
              <small>Diese Nachricht wurde automatisch versendet – bitte nicht direkt darauf antworten.</small>
            </div>
          `,
        });
      } catch (replyError) {
        console.error("⚠️ Fehler beim Auto-Reply:", replyError);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Fehler in /api/contact:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Speichern der Nachricht." }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("GET /api/contact Fehler:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Laden der Nachrichten." }),
      { status: 500 }
    );
  }
}