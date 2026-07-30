export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { encrypt } from "@/lib/encryption";
import { getSupabase } from "@/lib/supabase";
import { newsletterSchema, parseBody } from "@/lib/validation";

const supabase = getSupabase();

// Basis-URL zuverlässig aus dem Request ableiten (funktioniert lokal & live).
function getOrigin(req) {
  const host = req.headers.get("host");
  if (!host) return process.env.NEXT_PUBLIC_SITE_URL || "https://www.lobbium.com";
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/* ============================================================================= */
/*                         POST – New Subscriber (Queue + Email)                 */
/* ============================================================================= */

export async function POST(req) {
  try {
    const parsed = parseBody(newsletterSchema, await req.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { email, name, locale } = parsed.data;

    // 🔐 Verschlüsseln
    const encryptedEmail = encrypt(email);
    const encryptedName = name ? encrypt(name) : null;

    // 🔑 Token für Double-Opt-In
    const token = Math.random().toString(36).substring(2, 12);

    /* ----------------------------------------------------------- */
    /* 1) Speichern in newsletter_subscribers                      */
    /* ----------------------------------------------------------- */
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: encryptedEmail,
        name: encryptedName,
        token,
        locale: locale || "en",
        confirmed: false,
      });

    if (insertError) {
      console.error("Supabase Insert ERROR:", insertError);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    /* ----------------------------------------------------------- */
    /* 2) Email in Queue einfügen                                  */
    /* ----------------------------------------------------------- */
    await supabase.from("newsletter_queue").insert({
      email: encryptedEmail,
      payload: JSON.stringify({
        type: "confirm",
        token,
        locale: locale || "en",
        name,
      }),
      status: "pending",
    });

    /* ----------------------------------------------------------- */
    /* 3) Double-Opt-In Email senden                               */
    /* ----------------------------------------------------------- */
    const confirmUrl = `${getOrigin(req)}/api/newsletter/confirm?token=${token}`;

    const texts = {
      de: {
        subject: "Bitte bestätige deine Anmeldung bei Lobbium",
        body: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Lobbium Newsletter</h1>
              </div>
              <div style="padding: 40px;">
                <h2 style="color: #333;">Hallo ${name || ""}! 👋</h2>
                <p style="color: #666; line-height: 1.6;">Vielen Dank für dein Interesse an unserem Newsletter!</p>
                <p style="color: #666; line-height: 1.6;">Bitte bestätige deine E-Mail-Adresse, um regelmäßig Updates zu erhalten.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmUrl}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    ✅ Jetzt bestätigen
                  </a>
                </div>
                <p style="color: #999; font-size: 12px; text-align: center;">Falls der Button nicht funktioniert, kopiere diesen Link:<br>${confirmUrl}</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      fr: {
        subject: "Veuillez confirmer votre inscription à Lobbium",
        body: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Lobbium Newsletter</h1>
              </div>
              <div style="padding: 40px;">
                <h2 style="color: #333;">Bonjour ${name || ""}! 👋</h2>
                <p style="color: #666; line-height: 1.6;">Merci de ton intérêt pour notre newsletter!</p>
                <p style="color: #666; line-height: 1.6;">Confirme ton adresse e-mail pour recevoir nos mises à jour.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmUrl}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    ✅ Confirmer maintenant
                  </a>
                </div>
                <p style="color: #999; font-size: 12px; text-align: center;">Si le bouton ne fonctionne pas, copie ce lien:<br>${confirmUrl}</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      en: {
        subject: "Please confirm your subscription to Lobbium",
        body: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">Lobbium Newsletter</h1>
              </div>
              <div style="padding: 40px;">
                <h2 style="color: #333;">Hello ${name || ""}! 👋</h2>
                <p style="color: #666; line-height: 1.6;">Thank you for your interest in our newsletter!</p>
                <p style="color: #666; line-height: 1.6;">Please confirm your email address to receive regular updates.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmUrl}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    ✅ Confirm now
                  </a>
                </div>
                <p style="color: #999; font-size: 12px; text-align: center;">If the button doesn't work, copy this link:<br>${confirmUrl}</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
    };

    const t = texts[locale] || texts.en;

    // Email via Brevo senden
    await sendEmail({
      from: { name: "Lobbium Newsletter", email: "info@lobbium.com" },
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
/*                                 GET – Admin View                              */
/* ============================================================================= */

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // today | all | recent

    let { data: entries, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET Error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      entries = entries.filter((n) =>
        n.created_at && n.created_at.startsWith(today)
      );
    }

    if (filter === "recent") {
      entries = entries.slice(0, 10);
    }

    return NextResponse.json(entries, { status: 200 });

  } catch (error) {
    console.error("❌ Fehler bei GET /api/newsletter:", error);
    return NextResponse.json({ error: "Fehler beim Laden" }, { status: 500 });
  }
}