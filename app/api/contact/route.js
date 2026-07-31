export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getSupabase } from "@/lib/supabase";
import { getClientIp, sanitizeInput, SECURITY_HEADERS } from "@/lib/security";
import { rateLimitDb } from "@/lib/ratelimit";
import { logError } from "@/lib/errorlog";
import { contactSchema, parseBody } from "@/lib/validation";

const supabase = getSupabase();

/* ============================================================================= */
/*                          POST – Kontaktanfrage speichern                      */
/* ============================================================================= */

export async function POST(req) {
  try {
    // 🛡️ Durables Rate-Limit: max 3 Anfragen / Stunde je IP
    const clientIp = getClientIp(req);
    const rl = await rateLimitDb(`contact:${clientIp}`, 3, 3600);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte warten Sie eine Stunde." },
        { status: 429, headers: SECURITY_HEADERS }
      );
    }

    const parsed = parseBody(contactSchema, await req.json());
    if (!parsed.ok) {
      return NextResponse.json(
        { error: parsed.error },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }
    const { name, email, message } = parsed.data;

    const safeName = sanitizeInput(name);
    const safeEmail = sanitizeInput(email);
    const safeMessage = sanitizeInput(message);

    // Persistent in Supabase (serverless-fest)
    const { error: insErr } = await supabase
      .from("contact_messages")
      .insert({ name, email, message });
    if (insErr) {
      await logError("contact.insert", insErr.message, { email });
    }

    // Admin-Benachrichtigung via Brevo
    if (process.env.CONTACT_RECEIVER) {
      await sendEmail({
        from: { name: "Lobbium Kontaktformular", email: "info@lobbium.com" },
        to: process.env.CONTACT_RECEIVER,
        subject: `Neue Nachricht von ${safeName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
              <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📬 Neue Kontaktanfrage</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>E-Mail:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
                <p><strong>Nachricht:</strong></p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 10px;">
                  ${safeMessage}
                </div>
              </div>
              <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
                Lobbium Smart Family Life - Kontaktformular
              </p>
            </div>
          </body>
          </html>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    await logError("contact.POST", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

/* ============================================================================= */
/*                          GET – Kontaktanfragen abrufen                        */
/* ============================================================================= */

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // today | recent | all

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      await logError("contact.GET", error.message);
      return NextResponse.json([], { status: 200 });
    }

    let messages = (data || []).map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      message: m.message,
      createdAt: m.created_at,
    }));

    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      messages = messages.filter(
        (m) => m.createdAt && String(m.createdAt).startsWith(today)
      );
    }

    if (filter === "recent") {
      messages = messages.slice(0, 5);
    }

    return NextResponse.json(messages, { status: 200 });
  } catch (err) {
    await logError("contact.GET", err);
    return NextResponse.json([], { status: 200 });
  }
}
