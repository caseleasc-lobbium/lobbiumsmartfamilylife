import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // ✅ Konsistenten Admin-Cookie löschen
    cookies().delete("lobbium_admin_auth");
    
    // Supabase Session-Cookies löschen (falls Magic Link verwendet wurde)
    const res = NextResponse.json({ success: true });
    res.cookies.set("sb-access-token", "", { maxAge: 0 });
    res.cookies.set("sb-refresh-token", "", { maxAge: 0 });

    return res;
  } catch (err) {
    console.error("❌ Logout Error:", err);
    return NextResponse.json(
      { success: false, error: "Logout Fehler" },
      { status: 500 }
    );
  }
}