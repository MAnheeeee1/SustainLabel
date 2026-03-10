import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── RAG queries scoped to interpretable text fields only ──────────
const RAG_QUERIES = [
  "reparation underhåll tvättråd skötsel service livslängd",
  "återvinning återbruk cirkulär avfall end-of-life material",
  "miljöpåverkan energi vatten kemikalier tillverkning process hållbarhet",
  "socialt ansvar arbetsförhållanden leverantör certifiering fabrik ursprungsland etik",
];

/** Search one query with retry for index readiness */
async function searchWithRetry(
  vectorStoreId: string,
  query: string,
  maxAttempts = 3,
) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await openai.vectorStores.search(vectorStoreId, {
      query,
      max_num_results: 5,
    });
    if (res.data.length > 0) return res.data;
    await new Promise((r) => setTimeout(r, 3000));
  }
  return [];
}

/** Extract text from search results, deduplicate by content */
function extractUniqueChunks(
  allResults: { content: Array<{ type: string; text?: string }> }[][],
): string[] {
  const seen = new Set<string>();
  const chunks: string[] = [];
  for (const results of allResults) {
    for (const r of results) {
      for (const c of r.content) {
        if (c.type === "text" && c.text) {
          const key = c.text.slice(0, 200);
          if (!seen.has(key)) {
            seen.add(key);
            chunks.push(c.text);
          }
        }
      }
    }
  }
  return chunks;
}

/**
 * Track 1 — Responses API
 * Passes raw files directly to the model (no chunking).
 * Best for structured/tabular data: numbers, IDs, material lists.
 */
async function extractStructuredViaResponsesAPI(
  fileIds: string[],
): Promise<Record<string, unknown>> {
  try {
    const fileInputs = fileIds.map((id) => ({
      type: "input_file" as const,
      file_id: id,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (openai as any).responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "user",
          content: [
            ...fileInputs,
            {
              type: "input_text",
              text: `Du är en specialist på att extrahera strukturerad data ur produktdokument och tabeller.

Extrahera följande fält och returnera ett rent JSON-objekt (utan markdown, inga kodblock):
- productName (string): Produktnamn
- articleNumber (string): Artikelnummer eller produkt-ID
- totalTransportKm (number): Total transportsträcka i km. Summera etapper om total saknas.
- totalCO2Kg (number): Totalt CO2-utsläpp i kg. Om ett per-enhet-värde ges (t.ex. "0.17 kg CO2 per plagg"), använd det direkt. Summera delvärden om total saknas.
- totalComponents (number): Totalt antal delar, komponenter eller unika material.
- materials (array): Lista med objekt { "name": string, "percentage": number|null, "origin": string|null }.

REGLER:
- Läs tabeller och listor noggrant — värden sitter ofta i tabellceller.
- Beräkna/summera om explicit totalvärde saknas. Sätt null om inget finns.
- Returnera BARA ett rent JSON-objekt på toppnivå. Ingen markdown, inga extra nycklar.`,
            },
          ],
        },
      ],
    });

    // Support both output_text getter and manual traversal
    let text = "";
    if (typeof response.output_text === "string") {
      text = response.output_text;
    } else if (Array.isArray(response.output)) {
      for (const item of response.output as Array<{
        type: string;
        content?: Array<{ type: string; text?: string }>;
      }>) {
        if (item.type === "message" && Array.isArray(item.content)) {
          for (const c of item.content) {
            if (c.type === "output_text" && c.text) {
              text = c.text;
              break;
            }
          }
        }
        if (text) break;
      }
    }

    console.log(
      "[classify:structured] responses API output:",
      text.slice(0, 500),
    );

    const cleaned = text
      .replace(/^```(?:json)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn(
        "[classify:structured] no JSON found in responses API output",
      );
      return {};
    }
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("[classify:structured] responses API failed, skipping:", err);
    return {};
  }
}

/**
 * Track 2 — RAG
 * Multi-query vector search for interpretable text fields.
 * Best for prose/insights: repair, recycling, environment, social.
 */
async function extractTextViaRAG(
  vectorStoreId: string,
): Promise<Record<string, unknown>> {
  const searchResults = await Promise.all(
    RAG_QUERIES.map((q) => searchWithRetry(vectorStoreId, q)),
  );
  const uniqueChunks = extractUniqueChunks(searchResults);
  const rawContext = uniqueChunks.join("\n\n");

  console.log(
    "[classify:text] unique chunks:",
    uniqueChunks.length,
    "| context length:",
    rawContext.length,
  );

  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Du är en assistent som skapar digitala produktpass (DPP) på svenska.
Du får rådata och ska returnera ett JSON-objekt med EXAKT dessa fyra fält:
- repairAndMaintenance: Beskriv hur produkten kan repareras och underhållas baserat på material och konstruktion.
- recyclingPotential: Bedöm återvinningspotential baserat på materialsammansättningen.
- environmentalImpact: Sammanfatta miljöpåverkan baserat på transporter, material och processer.
- socialResponsibility: Sammanfatta socialt ansvar baserat på leverantörer, ursprungsland och certifieringar.

REGLER:
- Basera ALLTID på information som faktiskt finns i datan.
- Uppfinn ALDRIG information.
- Om datan är helt tyst om ett ämne — sätt null.
- Svara på svenska, 2–4 meningar per fält.
- Returnera PLATT JSON med dessa fyra fält direkt på toppnivå.`,
      },
      {
        role: "user",
        content: rawContext || "Ingen data hittades.",
      },
    ],
  });

  return JSON.parse(completion.choices[0].message.content ?? "{}");
}

export async function POST(req: NextRequest) {
  const { vectorStoreId, fileIds } = await req.json();
  const hasFileIds = Array.isArray(fileIds) && fileIds.length > 0;

  console.log(
    "[classify] vectorStoreId:",
    vectorStoreId,
    "| fileIds:",
    hasFileIds ? fileIds.length : 0,
  );

  // Run both tracks in parallel
  const [structuredResult, textResult] = await Promise.all([
    hasFileIds
      ? extractStructuredViaResponsesAPI(fileIds)
      : Promise.resolve({}),
    extractTextViaRAG(vectorStoreId),
  ]);

  // Merge: Responses API for structured fields, RAG for text fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = structuredResult as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = textResult as any;
  const result = {
    productName: (s.productName as string | null) ?? null,
    articleNumber: (s.articleNumber as string | null) ?? null,
    totalTransportKm: (s.totalTransportKm as number | null) ?? null,
    totalCO2Kg: (s.totalCO2Kg as number | null) ?? null,
    totalComponents: (s.totalComponents as number | null) ?? null,
    materials: (s.materials as unknown[] | null) ?? null,
    repairAndMaintenance: (t.repairAndMaintenance as string | null) ?? null,
    recyclingPotential: (t.recyclingPotential as string | null) ?? null,
    environmentalImpact: (t.environmentalImpact as string | null) ?? null,
    socialResponsibility: (t.socialResponsibility as string | null) ?? null,
  };

  console.log("[classify] final result:", JSON.stringify(result).slice(0, 500));

  return NextResponse.json({ vectorStoreId, result });
}
