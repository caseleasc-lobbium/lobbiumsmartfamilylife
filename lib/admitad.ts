// Admitad Publisher-API-Anbindung (nur lesend + Deeplink-Erzeugung).
//
// WICHTIG (Stand 2026): Programme BEWERBEN geht NICHT mehr per API
// (der alte "attach"-Endpoint antwortet 410 "no longer available").
// Bewerben passiert im Admitad-Dashboard. Per API möglich sind:
//   - Katalog & Verbindungsstatus lesen
//   - für AKTIVE (freigeschaltete) Programme echte Tracking-Deeplinks erzeugen
//
// Genau darauf baut der Sync-Motor: freigeschaltete Programme werden
// automatisch mit echten Provisions-Links auf der Seite scharfgeschaltet.

const API = "https://api.admitad.com";

export interface AdmitadConnection {
  id: number;
  name: string;
  status: string; // "active" | "pending" | "declined" | ...
  gotolink: string | null;
}

function creds() {
  const clientId = process.env.ADMITAD_CLIENT_ID;
  const base64 =
    process.env.ADMITAD_BASE64_HEADER ||
    (clientId && process.env.ADMITAD_CLIENT_SECRET
      ? Buffer.from(`${clientId}:${process.env.ADMITAD_CLIENT_SECRET}`).toString("base64")
      : undefined);
  if (!clientId || !base64) {
    throw new Error("Admitad-Zugangsdaten fehlen (ADMITAD_CLIENT_ID / ADMITAD_BASE64_HEADER).");
  }
  return { clientId, base64 };
}

export async function getAdmitadToken(
  scope = "public_data advcampaigns advcampaigns_for_website websites deeplink_generator"
): Promise<string> {
  const { clientId, base64 } = creds();
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    scope,
  });
  const r = await fetch(`${API}/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${base64}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const j = await r.json();
  if (!r.ok || !j.access_token) {
    throw new Error(`Admitad-Token fehlgeschlagen (${r.status}): ${JSON.stringify(j)}`);
  }
  return j.access_token as string;
}

/** Erste aktive Website (Ad Space) des Kontos. */
export async function getWebsiteId(token: string): Promise<number> {
  if (process.env.ADMITAD_WEBSITE_ID) return Number(process.env.ADMITAD_WEBSITE_ID);
  const r = await fetch(`${API}/websites/v2/`, { headers: { Authorization: `Bearer ${token}` } });
  const list = await r.json();
  const site = Array.isArray(list) ? list.find((w: any) => w.status === "active") || list[0] : null;
  if (!site) throw new Error("Kein Ad Space im Admitad-Konto gefunden.");
  return site.id as number;
}

/** Alle Programm-Verbindungen (mit Status) für eine Website. */
export async function listConnections(token: string, websiteId: number): Promise<AdmitadConnection[]> {
  const out: AdmitadConnection[] = [];
  let offset = 0;
  for (;;) {
    const r = await fetch(
      `${API}/advcampaigns/website/${websiteId}/?limit=200&offset=${offset}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const j = await r.json();
    if (!r.ok) throw new Error(`Verbindungen lesen fehlgeschlagen (${r.status})`);
    const results = j.results || [];
    for (const c of results) {
      out.push({
        id: c.id,
        name: c.name,
        status: c.connection_status || c.status,
        gotolink: c.gotolink || null,
      });
    }
    const total = j._meta ? j._meta.count : results.length;
    offset += 200;
    if (offset >= total || results.length === 0) break;
  }
  return out;
}

/**
 * Tracking-Deeplink für ein AKTIVES Programm erzeugen.
 * `ulp` = Ziel-URL (z. B. Partner-Startseite oder Produktseite).
 * Gibt null zurück, wenn kein Link erzeugt werden kann (z. B. nicht aktiv).
 */
export async function generateDeeplink(
  token: string,
  websiteId: number,
  campaignId: number,
  ulp: string
): Promise<string | null> {
  const r = await fetch(
    `${API}/deeplink/${websiteId}/advcampaign/${campaignId}/?ulp=${encodeURIComponent(ulp)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!r.ok) return null;
  const j = await r.json();
  const link = Array.isArray(j) ? j[0]?.link : j?.link;
  return link || null;
}
