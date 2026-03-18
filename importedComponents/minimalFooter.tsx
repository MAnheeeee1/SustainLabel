import Image from "next/image";

type MinimalFooterProps = {
  copyrightText?: string;
  logoUrl?: string;
  align?: "left" | "center" | "right";
  logoWidth?: number;
  logoHeight?: number;
};

export default function MinimalFooter({
  copyrightText = "© 2026 All Right Reserved",
  logoUrl = "/8848.png",
  align = "center",
  logoWidth = 60,
  logoHeight = 20,
}: MinimalFooterProps) {
  const alignmentClass =
    align === "left"
      ? "items-start"
      : align === "right"
        ? "items-end"
        : "items-center";

  return (
    <div>
      <hr />
      <div className={`flex p-2 justify-center flex-col ${alignmentClass}`}>
        <h1 className="my-2 mb-5">{copyrightText}</h1>
        <Image src={logoUrl} height={logoHeight} width={logoWidth} alt="Logo" />
      </div>
    </div>
  );
}
