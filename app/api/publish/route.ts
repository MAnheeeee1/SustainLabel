import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { normalizePuckData } from "@/lib/puck-normalize";

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectName, result } = await req.json();

  if (!projectName || !result) {
    return NextResponse.json(
      { error: "projectName and result are required" },
      { status: 400 },
    );
  }

  // Load template from local JSON file
  const templatePath = path.join(process.cwd(), "dpptemplate.json");
  const template = JSON.parse(await readFile(templatePath, "utf-8"));

  // Deep-clone the template page data
  const pageData = normalizePuckData(
    JSON.parse(JSON.stringify(template["/template"])),
  );

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
        if (Array.isArray(p.listOfFacts)) {
          p.listOfFacts = p.listOfFacts.map(
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

  // Upsert into Supabase
  const { error } = await supabase.from("dpp_pages").upsert(
    {
      user_id: user.id,
      slug,
      name: result.productName ?? projectName,
      content: pageData,
    },
    { onConflict: "user_id,slug" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath(pagePath);
  return NextResponse.json({ path: pagePath, editPath: `/puck${pagePath}` });
}
