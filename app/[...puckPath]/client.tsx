"use client";

import type { Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core";
import config from "../../puck.config";
import { normalizePuckData } from "@/lib/puck-normalize";

export function Client({ data }: { data: Data }) {
  return <Render config={config} data={normalizePuckData(data)} />;
}
