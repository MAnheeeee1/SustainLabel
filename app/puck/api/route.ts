import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /puck/api — create a new page
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path, data } = await request.json();
  const slug = (path as string).replace(/^\//, "");
  const name = data?.root?.props?.title || slug;
  const content = data ?? { content: [], root: { props: { title: "" } } };

  const { error } = await supabase.from("dpp_pages").insert({
    user_id: user.id,
    slug,
    name,
    content,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Page already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ redirect: `/puck/${slug}` });
}

// PUT /puck/api — save (upsert) page content
export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path, data } = await request.json();
  const slug = (path as string).replace(/^\//, "");
  const name = data?.root?.props?.title || slug;

  const { error } = await supabase
    .from("dpp_pages")
    .upsert(
      { user_id: user.id, slug, name, content: data },
      { onConflict: "user_id,slug" },
    );

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath(`/${slug}`);
  return NextResponse.json({ ok: true });
}

// DELETE /puck/api — delete a page
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path } = await request.json();
  const slug = (path as string).replace(/^\//, "");

  const { error } = await supabase
    .from("dpp_pages")
    .delete()
    .eq("slug", slug)
    .eq("user_id", user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath(`/${slug}`);
  return NextResponse.json({ status: "deleted" });
}
