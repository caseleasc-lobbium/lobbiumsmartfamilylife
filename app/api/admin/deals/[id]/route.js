import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateAdminAuth } from "@/lib/security";

export const dynamic = "force-dynamic";
const supabase = getSupabase();

export async function GET(request, { params }) {
  if (!validateAdminAuth(request.cookies)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("deals").select("*").eq("id", Number(params.id)).maybeSingle();
  if (error || !data) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(request, { params }) {
  if (!validateAdminAuth(request.cookies)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await request.json();
    if (!(b.title || "").trim()) return NextResponse.json({ error: "Titel fehlt" }, { status: 400 });
    const update = {
      title: b.title.trim(),
      description: b.description || null,
      hook: b.hook || null,
      partner: b.partner || null,
      affiliate_id: b.affiliate_id ? Number(b.affiliate_id) : null,
      url: (b.url || "").trim(),
      category: (b.category || "familienleben").trim().toLowerCase(),
      image_url: b.image_url || null,
      valid_until: b.valid_until || null,
      published: b.published !== false,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("deals").update(update).eq("id", Number(params.id)).select().single();
    if (error) return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!validateAdminAuth(request.cookies)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { error } = await supabase.from("deals").delete().eq("id", Number(params.id));
  if (error) return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
  return NextResponse.json({ success: true });
}
