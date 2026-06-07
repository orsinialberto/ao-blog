"use client";

import Link from "next/link";
import { useLocale } from "@/i18n/hooks";
import { createLocalizedPath } from "@/lib/i18n/routing";
import { supportedLocales } from "@/config/locales";

interface LocalizedLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string;
  children: React.ReactNode;
}

/**
 * LocalizedLink component that automatically preserves the current locale in links
 * Use this instead of Next.js Link for internal navigation
 *
 * @example
 * ```tsx
 * <LocalizedLink href="/about">About</LocalizedLink>
 * // If current locale is 'en', links to '/en/about'
 * // If current locale is 'it', links to '/it/about'
 * ```
 */
export function LocalizedLink({ href, children, ...props }: LocalizedLinkProps) {
  const locale = useLocale();
  
  // If href is external (starts with http:// or https://), use as-is
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  
  // Parse query string if present
  const [path, queryString] = href.split("?");
  const query = queryString ? `?${queryString}` : "";
  
  // Check if path already has a locale prefix
  const pathSegments = path.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];
  const hasLocalePrefix = firstSegment && supportedLocales.includes(firstSegment as any);
  
  let localizedHref: string;
  
  if (hasLocalePrefix) {
    // Already has locale, use as-is but ensure it matches current locale
    // For now, we'll replace the locale to match current one
    const pathWithoutLocale = "/" + pathSegments.slice(1).join("/");
    localizedHref = createLocalizedPath(pathWithoutLocale, locale) + query;
  } else if (path.startsWith("/")) {
    // Internal path without locale, add current locale
    localizedHref = createLocalizedPath(path, locale) + query;
  } else {
    // Relative path or already formatted
    localizedHref = href;
  }

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
}
