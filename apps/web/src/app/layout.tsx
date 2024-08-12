import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "./providers";

const notoSansKR = localFont({
  src: [
    { path: "../../public/fonts/AppleSDGothicNeoH.ttf", weight: "900" },
    { path: "../../public/fonts/AppleSDGothicNeoEB.ttf", weight: "800" },
    { path: "../../public/fonts/AppleSDGothicNeoB.ttf", weight: "700" },
    { path: "../../public/fonts/AppleSDGothicNeoM.ttf", weight: "500" },
    { path: "../../public/fonts/AppleSDGothicNeoR.ttf", weight: "400" },
    { path: "../../public/fonts/AppleSDGothicNeoL.ttf", weight: "300" },
  ],
  variable: "--apple-sd-gothic",
});

export const metadata: Metadata = {
  title: "QR Menu",
  description: "QR Menu System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={notoSansKR.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
