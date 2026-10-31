import { redirect } from "next/navigation";

export default function AuthorLayout() {
  redirect("/admin/blog");
}
