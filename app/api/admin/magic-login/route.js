import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { sendEmail } from "@/lib/email";

// Token-Speicher
const TOKENS_FILE = path.join(process.cwd(), "data", "magic_tokens.json");

function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveToken(email, token) {
  ensureDataDir();
  
  let tokens = {};
  if (fs.existsSync(TOKENS_FILE)) {
    tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8"));
  }
  
  tokens[token] = {
    email,
    createdAt: Date.now(),
    expiresAt: Date.now() + (15 * 60 * 1000),
  };
  
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Nur Admin Email
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@lobbium.com";
    
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Diese E-Mail ist nicht berechtigt." },
        { status: 401 }
      );
    }

    // Token generieren
    const token = crypto.randomBytes(32).toString("hex");
    saveToken(email, token);

    // Magic Link URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/admin/verify?token=${token}`;

    // Email via Brevo
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 40px 30px; border-radius: 0 0 12px 12px; }
          .button { display: inline-block; background: #667eea; color: white !important; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🔐 Admin Login</h1>
            <p style="margin: 10px 0 0 0;">Lobbium Smart Family Life</p>
          </div>
          <div class="content">
            <h2>Hallo Admin!</h2>
            <p>Klicken Sie auf den Button um sich einzuloggen:</p>
            <div style="text-align: center;">
              <a href="${magicLink}" class="button">Jetzt einloggen</a>
            </div>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              Link ist 15 Minuten gültig.<br>
              Falls der Button nicht funktioniert: ${magicLink}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      from: { name: "Lobbium Admin", email: "info@lobbium.com" },
      to: email,
      subject: "🔐 Ihr Magic Link für Lobbium Admin",
      html: htmlContent
    });

    console.log("✅ Magic Link gesendet an:", email);
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("❌ Magic Link Error:", err);
    return NextResponse.json(
      { error: "Serverfehler" },
      { status: 500 }
    );
  }
}
