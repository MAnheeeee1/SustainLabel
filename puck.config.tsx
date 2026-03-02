import type { Config } from "@puckeditor/core";
import MoreProductSection from "./importedComponents/moreProductSection";
import NewCollection from "./importedComponents/newCollection";
import PopDownInfo from "./importedComponents/popDownInfo";
import ProductImage from "./importedComponents/productImage";
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
    listofFacts: { keyFact: string; value: string }[];
    bgColor: string;
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
    contentBgColor: string;
  };
  CollectionSection: {
    title: string;
    buttonText: string;
    buttonUrl: string;
    bgColor: string;
    mainImage: string;
    overlayImage1: string;
    overlayImage2: string;
  };
  ProductRecommendations: {
    heading: string;
    linkText: string;
    linkUrl: string;
    products: {
      productTitel: string;
      productCurrentPrice: number;
      productPrevPrice?: number;
      colorOptions?: { color: string }[];
      productImageSrc: string;
    }[];
  };
  // General components
  Heading: {
    title: string;
    level: string;
    align: string;
    color: string;
    padding: string;
  };
  Paragraph: {
    content: string;
    align: string;
    color: string;
    fontSize: string;
    maxWidth: string;
    padding: string;
  };
  RichText: {
    content: string;
    padding: string;
    maxWidth: string;
  };
  Image: {
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
  Button: {
    label: string;
    href: string;
    variant: string;
    align: string;
    padding: string;
  };
  Divider: {
    color: string;
    thickness: string;
    margin: string;
  };
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
      ],
    },
    General: {
      components: [
        "Heading",
        "Paragraph",
        "RichText",
        "Image",
        "Video",
        "Button",
        "Divider",
      ],
    },
  },
  components: {
    HeroSection: {
      fields: {
        imageUrl: { type: "text" },
        height: { type: "number" },
        width: { type: "number" },
        position: {
          type: "select",
          options: [
            { label: "Center", value: "center" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
        },
        altText: { type: "text" },
        articleNumber: { type: "text" },
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
        listofFacts: {
          type: "array",
          arrayFields: {
            keyFact: { type: "text" },
            value: { type: "text" },
          },
          defaultItemProps: {
            keyFact: "100%",
            value: "Recycled",
          },
          getItemSummary: (item: any) => item.keyFact || "Fact",
        },
        bgColor: { type: "text" },
        accentColor: {
          type: "select",
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
        listofFacts: [
          { keyFact: "100%", value: "Recycled" },
          { keyFact: "PFAS-free", value: "Impregnation" },
          { keyFact: "0.17kg", value: "CO₂ / transport" },
        ],
        bgColor: "#E2E2E2",
        accentColor: "text-green-800",
      },
      render: ({ listofFacts, bgColor, accentColor }) => (
        <ThreeKeyFacts
          listofFacts={listofFacts}
          bgColor={bgColor}
          accentColor={accentColor}
        />
      ),
    },
    ExpandableCard: {
      fields: {
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            content: { type: "textarea" },
            links: {
              type: "array",
              arrayFields: {
                label: { type: "text" },
                url: { type: "text" },
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
        buttonColor: { type: "text" },
        buttonHoverColor: { type: "text" },
        contentBgColor: { type: "text" },
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
        contentBgColor: "#ecfdf5",
      },
      render: ({ items, buttonColor, buttonHoverColor, contentBgColor }) => (
        <PopDownInfo
          items={items}
          buttonColor={buttonColor}
          buttonHoverColor={buttonHoverColor}
          contentBgColor={contentBgColor}
        />
      ),
    },
    CollectionSection: {
      fields: {
        title: { type: "text" },
        buttonText: { type: "text" },
        buttonUrl: { type: "text" },
        bgColor: { type: "text" },
        mainImage: { type: "text" },
        overlayImage1: { type: "text" },
        overlayImage2: { type: "text" },
      },
      defaultProps: {
        title: "Ny kollektion - Stay Iconic",
        buttonText: "Shoppa",
        buttonUrl: "https://www.8848altitude.com/en/8848-magazine",
        bgColor: "#D4E9E2",
        mainImage: "/twoGirls.webp",
        overlayImage1: "/jackaiStudio.webp",
        overlayImage2: "/girl2.webp",
      },
      render: ({
        title,
        buttonText,
        buttonUrl,
        bgColor,
        mainImage,
        overlayImage1,
        overlayImage2,
      }) => (
        <NewCollection
          title={title}
          buttonText={buttonText}
          buttonUrl={buttonUrl}
          bgColor={bgColor}
          mainImage={mainImage}
          overlayImage1={overlayImage1}
          overlayImage2={overlayImage2}
        />
      ),
    },
    ProductRecommendations: {
      fields: {
        heading: { type: "text" },
        linkText: { type: "text" },
        linkUrl: { type: "text" },
        products: {
          type: "array",
          arrayFields: {
            productTitel: { type: "text" },
            productCurrentPrice: { type: "number" },
            productPrevPrice: { type: "number" },
            productImageSrc: { type: "text" },
            colorOptions: {
              type: "array",
              arrayFields: {
                color: { type: "text" },
              },
              getItemSummary: (item: any) => item.color || "Color",
            },
          },
          defaultItemProps: {
            productTitel: "Product",
            productCurrentPrice: 999,
            productImageSrc: "/placeholder.webp",
          },
          getItemSummary: (item: any) => item.productTitel || "Product",
        },
      },
      defaultProps: {
        heading: "Kompletera din look med",
        linkText: "See mer",
        linkUrl: "https://www.8848altitude.com/sv-SE/dam/skidklader/skidjackor",
        products: [
          {
            productTitel: "Francias W Pant - Blanc",
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
    Heading: {
      fields: {
        title: { type: "text" },
        level: {
          type: "select",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
          ],
        },
        align: {
          type: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        color: { type: "text" },
        padding: { type: "text" },
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
    Paragraph: {
      fields: {
        content: { type: "textarea" },
        align: {
          type: "select",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        color: { type: "text" },
        fontSize: {
          type: "select",
          options: [
            { label: "Small", value: "14px" },
            { label: "Medium", value: "16px" },
            { label: "Large", value: "18px" },
            { label: "XL", value: "20px" },
          ],
        },
        maxWidth: { type: "text" },
        padding: { type: "text" },
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
    RichText: {
      fields: {
        content: { type: "textarea" },
        padding: { type: "text" },
        maxWidth: { type: "text" },
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
    Image: {
      fields: {
        url: { type: "text" },
        alt: { type: "text" },
        maxWidth: { type: "text" },
        align: {
          type: "select",
          options: [
            { label: "Left", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "Right", value: "flex-end" },
          ],
        },
        padding: { type: "text" },
        rounded: {
          type: "select",
          options: [
            { label: "None", value: "0" },
            { label: "Small", value: "8px" },
            { label: "Medium", value: "16px" },
            { label: "Large", value: "24px" },
            { label: "Full", value: "9999px" },
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
        url: { type: "text" },
        padding: { type: "text" },
        maxWidth: { type: "text" },
        align: {
          type: "select",
          options: [
            { label: "Left", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "Right", value: "flex-end" },
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
    Button: {
      fields: {
        label: { type: "text" },
        href: { type: "text" },
        variant: {
          type: "select",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
          ],
        },
        align: {
          type: "select",
          options: [
            { label: "Left", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "Right", value: "flex-end" },
          ],
        },
        padding: { type: "text" },
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
    Divider: {
      fields: {
        color: { type: "text" },
        thickness: {
          type: "select",
          options: [
            { label: "Thin (1px)", value: "1px" },
            { label: "Medium (2px)", value: "2px" },
            { label: "Thick (4px)", value: "4px" },
          ],
        },
        margin: { type: "text" },
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
