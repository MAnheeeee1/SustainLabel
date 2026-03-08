import { Marquee } from "./ui/marquee";

const logos = [
  { name: "H&M", domain: "hm.com" },
  { name: "IKEA", domain: "ikea.com" },
  { name: "Patagonia", domain: "patagonia.com" },
  { name: "Adidas", domain: "adidas.com" },
  { name: "Nike", domain: "nike.com" },
  { name: "Puma", domain: "puma.com" },
  { name: "Levi's", domain: "levis.com" },
  { name: "Fjällräven", domain: "fjallraven.com" },
  { name: "Zara", domain: "zara.com" },
  { name: "Uniqlo", domain: "uniqlo.com" },
  { name: "Arc'teryx", domain: "arcteryx.com" },
  { name: "Muji", domain: "muji.com" },
];

const TOKEN = "pk_Q1PkSyyMRrewpRVo00u7gA";

export function MarqueeDemo() {
  return (
    <div className="relative w-full py-12">
      <p className="text-5xl font-bold tracking-tight text-gray-900 text-center mb-10">
        Anförtrodda av ledande varumärken
      </p>
      <div className="relative flex w-full flex-col gap-3 overflow-hidden">
        <Marquee reverse pauseOnHover className="[--duration:30s]">
          {logos.map(({ name, domain }) => (
            <img
              key={domain}
              src={`https://img.logo.dev/${domain}?token=${TOKEN}&format=webp&size=128&fallback=monogram&retina=true`}
              alt={name}
              className="h-36 w-auto grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition mx-8"
            />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white"></div>
      </div>
    </div>
  );
}
