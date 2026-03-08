"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconCirclePlusFilled,
  IconMail,
  IconPencil,
  IconLayoutDashboard,
  type Icon,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const [path, setPath] = useState("");
  const [open, setOpen] = useState(false);
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

    let templateData = { content: [], root: {} };
    if (currentStep === 2 && designFromMall) {
      // Fetch template from dpptemplate.json
      const resTemplate = await fetch("/api/dpptemplate");
      if (resTemplate.ok) {
        const json = await resTemplate.json();
        templateData = json["/template"] || templateData;
        // Generate unique keys for each component
        templateData = {
          ...templateData,
          content: templateData.content.map((item) => {
            if (item.props && item.props.id) {
              // Append a random string to the id
              return {
                ...item,
                props: {
                  ...item.props,
                  id: `${item.props.id}-${Math.random().toString(36).substr(2, 9)}`,
                },
              };
            }
            return item;
          }),
        };
      }
    }

    const res = await fetch("puck/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: normalizedPath,
        data: templateData,
      }),
    });

    if (res.ok) {
      setOpen(false);
      setPath("");
      router.push(`${normalizedPath}/edit`);
    }
  }
  const [currentStep, setCurrentStep] = useState(1);
  const [designFromMall, setDesignFromMall] = useState(false);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                >
                  <IconCirclePlusFilled />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent>
                {currentStep == 1 ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>Skapa en ny DPP-sida</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3">
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
                        <Label htmlFor="path">Namn</Label>
                        <Input
                          id="path"
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
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
