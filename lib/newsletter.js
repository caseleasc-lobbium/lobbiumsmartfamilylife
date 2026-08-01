// Wöchentlicher Lobbium Familien-Spar-Brief: Ausgabe zusammenstellen + HTML bauen.
import { getSupabase } from "@/lib/supabase";

const BASE = "https://www.lobbium.com";
// Statische E-Mail-Assets (Header-Bild) in Supabase Storage – Bilder werden von
// Mail-Clients NIE dark-invertiert, dadurch bleibt das Logo überall lesbar.
const BASE_ASSETS = "https://pvmehyinztpqasothxro.supabase.co/storage/v1/object/public/public-assets/email";

const abs = (u) => (!u ? null : u.startsWith("http") ? u : `${BASE}${u.startsWith("/") ? "" : "/"}${u}`);
const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Rotierende Tool-Empfehlung (nach Kalenderwoche)
const TOOLS = [
  { t: "Kindergeld- & Familienleistungen-Checker", d: "Prüfe in 1 Minute, welche Leistungen deiner Familie zustehen.", u: "/tools/kindergeld-checker" },
  { t: "Familienbudget-Rechner", d: "Teile dein Einkommen mit der 50-30-20-Methode auf.", u: "/tools/familienbudget" },
  { t: "Was kostet ein Kind?", d: "Schätze die Kosten bis zum 18. Geburtstag.", u: "/tools/was-kostet-ein-kind" },
  { t: "Taschengeld-Rechner", d: "Wie viel Taschengeld passt zum Alter deines Kindes?", u: "/tools/taschengeld" },
  { t: "Gratis Druckvorlagen", d: "Budget-Planer, Wochenplan, Packliste & Sparziel-Tracker.", u: "/tools/druckvorlagen" },
];

function weekIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.floor((now - start) / (7 * 24 * 3600 * 1000));
}

export async function assembleIssue() {
  const supabase = getSupabase();
  const today = new Date().toISOString().slice(0, 10);
  const wk = weekIndex();

  // Top 3 Deals
  const { data: dealsRaw } = await supabase
    .from("deals").select("*").eq("published", true).order("created_at", { ascending: false });
  const deals = (dealsRaw || [])
    .filter((d) => !d.valid_until || d.valid_until >= today)
    .slice(0, 3)
    .map((d) => ({ title: d.title, hook: d.hook, description: d.description, url: abs(d.url), image: abs(d.image_url) }));

  // Spartipp der Woche = rotierender Ratgeber (DE)
  const { data: arts } = await supabase
    .from("blog_posts").select("slug,title,excerpt").eq("published", true).eq("locale", "de").order("created_at", { ascending: true });
  const art = arts && arts.length ? arts[wk % arts.length] : null;
  const tip = art ? { title: art.title, text: art.excerpt, url: `${BASE}/blog/${art.slug}` } : null;

  // Tool der Woche = rotierend
  const t = TOOLS[wk % TOOLS.length];
  const tool = { title: t.t, text: t.d, url: `${BASE}${t.u}` };

  return { deals, tip, tool };
}

export function buildWeeklyHtml({ name, deals = [], tip, tool, unsubUrl }) {
  const dealCards = deals.map((d) => `
    <tr><td style="padding:8px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="lob-dealcard" style="border:1px solid #eef2fb;border-radius:14px;background:#ffffff;">
        <tr>
          ${d.image ? `<td width="84" style="padding:12px 0 12px 12px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td class="lob-logo" bgcolor="#ffffff" align="center" width="64" height="64" style="background:#ffffff;border-radius:10px;width:64px;height:64px;"><img src="${d.image}" width="52" height="52" style="display:block;object-fit:contain;border:0;" alt=""></td></tr></table></td>` : ""}
          <td style="padding:14px 16px;vertical-align:middle;">
            ${d.hook ? `<span style="display:inline-block;background:#2b6cb0;color:#ffffff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;margin-bottom:6px;">${esc(d.hook)}</span><br>` : ""}
            <a href="${d.url}" class="lob-title" style="color:#0f1c3f;font-size:16px;font-weight:700;text-decoration:none;">${esc(d.title)}</a>
            <div class="lob-text" style="color:#334155;font-size:14px;line-height:1.5;margin-top:4px;">${esc(d.description || "")}</div>
          </td>
        </tr>
      </table>
    </td></tr>`).join("");

  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<style>
  :root{color-scheme:light dark;supported-color-schemes:light dark;}
  @media (prefers-color-scheme:dark){
    .lob-bg{background:#0e1626!important;}
    .lob-card{background:#141f33!important;border-color:#26324c!important;}
    .lob-dealcard{background:#101a2f!important;border-color:#26324c!important;}
    .lob-toolbox{background:#13233f!important;}
    .lob-title{color:#f3f6fb!important;}
    .lob-text{color:#c2cfe4!important;}
    .lob-link{color:#8fbdf0!important;}
    .lob-logo{background:#ffffff!important;}
  }
</style></head>
<body class="lob-bg" style="margin:0;padding:0;background:#f8faff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="lob-bg" style="background:#f8faff;"><tr><td align="center" style="padding:28px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" class="lob-card" style="max-width:600px;width:100%;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #e6ecfb;">
  <tr><td bgcolor="#122a4d" style="background-color:#122a4d;padding:0;font-size:0;line-height:0;">
    <img src="${BASE_ASSETS}/header-newsletter.png" width="600" alt="LOBBIUM – Familien-Spar-Brief" style="display:block;width:100%;max-width:600px;height:auto;border:0;">
  </td></tr>
  <tr><td style="padding:30px 32px 6px;">
    <p class="lob-title" style="margin:0 0 6px;font-size:17px;line-height:1.6;color:#1e293b;">Hallo ${esc(name) || "liebe Familie"},</p>
    <p class="lob-text" style="margin:0;font-size:15px;line-height:1.6;color:#475569;">hier ist dein wöchentlicher Spar-Brief – kompakt in 2 Minuten. 👇</p>
  </td></tr>

  ${deals.length ? `<tr><td style="padding:18px 32px 0;">
    <h2 class="lob-title" style="margin:0 0 4px;font-size:17px;color:#0f1c3f;">🏷️ Die besten Familien-Deals</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${dealCards}</table>
  </td></tr>` : ""}

  ${tip ? `<tr><td style="padding:22px 32px 0;">
    <h2 class="lob-title" style="margin:0 0 6px;font-size:17px;color:#0f1c3f;">💡 Spartipp der Woche</h2>
    <a href="${tip.url}" class="lob-title" style="color:#0f1c3f;font-size:16px;font-weight:700;text-decoration:none;">${esc(tip.title)}</a>
    <div class="lob-text" style="color:#334155;font-size:15px;line-height:1.6;margin-top:4px;">${esc(tip.text || "")} <a href="${tip.url}" class="lob-link" style="color:#2b6cb0;font-weight:600;text-decoration:none;">Weiterlesen →</a></div>
  </td></tr>` : ""}

  ${tool ? `<tr><td style="padding:22px 32px 4px;">
    <h2 class="lob-title" style="margin:0 0 6px;font-size:17px;color:#0f1c3f;">🧮 Tool der Woche</h2>
    <div class="lob-toolbox" style="background:#eef4fc;border-radius:14px;padding:16px 18px;">
      <a href="${tool.url}" class="lob-title" style="color:#0f1c3f;font-size:16px;font-weight:700;text-decoration:none;">${esc(tool.title)}</a>
      <div class="lob-text" style="color:#334155;font-size:15px;line-height:1.6;margin:4px 0 12px;">${esc(tool.text || "")}</div>
      <a href="${tool.url}" style="display:inline-block;background:#2b6cb0;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:11px 20px;border-radius:10px;">Jetzt ausprobieren</a>
    </div>
  </td></tr>` : ""}

  <tr><td style="padding:20px 32px 26px;text-align:center;">
    <a href="${BASE}/deals" class="lob-link" style="color:#2b6cb0;text-decoration:none;font-size:13px;font-weight:600;">Alle Deals ansehen →</a>
  </td></tr>

  <tr><td bgcolor="#0f1c3f" style="background:#0f1c3f;padding:20px 32px;text-align:center;">
    <div style="font-size:12px;color:#9cb2d6;">© Lobbium – Smart Family Life</div>
    <div style="font-size:12px;color:#6b7ea6;margin-top:6px;">
      <a href="${BASE}" style="color:#9cc2f0;text-decoration:none;">lobbium.com</a> ·
      <a href="${unsubUrl}" style="color:#9cc2f0;text-decoration:none;">Abmelden</a>
    </div>
  </td></tr>
</table></td></tr></table></body></html>`;
}
