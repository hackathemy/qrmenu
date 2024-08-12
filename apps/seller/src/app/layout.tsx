import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";
import Providers from "./providers";
import { cookies } from "next/headers";

const notoSansKR = localFont({
  src: [
    { path: "../../public/fonts/NotoSansKR-Black.ttf", weight: "900" },
    { path: "../../public/fonts/NotoSansKR-Bold.ttf", weight: "700" },
    { path: "../../public/fonts/NotoSansKR-Regular.ttf", weight: "400" },
  ],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "QR Seller",
  description: `QR Menu System for Seller`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  return (
    <html lang="en">
      <body className={notoSansKR.variable}>
        <Providers accessToken={accessToken?.value}>{children}</Providers>
      </body>
    </html>
  );
}
