import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  const db: Record<string, unknown> = fs.existsSync("database.json")
    ? JSON.parse(fs.readFileSync("database.json", "utf-8"))
    : {};
  const pages = Object.entries(db).map(([path, data]) => ({ path, data }));
  return NextResponse.json(pages);
}
