import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// Supabase Client
const supabase = getSupabase();

// -----------------------------
// Daily Shuffle (Rotation)
// -----------------------------
function dailyShuffle(array) {
  const today = new Date().toISOString().slice(0, 10);
  const seed = Number(today.split("-").join(""));
  return [...array].sort((a, b) => ((a.id * seed) % 7) - ((b.id * seed) % 7));
}

// -----------------------------
// GET – Partner abrufen (40+ optimiert, schneller!)
// -----------------------------
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    // Kategorie normalisieren (trimmt u. a. \n aus fehlerhaften DB-Slugs)
    const normalize = (v) => (v || "").trim().toLowerCase();

    // Immer alle laden und robust in JS filtern, damit Whitespace/Newlines
    // in den gespeicherten Kategorie-Werten den Abgleich nicht brechen.
    const { data, error } = await supabase
      .from("affiliates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET Error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    let affiliates = data || [];

    // Kategorie-Filter (normalisierter Vergleich)
    if (category && normalize(category) !== "all") {
      const wanted = normalize(category);
      affiliates = affiliates.filter((a) => normalize(a.category) === wanted);
    }

    // Tägliche Rotation
    affiliates = dailyShuffle(affiliates);

    // Limit anwenden — 40 wird sauber unterstützt
    if (limit > 0) affiliates = affiliates.slice(0, limit);

    return NextResponse.json(affiliates);

  } catch (err) {
    console.error("GET /affiliates ERROR:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// -----------------------------
// POST – Neuer Partner
// -----------------------------
export async function POST(request) {
  try {
    const auth = request.headers.get("authorization");
    if (auth !== "lobbiumAdminAuth:true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, imageUrl, link, description } = body;

    if (!title || !link) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("affiliates")
      .insert({
        title,
        category: category?.toLowerCase(),
        imageUrl,
        link,
        description,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase POST Error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error("POST /affiliates ERROR:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// -----------------------------
// DELETE – Partner löschen
// -----------------------------
export async function DELETE(request) {
  try {
    const auth = request.headers.get("authorization");
    if (auth !== "lobbiumAdminAuth:true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Fehlende ID" }, { status: 400 });
    }

    const { error } = await supabase
      .from("affiliates")
      .delete()
      .eq("id", Number(id));

    if (error) {
      console.error("Supabase DELETE Error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DELETE /affiliates ERROR:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}