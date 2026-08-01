import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateAdminAuth } from "@/lib/security";
import { decrypt } from "@/lib/encryption";
import { sendEmail } from "@/lib/email";
import { assembleIssue, buildWeeklyHtml } from "@/lib/newsletter";
import { logError } from "@/lib/errorlog";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BASE = "https://www.lobbium.com";
const FROM = { name: "Lobbium – Familien-Spar-Brief", email: "info@lobbium.com" };
const SUBJECT = "Dein Lobbium Familien-Spar-Brief 📬";

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
  if (!admin && !cron) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const test = url.searchParams.get("test"); // Test-Empfänger (nur Admin)

  const issue = await assembleIssue();

  // Test-Versand: eine Mail an die angegebene Adresse (nur Admin)
  if (test && admin) {
    const html = buildWeeklyHtml({ name: "Test", ...issue, unsubUrl: `${BASE}/api/newsletter/unsubscribe?token=TEST` });
    const r = await sendEmail({ from: FROM, to: test, subject: `[TEST] ${SUBJECT}`, html });
    return NextResponse.json({ ok: r.success, test, error: r.error, issue: { deals: issue.deals.length, tip: !!issue.tip, tool: issue.tool?.title } });
  }

  // Automatischer Cron nur senden, wenn ausdrücklich aktiviert
  if (cron && !admin && process.env.NEWSLETTER_AUTOSEND !== "true") {
    return NextResponse.json({ skipped: "NEWSLETTER_AUTOSEND ist nicht 'true'" });
  }

  // An alle bestätigten, nicht abgemeldeten Abonnenten
  const supabase = getSupabase();
  const { data: subs } = await supabase
    .from("newsletter_subscribers")
    .select("email, name, unsub_token")
    .eq("confirmed", true)
    .or("unsubscribed.is.null,unsubscribed.eq.false");

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
          const unsubUrl = `${BASE}/api/newsletter/unsubscribe?token=${s.unsub_token || ""}`;
          const html = buildWeeklyHtml({ name, ...issue, unsubUrl });
          const r = await sendEmail({ from: FROM, to: email, subject: SUBJECT, html });
          r.success ? sent++ : failed++;
        } catch {
          failed++;
        }
      })
    );
  }

  const result = { ok: true, recipients: list.length, sent, failed, deals: issue.deals.length, ts: new Date().toISOString() };
  if (failed) await logError("newsletter.send-weekly", `sent ${sent}/${list.length}, failed ${failed}`, {});
  return NextResponse.json(result);
}

export async function GET(req) {
  try { return await handle(req); }
  catch (e) { await logError("newsletter.send-weekly", e?.message || String(e), {}); return NextResponse.json({ error: "Sendefehler", detail: e?.message }, { status: 500 }); }
}
export const POST = GET;
