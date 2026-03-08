import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const savedFiles: string[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, new Uint8Array(bytes));
    savedFiles.push(filename);
  }

  return NextResponse.json({ saved: savedFiles });
}
