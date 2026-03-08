"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { OrbitingCirclesData } from "./orbial-data";
import { DataUploadHero } from "./data-upload-bento";
import { Globe } from "./ui/globe";
import { DeployRapid } from "./warp-deploy-rapid-";
export function BentoGridHero() {
  return (
    <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[28rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const SkeletonOne = () => {
  return <DeployRapid />;
};
const SkeletonTwo = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] overflow-hidden rounded-lg">
      <video
        src="/LiveDemo.mov"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div className="relative flex flex-1 w-full h-full min-h-[6rem] overflow-hidden">
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px]">
        <OrbitingCirclesData />
      </div>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div className=" flex flex-1 w-full h-full  overflow-hidden">
      <DataUploadHero />
    </div>
  );
};
const SkeletonFive = () => {
  return (
    <div className="relative flex flex-1 w-full h-full min-h-[6rem] overflow-hidden">
      <Globe className="!inset-auto !bottom-[-40%] !right-[-30%] !w-[120%] !max-w-none" />
    </div>
  );
};
const items = [
  {
    title: "Live på sekunder",
    description: (
      <span>
        Skapa, justera och publicera. Från första idé till live‑sida går allt på
        minuter i stället för veckor.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "All kontroll – noll kod",
    description: (
      <span>
        Lägg tiden på innehållet i stället för implementation. Editorn gör det
        enkelt att bygga, uppdatera och hålla alla DPP‑sidor synkade.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-2",
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Samla all produktdata till ett digitalt produktpass",
    description: (
      <span>
        Importera data från befintliga system och dokument. Plattformen
        strukturerar om informationen till färdiga DPP:er.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: "DPP:er som funkar överallt",
    description: (
      <span>
        Tryck publicera, vi sökter resten. Vi ser till att sidan är online,
        snabb och tillgänglig för alla som behöver den
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  },
];
