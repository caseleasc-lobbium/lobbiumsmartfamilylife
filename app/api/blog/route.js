import { promises as fs } from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "data", "blog_posts");

export async function GET() {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const posts = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(path.join(BLOG_DIR, file), "utf-8");
        return JSON.parse(content);
      })
    );
    return new Response(JSON.stringify(posts.reverse()), { status: 200 });
  } catch {
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
