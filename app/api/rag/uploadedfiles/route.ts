import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { vectorStoreId } = await req.json();

  if (!vectorStoreId) {
    return NextResponse.json(
      { error: "vectorStoreId is required" },
      { status: 400 },
    );
  }

  const files = await openai.vectorStores.files.list(vectorStoreId);

  // Fetch the filename for each file from the Files API
  const filesWithNames = await Promise.all(
    files.data.map(async (f) => {
      const meta = await openai.files.retrieve(f.id);
      return {
        id: f.id,
        filename: meta.filename,
        status: f.status,
        createdAt: f.created_at,
      };
    }),
  );

  return NextResponse.json({ files: filesWithNames });
}
