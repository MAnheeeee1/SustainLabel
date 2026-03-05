import React from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QRCodeDisplay({ url }: { url: string }) {
  return <QRCodeSVG value={url} size={200} />;
}
