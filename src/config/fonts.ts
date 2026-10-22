import { Noto_Serif, Inter, Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";

export const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
});

export const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

// Self-hosted: next/font/google has no fallback metrics for this font and warns on every request.
export const waitingForTheSunrise = localFont({
  src: "../assets/fonts/waiting-for-the-sunrise-latin.woff2",
  variable: "--font-waiting-for-the-sunrise",
  weight: "400",
  display: "swap",
  preload: true,
});

export const fontVariables = [
  notoSerif.variable,
  inter.variable,
  plusJakartaSans.variable,
  cormorantGaramond.variable,
  waitingForTheSunrise.variable,
].join(" ");

