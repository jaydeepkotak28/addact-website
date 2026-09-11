"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface GenericBreadcrumbProps {
  items?: BreadcrumbItem[];
  homeLabel?: string;
  homeHref?: string;
  separator?: React.ReactNode;
  className?: string;
}

/**
 * GenericBreadcrumb - Universal Breadcrumb Navigation Atom
 * Automatically generates breadcrumb trails from current route if items are not provided.
 */
export const GenericBreadcrumb: React.FC<GenericBreadcrumbProps> = ({
  items,
  homeLabel = "Home",
  homeHref = "/",
  separator,
  className = "",
}) => {
  const pathname = usePathname();

  // Auto-generate items from pathname if not explicitly passed
  const resolvedItems: BreadcrumbItem[] = React.useMemo(() => {
    if (items && items.length > 0) return items;

    if (!pathname || pathname === "/") return [];

    const segments = pathname.split("/").filter(Boolean);
    let accumulatedPath = "";

    return segments.map((seg, idx) => {
      accumulatedPath += `/${seg}`;
      const isLast = idx === segments.length - 1;
      const formattedLabel = decodeURIComponent(seg)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        label: formattedLabel,
        href: isLast ? undefined : accumulatedPath,
      };
    });
  }, [items, pathname]);

  if (resolvedItems.length === 0) return null;

  const defaultSeparator = separator || (
    <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
  );

  return (
    <nav aria-label="Breadcrumb" className={clsx("flex items-center text-sm", className)}>
      <ol className="flex items-center flex-wrap gap-1.5 text-slate-400">
        {/* Home Item */}
        <li className="inline-flex items-center">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-1 hover:text-white transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{homeLabel}</span>
          </Link>
        </li>

        {/* Dynamic Segments */}
        {resolvedItems.map((item, index) => {
          const isLast = index === resolvedItems.length - 1;

          return (
            <li key={item.label + index} className="inline-flex items-center gap-1.5">
              {defaultSeparator}
              {isLast || !item.href ? (
                <span className="text-white font-medium truncate max-w-[200px]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-white transition truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default GenericBreadcrumb;
