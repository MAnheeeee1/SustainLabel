import { NextRequest, NextResponse } from "next/server";
import Firecrawl from "@mendable/firecrawl-js";

export async function POST(req: NextRequest) {
  const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
  const body = await req.json();
  const targetUrl = body.targetUrl;

  if (!targetUrl) {
    return NextResponse.json(
      { error: "No targetUrl provided" },
      { status: 400 },
    );
  }

  const docs = await firecrawl.crawl(targetUrl, {
    limit: 20,
    includePaths: [
      "/hallbarhet",
      "/sustainability",
      "/materials",
      "/om-oss",
      "/about",
    ],
    scrapeOptions: {
      formats: ["markdown"],
    },
    excludePaths: ["/sale*", "/cart*", "/checkout*", "/account*"],
  });

  if (!docs.data || docs.data.length === 0) {
    return NextResponse.json({ error: "No pages crawled" }, { status: 500 });
  }

  const crawledText = docs.data
    .map((page: any) => page.markdown || "")
    .join("\n\n---\n\n")
    .slice(0, 15000);

  return NextResponse.json({ results: crawledText });
}
