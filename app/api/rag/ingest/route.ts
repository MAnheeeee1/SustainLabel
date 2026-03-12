import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { openaiFileIds, vectorStoreId: existingStoreId } = await req.json();

  if (!openaiFileIds || openaiFileIds.length === 0) {
    return NextResponse.json(
      { error: "openaiFileIds array is required" },
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

  // Add already-uploaded OpenAI files to the vector store
  for (const fileId of openaiFileIds) {
    await openai.vectorStores.files.create(vectorStoreId, {
      file_id: fileId,
    });
  }

  // Poll the vector store object until file_counts shows all files processed
  let ready = false;
  for (let i = 0; i < 60; i++) {
    const store = await openai.vectorStores.retrieve(vectorStoreId);
    const counts = store.file_counts;
    console.log(
      `[ingest] poll ${i}: in_progress=${counts.in_progress}, completed=${counts.completed}, failed=${counts.failed}, total=${counts.total}`,
    );
    if (counts.in_progress === 0 && counts.total > 0) {
      ready = counts.completed > 0;
      break;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Extra settle time — indexing can lag behind file_counts
  if (ready) {
    console.log("[ingest] files processed, waiting 5s for index to settle...");
    await new Promise((r) => setTimeout(r, 5000));
  }

  return NextResponse.json({ vectorStoreId, fileIds: openaiFileIds, ready });
}
