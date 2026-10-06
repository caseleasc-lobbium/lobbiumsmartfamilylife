export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { logError } from "@/lib/errorlog";
import { PRIVATE_API_HEADERS } from "@/lib/security";

const supabase = getSupabase();

function getOrigin(req) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL).origin;
    } catch {}
  }
  return new URL(req.url).origin;
}

function redirectToConfirmation(req) {
  return NextResponse.redirect(`${getOrigin(req)}/newsletter/abgemeldet`, {
    headers: PRIVATE_API_HEADERS,
  });
}

async function removeSubscriber(token) {
  let { data: user, error: findError } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, locale")
    .eq("unsub_token", token)
    .maybeSingle();

  if (findError) throw findError;

  // Supports links issued before the dedicated unsubscribe token was added.
  if (!user) {
    const fallback = await supabase
      .from("newsletter_subscribers")
      .select("id, email, name, locale")
      .eq("token", token)
      .maybeSingle();
    if (fallback.error) throw fallback.error;
    user = fallback.data;
  }

  // Repeated one-click requests are intentionally idempotent.
  if (!user) return;

  const { error: backupError } = await supabase
    .from("newsletter_unsubscribed")
    .insert({
      email: user.email,
      name: user.name,
      locale: user.locale,
      unsubscribed_at: new Date().toISOString(),
    });
  if (backupError) {
    await logError("newsletter.unsubscribe-backup", backupError.message, {});
  }

  const { error: deleteError } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("id", user.id);
  if (deleteError) throw deleteError;
}

async function unsubscribe(req, jsonResponse) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token || token.length < 10 || token.length > 128) {
    return jsonResponse
      ? NextResponse.json(
          { error: "Ungueltiger Abmelde-Link" },
          { status: 400, headers: PRIVATE_API_HEADERS }
        )
      : redirectToConfirmation(req);
  }

  try {
    await removeSubscriber(token);
    return jsonResponse
      ? NextResponse.json({ success: true }, { headers: PRIVATE_API_HEADERS })
      : redirectToConfirmation(req);
  } catch (error) {
    await logError("newsletter.unsubscribe", error, {});
    return jsonResponse
      ? NextResponse.json(
          { error: "Abmeldung konnte nicht abgeschlossen werden" },
          { status: 500, headers: PRIVATE_API_HEADERS }
        )
      : redirectToConfirmation(req);
  }
}

// Human unsubscribe links remain compatible with previously sent emails.
export async function GET(req) {
  return unsubscribe(req, false);
}

// RFC 8058 one-click unsubscribe used by supporting mail clients.
export async function POST(req) {
  return unsubscribe(req, true);
}
