import { cookies } from "next/headers";

export async function GET() {
  const session = cookies().get("admin_session");
  const authorized = session?.value === "active";
  return Response.json({ authorized });
}