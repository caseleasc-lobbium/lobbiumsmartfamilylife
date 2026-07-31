import Link from "next/link";
import SectionHero from "../../components/SectionHero";
import { getSupabase } from "@/lib/supabase";
import { generateMetadata as buildMeta } from "../../lib/seo";

export const revalidate = 120; // ISR: alle 2 Min neu, sonst vom Cache

export const metadata = buildMeta({
  title: "Ratgeber & Tipps",
  description:
    "Spartipps, Familienleben, Kinder & Bildung und Lifestyle – der Lobbium-Ratgeber für einen cleveren, modernen Familienalltag.",
  path: "/blog",
});

const CATEGORY_LABEL = {
  "finanzen-spartipps": "💰 Finanzen & Spartipps",
  familienleben: "🌳 Familienleben",
  "kinder-bildung": "🎓 Kinder & Bildung",
  lifestyle: "✨ Lifestyle",
};

function img(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `/${url}`;
}

export default async function BlogPage() {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug,title,excerpt,category,image_url,created_at")
    .eq("published", true)
    .eq("locale", "de")
    .order("created_at", { ascending: false });

  const posts = data || [];

  return (
    <div className="flex flex-col items-center w-full">
      <SectionHero
        title="Ratgeber & Tipps"
        subtitle="Clever sparen, den Familienalltag organisieren und Kinder spielerisch fördern – praxiserprobt und verständlich."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-6 pb-24">
        {posts.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            Bald geht's los – die ersten Ratgeber sind in Arbeit.
          </p>
        )}
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group bg-white rounded-3xl border border-gray-100 shadow hover:shadow-xl transition-all overflow-hidden flex flex-col"
          >
            {img(p.image_url) ? (
              <img
                src={img(p.image_url)}
                alt={p.title}
                loading="lazy"
                decoding="async"
                className="w-full h-44 object-cover bg-gray-50"
              />
            ) : (
              <div className="w-full h-44 bg-gray-100" />
            )}
            <div className="p-6 flex flex-col gap-2">
              <span className="text-xs font-medium text-blue-600">
                {CATEGORY_LABEL[p.category] || "Ratgeber"}
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
