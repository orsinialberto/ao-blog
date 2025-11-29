"use client";

import { usePathname } from "next/navigation";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <main className={`flex-1 pb-16 ${isHomePage ? "pt-0" : "pt-10"}`}>
      {children}
    </main>
  );
}

