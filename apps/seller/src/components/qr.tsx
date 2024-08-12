import { SmallBorderButton } from "./small-border-button";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";

export const Qr = ({ size, url }: { size?: 200 | 100; url?: string }) => {
  return (
    <div className="flex items-end">
      <div
        className={`h-auto mt-5 ${
          size === 200 || !size ? "w-[200px]" : "w-[100px]"
        }`}
      >
        <QRCodeCanvas
          className="h-auto max-w-full w-full"
          size={size}
          width={size}
          height={size}
          value={url || "awdawawdawdawd"}
        />
      </div>
      <SmallBorderButton
        className="border-[#101010] ml-3"
        type="button"
        onClick={() => {
          const canvas = document.querySelector("canvas");
          const url = canvas ? canvas.toDataURL("image/png") : "";
          const link = document.createElement("a");
          link.href = url;
          link.download = `qrcode.png`;
          link.click();
        }}
      >
        <div className="flex items-center">
          <Image
            alt="Download"
            src="/download.png"
            width={18}
            height={18}
            className="mr-2.5"
          />
          다운로드
        </div>
      </SmallBorderButton>
    </div>
  );
};
