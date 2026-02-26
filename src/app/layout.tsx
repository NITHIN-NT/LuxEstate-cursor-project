import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading-name",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-body-name",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuxEstate - Premium Real Estate",
  description: "Experience luxury living redefined. Explore our curated collection of extraordinary properties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head />
      <body
        className={`${playfair.variable} ${outfit.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
