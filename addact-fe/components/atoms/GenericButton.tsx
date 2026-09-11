"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { isExternalUrl } from "@/lib/generic";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "white";

export type ButtonSize = "sm" | "md" | "lg";

export interface GenericButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string | null;
  target?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isExternal?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/20",
  secondary:
    "bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-900",
  outline:
    "border-2 border-slate-700 text-slate-200 hover:border-blue-500 hover:text-white bg-transparent",
  ghost:
    "bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white",
  white:
    "bg-white text-slate-900 hover:bg-slate-100 active:bg-slate-200 shadow-md",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-lg gap-2 font-medium",
  lg: "px-7 py-3.5 text-base rounded-xl gap-2.5 font-semibold",
};

/**
 * GenericButton - Polymorphic Universal Button Atom
 * Seamlessly supports both `<button>` and Next.js `<Link>` with loading spinners and icons.
 */
export const GenericButton: React.FC<GenericButtonProps> = ({
  children,
  href,
  target,
  variant = "primary",
  size = "md",
  isLoading = false,
  iconLeft,
  iconRight,
  isExternal,
  fullWidth = false,
  className = "",
  disabled,
  ...rest
}) => {
  const isExt = isExternal ?? (href ? isExternalUrl(href) : false);
  const resolvedTarget = target ?? (isExt ? "_blank" : undefined);
  const resolvedRel = isExt ? "noopener noreferrer" : undefined;

  const baseClasses = clsx(
    "inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "w-auto",
    className
  );

  const spinner = (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const content = (
    <>
      {isLoading && spinner}
      {!isLoading && iconLeft}
      <span>{children}</span>
      {!isLoading && iconRight}
    </>
  );

  // Link mode
  if (href) {
    if (isExt || resolvedTarget === "_blank") {
      return (
        <a
          href={href}
          target={resolvedTarget}
          rel={resolvedRel}
          className={baseClasses}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  // Button mode
  return (
    <button
      className={baseClasses}
      disabled={disabled || isLoading}
      {...rest}
    >
      {content}
    </button>
  );
};

export default GenericButton;
