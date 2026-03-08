"use client";
import { LightRays } from "../components/ui/light-rays";
import { Safari } from "../components/ui/safari";
import Link from "next/link";
import { Highlighter } from "../components/ui/highlighter";
import { AnimatedGradientText } from "../components/ui/animated-gradient-text";
import { cn } from "../lib/utils";
import { ChevronRight } from "lucide-react";
import { SiteFooter } from "../components/site-footer";
import { useRef, useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { SmoothCursor } from "../components/ui/smooth-cursor";
import { BentoGridHero } from "../components/hero-bento";
import { MarqueeDemo } from "../components/company-test";
import { useScroll, useTransform, motion } from "motion/react";
export default function Home() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pris",
      link: "#pricing",
    },
    {
      name: "Kontakt",
      link: "#contact",
    },
  ];
  const content = [
    {
      title: "Skapa på minuter",
      description:
        "Bygg ett komplett digitalt produktpass med vår intuitiva drag-and-drop-redigerare. Lägg till material, certifieringar, ursprungsland och hållbarhetsdata utan en enda kodrad.",
      content: (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-white">
          <div className="text-6xl font-bold opacity-20">01</div>
          <p className="text-center text-2xl font-semibold">
            Drag-and-drop editor
          </p>
          <p className="text-center text-sm opacity-80">
            Inga kodkunskaper krävs
          </p>
        </div>
      ),
    },
    {
      title: "Dela med en QR-kod",
      description:
        "Varje produktpass får en unik QR-kod som kunder skannar för att se hela produktens historia — material, tillverkare, certifieringar och miljöpåverkan i realtid.",
      content: (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-white">
          <div className="text-6xl font-bold opacity-20">02</div>
          <p className="text-center text-2xl font-semibold">Unik QR-kod</p>
          <p className="text-center text-sm opacity-80">
            Skannas direkt av kunden
          </p>
        </div>
      ),
    },
    {
      title: "Uppfyll EU-krav",
      description:
        "EU:s kommande krav på digitala produktpass (DPP) träder i kraft 2027. Med SustainLabel är du redan redo — vi håller din data strukturerad och uppdaterad enligt de senaste regelverken.",
      content: (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-white">
          <div className="text-6xl font-bold opacity-20">03</div>
          <p className="text-center text-2xl font-semibold">EU-kompatibel</p>
          <p className="text-center text-sm opacity-80">
            Redo för DPP-reglerna 2027
          </p>
        </div>
      ),
    },
    {
      title: "Bygg förtroende",
      description:
        "Konsumenter efterfrågar transparens. Visa upp äkta hållbarhetsdata, certifieringar och spårbarhet — och bygg ett varumärke som kunderna litar på och återkommer till.",
      content: (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-white">
          <div className="text-6xl font-bold opacity-20">04</div>
          <p className="text-center text-2xl font-semibold">
            Transparent varumärke
          </p>
          <p className="text-center text-sm opacity-80">
            Kunder som litar på dig köper igen
          </p>
        </div>
      ),
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const rotateX = useTransform(scrollY, [0, 400], [18, 0]);
  const scale = useTransform(scrollY, [0, 400], [0.92, 1]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="landing-page relative min-h-screen w-screen overflow-hidden bg-white">
      <LightRays count={10} color="rgba(100, 200, 160, 0.15)" length="100vh" />
      <SmoothCursor />
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
            <NavbarButton variant="primary">Kom Igång</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-36 pb-24 text-center">
        <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#6ee7b71f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#6ee7b73f]">
          <span
            className={cn(
              "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-linear-to-r from-[#34d399]/50 via-[#059669]/50 to-[#34d399]/50 bg-size-[300%_100%] p-px",
            )}
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "subtract",
              WebkitClipPath: "padding-box",
            }}
          />
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
          <AnimatedGradientText
            className="text-sm font-medium"
            colorFrom="#34d399"
            colorTo="#059669"
          >
            Introducerar SustainLabel
          </AnimatedGradientText>
          <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </div>
        <h1 className="max-w-4xl text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
          Digitala produktpass,{" "}
          <span className="text-emerald-600">
            byggda för{" "}
            <Highlighter action="highlight" color="#FF9800">
              hållbarhet
            </Highlighter>
          </span>
        </h1>
        <p className="mt-8 max-w-2xl text-xl text-gray-500 leading-relaxed">
          Skapa, hantera och dela produkttransparenssidor på några minuter. Ge
          dina kunder hela historien bakom varje produkt.
        </p>
        <div className="mt-12 flex gap-5">
          <Link
            href="/dashboard"
            className="rounded-xl bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-emerald-400"
          >
            Kom igång
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-300 px-8 py-4 text-base font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Se demo
          </Link>
        </div>

        {/* Browser mockup */}
        <div
          className="mt-16 w-full max-w-6xl"
          style={{ perspective: "1200px" }}
        >
          <motion.div style={{ rotateX, scale, transformOrigin: "top center" }}>
            <Safari
              url="sustainlabel.se"
              imageSrc="/herolanding.png"
              className="w-full shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
      <MarqueeDemo />
      {/* Features section */}
      <div className="w-full px-6 py-24">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-5xl font-bold tracking-tight text-gray-900">
            Allt du behöver, ingenting du inte behöver
          </h2>
          <p className="mt-5 text-xl text-gray-500">
            En komplett plattform för digitala produktpass — från skapande till
            delning.
          </p>
        </div>
        <BentoGridHero />
      </div>
      {/* Trusted by section */}
      <SiteFooter />
    </div>
  );
}
