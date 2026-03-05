"use client";

import Link from "next/link";
import QRCodeDisplay from "./ui/qr-code";
import type { Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core";
import config from "../puck.config";
import {
  MoreHorizontal,
  CheckCircle2,
  GitBranch,
  Pencil,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";

interface DppCardProps {
  path: string;
  data: Data;
}

export function CardSmall({ path, data }: DppCardProps) {
  const title = data.root?.props?.title || path.replace(/^\//, "") || "Home";
  const displayUrl = `sustain-label.vercel.app${path}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const downloadQR = async () => {
    const url = await QRCode.toDataURL(`${baseUrl}/${path}`);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${path}-qr.png`;
    link.click();
  };

  return (
    <div className="w-full rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Top row: icon + info + actions */}
      <div className="flex items-start gap-4 p-5 pb-0">
        {/* Thumbnail / icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted text-xs font-bold uppercase text-muted-foreground">
          DPP
        </div>

        {/* Title + URL */}
        <div className="min-w-0 flex-1">
          <Link
            href={path}
            className="truncate text-base font-semibold hover:underline"
          >
            {title}
          </Link>
          <p className="truncate text-sm text-muted-foreground">{displayUrl}</p>
        </div>

        {/* Status + menu */}
        <div className="flex shrink-0 items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/puck${path}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Preview window */}
      <div className="mx-5 mt-4 overflow-hidden rounded-lg border">
        <div
          className="relative bg-white"
          style={{ height: "10rem", overflow: "hidden", contain: "strict" }}
        >
          <div
            className="pointer-events-none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transformOrigin: "top left",
              transform: "scale(0.25)",
              width: "400%",
              height: "400%",
            }}
          >
            <Render config={config} data={data} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 mt-4 border-t" />

      {/* Bottom row: meta info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 p-5 pt-4 text-sm text-muted-foreground">
        <Link
          href={`${path}/edit`}
          className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-0.5 text-xs font-medium hover:bg-muted"
        >
          <Pencil className="h-3 w-3" />
          Redigera
        </Link>
        <Link
          href={`${path}`}
          className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-0.5 text-xs font-medium hover:bg-muted"
        >
          <Eye className="h-3 w-3" />
          Visa
        </Link>
        <Link
          href={`#`}
          onClick={downloadQR}
          className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-0.5 text-xs font-medium hover:bg-muted"
        >
          Hämta Qr-Kod
        </Link>
      </div>
    </div>
  );
}
