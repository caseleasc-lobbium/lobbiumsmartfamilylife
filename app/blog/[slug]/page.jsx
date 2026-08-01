import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { generateMetadata as buildMeta } from "../../../lib/seo";
import NewsletterSignup from "../../../components/NewsletterSignup";

export const revalidate = 120;

const BASE = "https://www.lobbium.com";
const LOCALE_LABEL = { de: "DE", en: "EN", fr: "FR" };

async function getPost(slug) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .limit(1)
    .maybeSingle();
  return data;
}

// Sprachversionen desselben Artikels (über translation_key gruppiert)
async function getSiblings(key) {
  if (!key) return [];
  const supabase = getSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, locale")
    .eq("translation_key", key)
    .eq("published", true);
  return data || [];
}

function img(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `/${url}`;
}

const COVER_CATS = new Set(["finanzen-spartipps", "familienleben", "kinder-bildung", "lifestyle"]);
function coverFor(category) {
  return `/blog/cover-${COVER_CATS.has(category) ? category : "familienleben"}.svg`;
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return buildMeta({ title: "Artikel nicht gefunden", path: `/blog/${params.slug}` });

  const siblings = await getSiblings(post.translation_key);
  let languages;
  if (siblings.length > 1) {
    languages = {};
    for (const s of siblings) languages[s.locale] = `${BASE}/blog/${s.slug}`;
    const de = siblings.find((s) => s.locale === "de");
    if (de) languages["x-default"] = `${BASE}/blog/${de.slug}`;
  }

  return buildMeta({
    title: post.title,
    description: post.excerpt || undefined,
    path: `/blog/${post.slug}`,
    locale: post.locale,
    languages,
  });
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const siblings = await getSiblings(post.translation_key);
  const order = ["de", "en", "fr"];
  const langs = siblings
    .filter((s) => LOCALE_LABEL[s.locale])
    .sort((a, b) => order.indexOf(a.locale) - order.indexOf(b.locale));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    image: img(post.image_url) ? `${BASE}${img(post.image_url)}` : undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    inLanguage: post.locale || "de-DE",
    author: { "@type": "Organization", name: "Lobbium – Smart Family Life" },
    publisher: {
      "@type": "Organization",
      name: "Lobbium – Smart Family Life",
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png` },
    },
    mainEntityOfPage: `${BASE}/blog/${post.slug}`,
  };

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center justify-between gap-4">
        <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-800">
          ← Zurück zum Ratgeber
        </Link>

        {langs.length > 1 && (
          <div className="flex items-center gap-1 text-sm">
            {langs.map((s) => (
              <Link
                key={s.locale}
                href={`/blog/${s.slug}`}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  s.locale === post.locale
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {LOCALE_LABEL[s.locale]}
              </Link>
            ))}
          </div>
        )}
      </div>

      <h1 className="mt-4 text-3xl md:text-4xl font-bold text-[#0F1C3F] leading-tight text-balance">
        {post.title}
      </h1>

      {post.excerpt && <p className="mt-3 text-lg text-gray-500">{post.excerpt}</p>}

      <img
        src={img(post.image_url) || coverFor(post.category)}
        alt={post.title}
        className="mt-6 w-full h-64 object-cover rounded-2xl bg-gray-50"
      />

      <div className="blog-content mt-8" dangerouslySetInnerHTML={{ __html: post.content || "" }} />

      {/* Newsletter-Anmeldung am Artikelende */}
      <div className="mt-12">
        <NewsletterSignup />
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <Link
          href="/blog"
          className="inline-block px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Mehr Ratgeber lesen
        </Link>
      </div>
    </article>
  );
}
