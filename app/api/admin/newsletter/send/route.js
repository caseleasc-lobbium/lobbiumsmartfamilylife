export const dynamic = "force-dynamic";
export const maxDuration = 60;

import crypto from "crypto";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/encryption";
import { sendEmail } from "@/lib/email";
import { getSupabase } from "@/lib/supabase";
import {
  assembleIssue,
  buildAdminMessageHtml,
  buildWeeklyHtml,
} from "@/lib/newsletter";
import { PRIVATE_API_HEADERS, validateAdminAuth } from "@/lib/security";
import { logError } from "@/lib/errorlog";

const BASE = "https://www.lobbium.com";
const FROM = { name: "Lobbium – Smart Family Life", email: "info@lobbium.com" };
const WEEKLY_SUBJECT = "Dein Lobbium Familien-Spar-Brief 📬";
const MAX_RECIPIENTS = 100;

function createToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function normalizeIds(value) {
  if (!Array.isArray(value) || !value.length || value.length > MAX_RECIPIENTS) {
    return null;
  }
  const ids = value.filter((id) => {
    if (Number.isInteger(id) && id > 0) return true;
    return typeof id === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(id);
  });
  if (ids.length !== value.length) return null;
  return [...new Map(ids.map((id) => [String(id), id])).values()];
}

export async function POST(req) {
  if (!validateAdminAuth(req.cookies)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: PRIVATE_API_HEADERS }
    );
  }

  try {
    const body = await req.json();
    const ids = normalizeIds(body?.ids);
    const mode = body?.mode;
    if (!ids || !["custom", "newsletter"].includes(mode)) {
      return NextResponse.json(
        { error: "Ungültige Versanddaten" },
        { status: 400, headers: PRIVATE_API_HEADERS }
      );
    }

    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (
      mode === "custom" &&
      (!subject || subject.length > 160 || !message || message.length > 10000)
    ) {
      return NextResponse.json(
        { error: "Betreff oder Nachricht ist ungültig" },
        { status: 400, headers: PRIVATE_API_HEADERS }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id,email,name,unsub_token,locale")
      .in("id", ids)
      .eq("confirmed", true)
      .or("unsubscribed.is.null,unsubscribed.eq.false");

    if (error) throw error;

    const recipients = data || [];
    const issue = mode === "newsletter" ? await assembleIssue() : null;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < recipients.length; i += 5) {
      const batch = recipients.slice(i, i + 5);
      await Promise.all(
        batch.map(async (subscriber) => {
          try {
            const email = decrypt(subscriber.email);
            const name = subscriber.name ? decrypt(subscriber.name) : "";
            if (!email || email === "[Decryption failed]") {
              failed++;
              return;
            }

            let unsubToken = subscriber.unsub_token;
            if (!unsubToken) {
              unsubToken = createToken();
              const { error: tokenError } = await supabase
                .from("newsletter_subscribers")
                .update({ unsub_token: unsubToken })
                .eq("id", subscriber.id);
              if (tokenError) throw tokenError;
            }

            const unsubUrl = `${BASE}/api/newsletter/unsubscribe?token=${unsubToken}`;
            const html =
              mode === "newsletter"
                ? buildWeeklyHtml({ name, ...issue, unsubUrl })
                : buildAdminMessageHtml({ name, message, unsubUrl });
            const result = await sendEmail({
              from: FROM,
              to: email,
              subject: mode === "newsletter" ? WEEKLY_SUBJECT : subject,
              html,
              tags: [
                mode === "newsletter" ? "weekly-newsletter-manual" : "admin-message",
                `locale-${subscriber.locale || "de"}`,
              ],
              headers: {
                "List-Unsubscribe": `<${unsubUrl}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
              },
            });
            result.success ? sent++ : failed++;
          } catch (error) {
            failed++;
            await logError(
              "admin.newsletter-send-recipient",
              error?.message || String(error),
              {}
            );
          }
        })
      );
    }

    return NextResponse.json(
      {
        ok: failed === 0 && sent > 0,
        requested: ids.length,
        eligible: recipients.length,
        sent,
        failed,
        skipped: ids.length - recipients.length,
      },
      { status: failed ? 502 : 200, headers: PRIVATE_API_HEADERS }
    );
  } catch (error) {
    await logError("admin.newsletter-send", error?.message || String(error), {});
    return NextResponse.json(
      { error: "Versand fehlgeschlagen" },
      { status: 500, headers: PRIVATE_API_HEADERS }
    );
  }
}
