"use client";

import { usePathname } from "next/navigation";
import { removeLocaleFromPath } from "@/lib/i18n/routing";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const cleanPath = removeLocaleFromPath(pathname || "");
  const isHomePage = cleanPath === "/" || pathname === "/";
  const isTravelDetail = /^\/viaggi\/[^/]+/.test(cleanPath);

  return (
    <main className={`flex-1 ${isHomePage ? "" : `pb-16 ${isTravelDetail ? "" : "pt-(--header-height)"}`}`}>
      {children}
    </main>
  );
}

