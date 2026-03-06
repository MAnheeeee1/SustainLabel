import Image from "next/image";
import { number } from "zod";

type MinimalFooterProps = {
  copyWriteText?: string;
  logoUrl?: string;
  align?: string;
  logoWidth?: number;
  logoHeight?: number;
};

export default function MinimalFooter({
  copyWriteText = "© 2026 All Right Reserved",
  logoUrl = "/8848.png",
  logoWidth = 60,
  logoHeight = 20,
}: MinimalFooterProps) {
  return (
    <div>
      <hr />
      <div className="flex p-2 justify-center flex-col items-center">
        <h1 className="my-2 mb-5">{copyWriteText}</h1>
        <Image src={logoUrl} height={logoHeight} width={logoWidth} alt="Logo" />
      </div>
    </div>
  );
}
