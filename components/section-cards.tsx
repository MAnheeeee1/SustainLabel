import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Data } from "@puckeditor/core";
import { CardSmall } from "./dpp-sida-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconPencil,
  IconLayoutDashboard,
  IconRobotFace,
  IconCirclePlusFilled,
} from "@tabler/icons-react";

interface SectionCardsProps {
  pages: { path: string; data: Data }[];
  onRefresh: () => void;
}

export function SectionCards({ pages, onRefresh }: SectionCardsProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [designFromMall, setDesignFromMall] = useState(false);
  const [path, setPath] = useState("");
  const router = useRouter();

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setCurrentStep(1);
      setDesignFromMall(false);
      setPath("");
    }
  }

  async function handleCreate() {
    if (!path.trim()) return;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    let templateData: { content: unknown[]; root: object } = {
      content: [],
      root: {},
    };
    if (currentStep === 2 && designFromMall) {
      const resTemplate = await fetch("/api/dpptemplate");
      if (resTemplate.ok) {
        const json = await resTemplate.json();
        templateData = json["/template"] || templateData;
        templateData = {
          ...templateData,
          content: (templateData.content as { props?: { id?: string } }[]).map(
            (item) => {
              if (item.props?.id) {
                return {
                  ...item,
                  props: {
                    ...item.props,
                    id: `${item.props.id}-${Math.random().toString(36).substr(2, 9)}`,
                  },
                };
              }
              return item;
            },
          ),
        };
      }
    }
    const res = await fetch("/puck/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: normalizedPath, data: templateData }),
    });
    if (res.ok) {
      handleOpenChange(false);
      onRefresh();
      router.push(`${normalizedPath}/edit`);
    }
  }

  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center lg:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <IconCirclePlusFilled className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Inga DPP-sidor än</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Du har inte skapat några digitala produktpass ännu. Kom igång genom
            att skapa din första sida.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <IconCirclePlusFilled className="mr-2 h-4 w-4" />
          Skapa
        </Button>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent>
            {currentStep === 1 ? (
              <>
                <DialogHeader>
                  <DialogTitle>Skapa en ny DPP-sida</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setDesignFromMall(false);
                      setCurrentStep(2);
                    }}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-border p-6 text-sm font-medium transition hover:border-primary hover:bg-primary/5"
                  >
                    <IconPencil className="size-6 text-muted-foreground" />
                    Designa från grunden
                  </button>
                  <button
                    onClick={() => {
                      setDesignFromMall(true);
                      setCurrentStep(2);
                    }}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-border p-6 text-sm font-medium transition hover:border-primary hover:bg-primary/5"
                  >
                    <IconLayoutDashboard className="size-6 text-muted-foreground" />
                    Designa från en Mall
                  </button>
                  <button
                    onClick={() => {
                      handleOpenChange(false);
                      router.push("/dashboard/aigenerator");
                    }}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-border p-6 text-sm font-medium transition hover:border-primary hover:bg-primary/5"
                  >
                    <IconRobotFace className="size-6 text-muted-foreground" />
                    Generera med AI
                  </button>
                </div>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Skapa en ny DPP-sida</DialogTitle>
                  <DialogDescription>
                    Ange namnet på projektet
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="empty-path">Namn</Label>
                    <Input
                      id="empty-path"
                      placeholder="/my-product"
                      value={path}
                      onChange={(e) => setPath(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreate}>Skapa</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {pages.map((page) => (
        <CardSmall
          key={page.path}
          path={page.path}
          data={page.data}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
