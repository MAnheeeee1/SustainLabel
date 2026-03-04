import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "database.json");

function getDatabase(): Record<string, any> {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function setDatabase(data: Record<string, any>) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// GET a specific page by ?path=/some-path
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pagePath = searchParams.get("path");

  if (!pagePath) {
    return NextResponse.json(getDatabase());
  }

  const db = getDatabase();
  return NextResponse.json(db[pagePath] ?? null);
}

// POST to create a new page
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { path: pagePath, data } = body;

  if (!pagePath) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  const db = getDatabase();

  if (db[pagePath]) {
    return NextResponse.json({ error: "Page already exists" }, { status: 409 });
  }

  db[pagePath] = data;
  setDatabase(db);

  return NextResponse.json({ ok: true, path: pagePath }, { status: 201 });
}

// PUT to update an existing page
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { path: pagePath, data } = body;

  if (!pagePath) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  const db = getDatabase();
  db[pagePath] = data;
  setDatabase(db);

  return NextResponse.json({ ok: true });
}
