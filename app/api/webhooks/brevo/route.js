export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import crypto from "crypto";
import { NextResponse } from "next/server";
import { emailHash } from "@/lib/encryption";
import { getSupabase } from "@/lib/supabase";
import { logError } from "@/lib/errorlog";
import { PRIVATE_API_HEADERS } from "@/lib/security";

const MAX_BODY_BYTES = 64 * 1024;
const SUPPRESSION_EVENTS = new Set([
  "blocked",
  "hardBounce",
  "invalid",
  "spam",
  "unsubscribed",
]);
const FAILURE_EVENTS = new Set([
  ...SUPPRESSION_EVENTS,
  "deferred",
  "softBounce",
]);

function secretsMatch(provided, expected) {
  if (!provided || !expected) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

function normalizeEvents(payload) {
  const events = Array.isArray(payload) ? payload : [payload];
  return events.filter(
    (event) =>
      event &&
      typeof event === "object" &&
      typeof event.event === "string"
  );
}

function eventContext(event) {
  const email = typeof event.email === "string" ? event.email : "";
  return {
    event: event.event,
    emailHash: email ? emailHash(email) : null,
    messageId: event["message-id"] || event.messageId || null,
    timestamp: event.ts_event || event.ts || null,
    tag: event.tag || null,
  };
}

export async function POST(req) {
  const expectedSecret = process.env.BREVO_WEBHOOK_SECRET;
  const providedSecret = req.headers.get("x-lobbium-webhook-secret");

  if (!expectedSecret) {
    await logError("brevo.webhook-config", "BREVO_WEBHOOK_SECRET is missing", {});
    return NextResponse.json(
      { error: "Webhook nicht konfiguriert" },
      { status: 503, headers: PRIVATE_API_HEADERS }
    );
  }

  if (!secretsMatch(providedSecret, expectedSecret)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: PRIVATE_API_HEADERS }
    );
  }

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Payload zu gross" },
      { status: 413, headers: PRIVATE_API_HEADERS }
    );
  }

  try {
    const rawBody = await req.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Payload zu gross" },
        { status: 413, headers: PRIVATE_API_HEADERS }
      );
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Ungueltiges JSON" },
        { status: 400, headers: PRIVATE_API_HEADERS }
      );
    }

    const events = normalizeEvents(payload);
    if (!events.length) {
      return NextResponse.json(
        { error: "Ungueltiges Event" },
        { status: 400, headers: PRIVATE_API_HEADERS }
      );
    }

    const supabase = getSupabase();
    for (const event of events) {
      const context = eventContext(event);

      if (SUPPRESSION_EVENTS.has(event.event) && context.emailHash) {
        const { error } = await supabase
          .from("newsletter_subscribers")
          .update({ unsubscribed: true })
          .eq("email_hash", context.emailHash);
        if (error) throw error;
      }

      if (FAILURE_EVENTS.has(event.event)) {
        await logError(
          "brevo.webhook",
          `Transactional email event: ${event.event}`,
          context
        );
      }
    }

    return NextResponse.json(
      { received: events.length },
      { headers: PRIVATE_API_HEADERS }
    );
  } catch (error) {
    await logError("brevo.webhook", error, {});
    return NextResponse.json(
      { error: "Webhook-Verarbeitung fehlgeschlagen" },
      { status: 500, headers: PRIVATE_API_HEADERS }
    );
  }
}
