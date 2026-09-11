import React from "react";
import type { BaseCard, Nullable } from "@/types";
import { StrapiImage } from "./StrapiImage";
import { GenericLink } from "./GenericLink";

export interface GenericCardProps<T extends Partial<BaseCard> = BaseCard> {
  card?: Nullable<T>;
  title?: Nullable<string>;
  description?: Nullable<string>;
  image?: Nullable<any>;
  link?: Nullable<any>;
  className?: string;
  imageClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  linkClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
  showLink?: boolean;
}

/**
 * GenericCard - Universal Card Component
 * Reusable for Header cards, Footer cards, Promo cards, and dynamic zone content
 */
export function GenericCard<T extends Partial<BaseCard> = BaseCard>({
  card,
  title,
  description,
  image,
  link,
  className = "p-4 rounded-lg bg-neutral-900 text-white border border-neutral-800",
  imageClassName = "rounded mb-3 object-cover",
  titleClassName = "text-lg font-semibold mb-1 text-white",
  descriptionClassName = "text-sm text-neutral-400 mb-3",
  linkClassName = "text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1",
  imageWidth = 400,
  imageHeight = 250,
  showLink = true,
}: GenericCardProps<T>) {
  const resolvedTitle = title ?? card?.title;
  const resolvedDesc = description ?? card?.description;
  const resolvedImage = image ?? card?.image ?? (card as any)?.Image;
  const resolvedLink = link ?? card?.link ?? (card as any)?.Link;

  return (
    <div className={className}>
      {resolvedImage && (
        <StrapiImage
          src={resolvedImage}
          alt={resolvedTitle || "Card image"}
          width={imageWidth}
          height={imageHeight}
          className={imageClassName}
        />
      )}
      {resolvedTitle && <h3 className={titleClassName}>{resolvedTitle}</h3>}
      {resolvedDesc && <p className={descriptionClassName}>{resolvedDesc}</p>}
      {showLink && resolvedLink && (
        <GenericLink link={resolvedLink} className={linkClassName}>
          {resolvedLink.label || "Learn More"}
        </GenericLink>
      )}
    </div>
  );
}

export default GenericCard;
