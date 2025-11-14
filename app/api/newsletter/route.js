import { NextResponse } from "next/server";
import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

// 📁 Datei-Pfad
const filePath = path.join(process.cwd(), "data", "subscribers.json");

// 🟦 Datei laden
function loadSubscribers() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    console.error("Fehler beim Lesen der subscribers.json:", err);
    return [];
  }
}

// 🟩 Datei speichern
function saveSubscribers(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/* ============================================================================= */
/*                                  POST                                          */
/* ============================================================================= */

export async function POST(req) {
  try {
    const { email, name, locale } = await req.json();

    // Token generieren
    const token = Math.random().toString(36).substring(2, 12);

    //---------------------- SPEICHERN ---------------------------//

    const subs = loadSubscribers();

    subs.push({
      id: Date.now(),
      email,
      name: name || "",
      locale: locale || "en",
      token,
      confirmed: false,
      createdAt: new Date().toISOString(),
    });

    saveSubscribers(subs);

    //---------------------- EMAIL SENDEN ------------------------//

    const texts = {
      de: {
        subject: "Bitte bestätige deine Anmeldung bei Lobbium",
        body: `
          Hallo ${name || ""},<br/><br/>
          Bitte bestätige deine Anmeldung für den Lobbium-Newsletter:<br/><br/>
          <a href="https://lobbium.com/${locale}/newsletter/confirm?token=${token}">
            Anmeldung bestätigen
          </a>
        `,
      },
      fr: {
        subject: "Veuillez confirmer votre inscription à Lobbium",
        body: `
          Bonjour ${name || ""},<br/><br/>
          Merci de confirmer ton inscription :<br/><br/>
          <a href="https://lobbium.com/${locale}/newsletter/confirm?token=${token}">
            Confirmer
          </a>
        `,
      },
      en: {
        subject: "Please confirm your subscription to Lobbium",
        body: `
          Hi ${name || ""},<br/><br/>
          Please confirm your subscription:<br/><br/>
          <a href="https://lobbium.com/${locale}/newsletter/confirm?token=${token}">
            Confirm subscription
          </a>
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