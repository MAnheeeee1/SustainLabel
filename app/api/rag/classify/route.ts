import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import OpenAI, { toFile } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { vectorStoreId } = await req.json();

  const userQuery = `Hämta följande produktinformation:
  - Produktnamn och artikelnummer
  - Total transportsträcka (km)
  - Total CO2-utsläpp (kg)
  - Totalt antal delar/komponenter
  - Material och tillverkning (tyg, fyllning, ursprungsland)
  - Reparation, underhåll och återbruk
  - Potential för återvinning
  - Miljöpåverkan
  - Socialt ansvar (arbetsförhållanden, leverantörskedja)
  VIKTIGT: SVARET SKA VAR FORMATERADE SOM EN JSON OBJEKT MED PRODUKTINFORMAION SOM NYCKEL
`;

  console.log("[classify] vectorStoreId received:", vectorStoreId);

  // Retry search up to 5 times if the index isn't ready yet
  let results;
  for (let attempt = 0; attempt < 5; attempt++) {
    results = await openai.vectorStores.search(vectorStoreId, {
      query: userQuery,
    });
    console.log(
      `[classify] attempt ${attempt}: search results count: ${results.data.length}`,
    );
    if (results.data.length > 0) break;
    console.log("[classify] no results yet, waiting 3s before retry...");
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log("[classify] final search results count:", results!.data.length);

  // Concatenate the raw text chunks from the vector store results
  const rawContext = results!.data
    .flatMap((r) => r.content)
    .filter((c) => c.type === "text")
    .map((c) => (c as { type: "text"; text: string }).text)
    .join("\n\n");

  console.log("[classify] rawContext length:", rawContext.length);
  console.log("[classify] rawContext preview:", rawContext.slice(0, 500));

  // Use a chat completion to extract structured JSON from the raw chunks
  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Du är en assistent som skapar digitala produktpass (DPP) på svenska.
Du får rådata om en produkt och ska returnera ett JSON-objekt.

FÄLT SOM KRÄVER EXAKT EXTRAKTION — skriv aldrig egna värden, sätt null om det saknas:
- productName
- articleNumber  
- totalTransportKm (number)
- totalCO2Kg (number)
- totalComponents (number)
- materials (array)

FÄLT SOM FÅR TOLKAS OCH SAMMANFATTAS utifrån datan — du får dra rimliga slutsatser 
från material, leverantörer, certifieringar, processer och företagsinformation som finns i datan:
- repairAndMaintenance: Beskriv hur produkten kan repareras och underhållas baserat på material och konstruktion
- recyclingPotential: Bedöm återvinningspotential baserat på materialsammansättningen i datan
- environmentalImpact: Sammanfatta miljöpåverkan baserat på transporter, material och processer i datan
- socialResponsibility: Sammanfatta socialt ansvar baserat på leverantörer, ursprungsland och certifieringar i datan

REGLER FÖR TOLKNINGSFÄLTEN:
- Basera ALLTID på information som faktiskt finns i datan
- Uppfinn ALDRIG information som inte kan härledas från datan
- Om datan är helt tyst om ett ämne — sätt null
- Svara på svenska
- Håll varje fält till 2–4 meningar

VIKTIGT: Returnera ett PLATT JSON-objekt med fältnamnen direkt på toppnivå. Wrappa INTE i en extra nyckel som "result" eller "data".`,
      },
      {
        role: "user",
        content: `Extrahera och tolka produktinformation från följande rådata och returnera ett JSON-objekt enligt instruktionerna:

${rawContext}`,
      },
    ],
  });

  let structured = JSON.parse(completion.choices[0].message.content ?? "{}");

  // If the model wrapped the result in an extra key, unwrap it
  const keys = Object.keys(structured);
  if (
    keys.length === 1 &&
    typeof structured[keys[0]] === "object" &&
    !Array.isArray(structured[keys[0]])
  ) {
    console.log("[classify] unwrapping nested key:", keys[0]);
    structured = structured[keys[0]];
  }

  console.log("[classify] structured response keys:", Object.keys(structured));
  console.log(
    "[classify] structured response:",
    JSON.stringify(structured).slice(0, 500),
  );

  return NextResponse.json({ vectorStoreId, result: structured });
}
