"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import config from "../../../puck.config";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { normalizePuckData } from "@/lib/puck-normalize";

export function Client({ path, data }: { path: string; data: Partial<Data> }) {
  const [open, setOpen] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const downloadQR = async () => {
    const url = await QRCode.toDataURL(`${baseUrl}/${path}`);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${path}-qr.png`;
    link.click();
  };
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
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Hurra, Din DPP-sida är publicerad! 🎉
                    </DialogTitle>
                    <DialogDescription>
                      Sidan på
                      <Link
                        className="text-green-800 font-bold"
                        href={`${baseUrl}/${path}`}
                      >
                        {" "}
                        {`${baseUrl}/${path}`}
                      </Link>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {" "}
                    <QRCodeSVG value={`${baseUrl}/${path}`} />
                  </div>
                  <DialogFooter>
                    {" "}
                    <Link
                      href={`#`}
                      onClick={downloadQR}
                      className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-0.5 text-xs font-medium hover:bg-muted"
                    >
                      Hämta Qr-Kod
                    </Link>
                    <Link
                      href={`${baseUrl}/dashboard`}
                      className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-0.5 text-xs font-medium hover:bg-muted"
                    >
                      Till Dashboard
                    </Link>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {children}
          </>
        ),
      }}
      onPublish={async (data) => {
        const normalizedData = normalizePuckData(data);
        await fetch("/puck/api", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: normalizedData, path }),
        });
        setOpen(true);
        //window.location.href = "/dashboard";
      }}
    />
  );
}
