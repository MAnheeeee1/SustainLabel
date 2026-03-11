import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function freshId(type: string): string {
  return `${type}-${randomUUID()}`;
}

function formatMaterials(
  materials:
    | { name?: string; percentage?: number | null; origin?: string | null }[]
    | null,
): string {
  if (!materials || materials.length === 0) return "";
  return materials
    .map((m) => {
      const parts = [m.name];
      if (m.percentage != null) parts.push(`${m.percentage}%`);
      if (m.origin) parts.push(`(${m.origin})`);
      return parts.filter(Boolean).join(" ");
    })
    .join(", ");
}

export async function POST(req: NextRequest) {
  const { projectName, result } = await req.json();

  if (!projectName || !result) {
    return NextResponse.json(
      { error: "projectName and result are required" },
      { status: 400 },
    );
  }

  // Load template and database
  const templatePath = path.join(process.cwd(), "dpptemplate.json");
  const dbPath = path.join(process.cwd(), "database.json");

  const template = JSON.parse(await readFile(templatePath, "utf-8"));
  const db = JSON.parse(await readFile(dbPath, "utf-8").catch(() => "{}"));

  // Deep-clone the template page data
  const pageData = JSON.parse(JSON.stringify(template["/template"]));

  const materialsText = formatMaterials(result.materials);

  // Map classified fields into template placeholders and regenerate IDs
  for (const component of pageData.content) {
    const p = component.props;

    // Regenerate component ID
    if (p.id) {
      const type = p.id.split("-")[0];
      p.id = freshId(type);
    }

    switch (component.type) {
      case "Heading":
        if (p.title === "[HEADER-TITEL]")
          p.title = result.productName ?? projectName;
        break;

      case "HeroSection":
        if (p.altText === "[ALT-TEXT]")
          p.altText = result.productName ?? projectName;
        if (p.articleNumber === "[ART-NUMMBER]")
          p.articleNumber = result.articleNumber ?? "";
        break;

      case "KeyMetric":
        if (Array.isArray(p.listofFacts)) {
          p.listofFacts = p.listofFacts.map(
            (fact: { keyFact: string; value: string }) => {
              if (fact.keyFact === "[TOTAL-TRANSPORT-STÄCKA]")
                return {
                  ...fact,
                  keyFact:
                    result.totalTransportKm != null
                      ? `${result.totalTransportKm} km`
                      : "—",
                };
              if (fact.keyFact === "[TOTAL-CO2-UTSLÄPP]")
                return {
                  ...fact,
                  keyFact:
                    result.totalCO2Kg != null ? `${result.totalCO2Kg} kg` : "—",
                };
              if (fact.keyFact === "[TOTAL-ANTAL-DELAR]")
                return {
                  ...fact,
                  keyFact:
                    result.totalComponents != null
                      ? `${result.totalComponents}`
                      : "—",
                };
              return fact;
            },
          );
        }
        break;

      case "ExpandableCard":
        if (Array.isArray(p.items)) {
          p.items = p.items.map(
            (item: { title: string; content: string; links?: unknown[] }) => {
              if (item.content === "[REPERATION-UNDERHÅLL-ÅTERBRUK-INFO]")
                return { ...item, content: result.repairAndMaintenance ?? "" };
              if (item.content === "[MATERIAL-TILLVERKNING-INFO]")
                return { ...item, content: materialsText };
              if (item.content === "[POTENTIAL-FÖR-ÅTERVINNING-INFO]")
                return { ...item, content: result.recyclingPotential ?? "" };
              if (item.content === "[MILJÖPÅVERKAN-INFO]")
                return { ...item, content: result.environmentalImpact ?? "" };
              if (item.content === "[SOCIALT-ANSVAR-INFO]")
                return { ...item, content: result.socialResponsibility ?? "" };
              return item;
            },
          );
        }
        break;
    }
  }

  // Build slug and page path
  const slug = slugify(projectName);
  const pagePath = `/${slug}`;

  // Save to database (overwrite if exists)
  db[pagePath] = pageData;
  await writeFile(dbPath, JSON.stringify(db, null, 2), "utf-8");

  return NextResponse.json({ path: pagePath, editPath: `/puck${pagePath}` });
}
