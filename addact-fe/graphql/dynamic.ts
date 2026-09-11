/**
 * Universal Dynamic GraphQL Query Generator
 * Allows querying any Strapi collection or single type WITHOUT writing raw GraphQL query strings.
 */

import { fetchStrapiCollection, fetchStrapiSingle } from "@/lib/api/client";
import type { QueryOptions, StrapiFilters, PaginationInput } from "@/types/api";

export interface UniversalQueryOptions<TFilter = Record<string, unknown>> extends QueryOptions {
  /** The fields to retrieve from the entity. Defaults to ["documentId", "title"] */
  fields?: string[];
  /** Sub-relations or media fields to expand (e.g. ["image", "link", "author"]) */
  populate?: Record<string, string[]> | string[];
  /** Strapi filter object */
  filters?: StrapiFilters<TFilter>;
  /** Pagination configuration */
  pagination?: PaginationInput;
  /** Sorting order (e.g. ["createdAt:desc"]) */
  sort?: string[];
}

function buildFieldSelection(
  fields: string[] = ["documentId"],
  populate?: Record<string, string[]> | string[]
): string {
  const fieldList = new Set<string>(fields);
  let populateStr = "";

  if (Array.isArray(populate)) {
    for (const rel of populate) {
      fieldList.delete(rel);
      populateStr += `
        ${rel} {
          documentId
          url
          alternativeText
          name
        }`;
    }
  } else if (populate && typeof populate === "object") {
    for (const [rel, subFields] of Object.entries(populate)) {
      fieldList.delete(rel);
      populateStr += `
        ${rel} {
          ${subFields.join("\n          ")}
        }`;
    }
  }

  return `${Array.from(fieldList).join("\n      ")}${populateStr}`;
}

/**
 * Fetches an array of items from any Strapi collection without writing GraphQL strings.
 * 
 * @example
 * const testimonials = await queryStrapiCollection<Testimonial>("testimonials", {
 *   fields: ["documentId", "clientName", "feedback", "rating"],
 *   populate: ["avatar"],
 *   filters: { isFeatured: { eq: true } },
 *   pagination: { limit: 6 },
 * });
 */
export async function queryStrapiCollection<TItem = unknown>(
  collectionName: string,
  options: UniversalQueryOptions = {}
): Promise<TItem[]> {
  const selection = buildFieldSelection(options.fields, options.populate);
  const queryName =
    options.queryName ||
    `DynamicGet${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}`;

  const query = `
    query ${queryName}($filters: JSON, $pagination: PaginationInput, $sort: [String]) {
      ${collectionName}(filters: $filters, pagination: $pagination, sort: $sort) {
        ${selection}
      }
    }
  `;

  const variables = {
    filters: options.filters,
    pagination: options.pagination,
    sort: options.sort,
  };

  return fetchStrapiCollection<TItem>(
    query,
    collectionName,
    variables,
    options
  );
}

/**
 * Fetches a single item by its slug from any Strapi collection without writing GraphQL strings.
 * 
 * @example
 * const article = await queryStrapiBySlug<Article>("articles", "sitecore-headless-guide", {
 *   fields: ["title", "content", "publishedAt"],
 *   populate: ["featuredImage", "author"],
 * });
 */
export async function queryStrapiBySlug<TItem = unknown>(
  collectionName: string,
  slug: string,
  options: UniversalQueryOptions = {}
): Promise<TItem | null> {
  const selection = buildFieldSelection(options.fields, options.populate);
  const queryName =
    options.queryName ||
    `DynamicGet${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}BySlug`;

  const query = `
    query ${queryName}($slug: String!) {
      ${collectionName}(filters: { slug: { eq: $slug } }) {
        ${selection}
      }
    }
  `;

  return fetchStrapiSingle<TItem>(
    query,
    collectionName,
    { slug },
    options
  );
}
