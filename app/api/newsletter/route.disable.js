import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { locales } from "@/app/i18n";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { email, name, locale } = await req.json();
  const token = Math.random().toString(36).substring(2, 12);

  await prisma.subscriber.create({
    data: { email, name, locale, token },
  });

  const texts = {
    de: {
      subject: "Bitte bestätige deine Anmeldung bei Lobbium",
      body: `Hallo ${name || ""},<br/><br/>bitte bestätige deine Anmeldung für den Lobbium-Newsletter:<br/>
        <a href="https://lobbium.com/${locale}/newsletter/confirm?token=${token}">Anmeldung bestätigen</a>`,
    },
    fr: {
      subject: "Veuillez confirmer votre inscription à Lobbium",
      body: `Bonjour ${name || ""},<br/><br/>Merci de confirmer ton inscription :<br/>
        <a href="https://lobbium.com/${locale}/newsletter/confirm?token=${token}">Confirmer</a>`,
    },
    en: {
      subject: "Please confirm your subscription to Lobbium",
      body: `Hi ${name || ""},<br/><br/>Please confirm your subscription:<br/>
        <a href="https://lobbium.com/${locale}/newsletter/confirm?token=${token}">Confirm</a>`,
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
}