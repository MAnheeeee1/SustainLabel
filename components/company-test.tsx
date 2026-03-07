import { cn } from "@/lib/utils";
import { Marquee } from "./ui/marquee";
import { ChevronRight } from "lucide-react";
import { DottedMap } from "./ui/dotted-map";

const cards = [
  {
    img: "/jacka.png",
    site: "8848altitude.se",
    label: "Outdoor jacka",
    href: "#",
  },
  {
    img: "/lolahat.webp",
    site: "lola.se",
    label: "Accessoarer",
    href: "#",
  },
  {
    img: "/franciasPant.webp",
    site: "francias.se",
    label: "Byxor",
    href: "#",
  },
  {
    img: "/girl2.webp",
    site: "newseason.se",
    label: "Säsongskollektion",
    href: "#",
  },
  {
    img: "/starmitten.webp",
    site: "starbrands.se",
    label: "Vinterplagg",
    href: "#",
  },
  {
    img: "/twoGirls.webp",
    site: "sustainmode.se",
    label: "Hållbart mode",
    href: "#",
  },
  {
    img: "/product.jpg",
    site: "ecostore.se",
    label: "Produktpass",
    href: "#",
  },
];

const CardItem = ({
  img,
  site,
  label,
  href,
}: {
  img: string;
  site: string;
  label: string;
  href: string;
}) => {
  return (
    <figure className="w-80 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="h-72 w-full overflow-hidden bg-gray-100">
        <img
          src={img}
          alt={site}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="px-5 py-4">
        <a
          href={href}
          className="flex items-center gap-1 text-base font-semibold text-gray-900 hover:underline"
        >
          {site}
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </a>
        <p className="mt-1 text-sm text-gray-500">{label}</p>
      </div>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative mt-16 w-full flex content-center flex-col overflow-hidden rounded-2xl py-16">
      {/* Dotted map background */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <DottedMap
          dotColor="#059669"
          width={200}
          height={100}
          mapSamples={8000}
        />
      </div>

      <p className="relative mb-10 text-base font-semibold uppercase tracking-widest text-gray-400">
        Använda av olika företag världen över
      </p>
      <div className="relative mask-[linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
        <Marquee pauseOnHover repeat={3} className="[--gap:1.25rem]">
          {cards.map((card) => (
            <CardItem key={card.site} {...card} />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
