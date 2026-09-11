"use client";

import React from "react";
import Link from "next/link";
import type { BaseLink, Nullable } from "@/types";
import { resolveLinkProps } from "@/lib/generic";
import { openContactDrawer, shouldOpenContactDrawer } from "@/lib/contactDrawer";

export interface GenericLinkProps<T extends Partial<BaseLink> = BaseLink>
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target"> {
  link?: Nullable<T>;
  href?: Nullable<string>;
  label?: Nullable<string>;
  target?: Nullable<string>;
  isExternal?: Nullable<boolean>;
  children?: React.ReactNode;
  className?: string;
  enableDrawer?: boolean;
}

/**
 * GenericLink - Universal Polymorphic Link Component
 * 
 * Automatically handles:
 * - Internal Next.js routing (<Link>) vs External links (<a> with _blank & noopener)
 * - Objects implementing BaseLink ({ href, label, isExternal, target })
 * - Contact drawer trigger intercepts
 * - Custom children or fallback to label
 */
export function GenericLink<T extends Partial<BaseLink> = BaseLink>({
  link,
  href,
  label,
  target,
  isExternal,
  children,
  className = "",
  enableDrawer = true,
  onClick,
  ...rest
}: GenericLinkProps<T>) {
  const resolved = resolveLinkProps(link, { href, label, target, isExternal });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (enableDrawer && !resolved.isExternal && shouldOpenContactDrawer(resolved.href)) {
      e.preventDefault();
      openContactDrawer();
      return;
    }
    onClick?.(e);
  };

  const content = children ?? resolved.label;

  // External or new-tab link
  if (resolved.isExternal || resolved.target === "_blank") {
    return (
      <a
        href={resolved.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
        {...rest}
      >
        {content}
      </a>
    );
  }

  // Internal Next.js Link
  return (
    <Link
      href={resolved.href}
      target={resolved.target}
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {content}
    </Link>
  );
}

export default GenericLink;
