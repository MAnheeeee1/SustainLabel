import fs from "fs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { path, data } = await request.json();
  const db = JSON.parse(fs.readFileSync("database.json", "utf-8") || "{}");

  if (db[path]) {
    return NextResponse.json({ error: "Page already exists" }, { status: 409 });
  }

  db[path] = data || { content: [], root: { props: { title: "" } } };
  fs.writeFileSync("database.json", JSON.stringify(db));

  return NextResponse.json({ redirect: `/puck${path}` });
}

export async function PUT(request: Request) {
  const { path, data } = await request.json();
  const db = JSON.parse(fs.readFileSync("database.json", "utf-8") || "{}");

  db[path] = data;
  fs.writeFileSync("database.json", JSON.stringify(db, null, 2));
  revalidatePath(path);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { path } = await request.json();
  const db = JSON.parse(fs.readFileSync("database.json", "utf-8") || "{}");

  delete db[path];
  fs.writeFileSync("database.json", JSON.stringify(db));
  revalidatePath(path);

  return NextResponse.json({ status: "deleted" });
}
