import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, vectorStoreId } = await req.json();
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (vectorStoreId !== undefined) updates.vector_store_id = vectorStoreId;

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id, name, vector_store_id, created_at")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const project: Project = {
    id: data.id,
    name: data.name,
    vectorStoreId: data.vector_store_id,
    createdAt: data.created_at,
  };

  return NextResponse.json(project);
}

// DELETE /api/projects/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id, name, vector_store_id, created_at")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  return NextResponse.json({ id: data.id, name: data.name });
}
