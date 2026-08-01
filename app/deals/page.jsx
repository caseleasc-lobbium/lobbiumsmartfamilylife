import { cookies } from "next/headers";
import SectionHero from "../../components/SectionHero";
import { getSupabase } from "@/lib/supabase";
import { generateMetadata as buildMeta } from "../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMeta({
  title: "Deal-Radar – Angebote für Familien",
  description:
    "Handverlesene Angebote, Deals und Empfehlungen für Familien – Reise, Sparen, Kinder & Lifestyle. Regelmäßig aktualisiert.",
  path: "/deals",
});

const STR = {
  de: { title: "Deal-Radar", subtitle: "Handverlesene Angebote & Empfehlungen für Familien – regelmäßig aktualisiert.", cta: "Zum Angebot →", empty: "Bald geht's los – die ersten Deals sind in Arbeit.", until: "gültig bis" },
  en: { title: "Deal Radar", subtitle: "Hand-picked offers & recommendations for families – updated regularly.", cta: "View offer →", empty: "Coming soon – the first deals are in the works.", until: "valid until" },
  fr: { title: "Radar des offres", subtitle: "Offres et recommandations sélectionnées pour les familles – mises à jour régulièrement.", cta: "Voir l'offre →", empty: "Bientôt disponible – les premières offres arrivent.", until: "valable jusqu'au" },
};
const CAT = {
  de: { "finanzen-spartipps": "💰 Sparen", familienleben: "🌳 Familie", "kinder-bildung": "🎓 Kinder", lifestyle: "✨ Lifestyle" },
  en: { "finanzen-spartipps": "💰 Savings", familienleben: "🌳 Family", "kinder-bildung": "🎓 Kids", lifestyle: "✨ Lifestyle" },
  fr: { "finanzen-spartipps": "💰 Économies", familienleben: "🌳 Famille", "kinder-bildung": "🎓 Enfants", lifestyle: "✨ Lifestyle" },
};

const img = (u) => (!u ? "/partner-placeholder.svg" : u.startsWith("http") ? u : `/${u}`);

export default async function DealsPage() {
  const supabase = getSupabase();
  const loc = cookies().get("lobbium_locale")?.value;
  const s = STR[["de", "en", "fr"].includes(loc) ? loc : "de"] || STR.de;
  const cat = CAT[["de", "en", "fr"].includes(loc) ? loc : "de"] || CAT.de;
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabase
    .from("deals")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  const deals = (data || []).filter((d) => !d.valid_until || d.valid_until >= today);

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title={s.title} subtitle={s.subtitle} />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-6 pb-24">
        {deals.length === 0 && <p className="col-span-full text-center text-gray-500">{s.empty}</p>}
        {deals.map((d) => (
          <a
            key={d.id}
            href={d.url || "#"}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group bg-white rounded-3xl border border-gray-100 shadow hover:shadow-xl transition-all overflow-hidden flex flex-col"
          >
            <div className="relative h-40 bg-white flex items-center justify-center p-6 border-b border-gray-50">
              <img src={img(d.image_url)} alt={d.partner || d.title} loading="lazy" decoding="async" className="max-h-24 max-w-[70%] object-contain" />
              {d.hook && (
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{d.hook}</span>
              )}
            </div>
            <div className="p-5 flex flex-col gap-2 flex-1">
              {d.category && <span className="text-xs font-medium text-blue-600">{cat[d.category] || ""}</span>}
              <h2 className="text-base font-semibold text-[#0F1C3F] group-hover:text-blue-700 transition leading-snug">{d.title}</h2>
              <p className="text-gray-500 text-sm line-clamp-3 flex-1">{d.description}</p>
              {d.valid_until && <p className="text-[11px] text-gray-400">{s.until} {d.valid_until}</p>}
              <span className="mt-1 inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">{s.cta}</span>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}
