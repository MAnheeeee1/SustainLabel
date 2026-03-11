"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { useState, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FileUpload } from "../../../components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconAlertCircle } from "@tabler/icons-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type ClassifiedResult = {
  result: {
    productName: string | null;
    articleNumber: string | null;
    totalTransportKm: number | null;
    totalCO2Kg: number | null;
    totalComponents: number | null;
    repairAndMaintenance: string | null;
    recyclingPotential: string | null;
    environmentalImpact: string | null;
    socialResponsibility: string | null;
  } | null;
};

export default function Page() {
  // ── Project step ────────────────────────────────────────────────
  const [step, setStep] = useState<
    "project" | "main" | "loading" | "question" | "summary"
  >("project");
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<
    "idle" | "saving" | "error"
  >("idle");
  const [classfiedData, setClassfiedData] = useState<ClassifiedResult>({
    result: null,
  });
  const [fieldInputs, setFieldInputs] = useState<Record<string, string>>({});
  const [fieldStatus, setFieldStatus] = useState<
    Record<string, "idle" | "saved" | "skipped">
  >({});
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>(
    {},
  );
  const [publishStatus, setPublishStatus] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [publishedPagePath, setPublishedPagePath] = useState<string | null>(
    null,
  );
  const [publishError, setPublishError] = useState<string | null>(null);

  const toggleExpand = (field: string) =>
    setExpandedFields((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleFieldSave = (field: string) => {
    setClassfiedData((prev) => ({
      ...prev,
      result: prev.result
        ? { ...prev.result, [field]: fieldInputs[field] ?? "" }
        : prev.result,
    }));
    setFieldStatus((prev) => ({ ...prev, [field]: "saved" }));
  };

  const handleFieldSkip = (field: string) => {
    setFieldStatus((prev) => ({ ...prev, [field]: "skipped" }));
  };

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
      // Reset state from previous project
      setVectorStoreId(null);
      setFileIds([]);
      setClassfiedData({ result: null });
      setFieldInputs({});
      setFieldStatus({});
      setExpandedFields({});
      setUploadedFilenames([]);
      setFiles([]);
      setUploadStatus("idle");
      setCrawlFilename(null);
      setCrawlStatus("idle");
      setIngestStatus("idle");
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
  const [fileIds, setFileIds] = useState<string[]>([]);

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
  const classifyData = async (storeId: string, fIds: string[]) => {
    console.log(
      "[frontend] calling classify with storeId:",
      storeId,
      "fileIds:",
      fIds.length,
    );
    const req = await fetch(`/api/rag/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vectorStoreId: storeId, fileIds: fIds }),
    });
    const data = await req.json();
    console.log(
      "[frontend] classify response:",
      JSON.stringify(data).slice(0, 500),
    );
    console.log(
      "[frontend] result keys:",
      data.result ? Object.keys(data.result) : "no result",
    );
    return data;
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
        body: JSON.stringify({ filenames: allFilenames, vectorStoreId }),
      });
      const data = await res.json();
      setVectorStoreId(data.vectorStoreId);
      setFileIds(data.fileIds ?? []);
      setIngestStatus("done");

      // Save vectorStoreId back to the project
      if (projectId) {
        await fetch(`/api/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vectorStoreId: data.vectorStoreId }),
        });
      }
      setStep("loading");
      const classfieddata = await classifyData(
        data.vectorStoreId,
        data.fileIds ?? [],
      );
      setClassfiedData(classfieddata);

      // Skip question step if all fields are filled
      const result = classfieddata?.result;
      const hasMissingFields =
        result &&
        Object.values(result).some(
          (v) => v === null || v === "" || (Array.isArray(v) && v.length === 0),
        );
      setStep(hasMissingFields ? "question" : "summary");
    } catch {
      setIngestStatus("error");
    }
  };

  const allFilesReady = uploadedFilenames.length > 0 || crawlFilename !== null;

  // ── Rotating facts for loading screen ────────────────────────
  const facts = [
    "Ett digitalt produktpass (DPP) blir obligatoriskt inom EU från 2027.",
    "Textilindustrin står för ca 10% av världens koldioxidutsläpp.",
    "Att förlänga ett plaggs livslängd med 9 månader minskar dess klimatavtryck med ~30%.",
    "Över 92 miljoner ton textilier hamnar på soptippen varje år.",
    "Återvunnen polyester kräver 59% mindre energi än nyproducerad.",
    "Bomullsodling använder 6% av världens bekämpningsmedel.",
    "En genomsnittlig t-shirt kräver ca 2 700 liter vatten att producera.",
    "EU:s gröna giv kräver spårbarhet genom hela leverantörskedjan.",
    "Cirkulär design kan minska textilavfall med upp till 80%.",
    "Transparens i leverantörskedjan ökar konsumenternas förtroende med 73%.",
  ];
  const [factIndex, setFactIndex] = useState(0);
  useEffect(() => {
    if (step !== "loading") return;
    const interval = setInterval(() => {
      setFactIndex((i) => (i + 1) % facts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [step, facts.length]);

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
          {/* Loading screen with rotating facts */}
          {step === "loading" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-8 py-24">
              <div className="relative flex items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-green-500" />
              </div>
              <div className="flex flex-col items-center gap-3 text-center max-w-md">
                <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
                  Analyserar produktdata…
                </h2>
                <p className="text-sm text-neutral-400 transition-opacity duration-500">
                  {facts[factIndex]}
                </p>
              </div>
              <p className="text-xs text-neutral-300">
                Detta kan ta upp till en minut
              </p>
            </div>
          )}

          {step === "question" && (
            <>
              <p className="text-sm text-neutral-400 -mb-6">
                Projekt:{" "}
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  {projectName}
                </span>
              </p>

              <section className="flex flex-col gap-4">
                {/* ── Missing fields ── */}
                {classfiedData.result &&
                  (Object.entries(classfiedData.result) as [string, unknown][])
                    .filter(
                      ([, val]) =>
                        val === null ||
                        val === "" ||
                        (Array.isArray(val) && val.length === 0),
                    )
                    .map(([field]) => {
                      const labels: Record<
                        string,
                        {
                          title: string;
                          description: string;
                          placeholder: string;
                        }
                      > = {
                        productName: {
                          title: "Produktnamn saknas",
                          description: "Vad heter produkten?",
                          placeholder: "T.ex. Arktis vinter-jacka",
                        },
                        articleNumber: {
                          title: "Artikelnummer saknas",
                          description: "Ange produktens artikelnummer.",
                          placeholder: "T.ex. JKT-2026-001",
                        },
                        totalTransportKm: {
                          title: "Transportsträcka saknas",
                          description:
                            "Hur långt transporterades produkten totalt (km)?",
                          placeholder: "T.ex. 3500",
                        },
                        totalCO2Kg: {
                          title: "CO₂-utsläpp saknas",
                          description:
                            "Vad är produktens totala CO₂-utsläpp (kg)?",
                          placeholder: "T.ex. 0.17",
                        },
                        totalComponents: {
                          title: "Antal komponenter saknas",
                          description:
                            "Hur många delar/komponenter ingår i produkten?",
                          placeholder: "T.ex. 52",
                        },
                        repairAndMaintenance: {
                          title: "Reparation & underhåll saknas",
                          description:
                            "Finns det reparations- eller underhållsinformation?",
                          placeholder: "Beskriv möjligheter för reparation...",
                        },
                        recyclingPotential: {
                          title: "Återvinningspotential saknas",
                          description: "Kan produkten återvinnas? Om ja, hur?",
                          placeholder:
                            "T.ex. 90% polyester, fullt återvinningsbart",
                        },
                        environmentalImpact: {
                          title: "Miljöpåverkan saknas",
                          description: "Beskriv produktens miljöpåverkan.",
                          placeholder:
                            "T.ex. tillverkad med lågenergiprocess...",
                        },
                        socialResponsibility: {
                          title: "Socialt ansvar saknas",
                          description:
                            "Finns det information om arbetsförhållanden?",
                          placeholder: "T.ex. uppfyller SA8000-standarden...",
                        },
                      };
                      const meta = labels[field] ?? {
                        title: `${field} saknas`,
                        description: "Ange information.",
                        placeholder: "",
                      };
                      const status = fieldStatus[field] ?? "idle";
                      return (
                        <Card
                          key={field}
                          className={`w-full max-w-xl transition-opacity ${
                            status === "skipped" ? "opacity-40" : "opacity-100"
                          }`}
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              {status === "saved" ? (
                                <span className="text-green-500">✓</span>
                              ) : (
                                <IconAlertCircle className="inline text-amber-500" />
                              )}
                              {status === "saved"
                                ? meta.title.replace(" saknas", "")
                                : meta.title}
                            </CardTitle>
                            <CardDescription>
                              {meta.description}
                            </CardDescription>
                          </CardHeader>
                          {status !== "saved" && (
                            <CardContent>
                              <div className="grid gap-2">
                                <Label htmlFor={field}>{meta.title}</Label>
                                <Input
                                  id={field}
                                  placeholder={meta.placeholder}
                                  value={fieldInputs[field] ?? ""}
                                  onChange={(e) =>
                                    setFieldInputs((prev) => ({
                                      ...prev,
                                      [field]: e.target.value,
                                    }))
                                  }
                                  disabled={status === "skipped"}
                                />
                              </div>
                            </CardContent>
                          )}
                          {status === "idle" && (
                            <CardFooter className="flex-col gap-2">
                              <Button
                                className="w-full"
                                disabled={!fieldInputs[field]}
                                onClick={() => handleFieldSave(field)}
                              >
                                Spara
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleFieldSkip(field)}
                              >
                                Hoppa över
                              </Button>
                            </CardFooter>
                          )}
                        </Card>
                      );
                    })}
              </section>

              {/* Show continue button when all questions are handled */}
              {classfiedData.result &&
                (() => {
                  const missingFields = (
                    Object.entries(classfiedData.result!) as [string, unknown][]
                  )
                    .filter(
                      ([, val]) =>
                        val === null ||
                        val === "" ||
                        (Array.isArray(val) && val.length === 0),
                    )
                    .map(([field]) => field);
                  const allHandled = missingFields.every(
                    (f) =>
                      fieldStatus[f] === "saved" ||
                      fieldStatus[f] === "skipped",
                  );
                  if (!allHandled) return null;
                  return (
                    <Button
                      className="mt-4 w-full max-w-xl"
                      onClick={() => setStep("summary")}
                    >
                      Fortsätt till sammanfattning →
                    </Button>
                  );
                })()}
            </>
          )}

          {/* Step: Summary */}
          {step === "summary" && (
            <>
              <section className="flex flex-col gap-6 w-full max-w-2xl">
                <div>
                  <h2 className="text-xl font-semibold">Sammanfattning</h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Granska all insamlad produktdata innan du publicerar.
                  </p>
                </div>
                <pre className="rounded-lg border bg-neutral-50 p-4 text-xs text-neutral-700 overflow-x-auto max-h-[60vh] overflow-y-auto">
                  {JSON.stringify(classfiedData.result, null, 2)}
                </pre>
                {publishStatus !== "done" ? (
                  <>
                    {publishError && (
                      <p className="text-sm text-red-500">{publishError}</p>
                    )}
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={publishStatus === "loading"}
                      onClick={async () => {
                        setPublishStatus("loading");
                        setPublishError(null);
                        try {
                          const res = await fetch("/api/publish", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              projectName,
                              result: classfiedData.result,
                            }),
                          });
                          if (!res.ok) {
                            const err = await res.json().catch(() => ({}));
                            throw new Error(err.error ?? `Fel ${res.status}`);
                          }
                          const { path, editPath } = await res.json();
                          setPublishedPagePath(path);
                          setPublishedSlug(editPath);
                          setPublishStatus("done");
                        } catch (e: unknown) {
                          setPublishError(
                            e instanceof Error ? e.message : "Okänt fel",
                          );
                          setPublishStatus("error");
                        }
                      }}
                    >
                      {publishStatus === "loading"
                        ? "Publicerar…"
                        : "Publicera"}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Produktpasset har publicerats!
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        asChild
                      >
                        <a href={publishedPagePath!}>Visa sida →</a>
                      </Button>
                      <Button size="lg" className="flex-1" asChild>
                        <a href={`${publishedPagePath}/edit`}>
                          Redigera i editor →
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
