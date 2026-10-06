export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { decrypt } from "@/lib/encryption";
import { getSupabase } from "@/lib/supabase";
import { PRIVATE_API_HEADERS, validateAdminAuth } from "@/lib/security";
import { logError } from "@/lib/errorlog";

const MAX_IDS = 1000;

function unauthorized() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401, headers: PRIVATE_API_HEADERS }
  );
}

function normalizeIds(value) {
  if (!Array.isArray(value) || value.length > MAX_IDS) return null;
  const ids = value.filter((id) => {
    if (Number.isInteger(id) && id > 0) return true;
    return typeof id === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(id);
  });
  if (ids.length !== value.length) return null;
  return [...new Map(ids.map((id) => [String(id), id])).values()];
}

export async function GET(req) {
  if (!validateAdminAuth(req.cookies)) return unauthorized();

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select(
        "id,email,name,confirmed,consent,unsubscribed,locale,created_at,date_consent"
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    const subscribers = (data || []).map((subscriber) => ({
      ...subscriber,
      email: subscriber.email ? decrypt(subscriber.email) : "",
      name: subscriber.name ? decrypt(subscriber.name) : "",
    }));

    return NextResponse.json(subscribers, { headers: PRIVATE_API_HEADERS });
  } catch (error) {
    await logError("admin.newsletter-list", error?.message || String(error), {});
    return NextResponse.json(
      { error: "Abonnenten konnten nicht geladen werden" },
      { status: 500, headers: PRIVATE_API_HEADERS }
    );
  }
}

export async function DELETE(req) {
  if (!validateAdminAuth(req.cookies)) return unauthorized();

  try {
    const body = await req.json();
    const ids = normalizeIds(body?.ids);
    if (!ids?.length) {
      return NextResponse.json(
        { error: "Keine gültigen Empfänger ausgewählt" },
        { status: 400, headers: PRIVATE_API_HEADERS }
      );
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .in("id", ids)
      .select("id");

    if (error) throw error;

    return NextResponse.json(
      { success: true, deleted: data?.length || 0 },
      { headers: PRIVATE_API_HEADERS }
    );
  } catch (error) {
    await logError("admin.newsletter-delete", error?.message || String(error), {});
    return NextResponse.json(
      { error: "Löschen fehlgeschlagen" },
      { status: 500, headers: PRIVATE_API_HEADERS }
    );
  }
}
