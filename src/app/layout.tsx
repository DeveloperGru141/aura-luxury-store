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
  title: "OMO ESHO SIGNATURES | Designer Bags, Wears, Shoes, Wristwatches & Fine Jewelry",
  description:
    "Discover handcrafted Italian leather bags, bespoke wears, luxury shoes, Swiss automatic wristwatches, and certified 18k fine jewelry.",
  keywords: [
    "Luxury fashion",
    "Designer bags",
    "Fine wears",
    "Wristwatches",
    "Luxury timepieces",
    "Fine jewelry",
    "Luxury shoes",
    "Italian leather",
  ],
  openGraph: {
    title: "OMO ESHO SIGNATURES | Designer Bags, Wears, Wristwatches & Fine Jewelry",
    description:
      "Handcrafted Italian leather bags, bespoke wears, Swiss automatic wristwatches, and 18k fine jewelry.",
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
      <body className="font-sans antialiased bg-[#0D0F14] text-white min-h-screen">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
