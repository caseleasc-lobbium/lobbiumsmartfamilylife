export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { encrypt } from "@/lib/encryption";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lobbium.com";

// -----------------------------
// Supabase Client
// -----------------------------
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -----------------------------
// POST → Newsletter abonnieren
// -----------------------------
export async function POST(req) {
  try {
    const { name, email, locale } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-Mail fehlt" }, { status: 400 });
    }

    // 🔐 Verschlüsseln
    const encryptedEmail = encrypt(email);
    const encryptedName = name ? encrypt(name) : null;

    // 🔑 Token generieren
    const token = Math.random().toString(36).substring(2, 12);

    // 📝 In Supabase speichern
    const { error } = await supabase.from("newsletter").insert({
      name: encryptedName,
      email: encryptedEmail,
      token,
      locale: locale || "de",
      confirmed: false,
      date_consent: null,
      createdAt: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json(
        { error: "Fehler beim Speichern" },
        { status: 500 }
      );
    }

    // 🔗 Bestätigungslink
    const confirmUrl = `${BASE_URL}/${locale || "de"}/newsletter/confirm?token=${token}`;

    // 🌍 Mehrsprachige Texte
    const texts = {
      de: {
        subject: "Bitte bestätige dein Newsletter-Abo",
        html: `
          <h2>Willkommen bei Lobbium Smart Family Life 💌</h2>
          <p>Bitte bestätige dein Newsletter-Abo:</p>
          <p><a href="${confirmUrl}">👉 Jetzt bestätigen</a></p>
          <br/>
          <p>© ${new Date().getFullYear()} Lobbium</p>
        `,
      },
      fr: {
        subject: "Veuillez confirmer votre abonnement",
        html: `
          <h2>Bienvenue chez Lobbium 💌</h2>
          <p>Merci de confirmer votre abonnement :</p>
          <p><a href="${confirmUrl}">👉 Confirmer maintenant</a></p>
          <br/>
          <p>© ${new Date().getFullYear()} Lobbium</p>
        `,
      },
      en: {
        subject: "Please confirm your subscription",
        html: `
          <h2>Welcome to Lobbium 💌</h2>
          <p>Please confirm your subscription:</p>
          <p><a href="${confirmUrl}">👉 Confirm now</a></p>
          <br/>
          <p>© ${new Date().getFullYear()} Lobbium</p>
        `,
      },
    };

    const t = texts[locale] || texts.de;

    // 📧 E-Mail senden via Resend
    await resend.emails.send({
      from: "Lobbium <info@lobbium.com>",
      to: email,
      subject: t.subject,
      html: t.html,
    });

    return NextResponse.json({
      success: true,
      message: "Bestätigungs-E-Mail gesendet.",
    });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}