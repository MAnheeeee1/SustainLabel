"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FileUpload } from "../../../components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  // ── Project step ────────────────────────────────────────────────
  const [step, setStep] = useState<"project" | "main">("project");
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<
    "idle" | "saving" | "error"
  >("idle");

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    setProjectStatus("saving");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName.trim() }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjectId(data.id);
      setProjectStatus("idle");
      setStep("main");
    } catch {
      setProjectStatus("error");
    }
  };

  // ── File upload ─────────────────────────────────────────────────
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [uploadedFilenames, setUploadedFilenames] = useState<string[]>([]);

  // ── Webcrawler ──────────────────────────────────────────────────
  const [targetUrl, setTargetUrl] = useState("");
  const [crawlStatus, setCrawlStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [crawlFilename, setCrawlFilename] = useState<string | null>(null);

  // ── Ingest ──────────────────────────────────────────────────────
  const [ingestStatus, setIngestStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [vectorStoreId, setVectorStoreId] = useState<string | null>(null);

  const handleFileUpload = (uploaded: File[]) => {
    setFiles(uploaded);
    setUploadStatus("idle");
  };

  const handleSave = async () => {
    if (files.length === 0) return;
    setUploadStatus("saving");
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setUploadedFilenames(data.saved);
        setUploadStatus("saved");
      } else {
        setUploadStatus("error");
      }
    } catch {
      setUploadStatus("error");
    }
  };

  const handleCrawl = async () => {
    if (!targetUrl) return;
    setCrawlStatus("loading");
    try {
      const res = await fetch("/api/webcrawler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl }),
      });
      const data = await res.json();
      if (data.filename) {
        setCrawlFilename(data.filename);
        setCrawlStatus("done");
      } else {
        setCrawlStatus("error");
      }
    } catch {
      setCrawlStatus("error");
    }
  };

  const handleIngest = async () => {
    const allFilenames = [
      ...uploadedFilenames,
      ...(crawlFilename ? [crawlFilename] : []),
    ];
    if (allFilenames.length === 0) return;
    setIngestStatus("loading");
    try {
      const res = await fetch("/api/rag/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filenames: allFilenames }),
      });
      const data = await res.json();
      setVectorStoreId(data.vectorStoreId);
      setIngestStatus("done");

      // Save vectorStoreId back to the project
      if (projectId) {
        await fetch(`/api/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vectorStoreId: data.vectorStoreId }),
        });
      }
    } catch {
      setIngestStatus("error");
    }
  };

  const allFilesReady = uploadedFilenames.length > 0 || crawlFilename !== null;

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
        <div className="flex flex-1 flex-col px-6 py-8 max-w-2xl mx-auto w-full gap-10">
          {/* Step 0: Project name */}
          {step === "project" && (
            <section className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-semibold">Skapa nytt projekt</h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Ge projektet ett namn — t.ex. produktnamnet eller kollektionen
                  det tillhör.
                </p>
              </div>
              <div className="flex gap-3">
                <Input
                  placeholder="T.ex. Arktis vinter-jacka 2026"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  onClick={handleCreateProject}
                  disabled={!projectName.trim() || projectStatus === "saving"}
                >
                  {projectStatus === "saving" ? "Skapar..." : "Fortsätt →"}
                </Button>
              </div>
              {projectStatus === "error" && (
                <span className="text-sm text-red-500">
                  Kunde inte skapa projektet. Försök igen.
                </span>
              )}
            </section>
          )}

          {/* Steps 1-3: main flow */}
          {step === "main" && (
            <>
              <p className="text-sm text-neutral-400 -mb-6">
                Projekt:{" "}
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {projectName}
                </span>
              </p>

              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">
                  1. Ladda upp produktdata
                </h2>
                <p className="text-sm text-neutral-500">
                  Ladda upp specifikationsblad, materiallista eller annan
                  produktdokumentation.
                </p>
                <div className="border border-dashed border-neutral-300 rounded-xl bg-neutral-50">
                  <FileUpload onChange={handleFileUpload} />
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={files.length === 0 || uploadStatus === "saving"}
                    variant="outline"
                  >
                    {uploadStatus === "saving"
                      ? "Laddar upp..."
                      : "Ladda upp filer"}
                  </Button>
                  {uploadStatus === "saved" && (
                    <span className="text-sm text-green-600">
                      ✓ {uploadedFilenames.length} fil
                      {uploadedFilenames.length !== 1 ? "er" : ""} uppladdad
                    </span>
                  )}
                  {uploadStatus === "error" && (
                    <span className="text-sm text-red-500">
                      Uppladdning misslyckades.
                    </span>
                  )}
                </div>
              </section>

              {/* Steg 2: Crawla webbplats */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">
                  2. Hämta information från webbplats{" "}
                  <span className="text-neutral-400 font-normal text-sm">
                    (valfritt)
                  </span>
                </h2>
                <p className="text-sm text-neutral-500">
                  Klistra in en URL för att automatiskt hämta
                  hållbarhetsinformation från webbplatsen.
                </p>
                <div className="flex gap-3">
                  <Input
                    placeholder="https://www.example.com"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCrawl}
                    disabled={!targetUrl || crawlStatus === "loading"}
                    variant="outline"
                  >
                    {crawlStatus === "loading" ? "Hämtar..." : "Hämta"}
                  </Button>
                </div>
                {crawlStatus === "done" && (
                  <span className="text-sm text-green-600">
                    ✓ Webbplatsdata hämtad och sparad
                  </span>
                )}
                {crawlStatus === "error" && (
                  <span className="text-sm text-red-500">
                    Misslyckades. Kontrollera URL:en.
                  </span>
                )}
              </section>

              {/* Steg 3: Bygg kunskapsbas */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">3. Bygg kunskapsbas</h2>
                <p className="text-sm text-neutral-500">
                  Ladda upp all insamlad data till AI:ns kunskapsbas (vector
                  store).
                </p>
                <Button
                  onClick={handleIngest}
                  disabled={!allFilesReady || ingestStatus === "loading"}
                  className="w-fit"
                >
                  {ingestStatus === "loading"
                    ? "Bygger kunskapsbas..."
                    : "Bygg kunskapsbas"}
                </Button>
                {ingestStatus === "done" && (
                  <span className="text-sm text-green-600">
                    ✓ Kunskapsbas klar — ID: {vectorStoreId}
                  </span>
                )}
                {ingestStatus === "error" && (
                  <span className="text-sm text-red-500">
                    Något gick fel. Försök igen.
                  </span>
                )}
              </section>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
