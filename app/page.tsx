"use client";
import { LightRays } from "../components/ui/light-rays";
import { Safari } from "../components/ui/safari";
import Link from "next/link";
import { Highlighter } from "../components/ui/highlighter";
import { AnimatedGradientText } from "../components/ui/animated-gradient-text";
import { cn } from "../lib/utils";
import { ChevronRight } from "lucide-react";
import { MarqueeDemo } from "../components/company-test";
import { SiteFooter } from "../components/site-footer";
import { useState } from "react";
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-white">
      <LightRays count={10} color="rgba(100, 200, 160, 0.15)" length="100vh" />
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
        <div className="mt-16 w-full max-w-4xl">
          <Safari
            url="sustainlabel.se"
            imageSrc="/herolanding.png"
            className="w-full shadow-2xl"
          />
        </div>
        <MarqueeDemo />
      </div>
      <SiteFooter />
    </div>
  );
}
