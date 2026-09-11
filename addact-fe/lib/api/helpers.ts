/**
 * Strapi API & Query Helper Utilities
 */

import type {
  ApiError,
  ApiErrorDetail,
  ApiSuccess,
  PaginationInput,
  StrapiFilters,
} from "@/types/api";

/**
 * Creates a normalized API success result
 */
export function createSuccessResult<T>(data: T): ApiSuccess<T> {
  return {
    ok: true,
    data,
    error: null,
  };
}

/**
 * Creates a normalized API error result
 */
export function createErrorResult(
  message: string,
  options?: Partial<Omit<ApiErrorDetail, "message">>
): ApiError {
  return {
    ok: false,
    data: null,
    error: {
      message,
      code: options?.code,
      status: options?.status,
      details: options?.details,
    },
  };
}

/**
 * Safely extracts a single item from a Strapi response object.
 * Handles both collection shapes (taking [0]) and direct single item shapes.
 */
export function extractSingle<T>(
  response: unknown,
  key: string
): T | null {
  if (!response || typeof response !== "object") return null;

  const target = (response as Record<string, unknown>)[key];
  if (!target) return null;

  if (Array.isArray(target)) {
    return (target[0] as T) ?? null;
  }

  return (target as T) ?? null;
}

/**
 * Safely extracts a collection array from a Strapi response object.
 * Always returns an array, never null or undefined.
 */
export function extractCollection<T>(
  response: unknown,
  key: string
): T[] {
  if (!response || typeof response !== "object") return [];

  const target = (response as Record<string, unknown>)[key];
  if (!target) return [];

  if (Array.isArray(target)) {
    return target as T[];
  }

  return [target as T];
}

/**
 * Builds normalized pagination variables for Strapi GraphQL or REST
 */
export function buildStrapiPagination(input?: PaginationInput): PaginationInput | undefined {
  if (!input) return undefined;

  const pagination: PaginationInput = {};
  if (typeof input.page === "number") pagination.page = input.page;
  if (typeof input.pageSize === "number") pagination.pageSize = input.pageSize;
  if (typeof input.start === "number") pagination.start = input.start;
  if (typeof input.limit === "number") pagination.limit = input.limit;

  return Object.keys(pagination).length > 0 ? pagination : undefined;
}

/**
 * Recursively cleans empty/undefined values from Strapi filters
 */
export function cleanStrapiFilters<T>(filters?: StrapiFilters<T>): StrapiFilters<T> | undefined {
  if (!filters || typeof filters !== "object") return undefined;

  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      cleaned[key] = value;
    } else if (typeof value === "object" && value !== null) {
      const nested = cleanStrapiFilters(value as StrapiFilters<Record<string, unknown>>);
      if (nested && Object.keys(nested).length > 0) {
        cleaned[key] = nested;
      }
    } else {
      cleaned[key] = value;
    }
  }

  return Object.keys(cleaned).length > 0 ? (cleaned as StrapiFilters<T>) : undefined;
}
