import { NextRequest, NextResponse } from "next/server";
import path from "path";
import Firecrawl from "@mendable/firecrawl-js";
import OpenAI, { toFile } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PARSEABLE_EXTENSIONS = [
  ".pdf",
  ".xlsx",
  ".xls",
  ".docx",
  ".doc",
  ".odt",
  ".rtf",
];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
  const openaiFileIds: string[] = [];

  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    const safeBasename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();

    if (PARSEABLE_EXTENSIONS.includes(ext)) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mimeMap: Record<string, string> = {
        ".pdf": "application/pdf",
        ".xlsx":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xls": "application/vnd.ms-excel",
        ".docx":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".doc": "application/msword",
        ".odt": "application/vnd.oasis.opendocument.text",
        ".rtf": "application/rtf",
      };
      const mimeType = mimeMap[ext] ?? "application/octet-stream";

      let uploadBuffer: Buffer;
      let uploadFilename: string;

      try {
        // Parse with Firecrawl and upload the resulting markdown to OpenAI
        const dataUri = `data:${mimeType};base64,${base64}`;
        const result = await firecrawl.scrape(dataUri, {
          formats: ["markdown"],
          ...(ext === ".pdf"
            ? { parsers: [{ type: "pdf" as const, mode: "auto" as const }] }
            : {}),
        });
        const markdown = (result as any)?.markdown ?? "";
        uploadBuffer = Buffer.from(markdown, "utf-8");
        uploadFilename = `${timestamp}-${safeBasename}.md`;
        console.log(
          `[upload] parsed ${file.name} → markdown (${markdown.length} chars)`,
        );
      } catch (err) {
        // Fallback: upload the raw file bytes if Firecrawl fails
        console.warn(
          `[upload] Firecrawl parsing failed for ${file.name}, uploading raw:`,
          err,
        );
        uploadBuffer = Buffer.from(bytes);
        uploadFilename = `${timestamp}-${safeBasename}`;
      }

      const uploadable = await toFile(uploadBuffer, uploadFilename, {
        type: "text/plain",
      });
      const created = await openai.files.create({
        file: uploadable,
        purpose: "assistants",
      });
      openaiFileIds.push(created.id);
    } else {
      // Plain text / CSV — upload directly to OpenAI
      const bytes = await file.arrayBuffer();
      const uploadable = await toFile(
        Buffer.from(bytes),
        `${timestamp}-${safeBasename}`,
      );
      const created = await openai.files.create({
        file: uploadable,
        purpose: "assistants",
      });
      openaiFileIds.push(created.id);
    }
  }

  return NextResponse.json({ openaiFileIds });
}
