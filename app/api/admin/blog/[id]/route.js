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

// GET – einzelner Beitrag (fürs Edit-Formular)
export async function GET(request, { params }) {
  if (!validateAdminAuth(request.cookies)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", Number(params.id))
    .maybeSingle();
  if (error || !data) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  return NextResponse.json(data);
}

// PUT – Beitrag aktualisieren
export async function PUT(request, { params }) {
  if (!validateAdminAuth(request.cookies)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const b = await request.json();
    const title = (b.title || "").trim();
    if (!title) return NextResponse.json({ error: "Titel fehlt" }, { status: 400 });

    const update = {
      title,
      slug: slugify(b.slug || title),
      locale: ["de", "en", "fr"].includes(b.locale) ? b.locale : "de",
      excerpt: b.excerpt || null,
      content: b.content || "",
      category: (b.category || "familienleben").trim().toLowerCase(),
      image_url: b.image_url || null,
      published: b.published !== false,
      translation_key: b.translation_key || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .update(update)
      .eq("id", Number(params.id))
      .select()
      .single();
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

// DELETE – Beitrag löschen
export async function DELETE(request, { params }) {
  if (!validateAdminAuth(request.cookies)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { error } = await supabase.from("blog_posts").delete().eq("id", Number(params.id));
  if (error) return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
  return NextResponse.json({ success: true });
}
