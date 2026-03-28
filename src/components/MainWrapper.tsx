"use client";

import { usePathname } from "next/navigation";
import { removeLocaleFromPath } from "@/lib/i18n/routing";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = removeLocaleFromPath(pathname || "") === "/" || pathname === "/";

  return (
    <main className={`flex-1 pt-[88px] ${isHomePage ? "" : "pb-16"}`}>
      {children}
    </main>
  );
}

