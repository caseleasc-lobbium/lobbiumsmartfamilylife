import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { generateMetadata as buildMeta } from "../../../lib/seo";

export const revalidate = 120;

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

function img(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `/${url}`;
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return buildMeta({ title: "Artikel nicht gefunden", path: `/blog/${params.slug}` });
  return buildMeta({
    title: post.title,
    description: post.excerpt || undefined,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    image: img(post.image_url)
      ? `https://www.lobbium.com${img(post.image_url)}`
      : undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    inLanguage: post.locale || "de-DE",
    author: { "@type": "Organization", name: "Lobbium – Smart Family Life" },
    publisher: {
      "@type": "Organization",
      name: "Lobbium – Smart Family Life",
      logo: {
        "@type": "ImageObject",
        url: "https://www.lobbium.com/logo.png",
      },
    },
    mainEntityOfPage: `https://www.lobbium.com/blog/${post.slug}`,
  };

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-800">
        ← Zurück zum Ratgeber
      </Link>

      <h1 className="mt-4 text-3xl md:text-4xl font-bold text-[#0F1C3F] leading-tight text-balance">
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="mt-3 text-lg text-gray-500">{post.excerpt}</p>
      )}

      {img(post.image_url) && (
        <img
          src={img(post.image_url)}
          alt={post.title}
          className="mt-6 w-full h-64 object-cover rounded-2xl bg-gray-50"
        />
      )}

      <div
        className="blog-content mt-8"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />

      <div className="mt-12 pt-6 border-t border-gray-100">
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
