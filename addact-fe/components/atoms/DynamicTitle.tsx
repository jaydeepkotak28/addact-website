import React from "react";
import type { SharedTitle } from "@/lib/schemas/dynamicZoneSchema";

export interface DynamicTitleProps {
  data?: SharedTitle | null;
  title?: string | null;
  tag?: "H1" | "H2" | "H3" | "H4" | "H5" | "H6" | string | null;
  defaultTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  className?: string;
  children?: React.ReactNode;
}

/**
 * Reusable Atom component to render 'shared.title' component
 * dynamically with its selected semantic HTML tag (H1-H6).
 */
export const DynamicTitle: React.FC<DynamicTitleProps> = ({
  data,
  title,
  tag,
  defaultTag = "h2",
  className = "",
  children,
}) => {
  const content = children || data?.title || title;
  if (!content) return null;

  const rawTag = data?.tag || tag;
  const tagName = rawTag ? (rawTag.toLowerCase() as keyof React.JSX.IntrinsicElements) : defaultTag;
  const Tag = tagName as any;

  return <Tag className={className}>{content}</Tag>;
};

export default DynamicTitle;
