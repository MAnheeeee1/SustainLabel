import { Data } from "@puckeditor/core";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";

// Fetch a single DPP page by its URL path (e.g. "/my-product")
// Public: uses the anon key; RLS allows SELECT for everyone.
export const getPage = async (path: string): Promise<Data | null> => {
  const slug = path.replace(/^\//, "");
  const supabase = await createClient();
  const { data } = await supabase
    .from("dpp_pages")
    .select("content")
    .eq("slug", slug)
    .single();
  return (data?.content as Data) ?? null;
};

// Fetch all pages (used by sitemap / static generation)
export const getAllPages = async (): Promise<
  { path: string; title: string }[]
> => {
  const supabase = await createClient();
  const { data } = await supabase.from("dpp_pages").select("slug, content");
  if (!data) return [];
  return data.map((row) => ({
    path: `/${row.slug}`,
    title: (row.content as Data)?.root?.props?.title || "Untitled",
  }));
};

// Fetch the DPP template from the local JSON file (unchanged)
export const getTemplatePage = () => {
  const allData: Record<string, Data> | null = fs.existsSync("dpptemplate.json")
    ? JSON.parse(fs.readFileSync("dpptemplate.json", "utf-8"))
    : null;

  return allData ? allData["template"] : null;
};
