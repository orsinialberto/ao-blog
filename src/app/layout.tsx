import type { Metadata } from "next";

import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MainWrapper } from "@/components/MainWrapper";
import { fontVariables } from "@/config/fonts";
import { siteMetadata } from "@/config/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.url),
  title: siteMetadata.title,
  description: siteMetadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteMetadata.locale.split("-")[0]}>
      <body className={`${fontVariables} bg-brand-background antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <MainWrapper>{children}</MainWrapper>
          <Footer />
        </div>
      </body>
    </html>
  );
}
