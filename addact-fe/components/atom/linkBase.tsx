import React from "react";
import type { SharedLink } from "@/types";

export interface LinkBaseProps extends Partial<SharedLink> {
  href?: string | null;
  label?: string | null;
  className?: string;
}

export default function LinkBase({
  href = "#",
  label = "",
  target,
  isExternal,
  className = "",
}: LinkBaseProps) {
  return (
    <a
      href={href || "#"}
      target={isExternal ? "_blank" : target || undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`block text-black hover:text-[#5865F2] underline text-[22px] ${className}`.trim()}
    >
      {label}
    </a>
  );
}
