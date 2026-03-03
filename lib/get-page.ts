import { Data } from "@puckeditor/core";
import fs from "fs";

// Replace with call to your database
export const getPage = (path: string) => {
  const allData: Record<string, Data> | null = fs.existsSync("database.json")
    ? JSON.parse(fs.readFileSync("database.json", "utf-8"))
    : null;

  return allData ? allData[path] : null;
};
export const getAllPages = (): { path: string; title: string }[] => {
  const allData: Record<string, Data> | null = fs.existsSync("database.json")
    ? JSON.parse(fs.readFileSync("database.json", "utf-8"))
    : null;

  if (!allData) return [];

  return Object.entries(allData).map(([path, data]) => ({
    path,
    title: data.root?.props?.title || "Untitled",
  }));
};
