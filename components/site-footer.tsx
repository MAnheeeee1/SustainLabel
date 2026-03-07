import { Twitter, Linkedin, Github, Facebook, Instagram } from "lucide-react";
import { TextHoverEffect } from "./ui/text-hover-effect";
export function SiteFooter() {
  return (
    <footer className="relative z-10 w-full border-t border-gray-100 bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Logo + brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/sustainLabel-removebg-preview.png"
              alt="logo"
              width={150}
              height={150}
            />
          </div>
        </div>

        {/* Nav links */}
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            "Produkter",
            "Studio",
            "Kunder",
            "Pris",
            "Blogg",
            "Integritet",
            "Villkor",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className="text-base text-gray-500 transition hover:text-gray-900"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Dashed divider */}
        <div className="mt-10 border-t border-dashed border-gray-300" />
      </div>

      {/* Full-width text effect */}
      <div className="w-full overflow-hidden h-[34vw]">
        <TextHoverEffect text="SUSTAINLABEL" align="left" />
      </div>

      {/* Bottom row */}
      <div className="mx-auto max-w-5xl px-0">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-400">
            © SustainLabel AB {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-5 text-gray-400">
            <a
              href="#"
              aria-label="Twitter"
              className="transition hover:text-gray-700"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="transition hover:text-gray-700"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="transition hover:text-gray-700"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="transition hover:text-gray-700"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="transition hover:text-gray-700"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
