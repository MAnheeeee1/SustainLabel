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

type Project = {
  id: string;
  name: string;
  vectorStoreId: string | null;
  createdAt: string;
};

type Params = { params: Promise<{ id: string }> };

// PATCH /api/projects/[id] — update name or vectorStoreId
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const updates = await req.json();

  const data = await readProjects();
  const idx = data.projects.findIndex((p) => p.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  data.projects[idx] = { ...data.projects[idx], ...updates, id };
  await writeProjects(data);

  return NextResponse.json(data.projects[idx]);
}

// DELETE /api/projects/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const data = await readProjects();
  const idx = data.projects.findIndex((p) => p.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const [removed] = data.projects.splice(idx, 1);
  await writeProjects(data);

  return NextResponse.json(removed);
}
