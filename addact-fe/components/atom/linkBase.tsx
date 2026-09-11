import React from "react";
import type { BaseLink } from "@/types";
import { GenericLink, type GenericLinkProps } from "@/components/atoms/GenericLink";

export interface LinkBaseProps<T extends Partial<BaseLink> = BaseLink>
  extends GenericLinkProps<T> {}

export default function LinkBase<T extends Partial<BaseLink> = BaseLink>({
  href = "#",
  label = "",
  target,
  isExternal,
  className = "",
  children,
  ...rest
}: LinkBaseProps<T>) {
  return (
    <GenericLink
      href={href}
      label={label}
      target={target}
      isExternal={isExternal}
      className={`block text-black hover:text-[#5865F2] underline text-[22px] ${className}`.trim()}
      {...rest}
    >
      {children || label}
    </GenericLink>
  );
}
