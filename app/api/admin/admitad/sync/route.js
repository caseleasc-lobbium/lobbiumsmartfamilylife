import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateAdminAuth } from "@/lib/security";
import {
  getAdmitadToken,
  getWebsiteId,
  listConnections,
} from "@/lib/admitad";
import { logError } from "@/lib/errorlog";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Auth: Admin-Cookie (manueller Klick) ODER Cron-Secret (Vercel-Cron).
function authorized(request) {
  if (validateAdminAuth(request.cookies)) return true;
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization") || "";
    if (auth === `Bearer ${secret}`) return true;
  }
  return false;
}

async function runSync() {
  const supabase = getSupabase();
  const token = await getAdmitadToken();
  const websiteId = await getWebsiteId(token);
  const connections = await listConnections(token, websiteId);

  // Vorhandene Partner mit Admitad-Zuordnung
  const { data: existing } = await supabase
    .from("affiliates")
    .select("id, title, admitad_id, affiliate_url")
    .not("admitad_id", "is", null);
  const byAdmitad = new Map((existing || []).map((a) => [Number(a.admitad_id), a]));

  const activated = [];
  const removed = [];
  const pending = [];
  const activeNotOnSite = [];

  for (const c of connections) {
    const row = byAdmitad.get(Number(c.id));
    if (c.status === "active") {
      if (row) {
        // Echten Tracking-Link (gotolink) scharfschalten – nur bei Änderung schreiben.
        if (c.gotolink && row.affiliate_url !== c.gotolink) {
          await supabase
            .from("affiliates")
            .update({ affiliate_url: c.gotolink, is_active: true })
            .eq("id", row.id);
          activated.push(c.name);
        }
      } else {
        // Aktiv, aber noch nicht als Partner auf der Seite.
        activeNotOnSite.push({ id: c.id, name: c.name, gotolink: c.gotolink });
      }
    } else if (c.status === "declined") {
      // Abgelehnt: als Partner entfernen (kein Partner = nicht anzeigen).
      if (row) {
        await supabase.from("affiliates").delete().eq("id", row.id);
        removed.push(c.name);
      }
    } else {
      pending.push(c.name);
    }
  }

  return {
    ok: true,
    websiteId,
    connectionsChecked: connections.length,
    activated,
    removed,
    pending,
    activeNotOnSite,
    ts: new Date().toISOString(),
  };
}

export async function GET(request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runSync();
    return NextResponse.json(result);
  } catch (err) {
    await logError("admitad-sync", err?.message || String(err), {});
    return NextResponse.json({ error: "Sync fehlgeschlagen", detail: err?.message }, { status: 500 });
  }
}

export const POST = GET;
