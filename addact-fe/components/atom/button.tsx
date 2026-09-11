import React from "react";
import type { SharedLink } from "@/types";

export interface ButtonProps extends Partial<SharedLink> {
  href?: string | null;
  label?: string | null;
  className?: string;
}

export default function Button({
  href = "#",
  label = "",
  target,
  isExternal,
  className = "",
}: ButtonProps) {
  return (
    <a
      href={href || "#"}
      target={isExternal ? "_blank" : target || undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`inline-block bg-[#3C4CFF] text-white px-4 py-2 rounded hover:bg-[#3440CB] transition ${className}`.trim()}
    >
      {label}
    </a>
  );
}
