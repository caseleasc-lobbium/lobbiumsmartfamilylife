export const dynamic = "force-dynamic";
export const maxDuration = 60;

import crypto from "crypto";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/encryption";
import { sendTemplateEmail } from "@/lib/email";
import { getSupabase } from "@/lib/supabase";
import { PRIVATE_API_HEADERS, validateAdminAuth } from "@/lib/security";
import { rateLimitDb } from "@/lib/ratelimit";
import { logError } from "@/lib/errorlog";

const MAX_RECIPIENTS = 1000;

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

function getOrigin(req) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
    } catch {}
  }
  return new URL(req.url).origin;
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
    const all = body?.all === true;
    const ids = all ? null : normalizeIds(body?.ids);
    if (!all && !ids) {
      return NextResponse.json(
        { error: "Keine gültigen offenen Anmeldungen ausgewählt" },
        { status: 400, headers: PRIVATE_API_HEADERS }
      );
    }

    const rateKey = all
      ? "admin:newsletter-reminder:all"
      : `admin:newsletter-reminder:${crypto
          .createHash("sha256")
          .update(ids.map(String).sort().join(","))
          .digest("hex")}`;
    const limit = await rateLimitDb(rateKey, 1, 24 * 60 * 60);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Diese Erinnerung wurde bereits innerhalb von 24 Stunden ausgelöst" },
        {
          status: 429,
          headers: {
            ...PRIVATE_API_HEADERS,
            "Retry-After": String(limit.retryAfter || 86400),
          },
        }
      );
    }

    const supabase = getSupabase();
    let query = supabase
      .from("newsletter_subscribers")
      .select("id,email,name,locale")
      .eq("confirmed", false)
      .or("consent.is.null,consent.eq.false")
      .or("unsubscribed.is.null,unsubscribed.eq.false");
    if (ids) query = query.in("id", ids);

    const { data, error } = await query;
    if (error) throw error;

    const recipients = data || [];
    const origin = getOrigin(req);
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

            const token = createToken();
            const { error: tokenError } = await supabase
              .from("newsletter_subscribers")
              .update({ token })
              .eq("id", subscriber.id);
            if (tokenError) throw tokenError;

            const payload = JSON.stringify({
              type: "confirm-reminder",
              subscriberId: subscriber.id,
              token,
              locale: subscriber.locale || "de",
            });
            const { data: queued, error: queueError } = await supabase
              .from("newsletter_queue")
              .insert({ email: subscriber.email, payload, status: "pending" })
              .select("id")
              .maybeSingle();
            if (queueError) {
              await logError("newsletter.reminder-queue", queueError.message, {});
            }

            const result = await sendTemplateEmail({
              to: email,
              templateId: 2,
              params: {
                CONFIRM_URL: `${origin}/api/newsletter/confirm?token=${token}&lang=${subscriber.locale || "de"}`,
                NAME: name || "",
                LOCALE: subscriber.locale || "de",
              },
            });

            if (queued?.id) {
              await supabase
                .from("newsletter_queue")
                .update({ status: result.success ? "sent" : "failed" })
                .eq("id", queued.id);
            }

            result.success ? sent++ : failed++;
          } catch (error) {
            failed++;
            await logError(
              "newsletter.reminder-recipient",
              error?.message || String(error),
              {}
            );
          }
        })
      );
    }

    return NextResponse.json(
      { ok: failed === 0, recipients: recipients.length, sent, failed },
      { status: failed ? 502 : 200, headers: PRIVATE_API_HEADERS }
    );
  } catch (error) {
    await logError("newsletter.reminder", error?.message || String(error), {});
    return NextResponse.json(
      { error: "Erinnerungsversand fehlgeschlagen" },
      { status: 500, headers: PRIVATE_API_HEADERS }
    );
  }
}
