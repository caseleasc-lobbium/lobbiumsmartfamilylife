import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data_settings.json");

function readSettings() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(
        filePath,
        JSON.stringify(
          {
            siteName: "",
            siteDescription: "",
            contactEmail: ""
          },
          null,
          2
        )
      );
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function writeSettings(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const settings = readSettings();
  return NextResponse.json(settings);
}

export async function POST(req) {
  const auth = req.headers.get("authorization");

  if (auth !== "lobbiumAdminAuth:true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  writeSettings(data);

  return NextResponse.json({ success: true });
}