import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import Firecrawl from "@mendable/firecrawl-js";

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

  const uploadsDir = path.join(process.cwd(), "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
  const savedFiles: string[] = [];

  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    const safeBasename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();

    if (PARSEABLE_EXTENSIONS.includes(ext)) {
      // Save raw file temporarily so Firecrawl can receive it as a URL
      // Firecrawl scrape() accepts a data URI for local files via base64
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

      try {
        // Firecrawl supports data URIs for document parsing
        const dataUri = `data:${mimeType};base64,${base64}`;
        const result = await firecrawl.scrape(dataUri, {
          formats: ["markdown"],
          ...(ext === ".pdf"
            ? { parsers: [{ type: "pdf" as const, mode: "auto" as const }] }
            : {}),
        });

        const markdown = (result as any)?.markdown ?? "";
        const filename = `${timestamp}-${safeBasename}.md`;
        await writeFile(path.join(uploadsDir, filename), markdown, "utf-8");
        savedFiles.push(filename);
        console.log(
          `[upload] parsed ${file.name} → ${filename} (${markdown.length} chars)`,
        );
      } catch (err) {
        // Fallback: save raw file if Firecrawl fails
        console.warn(
          `[upload] Firecrawl parsing failed for ${file.name}, saving raw:`,
          err,
        );
        const filename = `${timestamp}-${safeBasename}`;
        await writeFile(
          path.join(uploadsDir, filename),
          new Uint8Array(await file.arrayBuffer()),
        );
        savedFiles.push(filename);
      }
    } else {
      // Plain text files (.txt, .csv etc.) — save as-is
      const bytes = await file.arrayBuffer();
      const filename = `${timestamp}-${safeBasename}`;
      await writeFile(path.join(uploadsDir, filename), new Uint8Array(bytes));
      savedFiles.push(filename);
    }
  }

  return NextResponse.json({ saved: savedFiles });
}
