// Marken-E-Mails als lokal gerendertes HTML (kein Brevo-Template-Engine).
// Grund: Brevos Template-Rendering hat beim gespeicherten Template einen
// hartnäckigen Render-Fehler geworfen; rohes htmlContent stellt zuverlässig zu.
// Aufgerufen über lib/email.js -> sendTemplateEmail (IDs 1 = Bestätigung, 5 = Willkommen).

const BASE = "https://www.lobbium.com";

const COPY = {
  de: {
    confirmTitle: "Bitte bestaetige deine Anmeldung",
    confirmHeading: "Nur noch ein Klick 🙌",
    hello: "Hallo",
    defaultName: "und willkommen",
    confirmIntro:
      "schön, dass du beim <strong>Lobbium Familien-Spar-Brief</strong> dabei sein möchtest! Bitte bestätige deine E-Mail-Adresse, damit wir dir die besten Familien-Deals, Spartipps und Tools schicken dürfen.",
    confirmButton: "Anmeldung bestätigen",
    copyLink: "Button funktioniert nicht? Kopiere diesen Link in deinen Browser:",
    trust: "Kompakt in 2 Minuten gelesen · jederzeit abbestellbar · kein Spam.",
    ignore: "Falls du dich nicht angemeldet hast, ignoriere diese E-Mail einfach.",
    welcomeTitle: "Willkommen bei Lobbium",
    welcomeHeading: "Willkommen an Bord",
    welcomeDefaultName: "liebe Familie",
    welcomeSuffix: " 🎉",
    welcomeIntro:
      "Deine Anmeldung ist bestätigt – schön, dass du dabei bist! Ab jetzt bekommst du <strong>einmal pro Woche</strong> das Beste für Familien: kompakt, ehrlich und in 2 Minuten gelesen.",
    benefitDeals: "🏷️ &nbsp;<strong>Die besten Familien-Deals</strong> – handverlesen, kein Werbe-Wust",
    benefitTip: "💡 &nbsp;<strong>1 konkreter Spartipp</strong> – umsetzbar im Alltag",
    benefitTool: "🧮 &nbsp;<strong>1 nützliches Tool oder Ratgeber</strong> – passend zur Woche",
    toolsButton: "Jetzt unsere Familien-Tools entdecken",
    dealsLink: "🎯 Deal-Radar",
    blogLink: "📖 Ratgeber",
    checkerLink: "🧾 Kindergeld-Checker",
    unsubscribe: "Abmelden",
  },
  en: {
    confirmTitle: "Confirm your subscription",
    confirmHeading: "Just one more click",
    hello: "Hello",
    defaultName: "and welcome",
    confirmIntro:
      "we are glad you want to join the Lobbium Family Savings Letter. Please confirm your email address so we may send you family deals, saving tips and useful tools.",
    confirmButton: "Confirm subscription",
    copyLink: "Button not working? Copy this link into your browser:",
    trust: "A two-minute read - unsubscribe anytime - no spam.",
    ignore: "If you did not subscribe, you can safely ignore this email.",
    welcomeTitle: "Welcome to Lobbium",
    welcomeHeading: "Welcome aboard",
    welcomeDefaultName: "family",
    welcomeSuffix: "",
    welcomeIntro:
      "Your subscription is confirmed. From now on, you will receive our best family deals, saving tips and tools once a week in a concise two-minute read.",
    benefitDeals: "<strong>The best family deals</strong> - hand-picked",
    benefitTip: "<strong>One practical saving tip</strong>",
    benefitTool: "<strong>One useful tool or guide</strong>",
    toolsButton: "Discover our family tools",
    dealsLink: "Deal radar",
    blogLink: "Guides",
    checkerLink: "Benefit checker",
    unsubscribe: "Unsubscribe",
  },
  fr: {
    confirmTitle: "Confirmez votre inscription",
    confirmHeading: "Encore un clic",
    hello: "Bonjour",
    defaultName: "et bienvenue",
    confirmIntro:
      "nous sommes ravis de vous accueillir dans la lettre famille Lobbium. Confirmez votre adresse e-mail pour recevoir nos offres, astuces et outils pour les familles.",
    confirmButton: "Confirmer l'inscription",
    copyLink: "Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :",
    trust: "Deux minutes de lecture - desinscription a tout moment - sans spam.",
    ignore: "Si vous ne vous etes pas inscrit, ignorez simplement cet e-mail.",
    welcomeTitle: "Bienvenue chez Lobbium",
    welcomeHeading: "Bienvenue",
    welcomeDefaultName: "chere famille",
    welcomeSuffix: "",
    welcomeIntro:
      "Votre inscription est confirmee. Vous recevrez desormais chaque semaine nos meilleures offres, astuces et outils pour les familles.",
    benefitDeals: "<strong>Les meilleures offres famille</strong> - selectionnees",
    benefitTip: "<strong>Une astuce d'economie concrete</strong>",
    benefitTool: "<strong>Un outil ou guide utile</strong>",
    toolsButton: "Decouvrir nos outils famille",
    dealsLink: "Offres",
    blogLink: "Guides",
    checkerLink: "Aides familiales",
    unsubscribe: "Se desinscrire",
  },
};

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function copyFor(locale) {
  return COPY[locale] || COPY.de;
}

function safeUrl(value, fallback = BASE) {
  try {
    const url = new URL(value || fallback);
    if (!['http:', 'https:'].includes(url.protocol)) return esc(fallback);
    return esc(url.toString());
  } catch {
    return esc(fallback);
  }
}

function safeBase(value) {
  try {
    const url = new URL(value || BASE);
    if (!["http:", "https:"].includes(url.protocol)) return BASE;
    return esc(url.origin);
  } catch {
    return BASE;
  }
}

// 1) Double-Opt-in-Bestätigung
export function renderConfirmEmail({ name, confirmUrl, locale = "de" }) {
  const t = copyFor(locale);
  const hi = name ? esc(name) : t.defaultName;
  const url = safeUrl(confirmUrl);
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
  :root{color-scheme:light dark;supported-color-schemes:light dark;}
  @media (prefers-color-scheme:dark){
    .lob-bg{background:#0e1626!important;}
    .lob-card{background:#141f33!important;border-color:#26324c!important;}
    .lob-box{background:#13233f!important;}
    .lob-title{color:#f3f6fb!important;}
    .lob-text{color:#c2cfe4!important;}
  }
</style>
<title>${t.confirmTitle}</title>
</head>
<body class="lob-bg" style="margin:0;padding:0;background:#f8faff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="lob-bg" style="background:#f8faff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="lob-card" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e6ecfb;">
          <tr>
            <td bgcolor="#122a4d" style="background-color:#122a4d;background:linear-gradient(135deg,#1c4c86,#0f2447);padding:28px 32px;text-align:center;">
              <div style="font-size:24px;font-weight:800;letter-spacing:2px;color:#ffffff;">LOBBIUM</div>
              <div style="font-size:12px;letter-spacing:3px;color:#e6f0fb;text-transform:uppercase;margin-top:4px;">Smart Family Life</div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 8px;">
              <h1 class="lob-title" style="margin:0 0 12px;font-size:22px;color:#0f1c3f;">${t.confirmHeading}</h1>
              <p class="lob-text" style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">
                ${t.hello} ${hi},<br>
                ${t.confirmIntro}
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:12px 32px 28px;">
              <a href="${url}" style="display:inline-block;background:#2b6cb0;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:15px 34px;border-radius:12px;">
                ${t.confirmButton}
              </a>
              <p style="margin:18px 0 0;font-size:12px;color:#9aa4bd;">
                ${t.copyLink}<br>
                <span style="color:#2b6cb0;word-break:break-all;">${url}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <div class="lob-box lob-text" style="background:#f1f6fd;border-radius:14px;padding:16px 18px;font-size:13px;color:#5b678a;line-height:1.6;">
                ${t.trust} ${t.ignore}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#0f1c3f;padding:22px 32px;text-align:center;">
              <div style="font-size:13px;color:#9cb2d6;">© Lobbium – Smart Family Life</div>
              <div style="font-size:12px;color:#6b7ea6;margin-top:6px;">
                <a href="${BASE}" style="color:#9cc2f0;text-decoration:none;">lobbium.com</a> ·
                <a href="${BASE}/newsletter" style="color:#9cc2f0;text-decoration:none;">Newsletter</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 5) Willkommen (nach Bestätigung)
export function renderWelcomeEmail({ name, siteUrl, unsubUrl, locale = "de" }) {
  const t = copyFor(locale);
  const hi = name ? esc(name) : t.welcomeDefaultName;
  const base = safeBase(siteUrl);
  const unsub = safeUrl(unsubUrl, `${BASE}/newsletter`);
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<style>
  :root{color-scheme:light dark;supported-color-schemes:light dark;}
  @media (prefers-color-scheme:dark){
    .lob-bg{background:#0e1626!important;}
    .lob-card{background:#141f33!important;border-color:#26324c!important;}
    .lob-box{background:#13233f!important;}
    .lob-title{color:#f3f6fb!important;}
    .lob-text{color:#c2cfe4!important;}
  }
</style>
<title>${t.welcomeTitle}</title>
</head>
<body class="lob-bg" style="margin:0;padding:0;background:#f8faff;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="lob-bg" style="background:#f8faff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="lob-card" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e6ecfb;">
          <tr>
            <td bgcolor="#122a4d" style="background-color:#122a4d;background:linear-gradient(135deg,#1c4c86,#0f2447);padding:28px 32px;text-align:center;">
              <div style="font-size:24px;font-weight:800;letter-spacing:2px;color:#ffffff;">LOBBIUM</div>
              <div style="font-size:12px;letter-spacing:3px;color:#e6f0fb;text-transform:uppercase;margin-top:4px;">Smart Family Life</div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 8px;">
              <h1 class="lob-title" style="margin:0 0 12px;font-size:22px;color:#0f1c3f;">${t.welcomeHeading}, ${hi}!${t.welcomeSuffix}</h1>
              <p class="lob-text" style="margin:0 0 8px;font-size:16px;line-height:1.6;color:#374151;">
                ${t.welcomeIntro}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="lob-text" style="padding:10px 0;font-size:15px;color:#374151;border-bottom:1px solid #eef2fb;">${t.benefitDeals}</td>
                </tr>
                <tr>
                  <td class="lob-text" style="padding:10px 0;font-size:15px;color:#374151;border-bottom:1px solid #eef2fb;">${t.benefitTip}</td>
                </tr>
                <tr>
                  <td class="lob-text" style="padding:10px 0;font-size:15px;color:#374151;">${t.benefitTool}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:26px 32px 10px;">
              <a href="${base}/tools" style="display:inline-block;background:#2b6cb0;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:15px 34px;border-radius:12px;">
                ${t.toolsButton}
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:6px 32px 30px;font-size:14px;">
                <a href="${base}/deals" style="color:#2b6cb0;text-decoration:none;">${t.dealsLink}</a> &nbsp;·&nbsp;
                <a href="${base}/blog" style="color:#2b6cb0;text-decoration:none;">${t.blogLink}</a> &nbsp;·&nbsp;
                <a href="${base}/tools/kindergeld-checker" style="color:#2b6cb0;text-decoration:none;">${t.checkerLink}</a>
            </td>
          </tr>
          <tr>
            <td style="background:#0f1c3f;padding:22px 32px;text-align:center;">
              <div style="font-size:13px;color:#9cb2d6;">© Lobbium – Smart Family Life</div>
              <div style="font-size:12px;color:#6b7ea6;margin-top:6px;">
                <a href="${base}" style="color:#9cc2f0;text-decoration:none;">lobbium.com</a> ·
                <a href="${unsub}" style="color:#9cc2f0;text-decoration:none;">${t.unsubscribe}</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
