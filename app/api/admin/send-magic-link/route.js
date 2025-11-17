import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { email } = await req.json();

  // Nur Admin E-Mail zulassen
  if (email !== "info@lobbium.com") {
    return NextResponse.json(
      { error: "Diese E-Mail ist nicht berechtigt." },
      { status: 401 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "https://lobbium.com/admin",
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}