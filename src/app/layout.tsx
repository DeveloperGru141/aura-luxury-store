import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import { StoreProvider } from "@/context/StoreContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFFFF",
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
    "Discover handcrafted Ilorin leather bags, bespoke wears, luxury shoes, Ilorin automatic wristwatches, and certified 18k fine jewelry.",
  keywords: [
    "Luxury fashion",
    "Designer bags",
    "Fine wears",
    "Wristwatches",
    "Luxury timepieces",
    "Fine jewelry",
    "Luxury shoes",
    "Ilorin leather",
  ],
  openGraph: {
    title: "OMO ESHO SIGNATURES | Designer Bags, Wears, Wristwatches & Fine Jewelry",
    description:
      "Handcrafted Ilorin leather bags, bespoke wears, Ilorin automatic wristwatches, and 18k fine jewelry.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[var(--color-surface)] text-[var(--color-text-primary)] min-h-screen">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
