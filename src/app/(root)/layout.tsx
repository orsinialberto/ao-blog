/**
 * Root layout for "/" only, which redirects to the default locale.
 * Every other route is rendered by [locale]/layout.tsx, which is its own root layout.
 */

import "../globals.css";
import { defaultLocale } from "@/config/locales";
import { fontVariables } from "@/config/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <body className={`${fontVariables} bg-white font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
