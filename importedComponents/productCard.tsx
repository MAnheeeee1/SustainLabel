import Image from "next/image";
import React from "react";
type ProductCardProps = {
  productTitel: string;
  productCurrentPrice: number;
  productPrevPrice?: number;
  colorOptions?: string[];
  productImageSrc: string;
};
function ProductCard({
  productTitel,
  productCurrentPrice,
  productPrevPrice,
  colorOptions,
  productImageSrc,
}: ProductCardProps) {
  return (
    <div className="flex flex-col content-center ">
      <Image
        height={150}
        width={250}
        src={productImageSrc}
        alt="Picture of jacket"
      />
      <div className="text-center">
        <h4>{productTitel}</h4>
        <h6 className="line-through opacity-67 text-sm text-">
          {productPrevPrice && productPrevPrice + " SEK"}
        </h6>
        <h4>{productCurrentPrice} SEK</h4>
        <div className="flex gap-1 justify-center mt-1">
          {colorOptions &&
            colorOptions.map((color, i) => {
              return (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                ></div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
