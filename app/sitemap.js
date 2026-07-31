import { getSupabase } from "@/lib/supabase";

export const revalidate = 3600; // stündlich neu

const BASE = "https://www.lobbium.com";

export default async function sitemap() {
  const staticPaths = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/finanzen-spartipps", priority: 0.9, changeFrequency: "daily" },
    { path: "/familienleben", priority: 0.8, changeFrequency: "daily" },
    { path: "/kinder-bildung", priority: 0.8, changeFrequency: "daily" },
    { path: "/lifestyle", priority: 0.7, changeFrequency: "daily" },
    { path: "/blog", priority: 0.8, changeFrequency: "daily" },
    { path: "/newsletter", priority: 0.5, changeFrequency: "monthly" },
    { path: "/kontakt", priority: 0.4, changeFrequency: "monthly" },
    { path: "/impressum", priority: 0.3, changeFrequency: "yearly" },
    { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" },
  ].map((p) => ({
    url: `${BASE}${p.path}`,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  let posts = [];
  try {
    const { data } = await getSupabase()
      .from("blog_posts")
      .select("slug, updated_at, created_at")
      .eq("published", true);
    posts = (data || []).map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updated_at || p.created_at || undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // Sitemap darf nie crashen
  }

  return [...staticPaths, ...posts];
}
