# 🚀 Deployment Guide

## Environment Variables Setup

⚠️ **WICHTIG**: Verwenden Sie Ihre eigenen Werte aus `.env.local`

### 📋 Erforderliche Variables für Vercel

Kopieren Sie die Werte aus Ihrer lokalen `.env.local` Datei:

#### 1. Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=<aus .env.local kopieren>
SUPABASE_SERVICE_ROLE_KEY=<aus .env.local kopieren>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<aus .env.local kopieren>
SUPABASE_URL=<aus .env.local kopieren>
DATABASE_URL=<aus .env.local kopieren>
```

#### 2. Email Service (Brevo - ERFORDERLICH)
```bash
BREVO_API_KEY=<aus .env.local kopieren>
```

**Wo finden Sie den Key:**
- Brevo Dashboard → SMTP & API → API Keys
- **Wichtig:** Dieser Key wird für ALLE Emails verwendet:
  - Contact Form
  - Newsletter
  - Magic Link Login

#### 3. Admin Configuration
```bash
ADMIN_EMAIL=<aus .env.local kopieren>
ADMIN_PASSWORD=<aus .env.local kopieren>
CONTACT_RECEIVER=<aus .env.local kopieren>
EMAIL_TO=<aus .env.local kopieren>
ENCRYPTION_KEY=<aus .env.local kopieren>
```

#### 4. Site URLs
```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

---

## 🔐 Sicherheitshinweise

1. ❌ **NIEMALS** echte API Keys in Git committen
2. ✅ Verwenden Sie `.env.example` als Template
3. ✅ Alle Secrets nur in Vercel Environment Variables
4. ✅ `.env.local` ist in `.gitignore` und wird nie committed

---

## 📝 Deployment Schritte

### In Vercel Dashboard:

1. Gehen Sie zu: https://vercel.com/dashboard
2. Wählen Sie Ihr Projekt
3. **Settings** → **Environment Variables**
4. Fügen Sie alle Variables aus `.env.local` hinzu
5. Klicken Sie **Save**
6. **Deployments** → **Redeploy**

---

## ✅ Post-Deployment Checklist

- [ ] Alle ENV Variables gesetzt
- [ ] Build erfolgreich
- [ ] Magic Link testen
- [ ] Admin Login testen
- [ ] Security Headers prüfen
- [ ] SSL Certificate aktiv

---

## 🔧 Wo finden Sie die Werte?

### Supabase Keys:
- Dashboard → Settings → API
- Service Role Key (secret)
- Anon Key (public)

### Brevo API Key:
- Dashboard → SMTP & API → API Keys

### Encryption Key generieren:
```bash
openssl rand -base64 32
```

---

## 📚 Weitere Dokumentation

- `SECURITY.md` - Sicherheitsmaßnahmen
- `.env.example` - Template für Environment Variables
- `README.md` - Projekt-Dokumentation
