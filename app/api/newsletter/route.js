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

    // ❗ Speichern in Supabase statt Prisma
    const { error: insertError } = await supabase.from("newsletter").insert({
      email: encryptedEmail,
      name: encryptedName,
      token,
      locale: locale || "en",
      confirmed: false
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

    // 🔄 Alles laden aus Supabase
    let { data: entries, error } = await supabase
      .from("newsletter")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Supabase GET Error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    // 📌 Filter: HEUTE
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      entries = entries.filter((n) =>
        n.createdAt && n.createdAt.startsWith(today)
      );
    }

    // 📌 Filter: LETZTE 10
    if (filter === "recent") {
      entries = entries.slice(0, 10);
    }

    return NextResponse.json(entries, { status: 200 });

  } catch (error) {
    console.error("❌ Fehler bei GET /api/newsletter:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}