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

  const results = await openai.vectorStores.search(vectorStoreId, {
    query: userQuery,
  });

  // Concatenate the raw text chunks from the vector store results
  const rawContext = results.data
    .flatMap((r) => r.content)
    .filter((c) => c.type === "text")
    .map((c) => (c as { type: "text"; text: string }).text)
    .join("\n\n");

  // Use a chat completion to extract structured JSON from the raw chunks
  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a product digital product pass creator. Given raw product lifecycle data, extract or analyze and return a structured JSON object with the following fields: productName, articleNumber, totalTransportKm (number), totalCO2Kg (number), totalComponents (number), materials (array of {name, type, composition, countryOfOrigin, supplier}), repairAndMaintenance (string), recyclingPotential (string), environmentalImpact (string), socialResponsibility (string). If a field cannot be determined from the data, set it to null.",
      },
      {
        role: "user",
        content: `Extract the product information from this data:\n\n${rawContext}`,
      },
    ],
  });

  const structured = JSON.parse(completion.choices[0].message.content ?? "{}");

  return NextResponse.json({ vectorStoreId, result: structured });
}
