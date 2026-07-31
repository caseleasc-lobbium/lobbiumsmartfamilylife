// Brevo Email Service Client
// Verwendet Brevo API für alle Email-Versendungen

// Versand über ein in Brevo gepflegtes Template (mit Merge-Params).
// Der Absender kommt aus dem Template selbst (verifiziert).
export async function sendTemplateEmail({ to, templateId, params }) {
  try {
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.warn("⚠️ BREVO_API_KEY nicht gesetzt - Email wird nicht gesendet");
      return { success: false, error: "Email-Service nicht konfiguriert" };
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        to: Array.isArray(to) ? to.map((email) => ({ email })) : [{ email: to }],
        templateId,
        params: params || {},
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Brevo Template Error:", errorData);
      return { success: false, error: errorData.message || "Template-Versand fehlgeschlagen" };
    }

    const data = await response.json();
    console.log("✅ Template-Email gesendet, Message ID:", data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (err) {
    console.error("❌ Template Email Error:", err);
    return { success: false, error: err.message };
  }
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
