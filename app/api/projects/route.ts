import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const DB = path.join(process.cwd(), "projects.json");

async function readProjects() {
  const raw = await readFile(DB, "utf-8");
  return JSON.parse(raw) as { projects: Project[] };
}

async function writeProjects(data: { projects: Project[] }) {
  await writeFile(DB, JSON.stringify(data, null, 2), "utf-8");
}

export type Project = {
  id: string;
  name: string;
  vectorStoreId: string | null;
  createdAt: string;
};

// GET /api/projects — list all projects
export async function GET() {
  const data = await readProjects();
  return NextResponse.json(data);
}

// POST /api/projects — create a new project
// Body: { name: string, vectorStoreId?: string }
export async function POST(req: NextRequest) {
  const { name, vectorStoreId = null } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const data = await readProjects();
  const project: Project = {
    id: `proj_${Date.now()}`,
    name: name.trim(),
    vectorStoreId,
    createdAt: new Date().toISOString(),
  };

  data.projects.push(project);
  await writeProjects(data);

  return NextResponse.json(project, { status: 201 });
}
