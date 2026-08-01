// Brevo Email Service Client
// Verwendet Brevo API für alle Email-Versendungen

import { renderConfirmEmail, renderWelcomeEmail } from "@/lib/emailTemplates";

// Marken-Mails werden LOKAL gerendert und als rohes HTML gesendet.
// (Brevos gespeicherte HTML-Templates warfen beim Rendern einen 'date'-Fehler
//  und wurden nicht zugestellt – rohes htmlContent stellt zuverlässig zu.)
const LOCAL_TEMPLATES = {
  1: {
    subject: "Bitte bestätige deine Anmeldung bei Lobbium ✅",
    render: (p) => renderConfirmEmail({ name: p.NAME, confirmUrl: p.CONFIRM_URL }),
  },
  5: {
    subject: "Willkommen bei Lobbium – dein Familien-Spar-Brief startet ✨",
    render: (p) => renderWelcomeEmail({ name: p.NAME, siteUrl: p.SITE_URL, unsubUrl: p.UNSUB_URL }),
  },
};

// Versand einer Marken-Mail. templateId wählt Betreff + HTML-Renderer (lokal).
// Signatur bleibt kompatibel zu bestehenden Aufrufstellen (params wie zuvor).
export async function sendTemplateEmail({ to, templateId, params }) {
  const tpl = LOCAL_TEMPLATES[templateId];
  if (!tpl) {
    console.error("❌ Unbekannte templateId:", templateId);
    return { success: false, error: "Unbekannte Template-ID" };
  }
  const p = params || {};
  return sendEmail({
    from: { name: "Lobbium", email: "info@lobbium.com" },
    to,
    subject: tpl.subject,
    html: tpl.render(p),
  });
}

export async function sendEmail({ from, to, subject, html }) {
  try {
    const brevoApiKey = process.env.BREVO_API_KEY;
    
    if (!brevoApiKey) {
      console.warn("⚠️ BREVO_API_KEY nicht gesetzt - Email wird nicht gesendet");
      return { 
        success: false, 
        error: "Email-Service nicht konfiguriert" 
      };
    }

    // Brevo API Call
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: from.name || "Lobbium",
          email: from.email || "info@lobbium.com"
        },
        to: Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }],
        subject: subject,
        htmlContent: html
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Brevo API Error:", errorData);
      return { 
        success: false, 
        error: errorData.message || "Email konnte nicht gesendet werden" 
      };
    }

    const data = await response.json();
    console.log("✅ Email gesendet via Brevo, Message ID:", data.messageId);
    
    return { 
      success: true, 
      messageId: data.messageId 
    };

  } catch (err) {
    console.error("❌ Email Send Error:", err);
    return { 
      success: false, 
      error: err.message 
    };
  }
}
