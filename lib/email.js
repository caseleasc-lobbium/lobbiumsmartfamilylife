import { renderConfirmEmail, renderWelcomeEmail } from "@/lib/emailTemplates";

const BREVO_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";
const DEFAULT_SENDER = { name: "Lobbium", email: "info@lobbium.com" };
const EMAIL_TIMEOUT_MS = 15_000;

const SUBJECTS = {
  confirm: {
    de: "Bitte bestätige deine Anmeldung bei Lobbium",
    en: "Please confirm your Lobbium subscription",
    fr: "Confirmez votre inscription a Lobbium",
  },
  reminder: {
    de: "Erinnerung: Bitte bestätige deine Anmeldung bei Lobbium",
    en: "Reminder: Please confirm your Lobbium subscription",
    fr: "Rappel : confirmez votre inscription a Lobbium",
  },
  welcome: {
    de: "Willkommen bei Lobbium - dein Familien-Spar-Brief startet",
    en: "Welcome to Lobbium - your family savings letter starts now",
    fr: "Bienvenue chez Lobbium - votre lettre famille commence",
  },
};

function localeOf(params) {
  return ["de", "en", "fr"].includes(params?.LOCALE) ? params.LOCALE : "de";
}

const LOCAL_TEMPLATES = {
  1: {
    subject: (locale) => SUBJECTS.confirm[locale],
    render: (p, locale) =>
      renderConfirmEmail({
        name: p.NAME,
        confirmUrl: p.CONFIRM_URL,
        locale,
      }),
  },
  2: {
    subject: (locale) => SUBJECTS.reminder[locale],
    render: (p, locale) =>
      renderConfirmEmail({
        name: p.NAME,
        confirmUrl: p.CONFIRM_URL,
        locale,
      }),
  },
  5: {
    subject: (locale) => SUBJECTS.welcome[locale],
    render: (p, locale) =>
      renderWelcomeEmail({
        name: p.NAME,
        siteUrl: p.SITE_URL,
        unsubUrl: p.UNSUB_URL,
        locale,
      }),
  },
};

export async function sendTemplateEmail({ to, templateId, params }) {
  const tpl = LOCAL_TEMPLATES[templateId];
  if (!tpl) {
    console.error("Unknown local email template:", templateId);
    return { success: false, error: "Unbekannte Template-ID" };
  }
  const p = params || {};
  const locale = localeOf(p);
  return sendEmail({
    from: DEFAULT_SENDER,
    to,
    subject: tpl.subject(locale),
    html: tpl.render(p, locale),
    tags: [`lobbium-template-${templateId}`, `locale-${locale}`],
  });
}

function normalizeRecipients(to) {
  const values = Array.isArray(to) ? to : [to];
  return values
    .map((recipient) =>
      typeof recipient === "string" ? { email: recipient.trim() } : recipient
    )
    .filter(
      (recipient) =>
        recipient &&
        typeof recipient.email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.email)
    );
}

async function readBrevoResponse(response) {
  const body = await response.text();
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    return { message: body.slice(0, 300) };
  }
}

/**
 * @param {{
 *   from?: {name?: string, email?: string},
 *   to: string | Array<string | {name?: string, email: string}>,
 *   subject: string,
 *   html: string,
 *   replyTo?: {name?: string, email: string} | null,
 *   tags?: string[],
 *   headers?: Record<string, string> | null
 * }} message
 */
export async function sendEmail({
  from = DEFAULT_SENDER,
  to,
  subject,
  html,
  replyTo = null,
  tags = [],
  headers = null,
}) {
  const recipients = normalizeRecipients(to);
  if (!recipients.length || !subject || !html) {
    return { success: false, error: "Ungueltige E-Mail-Daten" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS);

  try {
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.warn("BREVO_API_KEY is missing - email was not sent");
      return { success: false, error: "Email-Service nicht konfiguriert" };
    }

    const payload = {
      sender: {
        name: from?.name || DEFAULT_SENDER.name,
        email: from?.email || DEFAULT_SENDER.email,
      },
      to: recipients,
      subject,
      htmlContent: html,
    };

    if (replyTo?.email) payload.replyTo = replyTo;
    if (Array.isArray(tags) && tags.length) payload.tags = tags;
    if (headers && typeof headers === "object") payload.headers = headers;

    const response = await fetch(BREVO_EMAIL_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await readBrevoResponse(response);

    if (!response.ok) {
      console.error("Brevo API error:", response.status, data.code || data.message);
      return {
        success: false,
        status: response.status,
        code: data.code,
        error: data.message || "Email konnte nicht gesendet werden",
      };
    }

    return { success: true, messageId: data.messageId };
  } catch (err) {
    const timedOut = err?.name === "AbortError";
    console.error("Email send error:", timedOut ? "timeout" : err?.message);
    return {
      success: false,
      error: timedOut ? "Brevo-Zeitueberschreitung" : err?.message,
    };
  } finally {
    clearTimeout(timeout);
  }
}
