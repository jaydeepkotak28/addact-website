import type { BaseLink, Nullable } from "@/types";

/**
 * Ensures an array is returned safely, preventing null/undefined errors in .map()
 */
export function safeArray<T>(items?: Nullable<T[]>): T[] {
  if (!items || !Array.isArray(items)) return [];
  return items;
}

/**
 * Returns the first item of an array or null
 */
export function firstOrNull<T>(items?: Nullable<T[]>): T | null {
  if (!items || !Array.isArray(items) || items.length === 0) return null;
  return items[0] ?? null;
}

/**
 * Checks if a given URL is external, mailto, or tel
 */
export function isExternalUrl(url?: Nullable<string>): boolean {
  if (!url) return false;
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  );
}

/**
 * Generic Link Resolver
 * Extracts normalized link properties from any link object or direct attributes
 */
export function resolveLinkProps<T extends Partial<BaseLink>>(
  link?: Nullable<T>,
  direct?: {
    href?: Nullable<string>;
    label?: Nullable<string>;
    target?: Nullable<string>;
    isExternal?: Nullable<boolean>;
  }
) {
  const resolvedHref = direct?.href ?? link?.href ?? "#";
  const resolvedLabel = direct?.label ?? link?.label ?? "";
  const isExternal =
    direct?.isExternal ??
    link?.isExternal ??
    isExternalUrl(resolvedHref) ??
    false;
  const resolvedTarget = direct?.target ?? link?.target ?? (isExternal ? "_blank" : "_self");
  const rel = isExternal ? "noopener noreferrer" : undefined;

  return {
    href: resolvedHref,
    label: resolvedLabel,
    target: resolvedTarget,
    isExternal,
    rel,
  };
}
