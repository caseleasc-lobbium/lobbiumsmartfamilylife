"use client";

import SectionHero from "../../components/SectionHero";
import NewsletterSignup from "../../components/NewsletterSignup";
import { useI18n } from "../../components/i18n/LanguageProvider";

const STR = {
  de: {
    title: "Der Familien-Spar-Brief",
    subtitle: "Einmal pro Woche das Beste für Familien – kompakt, ehrlich, in 2 Minuten gelesen. Kostenlos.",
    getTitle: "Das bekommst du jede Woche",
    items: [
      { e: "🏷️", t: "Die besten Familien-Deals", d: "Handverlesene Angebote, die sich wirklich lohnen – kein Werbe-Wust." },
      { e: "💡", t: "1 konkreter Spartipp", d: "Umsetzbar im Alltag – vom Haushaltsbudget bis zum günstigen Familienurlaub." },
      { e: "🧮", t: "1 nützliches Tool oder Ratgeber", d: "Rechner, Checkliste oder Ratgeber – passend zur Woche." },
    ],
    whyTitle: "Warum es sich lohnt",
    why: ["Kompakt: in 2 Minuten gelesen, kein Blabla.", "Ehrlich: wir empfehlen nur, was wir selbst nutzen würden.", "Sicher: Double-Opt-in, DSGVO-konform, jederzeit abbestellbar."],
  },
  en: {
    title: "The Family Savings Letter",
    subtitle: "Once a week, the best for families – compact, honest, read in 2 minutes. Free.",
    getTitle: "What you get every week",
    items: [
      { e: "🏷️", t: "The best family deals", d: "Hand-picked offers that are truly worth it – no ad clutter." },
      { e: "💡", t: "1 concrete saving tip", d: "Doable in daily life – from the household budget to cheap family holidays." },
      { e: "🧮", t: "1 useful tool or guide", d: "A calculator, checklist or guide – matching the week." },
    ],
    whyTitle: "Why it's worth it",
    why: ["Compact: read in 2 minutes, no waffle.", "Honest: we only recommend what we'd use ourselves.", "Safe: double opt-in, GDPR-compliant, unsubscribe anytime."],
  },
  fr: {
    title: "La Lettre d'économies famille",
    subtitle: "Une fois par semaine, le meilleur pour les familles – concis, honnête, lu en 2 minutes. Gratuit.",
    getTitle: "Ce que vous recevez chaque semaine",
    items: [
      { e: "🏷️", t: "Les meilleures offres famille", d: "Des offres sélectionnées qui valent vraiment le coup – sans surcharge pub." },
      { e: "💡", t: "1 astuce d'économie concrète", d: "Applicable au quotidien – du budget aux vacances pas chères." },
      { e: "🧮", t: "1 outil ou guide utile", d: "Un calculateur, une checklist ou un guide – adapté à la semaine." },
    ],
    whyTitle: "Pourquoi ça vaut le coup",
    why: ["Concis : lu en 2 minutes, sans blabla.", "Honnête : nous ne recommandons que ce que nous utiliserions.", "Sûr : double opt-in, conforme RGPD, désinscription à tout moment."],
  },
};

export default function NewsletterPage() {
  const { locale } = useI18n();
  const s = STR[locale] || STR.de;

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title={s.title} subtitle={s.subtitle} />

      <section className="w-full max-w-4xl px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-xl font-bold text-[#0F1C3F] mb-4">{s.getTitle}</h2>
            <div className="space-y-4">
              {s.items.map((it, i) => (
                <div key={i} className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <span className="text-3xl">{it.e}</span>
                  <div>
                    <h3 className="font-semibold text-[#0F1C3F]">{it.t}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{it.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-[#0F1C3F] mt-8 mb-3">{s.whyTitle}</h2>
            <ul className="space-y-2">
              {s.why.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-emerald-600 mt-0.5">✓</span>{w}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:sticky lg:top-24">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </div>
  );
}
