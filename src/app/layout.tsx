import type { Metadata } from "next";
import { Geist, Geist_Mono, Comforter, Klee_One, Poiret_One } from "next/font/google";

import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MainWrapper } from "@/components/MainWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comforter = Comforter({
  variable: "--font-comforter",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
});

const kleeOne = Klee_One({
  variable: "--font-klee-one",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  preload: true,
});

const poiretOne = Poiret_One({
  variable: "--font-poiret-one",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://albertorsini.it"),
  title: {
    default: "Diario di Viaggio",
    template: "%s · Diario di Viaggio",
  },
  description:
    "Itinerari, foto e appunti di viaggio raccontati attraverso un sito veloce e moderno.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${comforter.variable} ${kleeOne.variable} ${poiretOne.variable} bg-brand-background antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <MainWrapper>{children}</MainWrapper>
          <Footer />
        </div>
      </body>
    </html>
  );
}
