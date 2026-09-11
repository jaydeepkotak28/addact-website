/**
 * Universal Generic API Client for Strapi GraphQL and REST operations
 * 
 * Features:
 * - Strongly typed GraphQL queries & mutations with generic types
 * - Safe error handling (ApiResult) or direct data return with fallbacks
 * - Per-query Next.js ISR cache controls (revalidate, tags, cache)
 * - Automatic extraction helpers for single items and collections
 * - REST API executor for Strapi endpoints (/api/...)
 */

import { GraphQLClient } from "graphql-request";
import { getStrapiClient, STRAPI_REVALIDATE_SECONDS } from "@/lib/strapi";
import type {
  ApiResult,
  QueryOptions,
  RestOptions,
} from "@/types/api";
import {
  createSuccessResult,
  createErrorResult,
  extractSingle,
  extractCollection,
} from "./helpers";

function getRestBaseUrl(): string {
  return (
    process.env.STRAPI_API_URL ||
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    "http://localhost:1337"
  ).replace(/\/+$/, "");
}

function getAuthToken(): string | undefined {
  return (
    process.env.STRAPI_API_TOKEN ||
    process.env.NEXT_PUBLIC_STRAPI_TOKEN
  );
}

function parseOptions(optionsOrName?: string | QueryOptions): QueryOptions {
  if (!optionsOrName) return { queryName: "StrapiQuery" };
  if (typeof optionsOrName === "string") return { queryName: optionsOrName };
  return optionsOrName;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unknown error occurred";
}

/**
 * Creates a GraphQL client configured with optional per-query cache/headers
 */
function createConfiguredClient(options: QueryOptions): GraphQLClient {
  const defaultClient = getStrapiClient();

  // If no custom cache, headers, or tags, use the shared singleton client
  if (!options.headers && options.revalidate === undefined && !options.tags && !options.cache) {
    return defaultClient;
  }

  const endpoint =
    process.env.STRAPI_GRAPHQL_ENDPOINT ||
    process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT ||
    "http://localhost:1337/graphql";

  const token = getAuthToken();

  const isDev = process.env.NODE_ENV === "development";
  const revalidate = options.revalidate !== undefined ? options.revalidate : STRAPI_REVALIDATE_SECONDS;
  const tags = options.tags ? ["strapi", ...options.tags] : ["strapi"];
  const cache = options.cache ?? (options.revalidate === false ? "no-store" : "default");

  return new GraphQLClient(endpoint, {
    headers: {
      ...(token && token !== "dummy_static_token"
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...(options.headers || {}),
    },
    fetch: (url, fetchOptions) =>
      fetch(url, {
        ...fetchOptions,
        cache,
        signal: options.signal,
        next:
          options.tags || options.revalidate !== undefined || !isDev
            ? {
                revalidate: revalidate === false ? 0 : revalidate,
                tags,
              }
            : undefined,
      }),
  });
}

// ─── 1. Generic fetchStrapi (Direct / Backward-Compatible) ─────────────────────

/**
 * Generic Reusable Strapi GraphQL Query Executor
 * Returns direct data on success, or null on error.
 * 
 * @example
 * const data = await fetchStrapi<PageResponse>(GET_PAGE, { slug: "home" });
 * const data = await fetchStrapi<HeaderResponse>(GET_HEADER, { region }, { revalidate: 3600 });
 */
export async function fetchStrapi<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  optionsOrName?: string | QueryOptions
): Promise<TData | null> {
  const options = parseOptions(optionsOrName);
  const client = createConfiguredClient(options);

  try {
    const data = await client.request<TData>(query, variables as unknown as Record<string, unknown>);
    return data;
  } catch (error: unknown) {
    console.error(
      `⚠️ [Strapi] Failed to execute query '${options.queryName || "StrapiQuery"}':`,
      getErrorMessage(error)
    );
    return null;
  }
}

// ─── 2. Generic fetchStrapiSafe (Discriminated Union ApiResult) ────────────────

/**
 * Type-safe Strapi GraphQL Query Executor returning ApiResult<TData>.
 * Never throws an uncaught error.
 * 
 * @example
 * const result = await fetchStrapiSafe<PageData>(GET_PAGE, { slug });
 * if (result.ok) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error.message);
 * }
 */
export async function fetchStrapiSafe<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  optionsOrName?: string | QueryOptions
): Promise<ApiResult<TData>> {
  const options = parseOptions(optionsOrName);
  const client = createConfiguredClient(options);

  try {
    const data = await client.request<TData>(query, variables as unknown as Record<string, unknown>);
    return createSuccessResult(data);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error(`⚠️ [Strapi] Safe Query Error in '${options.queryName || "StrapiQuery"}':`, message);
    
    const errObj = typeof error === "object" && error !== null ? (error as Record<string, unknown>) : {};
    const resObj = typeof errObj.response === "object" && errObj.response !== null ? (errObj.response as Record<string, unknown>) : {};

    return createErrorResult(message, {
      code: typeof errObj.code === "string" || typeof errObj.code === "number" ? errObj.code : undefined,
      status: typeof resObj.status === "number" ? resObj.status : undefined,
      details: resObj.errors || error,
    });
  }
}

// ─── 3. Generic fetchStrapiSingle (Auto-unwrapper for Single Items) ────────────

/**
 * Executes a GraphQL query and automatically unwraps the target single entity.
 * Works whether Strapi returns a collection array `[key][0]` or a single object `[key]`.
 * 
 * @example
 * const page = await fetchStrapiSingle<PageItemData>(GET_PAGE_BY_SLUG, "pages", { slug });
 */
export async function fetchStrapiSingle<TItem, TVariables = Record<string, unknown>>(
  query: string,
  key: string,
  variables?: TVariables,
  optionsOrName?: string | QueryOptions
): Promise<TItem | null> {
  const response = await fetchStrapi<Record<string, unknown>, TVariables>(
    query,
    variables,
    optionsOrName
  );
  return extractSingle<TItem>(response, key);
}

// ─── 4. Generic fetchStrapiCollection (Auto-unwrapper for Collections) ─────────

/**
 * Executes a GraphQL query and automatically unwraps the target collection array.
 * Guaranteed to return an array (empty array `[]` on error/null).
 * 
 * @example
 * const pages = await fetchStrapiCollection<PageItemData>(GET_ALL_PAGES, "pages");
 */
export async function fetchStrapiCollection<TItem, TVariables = Record<string, unknown>>(
  query: string,
  key: string,
  variables?: TVariables,
  optionsOrName?: string | QueryOptions
): Promise<TItem[]> {
  const response = await fetchStrapi<Record<string, unknown>, TVariables>(
    query,
    variables,
    optionsOrName
  );
  return extractCollection<TItem>(response, key);
}

// ─── 5. Generic mutateStrapi (Mutation Executor) ──────────────────────────────

/**
 * Executes a GraphQL mutation safely and returns an ApiResult<TData>.
 * 
 * @example
 * const result = await mutateStrapi<CreateFormResponse>(SUBMIT_CONTACT_FORM, { input });
 */
export async function mutateStrapi<TData, TVariables = Record<string, unknown>>(
  mutation: string,
  variables?: TVariables,
  optionsOrName?: string | QueryOptions
): Promise<ApiResult<TData>> {
  const options = parseOptions(optionsOrName);
  options.queryName = options.queryName || "StrapiMutation";
  return fetchStrapiSafe<TData, TVariables>(mutation, variables, options);
}

// ─── 6. Generic fetchStrapiRest (Strapi REST API Client) ──────────────────────

/**
 * Generic REST API caller for Strapi endpoints (e.g. `/api/contact-forms`, `/api/articles`).
 * Automatically handles base URL, authorization headers, query parameter serialization, and error trapping.
 * 
 * @example
 * const result = await fetchStrapiRest<SubmissionResponse>("/api/contact-submissions", {
 *   method: "POST",
 *   body: { data: formValues }
 * });
 */
export async function fetchStrapiRest<TData>(
  endpoint: string,
  options: RestOptions = {}
): Promise<ApiResult<TData>> {
  const baseUrl = getRestBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let url = `${baseUrl}${cleanEndpoint}`;

  if (options.params && Object.keys(options.params).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, val] of Object.entries(options.params)) {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && token !== "dummy_static_token" ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const isDev = process.env.NODE_ENV === "development";
  const fetchConfig: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    method: options.method || "GET",
    headers,
    cache: options.cache ?? (isDev ? "no-store" : "default"),
    signal: options.signal,
    next:
      options.tags || options.revalidate !== undefined || !isDev
        ? {
            revalidate: options.revalidate === false ? 0 : options.revalidate,
            tags: options.tags ? ["strapi", ...options.tags] : ["strapi"],
          }
        : undefined,
  };

  if (options.body && options.method !== "GET") {
    fetchConfig.body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
  }

  try {
    const res = await fetch(url, fetchConfig);
    const contentType = res.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const errObj = typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>) : {};
      const nestedErr = typeof errObj.error === "object" && errObj.error !== null ? (errObj.error as Record<string, unknown>) : {};

      return createErrorResult(
        typeof nestedErr.message === "string" ? nestedErr.message : `Strapi REST request failed with status ${res.status}`,
        {
          status: res.status,
          code: typeof nestedErr.name === "string" ? nestedErr.name : undefined,
          details: nestedErr.details || payload,
        }
      );
    }

    return createSuccessResult(payload as TData);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error(`⚠️ [Strapi REST] Failed on '${endpoint}':`, message);
    return createErrorResult(message, { details: error });
  }
}
