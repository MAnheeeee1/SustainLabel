import { DropZone, type Config } from "@puckeditor/core";
import MoreProductSection from "./importedComponents/moreProductSection";
import NewCollection from "./importedComponents/newCollection";
import PopDownInfo from "./importedComponents/popDownInfo";
import ProductImage from "./importedComponents/productImage";
import MinimalFooter from "./importedComponents/minimalFooter";
import ThreeKeyFacts from "./importedComponents/threeKeyFacts";
type Props = {
  // DPP components
  HeroSection: {
    imageUrl: string;
    height: number;
    width: number;
    position: string;
    altText: string;
    articleNumber: string;
  };
  KeyMetric: {
    listOfFacts: { keyFact: string; value: string }[];
    backgroundColor: string;
    accentColor: string;
  };
  ExpandableCard: {
    items: {
      title: string;
      content: string;
      links: { label: string; url: string }[];
    }[];
    buttonColor: string;
    buttonHoverColor: string;
    contentBackgroundColor: string;
  };
  CollectionSection: {
    title: string;
    buttonText: string;
    buttonUrl: string;
    backgroundColor: string;
    mainImage: string;
    overlayImage1: string;
    overlayImage2: string;
  };
  ProductRecommendations: {
    heading: string;
    linkText: string;
    linkUrl: string;
    products: {
      productTitle: string;
      productCurrentPrice: number;
      productPrevPrice?: number;
      colorOptions?: { color: string }[];
      productImageSrc: string;
    }[];
  };
  MinimalFooter: {
    logoUrl: string;
    copyrightText: string;
    align: "left" | "center" | "right";
    logoWidth: number;
    logoHeight: number;
  };
  // General components
  Rubrik: {
    title: string;
    level: string;
    align: string;
    color: string;
    padding: string;
  };
  Stycke: {
    content: string;
    align: string;
    color: string;
    fontSize: string;
    maxWidth: string;
    padding: string;
  };
  "Formaterad text": {
    content: string;
    padding: string;
    maxWidth: string;
  };
  Bild: {
    url: string;
    alt: string;
    maxWidth: string;
    align: string;
    padding: string;
    rounded: string;
  };
  Video: {
    url: string;
    padding: string;
    maxWidth: string;
    align: string;
  };
  Knapp: {
    label: string;
    href: string;
    variant: string;
    align: string;
    padding: string;
  };
  Avgränsare: {
    color: string;
    thickness: string;
    margin: string;
  };
  Rutnät: {};
};

export const config: Config<Props> = {
  categories: {
    "Digital Product Pass": {
      components: [
        "HeroSection",
        "KeyMetric",
        "ExpandableCard",
        "CollectionSection",
        "ProductRecommendations",
        "MinimalFooter",
      ],
    },
    General: {
      components: [
        "Rubrik",
        "Stycke",
        "Formaterad text",
        "Bild",
        "Video",
        "Knapp",
        "Avgränsare",
        "Rutnät",
      ],
    },
  },
  components: {
    MinimalFooter: {
      fields: {
        logoUrl: { type: "text", label: "Logo-URL" },
        copyrightText: { type: "text", label: "Copyright-text" },
        logoWidth: { type: "number", label: "Logo bredd (px)" },
        logoHeight: { type: "number", label: "Logo höjd (px)" },
        align: {
          type: "select",
          label: "Justering",
          options: [
            { label: "Centrerad", value: "center" },
            { label: "Vänster", value: "left" },
            { label: "Höger", value: "right" },
          ],
        },
      },
      defaultProps: {
        logoUrl: "/8848.png",
        copyrightText: "© 2026 All Right Reserved",
        align: "center",
        logoWidth: 60,
        logoHeight: 20,
      },
      render: ({ logoUrl, copyrightText, align, logoWidth, logoHeight }) => (
        <MinimalFooter
          logoUrl={logoUrl}
          copyrightText={copyrightText}
          align={align}
          logoWidth={logoWidth}
          logoHeight={logoHeight}
        />
      ),
    },
    Rutnät: {
      render() {
        return (
          <DropZone
            zone="my-zone"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}
          />
        );
      },
    },
    HeroSection: {
      fields: {
        imageUrl: { type: "text", label: "Bild-URL" },
        height: { type: "number", label: "Höjd (px)" },
        width: { type: "number", label: "Bredd (px)" },
        position: {
          type: "select",
          label: "Position",
          options: [
            { label: "Centrerad", value: "center" },
            { label: "Vänster", value: "left" },
            { label: "Höger", value: "right" },
          ],
        },
        altText: { type: "text", label: "Alt-text" },
        articleNumber: { type: "text", label: "Artikelnummer" },
      },
      defaultProps: {
        imageUrl: "/jacka.png",
        height: 400,
        width: 300,
        position: "center",
        altText: "Produkt Photo",
        articleNumber: "Art nr 89349018",
      },
      render: ({
        imageUrl,
        height,
        width,
        position,
        altText,
        articleNumber,
      }) => (
        <ProductImage
          imageUrl={imageUrl}
          height={height}
          width={width}
          position={position}
          altText={altText}
          articleNumber={articleNumber}
        />
      ),
    },
    KeyMetric: {
      fields: {
        listOfFacts: {
          type: "array",
          label: "Nyckelfakta",
          arrayFields: {
            keyFact: { type: "text", label: "Nyckeltal" },
            value: { type: "text", label: "Beskrivning" },
          },
          defaultItemProps: {
            keyFact: "100%",
            value: "Recycled",
          },
          getItemSummary: (item: any) => item.keyFact || "Fact",
        },
        backgroundColor: { type: "text", label: "Bakgrundsfärg" },
        accentColor: {
          type: "select",
          label: "Accentfärg",
          options: [
            { label: "Green", value: "text-green-800" },
            { label: "Blue", value: "text-blue-800" },
            { label: "Red", value: "text-red-800" },
            { label: "Purple", value: "text-purple-800" },
            { label: "Black", value: "text-black" },
          ],
        },
      },
      defaultProps: {
        listOfFacts: [
          { keyFact: "100%", value: "Recycled" },
          { keyFact: "PFAS-free", value: "Impregnation" },
          { keyFact: "0.17kg", value: "CO₂ / transport" },
        ],
        backgroundColor: "#E2E2E2",
        accentColor: "text-green-800",
      },
      render: ({ listOfFacts, backgroundColor, accentColor }) => (
        <ThreeKeyFacts
          listOfFacts={listOfFacts}
          backgroundColor={backgroundColor}
          accentColor={accentColor}
        />
      ),
    },
    ExpandableCard: {
      fields: {
        items: {
          type: "array",
          label: "Sektioner",
          arrayFields: {
            title: { type: "text", label: "Rubrik" },
            content: { type: "textarea", label: "Innehåll" },
            links: {
              type: "array",
              label: "Länkar",
              arrayFields: {
                label: { type: "text", label: "Länktext" },
                url: { type: "text", label: "Länk-URL" },
              },
              getItemSummary: (item: any) => item.label || "Link",
            },
          },
          defaultItemProps: {
            title: "Section Title",
            content: "Section content goes here.",
            links: [],
          },
          getItemSummary: (item: any) => item.title || "Section",
        },
        buttonColor: { type: "text", label: "Knappfärg" },
        buttonHoverColor: { type: "text", label: "Hoverfärg" },
        contentBackgroundColor: { type: "text", label: "Bakgrundsfärg" },
      },
      defaultProps: {
        items: [
          {
            title: "Reparation, underhåll och återbruk",
            content:
              "Jackan är konstruerad med standardkomponenter som YKK‑dragkedjor, tryckknappar och utbytbara snoddar.",
            links: [
              {
                label: "Care & Repair (SV)",
                url: "https://www.8848altitude.com/sv-SE/8848-altitude/hallbarhet/care-and-repair",
              },
            ],
          },
        ],
        buttonColor: "#065f46",
        buttonHoverColor: "#064e3b",
        contentBackgroundColor: "#ecfdf5",
      },
      render: ({
        items,
        buttonColor,
        buttonHoverColor,
        contentBackgroundColor,
      }) => (
        <PopDownInfo
          items={items}
          buttonColor={buttonColor}
          buttonHoverColor={buttonHoverColor}
          contentBackgroundColor={contentBackgroundColor}
        />
      ),
    },
    CollectionSection: {
      fields: {
        title: { type: "text", label: "Rubrik" },
        buttonText: { type: "text", label: "Knapptext" },
        buttonUrl: { type: "text", label: "Knapp-URL" },
        backgroundColor: { type: "text", label: "Bakgrundsfärg" },
        mainImage: { type: "text", label: "Huvudbild" },
        overlayImage1: { type: "text", label: "Överläggsbild 1" },
        overlayImage2: { type: "text", label: "Överläggsbild 2" },
      },
      defaultProps: {
        title: "Ny kollektion - Stay Iconic",
        buttonText: "Shoppa",
        buttonUrl: "https://www.8848altitude.com/en/8848-magazine",
        backgroundColor: "#D4E9E2",
        mainImage: "/twoGirls.webp",
        overlayImage1: "/jackaiStudio.webp",
        overlayImage2: "/girl2.webp",
      },
      render: ({
        title,
        buttonText,
        buttonUrl,
        backgroundColor,
        mainImage,
        overlayImage1,
        overlayImage2,
      }) => (
        <NewCollection
          title={title}
          buttonText={buttonText}
          buttonUrl={buttonUrl}
          backgroundColor={backgroundColor}
          mainImage={mainImage}
          overlayImage1={overlayImage1}
          overlayImage2={overlayImage2}
        />
      ),
    },
    ProductRecommendations: {
      fields: {
        heading: { type: "text", label: "Rubrik" },
        linkText: { type: "text", label: "Länktext" },
        linkUrl: { type: "text", label: "Länk-URL" },
        products: {
          type: "array",
          label: "Produkter",
          arrayFields: {
            productTitle: { type: "text", label: "Produktnamn" },
            productCurrentPrice: { type: "number", label: "Nuvarande pris" },
            productPrevPrice: { type: "number", label: "Tidigare pris" },
            productImageSrc: { type: "text", label: "Produktbild" },
            colorOptions: {
              type: "array",
              label: "Färgalternativ",
              arrayFields: {
                color: { type: "text", label: "Färgkod" },
              },
              getItemSummary: (item: any) => item.color || "Color",
            },
          },
          defaultItemProps: {
            productTitle: "Product",
            productCurrentPrice: 999,
            productImageSrc: "/placeholder.webp",
          },
          getItemSummary: (item: any) => item.productTitle || "Product",
        },
      },
      defaultProps: {
        heading: "Kompletera din look med",
        linkText: "See mer",
        linkUrl: "https://www.8848altitude.com/sv-SE/dam/skidklader/skidjackor",
        products: [
          {
            productTitle: "Francias W Pant - Blanc",
            productCurrentPrice: 1299,
            productPrevPrice: 1799,
            colorOptions: [
              { color: "#000" },
              { color: "#fff" },
              { color: "#c8102e" },
            ],
            productImageSrc: "/franciasPant.webp",
          },
        ],
      },
      render: ({ heading, linkText, linkUrl, products }) => (
        <MoreProductSection
          heading={heading}
          linkText={linkText}
          linkUrl={linkUrl}
          products={
            products
              ? products.map((p: any) => ({
                  ...p,
                  colorOptions: p.colorOptions
                    ? p.colorOptions.map((c: any) => c.color)
                    : undefined,
                }))
              : undefined
          }
        />
      ),
    },

    // =====================
    // GENERAL COMPONENTS
    // =====================
    Rubrik: {
      fields: {
        title: { type: "text", label: "Rubrik" },
        level: {
          type: "select",
          label: "Rubriknivå",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
          ],
        },
        align: {
          type: "select",
          label: "Justering",
          options: [
            { label: "Vänster", value: "left" },
            { label: "Centrerad", value: "center" },
            { label: "Höger", value: "right" },
          ],
        },
        color: { type: "text", label: "Textfärg" },
        padding: { type: "text", label: "Inre marginal (padding)" },
      },
      defaultProps: {
        title: "Heading",
        level: "h2",
        align: "left",
        color: "#000000",
        padding: "16px 24px",
      },
      render: ({ title, level, align, color, padding }) => {
        const sizes: Record<string, string> = {
          h1: "2.5rem",
          h2: "2rem",
          h3: "1.5rem",
          h4: "1.25rem",
        };
        const style = { fontSize: sizes[level] || "2rem", color, margin: 0 };
        const inner =
          level === "h1" ? (
            <h1 style={style}>{title}</h1>
          ) : level === "h3" ? (
            <h3 style={style}>{title}</h3>
          ) : level === "h4" ? (
            <h4 style={style}>{title}</h4>
          ) : (
            <h2 style={style}>{title}</h2>
          );
        return <div style={{ padding, textAlign: align as any }}>{inner}</div>;
      },
    },
    Stycke: {
      fields: {
        content: { type: "textarea", label: "Text" },
        align: {
          type: "select",
          label: "Justering",
          options: [
            { label: "Vänster", value: "left" },
            { label: "Centrerad", value: "center" },
            { label: "Höger", value: "right" },
          ],
        },
        color: { type: "text", label: "Textfärg" },
        fontSize: {
          type: "select",
          label: "Textstorlek",
          options: [
            { label: "Liten", value: "14px" },
            { label: "Medel", value: "16px" },
            { label: "Stor", value: "18px" },
            { label: "Mycket stor", value: "20px" },
          ],
        },
        maxWidth: { type: "text", label: "Maxbredd" },
        padding: { type: "text", label: "Inre marginal (padding)" },
      },
      defaultProps: {
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id felis et ipsum bibendum ultrices.",
        align: "left",
        color: "#333333",
        fontSize: "16px",
        maxWidth: "800px",
        padding: "16px 24px",
      },
      render: ({ content, align, color, fontSize, maxWidth, padding }) => (
        <div
          style={{
            padding,
            textAlign: align as any,
            maxWidth,
            margin: align === "center" ? "0 auto" : undefined,
          }}
        >
          {content.split("\n").map((line: string, i: number) => (
            <p
              key={i}
              style={{ color, fontSize, lineHeight: 1.7, margin: "0 0 12px" }}
            >
              {line}
            </p>
          ))}
        </div>
      ),
    },
    "Formaterad text": {
      fields: {
        content: { type: "textarea", label: "Text" },
        padding: { type: "text", label: "Inre marginal (padding)" },
        maxWidth: { type: "text", label: "Maxbredd" },
      },
      defaultProps: {
        content:
          "Use **bold** and *italic* to format your text.\n\nYou can write multiple paragraphs separated by blank lines.",
        padding: "16px 24px",
        maxWidth: "800px",
      },
      render: ({ content, padding, maxWidth }) => {
        const formatText = (text: string) => {
          const parts: any[] = [];
          const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
          let lastIndex = 0;
          let match;
          let key = 0;
          while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
              parts.push(text.slice(lastIndex, match.index));
            }
            if (match[2]) {
              parts.push(<strong key={key++}>{match[2]}</strong>);
            } else if (match[3]) {
              parts.push(<em key={key++}>{match[3]}</em>);
            }
            lastIndex = match.index + match[0].length;
          }
          if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
          }
          return parts;
        };
        return (
          <div style={{ padding, maxWidth, margin: "0 auto" }}>
            {content.split("\n\n").map((block: string, i: number) => (
              <p
                key={i}
                style={{
                  color: "#333",
                  fontSize: "16px",
                  lineHeight: 1.7,
                  margin: "0 0 16px",
                }}
              >
                {formatText(block)}
              </p>
            ))}
          </div>
        );
      },
    },
    Bild: {
      fields: {
        url: { type: "text", label: "Bild-URL" },
        alt: { type: "text", label: "Alt-text" },
        maxWidth: { type: "text", label: "Maxbredd" },
        align: {
          type: "select",
          label: "Justering",
          options: [
            { label: "Vänster", value: "flex-start" },
            { label: "Centrerad", value: "center" },
            { label: "Höger", value: "flex-end" },
          ],
        },
        padding: { type: "text", label: "Inre marginal (padding)" },
        rounded: {
          type: "select",
          label: "Rundade hörn",
          options: [
            { label: "Ingen", value: "0" },
            { label: "Liten", value: "8px" },
            { label: "Medel", value: "16px" },
            { label: "Stor", value: "24px" },
            { label: "Helt", value: "9999px" },
          ],
        },
      },
      defaultProps: {
        url: "/placeholder.webp",
        alt: "Image",
        maxWidth: "100%",
        align: "center",
        padding: "16px 24px",
        rounded: "8px",
      },
      render: ({ url, alt, maxWidth, align, padding, rounded }) => (
        <div style={{ padding, display: "flex", justifyContent: align }}>
          <img
            src={url}
            alt={alt}
            style={{
              maxWidth,
              width: "100%",
              borderRadius: rounded,
              display: "block",
            }}
          />
        </div>
      ),
    },
    Video: {
      fields: {
        url: { type: "text", label: "Video-URL" },
        padding: { type: "text", label: "Inre marginal (padding)" },
        maxWidth: { type: "text", label: "Maxbredd" },
        align: {
          type: "select",
          label: "Justering",
          options: [
            { label: "Vänster", value: "flex-start" },
            { label: "Centrerad", value: "center" },
            { label: "Höger", value: "flex-end" },
          ],
        },
      },
      defaultProps: {
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        padding: "16px 24px",
        maxWidth: "800px",
        align: "center",
      },
      render: ({ url, padding, maxWidth, align }) => (
        <div style={{ padding, display: "flex", justifyContent: align }}>
          <div style={{ width: "100%", maxWidth, aspectRatio: "16 / 9" }}>
            <iframe
              src={url}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "8px",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ),
    },
    Knapp: {
      fields: {
        label: { type: "text", label: "Knapptext" },
        href: { type: "text", label: "Länk-URL" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "Primär", value: "primary" },
            { label: "Sekundär", value: "secondary" },
            { label: "Kontur", value: "outline" },
          ],
        },
        align: {
          type: "select",
          label: "Justering",
          options: [
            { label: "Vänster", value: "flex-start" },
            { label: "Centrerad", value: "center" },
            { label: "Höger", value: "flex-end" },
          ],
        },
        padding: { type: "text", label: "Inre marginal (padding)" },
      },
      defaultProps: {
        label: "Click me",
        href: "#",
        variant: "primary",
        align: "flex-start",
        padding: "16px 24px",
      },
      render: ({ label, href, variant, align, padding }) => {
        const styles: Record<string, React.CSSProperties> = {
          primary: {
            backgroundColor: "#000",
            color: "#fff",
            border: "2px solid #000",
            padding: "10px 24px",
            borderRadius: "6px",
            cursor: "pointer",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 500,
          },
          secondary: {
            backgroundColor: "#555",
            color: "#fff",
            border: "2px solid #555",
            padding: "10px 24px",
            borderRadius: "6px",
            cursor: "pointer",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 500,
          },
          outline: {
            backgroundColor: "transparent",
            color: "#000",
            border: "2px solid #000",
            padding: "10px 24px",
            borderRadius: "6px",
            cursor: "pointer",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: 500,
          },
        };
        return (
          <div style={{ padding, display: "flex", justifyContent: align }}>
            <a href={href} style={styles[variant] || styles.primary}>
              {label}
            </a>
          </div>
        );
      },
    },
    Avgränsare: {
      fields: {
        color: { type: "text", label: "Färg" },
        thickness: {
          type: "select",
          label: "Tjocklek",
          options: [
            { label: "Tunn (1px)", value: "1px" },
            { label: "Medel (2px)", value: "2px" },
            { label: "Tjock (4px)", value: "4px" },
          ],
        },
        margin: { type: "text", label: "Yttre marginal (margin)" },
      },
      defaultProps: {
        color: "#e2e2e2",
        thickness: "1px",
        margin: "16px 0",
      },
      render: ({ color, thickness, margin }) => (
        <hr
          style={{
            border: "none",
            borderTop: `${thickness} solid ${color}`,
            margin,
          }}
        />
      ),
    },
  },
};

export default config;
