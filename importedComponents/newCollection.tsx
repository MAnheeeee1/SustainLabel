import React from "react";
import Image from "next/image";

type NewCollectionProps = {
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
  bgColor?: string;
  mainImage?: string;
  overlayImage1?: string;
  overlayImage2?: string;
};

function NewCollection({
  title = "Ny kollektion - Stay Iconic",
  buttonText = "Shoppa",
  buttonUrl = "https://www.8848altitude.com/en/8848-magazine",
  bgColor = "#D4E9E2",
  mainImage = "/twoGirls.webp",
  overlayImage1 = "/jackaiStudio.webp",
  overlayImage2 = "/girl2.webp",
}: NewCollectionProps) {
  return (
    <div className="p-2 mt-15 pt-10 pb-25" style={{ backgroundColor: bgColor }}>
      <h1 className="text-3xl pb-5">{title}</h1>
      <div className="flex justify-around">
        <div className="border self-start px-2.5 py-1 ">
          <a href={buttonUrl} target="_blank">
            {buttonText}
          </a>
        </div>
        <div className="relative inline-block">
          <Image
            src={mainImage}
            alt="Collection main image"
            width={200}
            height={300}
            className="z-20"
          />
          <Image
            src={overlayImage1}
            alt="Collection overlay 1"
            width={100}
            height={100}
            className="absolute -bottom-10 z-30 -right-5 w-24 h-24 object-cover"
          />
          <Image
            src={overlayImage2}
            alt="Collection overlay 2"
            width={125}
            height={225}
            className="absolute -bottom-15 z-10 -left-18"
          />
        </div>
      </div>
    </div>
  );
}

export default NewCollection;
