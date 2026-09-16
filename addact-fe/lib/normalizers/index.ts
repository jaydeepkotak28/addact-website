/**
 * Central Data Normalization Utilities for Strapi CMS
 * Standardizes raw GraphQL/REST outputs into clean, predictable types.
 */

import type {
  BaseCard,
  BaseLink,
  BaseTitle,
  BaseTestimonial,
  BaseTestimonialItem,
  ImageType,
  Nullable,
} from "@/types/common";
import { getStrapiMediaUrl } from "@/lib/media";
import { isExternalUrl } from "@/lib/generic";

/**
 * Normalizes any Strapi media object (nested, flat, or string URL) into ImageType
 */
export function normalizeMedia(rawMedia?: unknown): ImageType | null {
  if (!rawMedia) return null;

  if (typeof rawMedia === "string") {
    const url = getStrapiMediaUrl(rawMedia);
    return url ? { url, alternativeText: "" } : null;
  }

  if (typeof rawMedia === "object" && rawMedia !== null) {
    const obj = rawMedia as Record<string, unknown>;
    const nested =
      (typeof obj.image === "object" && obj.image !== null ? obj.image : null) ||
      (typeof obj.Image === "object" && obj.Image !== null ? obj.Image : null) ||
      (typeof obj.data === "object" && obj.data !== null && "attributes" in (obj.data as Record<string, unknown>)
        ? (obj.data as Record<string, unknown>).attributes
        : null) ||
      obj;

    const nestedObj = nested as Record<string, unknown>;
    const url = getStrapiMediaUrl(nestedObj.url || nestedObj);

    if (!url) return null;

    return {
      url,
      alternativeText:
        typeof nestedObj.alternativeText === "string"
          ? nestedObj.alternativeText
          : typeof nestedObj.name === "string"
          ? nestedObj.name
          : "",
      width: typeof nestedObj.width === "number" ? nestedObj.width : undefined,
      height: typeof nestedObj.height === "number" ? nestedObj.height : undefined,
      name: typeof nestedObj.name === "string" ? nestedObj.name : undefined,
    };
  }

  return null;
}

/**
 * Normalizes any Strapi link object into a standardized BaseLink
 */
export function normalizeLink(rawLink?: unknown): BaseLink | null {
  if (!rawLink) return null;

  if (typeof rawLink === "string") {
    return {
      href: rawLink,
      label: rawLink,
      target: isExternalUrl(rawLink) ? "_blank" : "_self",
      isExternal: isExternalUrl(rawLink),
    };
  }

  if (typeof rawLink === "object" && rawLink !== null) {
    const obj = rawLink as Record<string, unknown>;
    const href = typeof obj.href === "string" ? obj.href : typeof obj.url === "string" ? obj.url : "#";
    const label = typeof obj.label === "string" ? obj.label : typeof obj.text === "string" ? obj.text : "";
    const isExt =
      typeof obj.isExternal === "boolean"
        ? obj.isExternal
        : isExternalUrl(href);
    const target =
      typeof obj.target === "string" ? obj.target : isExt ? "_blank" : "_self";
    const subDisc =
      typeof obj.subDisc === "string"
        ? obj.subDisc
        : typeof obj.SubDisc === "string"
        ? obj.SubDisc
        : undefined;

    const rawIcon = obj.icon || obj.Icon;
    const icon = rawIcon ? normalizeMedia(rawIcon) : undefined;

    return {
      id: typeof obj.id === "string" || typeof obj.id === "number" ? obj.id : undefined,
      href,
      label,
      target,
      isExternal: isExt,
      subDisc,
      icon,
    };
  }

  return null;
}

/**
 * Normalizes title structures into BaseTitle
 */
export function normalizeTitle(rawTitle?: unknown): BaseTitle | null {
  if (!rawTitle) return null;

  if (typeof rawTitle === "string") {
    return { title: rawTitle, tag: "H2" };
  }

  if (typeof rawTitle === "object" && rawTitle !== null) {
    const obj = rawTitle as Record<string, unknown>;
    const title = typeof obj.title === "string" ? obj.title : typeof obj.text === "string" ? obj.text : "";
    const tag = typeof obj.tag === "string" ? (obj.tag.toUpperCase() as BaseTitle["tag"]) : "H2";

    return { title, tag };
  }

  return null;
}

/**
 * Normalizes card structures into BaseCard
 */
export function normalizeCard(rawCard?: unknown): BaseCard | null {
  if (!rawCard || typeof rawCard !== "object") return null;

  const obj = rawCard as Record<string, unknown>;
  const title = typeof obj.title === "string" ? obj.title : undefined;
  const description =
    typeof obj.description === "string"
      ? obj.description
      : typeof obj.desc === "string"
      ? obj.desc
      : undefined;

  const rawImage = obj.image || obj.Image;
  const rawLink = obj.link || obj.Link;

  return {
    title,
    description,
    image: rawImage ? normalizeMedia(rawImage) : undefined,
    link: rawLink ? normalizeLink(rawLink) : undefined,
  };
}

/**
 * Normalizes arrays of entities safely
 */
export function normalizeCollection<TRaw, TNormalized>(
  items: Nullable<TRaw[]>,
  normalizer: (item: TRaw) => TNormalized | null
): TNormalized[] {
  if (!items || !Array.isArray(items)) return [];
  const result: TNormalized[] = [];
  for (const item of items) {
    const normalized = normalizer(item);
    if (normalized !== null) {
      result.push(normalized);
    }
  }
  return result;
}

/**
 * Normalizes testimonial entity into standardized BaseTestimonial
 */
export function normalizeTestimonial(raw?: any): BaseTestimonial | null {
  if (!raw || typeof raw !== "object") return null;

  const title = normalizeTitle(raw.Title || raw.title || "Client Testimonials");
  const ratingImage = normalizeMedia(raw.ratingImage || raw.rating_image);
  const bgText =
    typeof raw.bgText === "string"
      ? raw.bgText
      : typeof raw.bg_text === "string"
      ? raw.bg_text
      : "TESTIMONIAL";
  const rating = typeof raw.rating === "string" ? raw.rating : "4.8";

  const rawItems = raw.Item || raw.item || raw.items || [];
  const items = normalizeCollection(rawItems, (item: any): BaseTestimonialItem => {
    let quoteText = "";
    if (typeof item.quote === "string") {
      quoteText = item.quote;
    } else if (Array.isArray(item.quote)) {
      quoteText = item.quote
        .map((p: any) =>
          p?.children?.map((c: any) => c?.text || "").join("") || ""
        )
        .filter(Boolean)
        .join("\n");
    }

    const ratingStr = item.rating || "star5";
    const match = String(ratingStr).match(/star(\d)/);
    const ratingNumber = match ? parseInt(match[1], 10) : 5;

    return {
      id: item.id,
      quote: quoteText,
      rawQuote: item.quote,
      authorName: item.author_name || item.authorName || "",
      authorPosition: item.author_position || item.authorPosition || "",
      rating: ratingStr,
      ratingNumber,
    };
  });

  return {
    documentId: raw.documentId || raw.document_id,
    title,
    bgText,
    rating,
    ratingImage,
    items,
  };
}

/**
 * Normalizes WhoAreWe entity into standard WhoWeAre component format
 */
export function normalizeWhoAreWe(raw?: any): {
  documentId?: string;
  pageReference?: string;
  Title: Array<{ Title?: string; Description: string }>;
  Counter: Array<{ id: string; CounterTitle: string; NumberCount: number | string }>;
} | null {
  if (!raw || typeof raw !== "object") return null;

  // Case 1: Already in Title/Counter format
  if (Array.isArray(raw.Counter) || Array.isArray(raw.Title)) {
    const description =
      raw.Title?.[0]?.Description ||
      raw.description?.body ||
      raw.body ||
      "";
    const title = raw.Title?.[0]?.Title || raw.title || "";
    const counters = (raw.Counter || []).map((c: any, i: number) => ({
      id: c.id || c.documentId || String(i),
      CounterTitle: c.CounterTitle || c.title || "",
      NumberCount: c.NumberCount ?? c.counter ?? 0,
    }));

    return {
      documentId: raw.documentId,
      pageReference: raw.pageReference || raw.internalName,
      Title: [{ Title: title, Description: description }],
      Counter: counters,
    };
  }

  // Case 2: Strapi whoAreWe relation format
  const entity = raw.whoAreWe || raw;
  const description =
    entity.description?.body ||
    entity.description?.Description ||
    (typeof entity.description === "string" ? entity.description : "") ||
    "";
  const title = entity.title || entity.internalName || "";

  const counterCards = entity.counterCards || entity.Counter || [];
  const counters = (Array.isArray(counterCards) ? counterCards : []).map(
    (c: any, i: number) => {
      const cardObj = c.card || c;
      return {
        id: c.documentId || c.id || String(i),
        CounterTitle: cardObj.title || cardObj.CounterTitle || "",
        NumberCount: cardObj.counter ?? cardObj.NumberCount ?? 0,
      };
    }
  );

  return {
    documentId: entity.documentId,
    pageReference: entity.internalName || entity.pageReference,
    Title: [{ Title: title, Description: description }],
    Counter: counters,
  };
}

/**
 * Normalizes WhyAddact entity into standard Accordion/WhyWorkWithUs format
 */
export function normalizeWhyAddact(raw?: any): {
  documentId?: string;
  internalName?: string;
  title?: string;
  items: Array<{
    title: string;
    description: string;
    image?: any;
  }>;
} | null {
  if (!raw || typeof raw !== "object") return null;

  const entity = raw.whyAddact || raw;
  const title =
    entity.title?.title ||
    entity.Title?.[0]?.h2 ||
    (typeof entity.title === "string" ? entity.title : "") ||
    entity.internalName ||
    "";

  let items: Array<{ title: string; description: string; image?: any }> = [];

  if (Array.isArray(entity.content)) {
    items = entity.content.map((item: any) => ({
      title: item.Body?.title || item.title || item.internalName || "",
      description: item.Body?.description || item.description || "",
      image: item.image,
    }));
  } else if (Array.isArray(entity.GlobalCard)) {
    items = entity.GlobalCard.map((card: any) => ({
      title: card.Title || card.title || "",
      description: card.Description || card.description || "",
      image: card.Image || card.image,
    }));
  }

  return {
    documentId: entity.documentId,
    internalName: entity.internalName,
    title,
    items,
  };
}


