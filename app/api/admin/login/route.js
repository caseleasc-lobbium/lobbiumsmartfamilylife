import { cookies } from "next/headers";

export async function POST(req) {
  const { password } = await req.json();

  // 🔐 Einfaches Test-Passwort
  if (password === "admin123") {
    cookies().set("admin_session", "active", {
      path: "/",
      maxAge: 60 * 60, // 1 Stunde
    });
    return Response.json({ success: true });
  }

  return Response.json({ success: false }, { status: 401 });
}