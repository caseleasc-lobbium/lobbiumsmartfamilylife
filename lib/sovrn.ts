// Sovrn Commerce (ehem. VigLink) – Auto-Affiliate über Redirect-Link.
//
// Modell: Jede Ziel-URL wird durch den Sovrn-Redirect geschleust
//   https://sovrn.co?key=<KEY>&u=<encoded destination>
// Sovrn affiliatet & monetarisiert den Klick und leitet dann zum Ziel weiter –
// OHNE Einzel-Freischaltung pro Händler.
//
// WICHTIG: Monetarisierung startet erst NACH der Sovrn-„Site review"-Freigabe.
// Deshalb per Flag SOVRN_ENABLED steuerbar (vorher direkt zum Ziel leiten).

const SOVRN_REDIRECT = "https://sovrn.co";

export function sovrnEnabled(): boolean {
  return process.env.SOVRN_ENABLED === "true" && !!process.env.SOVRN_API_KEY;
}

/**
 * Wandelt eine Ziel-URL in einen Sovrn-Affiliate-Redirect.
 * Gibt die Original-URL zurück, wenn kein Key/Flag gesetzt ist.
 * @param destUrl  echte Ziel-URL (Partner-Startseite oder Produktseite)
 * @param cuid     optionale Klick-/Partner-Kennung fürs Reporting
 */
export function sovrnWrap(destUrl: string, cuid?: string): string {
  const key = process.env.SOVRN_API_KEY;
  if (!key || !destUrl) return destUrl;
  const q = new URLSearchParams({ key, u: destUrl });
  if (cuid) q.set("cuid", String(cuid));
  return `${SOVRN_REDIRECT}?${q.toString()}`;
}

/**
 * Link-Check: prüft, ob eine URL bei Sovrn monetarisierbar ist (+ geschätzter EPC).
 * Nutzbar für Reporting/Diagnose. Braucht den API-Key.
 */
export async function sovrnLinkCheck(
  outUrl: string,
  geo = "DE"
): Promise<{ affiliatable: boolean; eepc: number | null; optimized: string | null } | null> {
  const key = process.env.SOVRN_API_KEY;
  if (!key) return null;
  const q = new URLSearchParams({ out: outUrl, key, format: "json", geo });
  try {
    const r = await fetch(`https://api.viglink.com/api/link/?${q.toString()}`);
    if (!r.ok) return null;
    const j = await r.json();
    const d = Array.isArray(j) ? j[0] : j;
    return {
      affiliatable: !!d?.affiliatable,
      eepc: d?.eepc ?? null,
      optimized: d?.optimized ?? null,
    };
  } catch {
    return null;
  }
}
