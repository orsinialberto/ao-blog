/**
 * Root layout - provides base HTML structure
 * Next.js requires <html> and <body> tags in the root layout
 * The [locale]/layout.tsx handles locale-specific metadata and page structure
 */

import "./globals.css";
import { defaultLocale } from "@/config/locales";
import { fontVariables } from "@/config/fonts";
import { LangAttributeSetter } from "@/components/LangAttributeSetter";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <body className={`${fontVariables} bg-white font-body antialiased`}>
        <LangAttributeSetter />
        {children}
      </body>
    </html>
  );
}
