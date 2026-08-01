"use client";

import { useState } from "react";
import { useI18n } from "./i18n/LanguageProvider";
import { IconMail } from "./UiIcons";

const STR = {
  de: {
    heading: "Der Lobbium Familien-Spar-Brief",
    sub: "Jede Woche kompakt: die besten Familien-Deals, 1 Spartipp und 1 Tool – in 2 Minuten gelesen.",
    placeholder: "Deine E-Mail-Adresse",
    consent: "Ich möchte den Newsletter erhalten und akzeptiere die Datenschutzerklärung.",
    button: "Kostenlos abonnieren",
    sending: "Wird gesendet…",
    needEmail: "Bitte gib deine E-Mail-Adresse ein.",
    needConsent: "Bitte bestätige die Datenschutzerklärung.",
    err: "Etwas ist schiefgelaufen. Bitte später erneut versuchen.",
    net: "Netzwerkfehler. Bitte später erneut versuchen.",
    already: "Diese E-Mail ist bereits angemeldet. 🎉",
    successT: "Fast geschafft!",
    successD: "Danke! Wir haben dir eine Bestätigungs-E-Mail geschickt – bitte klicke darin auf den Bestätigungslink.",
    successS: "Keine Mail? Bitte auch im Spam-Ordner nachsehen.",
    trust: "Kostenlos · jederzeit abbestellbar · kein Spam",
  },
  en: {
    heading: "The Lobbium Family Savings Letter",
    sub: "Every week, compact: the best family deals, 1 saving tip and 1 tool – read in 2 minutes.",
    placeholder: "Your email address",
    consent: "I'd like to receive the newsletter and accept the privacy policy.",
    button: "Subscribe for free",
    sending: "Sending…",
    needEmail: "Please enter your email address.",
    needConsent: "Please accept the privacy policy.",
    err: "Something went wrong. Please try again later.",
    net: "Network error. Please try again later.",
    already: "This email is already subscribed. 🎉",
    successT: "Almost there!",
    successD: "Thanks! We've sent you a confirmation email – please click „Confirm“ in it.",
    successS: "No email? Please also check your spam folder.",
    trust: "Free · unsubscribe anytime · no spam",
  },
  fr: {
    heading: "La Lettre d'économies famille de Lobbium",
    sub: "Chaque semaine, en bref : les meilleures offres famille, 1 astuce et 1 outil – lu en 2 minutes.",
    placeholder: "Votre adresse e-mail",
    consent: "Je souhaite recevoir la newsletter et j'accepte la politique de confidentialité.",
    button: "S'abonner gratuitement",
    sending: "Envoi…",
    needEmail: "Veuillez saisir votre adresse e-mail.",
    needConsent: "Veuillez accepter la politique de confidentialité.",
    err: "Une erreur est survenue. Réessayez plus tard.",
    net: "Erreur réseau. Réessayez plus tard.",
    already: "Cet e-mail est déjà inscrit. 🎉",
    successT: "Presque terminé !",
    successD: "Merci ! Nous vous avons envoyé un e-mail de confirmation – cliquez sur « Confirmer ».",
    successS: "Pas d'e-mail ? Vérifiez aussi vos spams.",
    trust: "Gratuit · désinscription à tout moment · sans spam",
  },
};

export default function NewsletterSignup({ heading, sub, compact = false }) {
  const { locale } = useI18n();
  const s = STR[locale] || STR.de;
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!email) return setMsg(s.needEmail);
    if (!consent) return setMsg(s.needConsent);
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "", locale }),
      });
      const d = await res.json();
      if (d.code === "already_subscribed") setMsg(s.already);
      else if (!res.ok || d.error) setMsg(s.err);
      else { setOk(true); setEmail(""); setConsent(false); }
    } catch {
      setMsg(s.net);
    }
    setLoading(false);
  };

  if (ok) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="text-lg font-bold text-emerald-700">{s.successT}</h3>
        <p className="mt-1 text-gray-700 text-sm">{s.successD}</p>
        <p className="mt-2 text-gray-500 text-xs">{s.successS}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl border border-gray-100 shadow ${compact ? "p-6" : "p-7"}`}>
      <div className="flex items-start gap-3">
        <IconMail size={46} />
        <div>
          <h3 className="text-lg font-bold text-[#0F1C3F]">{heading || s.heading}</h3>
          <p className="mt-1 text-sm text-gray-500">{sub || s.sub}</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={s.placeholder}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="flex items-start gap-2 text-xs text-gray-500">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
          <span>{s.consent}</span>
        </label>
        {msg && <p className="text-sm text-red-600">{msg}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
          {loading ? s.sending : s.button}
        </button>
        <p className="text-center text-[11px] text-gray-400">{s.trust}</p>
      </form>
    </div>
  );
}
