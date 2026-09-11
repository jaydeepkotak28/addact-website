import React from "react";
import clsx from "clsx";

export type BadgeVariant =
  | "brand"
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "outline";

export type BadgeSize = "sm" | "md";

export interface GenericBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: React.ReactNode;
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  brand: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  neutral: "bg-slate-800 text-slate-300 border-slate-700",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  outline: "bg-transparent text-slate-400 border-slate-700",
};

const dotColors: Record<BadgeVariant, string> = {
  brand: "bg-blue-400",
  neutral: "bg-slate-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error: "bg-red-400",
  outline: "bg-slate-400",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs font-medium",
  md: "px-2.5 py-1 text-xs md:text-sm font-semibold",
};

/**
 * GenericBadge - Universal Chip / Tag Atom
 */
export const GenericBadge: React.FC<GenericBadgeProps> = ({
  label,
  children,
  variant = "brand",
  size = "sm",
  dot = false,
  className = "",
  ...rest
}) => {
  const content = children || label;
  if (!content) return null;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...rest}
    >
      {dot && <span className={clsx("w-1.5 h-1.5 rounded-full", dotColors[variant])} />}
      {content}
    </span>
  );
};

export default GenericBadge;
