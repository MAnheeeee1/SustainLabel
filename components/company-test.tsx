import { cn } from "@/lib/utils";
import { Marquee } from "./ui/marquee";
import { ChevronRight } from "lucide-react";

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
    <figure className="w-56 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="h-56 w-full overflow-hidden bg-gray-100">
        <img
          src={img}
          alt={site}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="px-4 py-3">
        <a
          href={href}
          className="flex items-center gap-1 text-sm font-semibold text-gray-900 hover:underline"
        >
          {site}
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        </a>
        <p className="mt-0.5 text-xs text-gray-500">{label}</p>
      </div>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative mt-16 w-full overflow-hidden">
      <p className="mb-6 text-sm font-medium uppercase tracking-widest text-gray-400">
        Exempel på produktpass
      </p>
      <div className="mask-[linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
        <Marquee pauseOnHover repeat={3} className="[--gap:1.25rem]">
          {cards.map((card) => (
            <CardItem key={card.site} {...card} />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
