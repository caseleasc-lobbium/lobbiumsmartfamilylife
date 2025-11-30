import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { rateLimit, getClientIp, isValidEmail, SECURITY_HEADERS } from "@/lib/security";

// Token-Speicher (einfaches File-System)
const TOKENS_FILE = path.join(process.cwd(), "data", "magic_tokens.json");

// Sicherstellen dass data Ordner existiert
function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Token speichern
function saveToken(email, token) {
  ensureDataDir();
  
  let tokens = {};
  if (fs.existsSync(TOKENS_FILE)) {
    tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8"));
  }
  
  tokens[token] = {
    email,
    createdAt: Date.now(),
    expiresAt: Date.now() + (15 * 60 * 1000), // 15 Minuten gültig
  };
  
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

export async function POST(req) {
  try {
    // 🛡️ Rate Limiting: Max 3 Magic Links pro Stunde
    const clientIp = getClientIp(req);
    const rateLimitResult = rateLimit(`magic-link:${clientIp}`, 3, 3600000);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: `Zu viele Anfragen. Bitte warten Sie ${Math.ceil(rateLimitResult.retryAfter / 60)} Minuten.` },
        { status: 429, headers: SECURITY_HEADERS }
      );
    }

    const { email } = await req.json();

    // Email Validierung
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "E-Mail fehlt" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Ungültige E-Mail-Adresse" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // Nur Admin E-Mail zulassen (aus ENV für Flexibilität)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@lobbium.com";
    
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Diese E-Mail ist nicht berechtigt." },
        { status: 401, headers: SECURITY_HEADERS }
      );
    }

    // Sicheren Token generieren
    const token = crypto.randomBytes(32).toString("hex");
    
    // Token speichern
    saveToken(email, token);

    // Magic Link URL erstellen
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/admin/verify?token=${token}`;

    // Email HTML Content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 40px 30px; border-radius: 0 0 12px 12px; }
          .button { display: inline-block; background: #667eea; color: white !important; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #5568d3; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🛡 Admin Login</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Lobbium Smart Family Life</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-top: 0;">Hallo Admin!</h2>
            <p style="font-size: 16px; color: #4b5563;">
              Sie haben einen Magic Link zum Einloggen in das Admin-Dashboard angefordert.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" class="button">
                🔓 Jetzt einloggen
              </a>
            </div>

            <div class="warning">
              <strong>⏱ Wichtig:</strong> Dieser Link ist nur <strong>15 Minuten</strong> gültig und kann nur einmal verwendet werden.
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              Falls der Button nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:
            </p>
            <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background: #fff; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb;">
              ${magicLink}
            </p>
          </div>
          <div class="footer">
            <p>Sie haben diese Email nicht angefordert? Bitte ignorieren Sie sie.</p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} Lobbium Smart Family Life</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Brevo API Key laden
    const brevoApiKey = process.env.BREVO_API_KEY;
    
    if (!brevoApiKey) {
      console.error("❌ BREVO_API_KEY nicht gefunden in ENV!");
      return NextResponse.json(
        { error: "Brevo API Key fehlt - bitte in .env.local konfigurieren" },
        { status: 500 }
      );
    }

    console.log("✅ Brevo API Key gefunden, sende Email...");

    // Email via Brevo API senden
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Lobbium Admin",
          email: "info@lobbium.com"
        },
        to: [
          {
            email: email,
            name: "Admin"
          }
        ],
        subject: "🔐 Ihr Magic Link für Lobbium Admin",
        htmlContent: htmlContent
      })
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json();
      console.error("❌ Brevo API Error:", errorData);
      return NextResponse.json(
        { error: "Fehler beim Senden der E-Mail via Brevo" },
        { status: 500 }
      );
    }

    const brevoData = await brevoResponse.json();
    console.log("✅ Magic Link gesendet via Brevo an:", email);
    console.log("📧 Brevo Message ID:", brevoData.messageId);
    
    return NextResponse.json({ 
      success: true,
      message: "Magic Link wurde an Ihre E-Mail gesendet" 
    });

  } catch (err) {
    console.error("❌ Magic Link Error:", err);
    return NextResponse.json(
      { error: "Serverfehler beim Senden des Magic Links" },
      { status: 500 }
    );
  }
}
