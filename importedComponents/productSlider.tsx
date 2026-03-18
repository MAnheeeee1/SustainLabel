"use client";

import React, { useRef } from "react";
import ProductCard from "./productCard";

type Product = {
  productTitle: string;
  productCurrentPrice: number;
  productPrevPrice?: number;
  colorOptions?: string[];
  productImageSrc: string;
};

const defaultProducts: Product[] = [
  {
    productTitle: "Francias W Pant - Blanc",
    productCurrentPrice: 1299,
    productPrevPrice: 1799,
    colorOptions: ["#000", "#fff", "#c8102e"],
    productImageSrc: "/franciasPant.webp",
  },
  {
    productTitle: "Star Shoftshell Mitte -Blanc",
    productCurrentPrice: 999,
    colorOptions: ["#1a1a2e", "#e94560"],
    productImageSrc: "/starmitten.webp",
  },
  {
    productTitle: "Rain Shell",
    productCurrentPrice: 699,
    productPrevPrice: 899,
    colorOptions: ["#0f3460", "#16213e", "#e94560"],
    productImageSrc: "/lolahat.webp",
  },
];

type ProductSliderProps = {
  products?: Product[];
};

function ProductSlider({ products }: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const items = products && products.length > 0 ? products : defaultProducts;

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.offsetWidth * 0.6;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full p-2 ">
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-10 h-10 items-center justify-center shadow"
        aria-label="Scroll left"
      >
        &#8249;
      </button>

      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 py-2 no-scrollbar"
      >
        {items.map((product, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[45%] md:w-[30%] lg:w-[23%]"
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full w-10 h-10 items-center justify-center shadow"
        aria-label="Scroll right"
      >
        &#8250;
      </button>
    </div>
  );
}

export default ProductSlider;
