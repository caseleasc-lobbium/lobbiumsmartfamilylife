import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { encrypt, decrypt } from "@/lib/encryption"; 

// 🔐 Supabase Setup
const supabase = getSupabase();

// --------------------------------------------------
// POST → neuen Subscriber anlegen
// --------------------------------------------------
export async function POST(req) {
  try {
    const { name, email, consent } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-Mail ist erforderlich" },
        { status: 400 }
      );
    }

    // 🔐 Verschlüsseln
    const encryptedEmail = encrypt(email);
    const encryptedName = name ? encrypt(name) : null;

    // In Supabase speichern
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        name: encryptedName,
        email: encryptedEmail,
        consent: consent || false,
      });

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /subscribers error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// --------------------------------------------------
// GET → alle Subscriber abrufen (entschlüsselt)
// --------------------------------------------------
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Select Error:", error);
      return NextResponse.json({ error: "DB Fehler" }, { status: 500 });
    }

    // Entschlüsseln
    const decrypted = data.map((s) => ({
      ...s,
      name: s.name ? decrypt(s.name) : "",
      email: s.email ? decrypt(s.email) : "",
    }));

    return NextResponse.json(decrypted);
  } catch (err) {
    console.error("GET /subscribers error:", err);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}