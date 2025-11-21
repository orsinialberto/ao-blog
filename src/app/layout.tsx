import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://travel.example.com"),
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
        className={`${geistSans.variable} ${geistMono.variable} bg-brand-background antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pb-16 pt-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
