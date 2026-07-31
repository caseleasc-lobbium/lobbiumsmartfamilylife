import Link from "next/link";
import { cookies } from "next/headers";
import SectionHero from "../../components/SectionHero";
import { getSupabase } from "@/lib/supabase";
import { generateMetadata as buildMeta } from "../../lib/seo";

export const dynamic = "force-dynamic"; // sprach-abhängig (Cookie)

export const metadata = buildMeta({
  title: "Ratgeber & Tipps",
  description:
    "Spartipps, Familienleben, Kinder & Bildung und Lifestyle – der Lobbium-Ratgeber für einen cleveren, modernen Familienalltag.",
  path: "/blog",
});

const HERO = {
  de: { title: "Ratgeber & Tipps", subtitle: "Clever sparen, den Familienalltag organisieren und Kinder spielerisch fördern – praxiserprobt und verständlich.", empty: "Bald geht's los – die ersten Ratgeber sind in Arbeit." },
  en: { title: "Guides & Tips", subtitle: "Save smartly, organise family life and nurture your kids playfully – practical and easy to follow.", empty: "Coming soon – the first guides are in the works." },
  fr: { title: "Conseils & Astuces", subtitle: "Économiser malin, organiser le quotidien familial et éveiller les enfants – concret et simple.", empty: "Bientôt disponible – les premiers guides arrivent." },
};

const CATEGORY_LABEL = {
  de: { "finanzen-spartipps": "💰 Finanzen & Spartipps", familienleben: "🌳 Familienleben", "kinder-bildung": "🎓 Kinder & Bildung", lifestyle: "✨ Lifestyle" },
  en: { "finanzen-spartipps": "💰 Finance & Savings", familienleben: "🌳 Family Life", "kinder-bildung": "🎓 Kids & Education", lifestyle: "✨ Lifestyle" },
  fr: { "finanzen-spartipps": "💰 Finances & Économies", familienleben: "🌳 Vie de famille", "kinder-bildung": "🎓 Enfants & Éducation", lifestyle: "✨ Lifestyle" },
};

function img(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `/${url}`;
}
const COVER_CATS = new Set(["finanzen-spartipps", "familienleben", "kinder-bildung", "lifestyle"]);
const coverFor = (category) => `/blog/cover-${COVER_CATS.has(category) ? category : "familienleben"}.svg`;

export default async function BlogPage() {
  const supabase = getSupabase();
  const locale = ["de", "en", "fr"].includes(cookies().get("lobbium_locale")?.value)
    ? cookies().get("lobbium_locale").value
    : "de";

  // Kanonische Themen-Liste = DE-Artikel
  const { data: deData } = await supabase
    .from("blog_posts")
    .select("slug,title,excerpt,category,image_url,created_at,translation_key")
    .eq("published", true)
    .eq("locale", "de")
    .order("created_at", { ascending: false });
  const dePosts = deData || [];

  // Übersetzungen der gewählten Sprache (falls nicht DE) – für Fallback-Merge
  let transByKey = {};
  if (locale !== "de") {
    const { data: tData } = await supabase
      .from("blog_posts")
      .select("slug,title,excerpt,category,image_url,translation_key")
      .eq("published", true)
      .eq("locale", locale)
      .not("translation_key", "is", null);
    for (const t of tData || []) transByKey[t.translation_key] = t;
  }

  // Merge: gewählte Sprache wo vorhanden, sonst DE
  const posts = dePosts.map((de) => {
    const key = de.translation_key || de.slug;
    const t = transByKey[key];
    return t ? { ...t, category: de.category } : de;
  });

  const hero = HERO[locale] || HERO.de;
  const catLabel = CATEGORY_LABEL[locale] || CATEGORY_LABEL.de;

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero title={hero.title} subtitle={hero.subtitle} />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-6 pb-24">
        {posts.length === 0 && (
          <p className="col-span-full text-center text-gray-500">{hero.empty}</p>
        )}
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group bg-white rounded-3xl border border-gray-100 shadow hover:shadow-xl transition-all overflow-hidden flex flex-col"
          >
            <img
              src={img(p.image_url) || coverFor(p.category)}
              alt={p.title}
              loading="lazy"
              decoding="async"
              className="w-full h-44 object-cover bg-gray-50"
            />
            <div className="p-6 flex flex-col gap-2">
              <span className="text-xs font-medium text-blue-600">
                {catLabel[p.category] || "Ratgeber"}
              </span>
              <h2 className="text-lg font-semibold text-[#0F1C3F] group-hover:text-blue-700 transition">
                {p.title}
              </h2>
              <p className="text-gray-500 text-sm line-clamp-3">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
