import React from "react";
import Image from "next/image";
type ImageProps = {
  imageUrl: string;
  height: number;
  width: number;
  position?: string;
  altText?: string;
  articleNumber?: string;
};
const ProductImage = ({
  imageUrl,
  height,
  width,
  position,
  altText = "Produkt Photo",
  articleNumber = "Art nr 89349018",
}: ImageProps) => {
  let divClassName = "flex justify-center items-center";
  if (position == "center") {
    divClassName = "flex justify-center items-center";
  } else if (position == "left") {
    divClassName = "flex justify-start items-center";
  } else if (position == "right") {
    divClassName = "flex justify-end items-center";
  }
  divClassName += " relative py-10";
  return (
    <div className={divClassName}>
      <Image alt={altText} src={imageUrl} height={height} width={width} />
      {articleNumber && (
        <p className="absolute bottom-12 right-18">{articleNumber}</p>
      )}
    </div>
  );
};

export default ProductImage;
