import type { Data } from "@puckeditor/core";

type PuckNode = {
  type?: string;
  props?: Record<string, any>;
  zones?: Record<string, PuckNode[]>;
};

type PuckDataLike = Partial<Data> & {
  content?: PuckNode[];
  root?: {
    props?: Record<string, any>;
    zones?: Record<string, PuckNode[]>;
  };
};

function normalizeComponentProps(
  type: string | undefined,
  props: Record<string, any>,
) {
  if (!type) return props;

  switch (type) {
    case "KeyMetric": {
      const listOfFacts = props.listOfFacts ?? props.listofFacts ?? [];
      const backgroundColor = props.backgroundColor ?? props.bgColor;
      const {
        listofFacts: _legacyListOfFacts,
        bgColor: _legacyBgColor,
        ...rest
      } = props;

      return {
        ...rest,
        listOfFacts,
        ...(backgroundColor ? { backgroundColor } : {}),
      };
    }

    case "CollectionSection": {
      const backgroundColor = props.backgroundColor ?? props.bgColor;
      const { bgColor: _legacyBgColor, ...rest } = props;
      return {
        ...rest,
        ...(backgroundColor ? { backgroundColor } : {}),
      };
    }

    case "ExpandableCard": {
      const contentBackgroundColor =
        props.contentBackgroundColor ?? props.contentBgColor;
      const { contentBgColor: _legacyContentBgColor, ...rest } = props;
      return {
        ...rest,
        ...(contentBackgroundColor ? { contentBackgroundColor } : {}),
      };
    }

    case "ProductRecommendations": {
      const products = Array.isArray(props.products)
        ? props.products.map((product: Record<string, any>) => {
            const { productTitel: _legacyProductTitle, ...normalizedProduct } =
              product;
            return {
              ...normalizedProduct,
              productTitle: product.productTitle ?? product.productTitel,
            };
          })
        : props.products;

      return {
        ...props,
        ...(products ? { products } : {}),
      };
    }

    case "MinimalFooter": {
      const copyrightText = props.copyrightText ?? props.copyWriteText;
      const { copyWriteText: _legacyCopyrightText, ...rest } = props;
      return {
        ...rest,
        ...(copyrightText ? { copyrightText } : {}),
      };
    }

    default:
      return props;
  }
}

function normalizeNode(node: PuckNode): PuckNode {
  const normalizedProps = normalizeComponentProps(node.type, node.props ?? {});

  const normalizedZones = node.zones
    ? Object.fromEntries(
        Object.entries(node.zones).map(([zoneName, zoneNodes]) => [
          zoneName,
          zoneNodes.map(normalizeNode),
        ]),
      )
    : undefined;

  return {
    ...node,
    props: normalizedProps,
    ...(normalizedZones ? { zones: normalizedZones } : {}),
  };
}

export function normalizePuckData<T extends PuckDataLike | null | undefined>(
  data: T,
): T {
  if (!data) return data;

  const normalizedContent = Array.isArray(data.content)
    ? data.content.map(normalizeNode)
    : data.content;

  const normalizedRootZones = data.root?.zones
    ? Object.fromEntries(
        Object.entries(data.root.zones).map(([zoneName, zoneNodes]) => [
          zoneName,
          zoneNodes.map(normalizeNode),
        ]),
      )
    : data.root?.zones;

  return {
    ...data,
    ...(normalizedContent !== undefined ? { content: normalizedContent } : {}),
    ...(data.root
      ? {
          root: {
            ...data.root,
            ...(normalizedRootZones !== undefined
              ? { zones: normalizedRootZones }
              : {}),
          },
        }
      : {}),
  } as T;
}
