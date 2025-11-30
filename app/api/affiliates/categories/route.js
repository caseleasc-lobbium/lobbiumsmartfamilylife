import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const supabase = getSupabase();

// --------------------------------------------------
// GET – Alle Kategorien laden
// --------------------------------------------------
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("affiliate_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("GET categories error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET categories error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// --------------------------------------------------
// POST – Kategorie hinzufügen
// --------------------------------------------------
export async function POST(request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Name fehlt" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/ /g, "-");

    const { data, error } = await supabase
      .from("affiliate_categories")
      .insert({ name, slug })
      .select()
      .single();

    if (error) {
      console.error("POST categories error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST categories error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// --------------------------------------------------
// DELETE – Kategorie löschen
// --------------------------------------------------
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID fehlt" }, { status: 400 });
    }

    const { error } = await supabase
      .from("affiliate_categories")
      .delete()
      .eq("id", Number(id));

    if (error) {
      console.error("DELETE categories error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE categories error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}