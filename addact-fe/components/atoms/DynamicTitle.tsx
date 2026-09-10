import React from "react";
import type { SharedTitle } from "@/lib/schemas/dynamicZoneSchema";

export type HeadingTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "span"
  | "div"
  | "p";

export type StrapiHeadingTag =
  | "H1"
  | "H2"
  | "H3"
  | "H4"
  | "H5"
  | "H6"
  | string;

export interface DynamicTitleProps {
  data?: SharedTitle | null;
  title?: string | SharedTitle | null;
  tag?: StrapiHeadingTag | HeadingTag | null;
  defaultTag?: HeadingTag;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Reusable DynamicTitle Component
 * Standardized across all organisms, dynamic-zone blocks, and pages.
 * Dynamically resolves heading level (H1-H6) from Strapi shared.title or tag prop.
 */
export const DynamicTitle: React.FC<DynamicTitleProps> = ({
  data,
  title,
  tag,
  defaultTag = "h2",
  className = "",
  children,
}) => {
  // Extract text content from children, title (string or object), or data
  const content =
    children ||
    (typeof title === "object" && title !== null ? title.title : title) ||
    data?.title;

  if (!content) return null;

  // Resolve HTML tag with precedence: explicit tag prop > title.tag > data.tag > defaultTag
  const resolvedTag =
    tag ||
    (typeof title === "object" && title !== null ? title.tag : null) ||
    data?.tag ||
    defaultTag;

  const tagName = resolvedTag
    ? (resolvedTag.toLowerCase() as HeadingTag)
    : defaultTag;

  const Tag = tagName as any;

  return <Tag className={className}>{content}</Tag>;
};

export default DynamicTitle;
