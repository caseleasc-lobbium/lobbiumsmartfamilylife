import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🔐 Admin Auth
function isAuthorized(request) {
  return request.headers.get("authorization") === "lobbiumAdminAuth:true";
}

// --------------------------------------------------
// GET – Einzelnen Partner abrufen
// --------------------------------------------------
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("affiliates")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Partner nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /affiliates/[id] ERROR:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// --------------------------------------------------
// PUT – Partner bearbeiten
// --------------------------------------------------
export async function PUT(request, { params }) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const { title, category, imageUrl, link, description } = body;

    const { data, error } = await supabase
      .from("affiliates")
      .update({
        title,
        category,
        imageUrl,
        link,
        description,
      })
      .eq("id", Number(id))
      .select()
      .single();

    if (error) {
      console.error("Supabase UPDATE ERROR:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("PUT /affiliates/[id] ERROR:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// --------------------------------------------------
// DELETE – Partner löschen
// --------------------------------------------------
export async function DELETE(request, { params }) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const { error } = await supabase
      .from("affiliates")
      .delete()
      .eq("id", Number(id));

    if (error) {
      console.error("Supabase DELETE ERROR:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /affiliates/[id] ERROR:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}