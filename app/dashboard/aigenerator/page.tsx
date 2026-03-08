"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FileUpload } from "../../../components/ui/file-upload";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  const handleFileUpload = (uploaded: File[]) => {
    setFiles(uploaded);
    setStatus("idle");
  };

  const handleSave = async () => {
    if (files.length === 0) return;
    setStatus("saving");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setStatus("saved");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                <FileUpload onChange={handleFileUpload} />
              </div>
              <div className="w-full max-w-4xl mx-auto flex items-center gap-4">
                <Button
                  onClick={handleSave}
                  disabled={files.length === 0 || status === "saving"}
                >
                  {status === "saving" ? "Saving..." : "Save"}
                </Button>
                {status === "saved" && (
                  <span className="text-sm text-green-600">
                    {files.length} file{files.length !== 1 ? "s" : ""} saved
                    successfully.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-sm text-red-500">
                    Failed to save files. Please try again.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
