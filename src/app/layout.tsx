import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import { StoreProvider } from "@/context/StoreContext";
import "./globals.css";

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
  title: "AURA Luxury Collective | Bags, Haute Couture, Timepieces & Fine Jewelry",
  description:
    "Discover handcrafted Italian leather bags, bespoke haute couture, Swiss automatic chronometers, sculpted footwear, and certified 18k fine jewelry.",
  keywords: [
    "Luxury fashion",
    "Designer bags",
    "Haute couture",
    "Swiss timepieces",
    "Fine jewelry",
    "Luxury shoes",
    "Italian leather",
  ],
  openGraph: {
    title: "AURA Luxury Collective | Maison de Luxe",
    description:
      "Handcrafted Italian leather bags, bespoke haute couture, Swiss automatic chronometers, and 18k fine jewelry.",
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
