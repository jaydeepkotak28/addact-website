/**
 * Generic API & GraphQL Query Types
 * Provides strongly-typed interfaces for Strapi GraphQL and REST API requests, responses, filters, and error handling.
 */

import type { Nullable } from "./common";

// ─── Result & Error Handling Types ───────────────────────────────────────────

export interface ApiErrorDetail {
  message: string;
  code?: string | number;
  status?: number;
  details?: unknown;
}

export interface ApiSuccess<T> {
  readonly ok: true;
  readonly data: T;
  readonly error: null;
}

export interface ApiError {
  readonly ok: false;
  readonly data: null;
  readonly error: ApiErrorDetail;
}

/**
 * Discriminated union for type-safe API results without throwing
 */
export type ApiResult<T> = ApiSuccess<T> | ApiError;

// ─── Query & Fetch Request Options ────────────────────────────────────────────

export interface QueryOptions {
  /** Identifier name for debug/console logging */
  queryName?: string;
  /** Next.js ISR cache revalidation interval in seconds (or false to disable caching) */
  revalidate?: number | false;
  /** Next.js on-demand revalidation cache tags (e.g., ['header', 'pages']) */
  tags?: string[];
  /** Standard fetch cache mode */
  cache?: RequestCache;
  /** Additional custom headers to send with the request */
  headers?: Record<string, string>;
  /** Request abort signal */
  signal?: AbortSignal;
  /** Request timeout in milliseconds */
  timeoutMs?: number;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RestOptions extends QueryOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
}

// ─── Strapi Response Shapes ───────────────────────────────────────────────────

/**
 * Single entity GraphQL response (e.g. `{ header: HeaderData }` or `{ globalSetting: GlobalSettingData }`)
 */
export type StrapiSingleResponse<T, K extends string = string> = {
  [key in K]?: Nullable<T>;
};

/**
 * Collection GraphQL response (e.g. `{ pages: PageItem[] }` or `{ footers: FooterData[] }`)
 */
export type StrapiCollectionResponse<T, K extends string = string> = {
  [key in K]?: Nullable<T[]>;
};

/**
 * Standard Strapi pagination metadata
 */
export interface StrapiPaginationMeta {
  page?: number;
  pageSize?: number;
  pageCount?: number;
  total?: number;
  start?: number;
  limit?: number;
}

/**
 * Strapi Paginated Response container
 */
export interface StrapiPaginatedResponse<T, K extends string = string> {
  data: { [key in K]?: Nullable<T[]> };
  meta?: {
    pagination?: StrapiPaginationMeta;
  };
}

// ─── Strapi Filters & Pagination Input ────────────────────────────────────────

export type FilterOperator =
  | "eq"
  | "ne"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "in"
  | "notIn"
  | "contains"
  | "notContains"
  | "containsi"
  | "notContainsi"
  | "null"
  | "notNull"
  | "between"
  | "startsWith"
  | "endsWith";

export type StrapiFilterValue<V = unknown> =
  | V
  | { [op in FilterOperator]?: V | V[] };

export type StrapiFilters<T = Record<string, unknown>> = {
  [P in keyof T]?: StrapiFilterValue<T[P]> | StrapiFilters<T[P]>;
} & {
  and?: StrapiFilters<T>[];
  or?: StrapiFilters<T>[];
  not?: StrapiFilters<T>;
};

export interface PaginationInput {
  page?: number;
  pageSize?: number;
  start?: number;
  limit?: number;
}

export type SortOrder = "asc" | "desc" | `${string}:asc` | `${string}:desc`;

/**
 * Standard Strapi GraphQL query variables with generic filters
 */
export interface StrapiQueryVariables<TFilter = Record<string, unknown>> {
  filters?: StrapiFilters<TFilter>;
  pagination?: PaginationInput;
  sort?: SortOrder | SortOrder[];
  [key: string]: unknown;
}
