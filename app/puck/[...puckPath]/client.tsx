"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import config from "../../../puck.config";
import Image from "next/image";

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  return (
    <Puck
      config={config}
      data={data}
      overrides={{
        headerActions: ({ children }) => (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Image
                src="/sustainLabel.png"
                alt="Logo"
                width={50}
                height={10}
                style={{ objectFit: "contain" }}
              />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>
                SustainLabel Editor
              </span>
            </div>
            {children}
          </>
        ),
      }}
      onPublish={async (data) => {
        await fetch("/puck/api", {
          method: "post",
          body: JSON.stringify({ data, path }),
        });
      }}
    />
  );
}
