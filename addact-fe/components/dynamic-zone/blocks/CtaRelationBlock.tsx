import React from "react";
import GenericCTA from "@/components/organisms/GenericCTA";
import type { CtaRelationBlockData } from "@/lib/schemas/dynamicZoneSchema";

export interface CtaRelationBlockProps extends CtaRelationBlockData {
  className?: string;
}

export const CtaRelationBlock: React.FC<CtaRelationBlockProps> = ({
  cta,
  className = "",
}) => {
  if (!cta) return null;

  // Strict null guard: Check for real content, avoiding false positives from empty arrays/objects
  const hasTitle = Array.isArray(cta.title)
    ? cta.title.some((t: any) =>
        typeof t === "string"
          ? Boolean(t.trim())
          : Boolean(t?.title?.trim() || t?.h1?.trim() || t?.h2?.trim() || t?.h3?.trim())
      )
    : Boolean(
        (cta.title as any)?.title?.trim?.() ||
        (typeof cta.title === "string" && (cta.title as string).trim())
      );

  const hasDescription =
    typeof cta.description === "string"
      ? Boolean(cta.description.trim())
      : Array.isArray(cta.description)
        ? cta.description.some((d: any) =>
            d?.children?.some((c: any) => Boolean(c?.text?.trim()))
          )
        : false;

  const hasImage = Boolean(
    cta.image?.url || (typeof cta.image === "string" && (cta.image as string).trim())
  );

  const hasLink = Boolean(
    cta.link?.label?.trim() ||
    (cta.link as any)?.href?.trim() ||
    (cta.link as any)?.url?.trim()
  );

  if (!hasTitle && !hasDescription && !hasImage && !hasLink) {
    return null;
  }

  return (
    <GenericCTA
      internalName={cta.internalName ?? undefined}
      variant={cta.variant ?? undefined}
      title={cta.title}
      description={cta.description}
      image={cta.image}
      link={cta.link}
      className={className}
    />
  );
};

export default CtaRelationBlock;
