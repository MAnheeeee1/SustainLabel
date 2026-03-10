import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import OpenAI, { toFile } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { filenames, vectorStoreId: existingStoreId } = await req.json();

  if (!filenames || filenames.length === 0) {
    return NextResponse.json(
      { error: "filenames array is required" },
      { status: 400 },
    );
  }

  // Skapa vector store om ingen finns
  let vectorStoreId = existingStoreId;
  if (!vectorStoreId) {
    const store = await openai.vectorStores.create({
      name: `dpp-store-${Date.now()}`,
    });
    vectorStoreId = store.id;
  }

  const uploadsDir = path.join(process.cwd(), "uploads");
  const uploadedFileIds: string[] = [];

  for (const filename of filenames) {
    if (filename.includes("/") || filename.includes("..")) {
      return NextResponse.json(
        { error: `Invalid filename: ${filename}` },
        { status: 400 },
      );
    }
    const buffer = await readFile(path.join(uploadsDir, filename));
    const uploadable = await toFile(buffer, filename);
    const createdFile = await openai.files.create({
      file: uploadable,
      purpose: "assistants",
    });
    await openai.vectorStores.files.create(vectorStoreId, {
      file_id: createdFile.id,
    });
    uploadedFileIds.push(createdFile.id);
  }

  // Poll until all files are processed before returning
  let ready = false;
  for (let i = 0; i < 30; i++) {
    const fileList = await openai.vectorStores.files.list(vectorStoreId);
    const allDone = fileList.data.every(
      (f) => f.status === "completed" || f.status === "failed",
    );
    if (allDone) {
      ready = true;
      break;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  return NextResponse.json({ vectorStoreId, fileIds: uploadedFileIds, ready });
}
