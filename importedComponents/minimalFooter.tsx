import Image from "next/image";

type MinimalFooterProps = {
  copyrightText?: string;
  logoSrc?: string;
  logoWidth?: number;
  logoHeight?: number;
};

export default function MinimalFooter({
  copyrightText = "© 2026 All Right Reserved",
  logoSrc = "/8848.png",
  logoWidth = 60,
  logoHeight = 20,
}: MinimalFooterProps) {
  return (
    <div>
      <hr />
      <div className="flex p-2 justify-center flex-col items-center">
        <h1 className="my-2 mb-5">{copyrightText}</h1>
        <Image src={logoSrc} height={logoHeight} width={logoWidth} alt="Logo" />
      </div>
    </div>
  );
}
