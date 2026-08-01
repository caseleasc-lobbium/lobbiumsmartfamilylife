import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateAdminAuth } from "@/lib/security";

export const dynamic = "force-dynamic";
const supabase = getSupabase();

export async function GET(request) {
  if (!validateAdminAuth(request.cookies)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase
    .from("deals")
    .select("id, title, partner, category, hook, valid_until, published, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  if (!validateAdminAuth(request.cookies)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await request.json();
    if (!(b.title || "").trim()) return NextResponse.json({ error: "Titel fehlt" }, { status: 400 });
    if (!(b.url || "").trim()) return NextResponse.json({ error: "Link (URL) fehlt" }, { status: 400 });
    const row = {
      title: b.title.trim(),
      description: b.description || null,
      hook: b.hook || null,
      partner: b.partner || null,
      affiliate_id: b.affiliate_id ? Number(b.affiliate_id) : null,
      url: b.url.trim(),
      category: (b.category || "familienleben").trim().toLowerCase(),
      image_url: b.image_url || null,
      valid_until: b.valid_until || null,
      published: b.published !== false,
    };
    const { data, error } = await supabase.from("deals").insert(row).select().single();
    if (error) return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
