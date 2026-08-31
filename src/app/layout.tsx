import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import { StoreProvider } from "@/context/StoreContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D0F12",
};

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OMO ESHO SIGNATURES | Ilorin Atelier — Small-Run Leather, Silk & 18k Gold",
  description:
    "Omo Esho Signatures brings together small-run leatherwork, fine silks, precision timepieces and 18k gold — curated locally in Ilorin and delivered worldwide with insured courier care.",
  keywords: [
    "Ilorin atelier",
    "Small-run luxury",
    "Omo Esho Signatures",
    "Nigerian luxury",
    "Leatherwork Ilorin",
    "18k gold",
    "Insured courier Nigeria",
  ],
  openGraph: {
    title: "OMO ESHO SIGNATURES | Ilorin Atelier — Small-Run Leather, Silk & 18k Gold",
    description:
      "Small-run leatherwork, fine silks, precision timepieces and 18k gold — curated in Ilorin and delivered worldwide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} scroll-smooth dark`}>
      <body className="font-sans antialiased bg-[#FAF8F5] text-[#1A1918] min-h-screen">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
