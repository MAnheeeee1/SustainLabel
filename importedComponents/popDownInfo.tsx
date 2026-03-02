"use client";
import { useState } from "react";

interface DropdownLink {
  label: string;
  url: string;
}

interface DropdownItem {
  title: string;
  content: string;
  links?: DropdownLink[];
}

type PopDownInfoProps = {
  items?: DropdownItem[];
  buttonColor?: string;
  buttonHoverColor?: string;
  contentBgColor?: string;
};

const defaultItems: DropdownItem[] = [
  {
    title: "Reparation, underhåll och återbruk",
    content:
      'Jackan är konstruerad med standardkomponenter som YKK‑dragkedjor, tryckknappar och utbytbara snoddar, vilket gör den lätt att reparera hos skräddare eller via 8848:s service.\n\nRätt tvätt, återaktivering av impregnering och punktlagningar förlänger livslängden, och 8848 erbjuder råd och reservdelar under "Care & Repair".\n\nDen tåliga konstruktionen gör plagget väl lämpat för återbruk genom andrahandsförsäljning eller vidare utlån när du själv är klar med det.',
    links: [
      {
        label: "Care & Repair (SV)",
        url: "https://www.8848altitude.com/sv-SE/8848-altitude/hallbarhet/care-and-repair",
      },
      {
        label: "Care & Repair (ENG)",
        url: "https://www.8848altitude.com/en/8848-altitude/sustainability/care-and-repair",
      },
    ],
  },
  {
    title: "Material och tillverkning",
    content:
      "Plagget består främst av polyester i skal, foder och isolering, med inslag av nylon, elastan, polyuretan och polypropen i detaljer som band, tejp, knappar och stoppare.\n\nNågra material är återvunnen polyester, och en isolering innehåller Sorona‑fibrer och solution‑dyed foder som minskar vatten-, kemi- och energianvändning jämfört med traditionell infärgning.\n\nTotalt väger material och komponenter cirka 1,26 kg per plagg, varav större delen i isolering och fodertyger.\n\n8848 följer REACH och använder PFAS‑fria impregneringar för att undvika persistenta fluorkarboner i sina plagg.",
    links: [
      {
        label: "Fabrics and Materials",
        url: "https://www.8848altitude.com/en/8848-altitude/sustainability/fabrics-and-materials",
      },
      {
        label: "Material Guide",
        url: "https://www.8848altitude.com/eu/material-guide",
      },
      {
        label: "Hållbarhetsarbete (SV)",
        url: "https://www.8848altitude.com/sv-SE/8848-altitude/hallbarhet/sustainability-work",
      },
      {
        label: "Sustainability Work (ENG)",
        url: "https://www.8848altitude.com/en-EU/8848-altitude/sustainability/sustainability-work",
      },
    ],
  },
  {
    title: "Potential för återvinning",
    content:
      "Jackan är starkt dominerad av polyester, vilket ger god teknisk potential för materialåtervinning i framtida polyesterflöden.\n\nFör att återvinna krävs demontering av dragkedjor, knappar och hårda plastdetaljer, men efter sortering kan en stor del av textilen bli råvara till nya fibrer eller produkter.\n\nI dag går många liknande plagg fortfarande till energiåtervinning, men utvecklingen av textilåtervinning gör att denna typ av konstruktion är relativt gynnsam.",
    links: [
      {
        label: "Fabrics and Materials",
        url: "https://www.8848altitude.com/en/8848-altitude/sustainability/fabrics-and-materials",
      },
      {
        label: "Hållbarhet (SV)",
        url: "https://www.8848altitude.com/sv-SE/8848-altitude/hallbarhet",
      },
      {
        label: "Sustainability Work",
        url: "https://www.8848altitude.com/en-EU/8848-altitude/sustainability/sustainability-work",
      },
    ],
  },
  {
    title: "Miljöpåverkan",
    content:
      "Den dokumenterade transportpåverkan från båtfrakten Dalian–Göteborg är 0,17 kg CO₂ per plagg, tack vare att 8848 prioriterar sjötransport framför flyg.\n\nStörsta delen av plaggets totala klimatpåverkan kommer dock från produktion av fiber och tyg, särskilt de syntetiska isolerings‑ och fodermaterialen.\n\nGenom att använda jackan länge, tvätta skonsamt och reparera istället för att byta ut den kan du kraftigt minska dess klimatpåverkan per användningstillfälle.",
    links: [
      {
        label: "Transports and Packaging",
        url: "https://www.8848altitude.com/en/8848-altitude/sustainability/transports-and-packaging",
      },
      {
        label: "Sustainability Overview",
        url: "https://www.8848altitude.com/en/8848-altitude/sustainability",
      },
      {
        label: "Sustainability Work",
        url: "https://www.8848altitude.com/en-EU/8848-altitude/sustainability/sustainability-work",
      },
    ],
  },
  {
    title: "Socialt ansvar",
    content:
      "Plagget är tillverkat i Kina hos leverantörer som 8848 arbetar med långsiktigt, med krav på uppförandekod, tredjepartsrevisioner och efterlevnad av lokala lagar och internationella konventioner.\n\n8848 är medlem i BSCI/liknande initiativ och följer sina egna riktlinjer för arbetsvillkor, lön och arbetsmiljö i leverantörskedjan.\n\nFöretaget redovisar sitt hållbarhetsarbete öppet på sin webbplats och arbetar med löpande förbättringar inom både sociala och miljömässiga frågor.",
    links: [
      {
        label: "Social Responsibility (ENG)",
        url: "https://www.8848altitude.com/en/8848-altitude/sustainability/social-responsibility",
      },
      {
        label: "Ansvarsfull produktion (SV)",
        url: "https://www.8848altitude.com/sv-SE/8848-altitude/hallbarhet/responsible-production",
      },
      {
        label: "Hållbarhetsarbete (SV)",
        url: "https://www.8848altitude.com/sv-SE/8848-altitude/hallbarhet/sustainability-work",
      },
    ],
  },
];

const DropdownModule = ({
  items,
  buttonColor = "#065f46",
  buttonHoverColor = "#064e3b",
  contentBgColor = "#ecfdf5",
}: PopDownInfoProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleDropdown = ({ index }: { index: number }) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const dropdownData = items && items.length > 0 ? items : defaultItems;

  return (
    <div className="max-w-md mx-auto p-2">
      {dropdownData.map((item, index) => (
        <div key={index} className="mb-3 rounded-xl overflow-hidden shadow-md">
          <button
            onClick={() => toggleDropdown({ index })}
            className="w-full text-white px-6 py-4 flex justify-between items-center transition-colors duration-300"
            style={{
              backgroundColor:
                activeIndex === index ? buttonHoverColor : buttonColor,
            }}
          >
            <span className="text-lg font-medium">{item.title}</span>
            <span
              className={`text-xl transition-transform duration-300 ${
                activeIndex === index ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              activeIndex === index ? "max-h-[600px] py-6 px-6" : "max-h-0"
            }`}
            style={{ backgroundColor: contentBgColor }}
          >
            {item.content.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-gray-800 text-base leading-relaxed mb-3"
              >
                {paragraph}
              </p>
            ))}
            {item.links && item.links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm underline"
                    style={{ color: buttonColor }}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DropdownModule;
