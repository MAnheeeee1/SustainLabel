import React from "react";
import ProductSlider from "./productSlider";
import Image from "next/image";

type MoreProductSectionProps = {
  heading?: string;
  linkText?: string;
  linkUrl?: string;
  products?: {
    productTitel: string;
    productCurrentPrice: number;
    productPrevPrice?: number;
    colorOptions?: string[];
    productImageSrc: string;
  }[];
};

function MoreProductSection({
  heading = "Kompletera din look med",
  linkText = "See mer",
  linkUrl = "https://www.8848altitude.com/sv-SE/dam/skidklader/skidjackor",
  products,
}: MoreProductSectionProps) {
  return (
    <div>
      <h2 className="text-3xl pl-2 mt-15 ">{heading}</h2>
      <p className="pl-2 text-xl inline-block pr-2">
        <a href={linkUrl} target="_blank">
          {linkText}
        </a>
      </p>
      <a href={linkUrl} target="_blank">
        <Image
          className="inline-block"
          src="/right-arrow.png"
          height={10}
          width={30}
          alt="Right arrow"
        />
      </a>
      <ProductSlider products={products} />
    </div>
  );
}

export default MoreProductSection;
