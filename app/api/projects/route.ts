import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type Project = {
  id: string;
  name: string;
  vectorStoreId: string | null;
  createdAt: string;
};

// GET /api/projects — list all projects for the current user
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, vector_store_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const projects: Project[] = (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    vectorStoreId: r.vector_store_id,
    createdAt: r.created_at,
  }));

  return NextResponse.json({ projects });
}

// POST /api/projects — create a new project
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, vectorStoreId = null } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: name.trim(),
      vector_store_id: vectorStoreId,
    })
    .select("id, name, vector_store_id, created_at")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const project: Project = {
    id: data.id,
    name: data.name,
    vectorStoreId: data.vector_store_id,
    createdAt: data.created_at,
  };

  return NextResponse.json(project, { status: 201 });
}
