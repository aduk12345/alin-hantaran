import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Poppins } from "next/font/google";
import { CartRoot } from "@/components/cart/CartRoot";
import { ErudaLoader } from "@/components/dev/ErudaLoader";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alin Hantaran — Catalog & Pricelist",
  description:
    "Katalog & pricelist sewa hias box seserahan Alin Hantaran, Morowudi, Gresik.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {process.env.NODE_ENV === "development" && <ErudaLoader />}
        <CartRoot>{children}</CartRoot>
      </body>
    </html>
  );
}
