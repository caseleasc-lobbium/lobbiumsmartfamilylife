export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { encrypt } from "@/lib/encryption";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lobbium.com";

export async function POST(req) {
  try {
    const { email, name, locale } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-Mail fehlt" }, { status: 400 });
    }

    const encryptedEmail = encrypt(email);
    const encryptedName = name ? encrypt(name) : null;
    const token = Math.random().toString(36).substring(2, 12);

    // → SPEICHERN IN NEUER TABELLE newsletter_subscribers
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: encryptedEmail,
        name: encryptedName,
        token,
        locale: locale || "en",
        confirmed: false,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Supabase Insert ERROR:", insertError);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

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
        subject: "Please confirm your subscription",
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
    console.error("❌ Fehler in POST /api/newsletter/subscribe:", error);
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}