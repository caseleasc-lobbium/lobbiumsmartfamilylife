import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateAdminAuth } from "@/lib/security";

export const dynamic = "force-dynamic";

const supabase = getSupabase();

const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// GET – alle Beiträge (Admin-Übersicht)
export async function GET(request) {
  if (!validateAdminAuth(request.cookies)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, locale, title, category, published, updated_at, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
  return NextResponse.json(data || []);
}

// POST – neuen Beitrag anlegen
export async function POST(request) {
  if (!validateAdminAuth(request.cookies)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const b = await request.json();
    const title = (b.title || "").trim();
    if (!title) return NextResponse.json({ error: "Titel fehlt" }, { status: 400 });

    const locale = ["de", "en", "fr"].includes(b.locale) ? b.locale : "de";
    const slug = slugify(b.slug || title);
    if (!slug) return NextResponse.json({ error: "Slug ungültig" }, { status: 400 });

    const row = {
      title,
      slug,
      locale,
      excerpt: b.excerpt || null,
      content: b.content || "",
      category: (b.category || "familienleben").trim().toLowerCase(),
      image_url: b.image_url || null,
      published: b.published !== false,
      translation_key: b.translation_key || null,
    };

    const { data, error } = await supabase.from("blog_posts").insert(row).select().single();
    if (error) {
      if (error.code === "23505")
        return NextResponse.json({ error: "Slug + Sprache existiert bereits" }, { status: 409 });
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
