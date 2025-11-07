// scripts/postinstall.js
const { execSync } = require("child_process");

try {
  console.log("🔄 Running Prisma generate...");
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("✅ Prisma Client successfully generated for Vercel build.");
} catch (error) {
  console.error("❌ Prisma Client generation failed:", error);
  process.exit(1);
}