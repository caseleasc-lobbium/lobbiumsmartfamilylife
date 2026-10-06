import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase";
import { PRIVATE_API_HEADERS, validateAdminAuth } from "@/lib/security";
import { decrypt } from "@/lib/encryption";
import { sendEmail } from "@/lib/email";
import { assembleIssue, buildWeeklyHtml } from "@/lib/newsletter";
import { logError } from "@/lib/errorlog";
import { emailSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BASE = "https://www.lobbium.com";
const FROM = { name: "Lobbium – Familien-Spar-Brief", email: "info@lobbium.com" };
const SUBJECT = "Dein Lobbium Familien-Spar-Brief 📬";

function createToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function isAdmin(req) {
  return validateAdminAuth(req.cookies);
}
function isCron(req) {
  const s = process.env.CRON_SECRET;
  return s && (req.headers.get("authorization") || "") === `Bearer ${s}`;
}

async function handle(req) {
  const admin = isAdmin(req);
  const cron = isCron(req);
  if (!admin && !cron) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: PRIVATE_API_HEADERS }
    );
  }

  const url = new URL(req.url);
  const test = url.searchParams.get("test"); // Test-Empfänger (nur Admin)

  if (cron && !admin && process.env.NEWSLETTER_AUTOSEND !== "true") {
    return NextResponse.json(
      { ok: true, skipped: "NEWSLETTER_AUTOSEND ist nicht 'true'" },
      { headers: PRIVATE_API_HEADERS }
    );
  }

  const issue = await assembleIssue();

  // Test-Versand: eine Mail an die angegebene Adresse (nur Admin)
  if (test && admin) {
    const parsedEmail = emailSchema.safeParse(test);
    if (!parsedEmail.success) {
      return NextResponse.json(
        { error: "Ungueltige Test-E-Mail-Adresse" },
        { status: 400, headers: PRIVATE_API_HEADERS }
      );
    }
    const html = buildWeeklyHtml({ name: "Test", ...issue, unsubUrl: `${BASE}/api/newsletter/unsubscribe?token=TEST` });
    const r = await sendEmail({
      from: FROM,
      to: parsedEmail.data,
      subject: `[TEST] ${SUBJECT}`,
      html,
      tags: ["weekly-newsletter-test"],
    });
    return NextResponse.json(
      {
        ok: r.success,
        error: r.error,
        issue: {
          deals: issue.deals.length,
          tip: !!issue.tip,
          tool: issue.tool?.title,
        },
      },
      { status: r.success ? 200 : 502, headers: PRIVATE_API_HEADERS }
    );
  }

  // An alle bestätigten, nicht abgemeldeten Abonnenten
  const supabase = getSupabase();
  const { data: subs, error: subscribersError } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, unsub_token, locale")
    .eq("confirmed", true)
    .or("unsubscribed.is.null,unsubscribed.eq.false");

  if (subscribersError) {
    throw new Error(`Subscriber query failed: ${subscribersError.message}`);
  }

  const list = subs || [];
  let sent = 0, failed = 0;

  // in kleinen Batches senden
  for (let i = 0; i < list.length; i += 5) {
    const batch = list.slice(i, i + 5);
    await Promise.all(
      batch.map(async (s) => {
        try {
          const email = decrypt(s.email);
          const name = s.name ? decrypt(s.name) : "";
          if (!email || email === "[Decryption failed]") { failed++; return; }
          let unsubToken = s.unsub_token;
          if (!unsubToken) {
            unsubToken = createToken();
            const { error: tokenError } = await supabase
              .from("newsletter_subscribers")
              .update({ unsub_token: unsubToken })
              .eq("id", s.id);
            if (tokenError) {
              failed++;
              await logError("newsletter.unsub-token", tokenError.message, {});
              return;
            }
          }
          const unsubUrl = `${BASE}/api/newsletter/unsubscribe?token=${unsubToken}`;
          const html = buildWeeklyHtml({ name, ...issue, unsubUrl });
          const r = await sendEmail({
            from: FROM,
            to: email,
            subject: SUBJECT,
            html,
            tags: ["weekly-newsletter", `locale-${s.locale || "de"}`],
            headers: {
              "List-Unsubscribe": `<${unsubUrl}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          });
          r.success ? sent++ : failed++;
        } catch (error) {
          failed++;
          await logError("newsletter.send-recipient", error?.message || String(error), {});
        }
      })
    );
  }

  const result = { ok: failed === 0, recipients: list.length, sent, failed, deals: issue.deals.length, ts: new Date().toISOString() };
  if (failed) await logError("newsletter.send-weekly", `sent ${sent}/${list.length}, failed ${failed}`, {});
  return NextResponse.json(result, { headers: PRIVATE_API_HEADERS });
}

export async function GET(req) {
  try { return await handle(req); }
  catch (e) { await logError("newsletter.send-weekly", e?.message || String(e), {}); return NextResponse.json({ error: "Sendefehler" }, { status: 500, headers: PRIVATE_API_HEADERS }); }
}
export const POST = GET;
