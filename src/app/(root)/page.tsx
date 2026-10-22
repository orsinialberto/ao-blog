"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/config/locales";

/**
 * Root page redirects to default locale
 * For static export, we use client-side redirect from / to /it/
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${defaultLocale}`);
  }, [router]);

  // Show loading state during redirect
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-brand-muted">Loading...</div>
    </div>
  );
}
