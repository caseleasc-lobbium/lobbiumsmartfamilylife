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
    { path: "/tools", priority: 0.8, changeFrequency: "weekly" },
    { path: "/tools/kindergeld-checker", priority: 0.8, changeFrequency: "monthly" },
    { path: "/tools/familienbudget", priority: 0.7, changeFrequency: "monthly" },
    { path: "/tools/was-kostet-ein-kind", priority: 0.7, changeFrequency: "monthly" },
    { path: "/tools/taschengeld", priority: 0.7, changeFrequency: "monthly" },
    { path: "/tools/spartyp-test", priority: 0.7, changeFrequency: "monthly" },
    { path: "/tools/druckvorlagen", priority: 0.7, changeFrequency: "monthly" },
    { path: "/tools/druckvorlagen/haushaltsbudget", priority: 0.6, changeFrequency: "monthly" },
    { path: "/tools/druckvorlagen/wochenplan", priority: 0.6, changeFrequency: "monthly" },
    { path: "/tools/druckvorlagen/packliste", priority: 0.6, changeFrequency: "monthly" },
    { path: "/tools/druckvorlagen/sparziel", priority: 0.6, changeFrequency: "monthly" },
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
