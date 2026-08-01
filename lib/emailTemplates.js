// Marken-E-Mails als lokal gerendertes HTML (kein Brevo-Template-Engine).
// Grund: Brevos Template-Rendering hat beim gespeicherten Template einen
// hartnäckigen Render-Fehler geworfen; rohes htmlContent stellt zuverlässig zu.
// Aufgerufen über lib/email.js -> sendTemplateEmail (IDs 1 = Bestätigung, 5 = Willkommen).

const BASE = "https://www.lobbium.com";

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 1) Double-Opt-in-Bestätigung
export function renderConfirmEmail({ name, confirmUrl }) {
  const hi = name ? esc(name) : "und willkommen";
  const url = confirmUrl || BASE;
  return `<!DOCTYPE html>
<html lang="de">
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
<title>Bitte bestätige deine Anmeldung</title>
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
              <h1 class="lob-title" style="margin:0 0 12px;font-size:22px;color:#0f1c3f;">Nur noch ein Klick 🙌</h1>
              <p class="lob-text" style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">
                Hallo ${hi},<br>
                schön, dass du beim <strong>Lobbium Familien-Spar-Brief</strong> dabei sein möchtest!
                Bitte bestätige deine E-Mail-Adresse, damit wir dir die besten Familien-Deals, Spartipps und Tools schicken dürfen.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:12px 32px 28px;">
              <a href="${url}" style="display:inline-block;background:#2b6cb0;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:15px 34px;border-radius:12px;">
                Anmeldung bestätigen
              </a>
              <p style="margin:18px 0 0;font-size:12px;color:#9aa4bd;">
                Button funktioniert nicht? Kopiere diesen Link in deinen Browser:<br>
                <span style="color:#2b6cb0;word-break:break-all;">${url}</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <div class="lob-box lob-text" style="background:#f1f6fd;border-radius:14px;padding:16px 18px;font-size:13px;color:#5b678a;line-height:1.6;">
                Kompakt in 2 Minuten gelesen · jederzeit abbestellbar · kein Spam.
                Falls du dich nicht angemeldet hast, ignoriere diese E-Mail einfach.
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
export function renderWelcomeEmail({ name, siteUrl, unsubUrl }) {
  const hi = name ? esc(name) : "liebe Familie";
  const base = siteUrl || BASE;
  const unsub = unsubUrl || `${base}/newsletter`;
  return `<!DOCTYPE html>
<html lang="de">
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
<title>Willkommen bei Lobbium</title>
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
              <h1 class="lob-title" style="margin:0 0 12px;font-size:22px;color:#0f1c3f;">Willkommen an Bord, ${hi}! 🎉</h1>
              <p class="lob-text" style="margin:0 0 8px;font-size:16px;line-height:1.6;color:#374151;">
                Deine Anmeldung ist bestätigt – schön, dass du dabei bist! Ab jetzt bekommst du <strong>einmal pro Woche</strong>
                das Beste für Familien: kompakt, ehrlich und in 2 Minuten gelesen.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="lob-text" style="padding:10px 0;font-size:15px;color:#374151;border-bottom:1px solid #eef2fb;">🏷️ &nbsp;<strong>Die besten Familien-Deals</strong> – handverlesen, kein Werbe-Wust</td>
                </tr>
                <tr>
                  <td class="lob-text" style="padding:10px 0;font-size:15px;color:#374151;border-bottom:1px solid #eef2fb;">💡 &nbsp;<strong>1 konkreter Spartipp</strong> – umsetzbar im Alltag</td>
                </tr>
                <tr>
                  <td class="lob-text" style="padding:10px 0;font-size:15px;color:#374151;">🧮 &nbsp;<strong>1 nützliches Tool oder Ratgeber</strong> – passend zur Woche</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:26px 32px 10px;">
              <a href="${base}/tools" style="display:inline-block;background:#2b6cb0;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:15px 34px;border-radius:12px;">
                Jetzt unsere Familien-Tools entdecken
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:6px 32px 30px;font-size:14px;">
              <a href="${base}/deals" style="color:#2b6cb0;text-decoration:none;">🎯 Deal-Radar</a> &nbsp;·&nbsp;
              <a href="${base}/blog" style="color:#2b6cb0;text-decoration:none;">📖 Ratgeber</a> &nbsp;·&nbsp;
              <a href="${base}/tools/kindergeld-checker" style="color:#2b6cb0;text-decoration:none;">🧾 Kindergeld-Checker</a>
            </td>
          </tr>
          <tr>
            <td style="background:#0f1c3f;padding:22px 32px;text-align:center;">
              <div style="font-size:13px;color:#9cb2d6;">© Lobbium – Smart Family Life</div>
              <div style="font-size:12px;color:#6b7ea6;margin-top:6px;">
                <a href="${base}" style="color:#9cc2f0;text-decoration:none;">lobbium.com</a> ·
                <a href="${unsub}" style="color:#9cc2f0;text-decoration:none;">Abmelden</a>
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
