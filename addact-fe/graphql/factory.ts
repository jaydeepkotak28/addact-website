/**
 * Generic GraphQL Query and Mutation Factory
 * Converts raw GraphQL query documents into reusable, type-safe runners.
 */

import {
  fetchStrapi,
  fetchStrapiSafe,
  fetchStrapiSingle,
  fetchStrapiCollection,
  mutateStrapi,
} from "@/lib/api/client";
import type { QueryOptions } from "@/types/api";
import type {
  TypedQueryRunner,
  TypedMutationRunner,
} from "./types";

/**
 * Creates a strongly-typed GraphQL Query Runner.
 * 
 * @example
 * export const queryPage = createQuery<GetPageResponse, { slug: string }>(
 *   GET_PAGE_BY_SLUG,
 *   { queryName: "GetPageBySlug", tags: ["pages"] }
 * );
 * 
 * // 1. Direct call (returns GetPageResponse | null):
 * const data = await queryPage({ slug: "about" });
 * 
 * // 2. Auto unwrap single item (returns PageItem | null):
 * const page = await queryPage.single<PageItem>("pages", { slug: "about" });
 * 
 * // 3. Auto unwrap array (returns PageItem[]):
 * const allPages = await queryPage.collection<PageItem>("pages");
 * 
 * // 4. Safe call (returns ApiResult<GetPageResponse>):
 * const res = await queryPage.safe({ slug: "about" });
 */
export function createQuery<TData, TVariables = Record<string, unknown>>(
  document: string,
  defaultOptions?: QueryOptions
): TypedQueryRunner<TData, TVariables> {
  const runner = (async (
    variables?: TVariables,
    options?: QueryOptions
  ): Promise<TData | null> => {
    const mergedOptions: QueryOptions = { ...defaultOptions, ...options };
    return fetchStrapi<TData, TVariables>(document, variables, mergedOptions);
  }) as TypedQueryRunner<TData, TVariables>;

  runner.document = document;

  runner.safe = async (
    variables?: TVariables,
    options?: QueryOptions
  ) => {
    const mergedOptions: QueryOptions = { ...defaultOptions, ...options };
    return fetchStrapiSafe<TData, TVariables>(document, variables, mergedOptions);
  };

  runner.single = async <TItem = unknown>(
    key: string,
    variables?: TVariables,
    options?: QueryOptions
  ) => {
    const mergedOptions: QueryOptions = { ...defaultOptions, ...options };
    return fetchStrapiSingle<TItem, TVariables>(document, key, variables, mergedOptions);
  };

  runner.collection = async <TItem = unknown>(
    key: string,
    variables?: TVariables,
    options?: QueryOptions
  ) => {
    const mergedOptions: QueryOptions = { ...defaultOptions, ...options };
    return fetchStrapiCollection<TItem, TVariables>(document, key, variables, mergedOptions);
  };

  return runner;
}

/**
 * Creates a strongly-typed GraphQL Mutation Runner.
 * 
 * @example
 * export const submitContact = createMutation<SubmitResponse, { input: ContactInput }>(
 *   SUBMIT_CONTACT_MUTATION,
 *   { queryName: "SubmitContact" }
 * );
 * 
 * const res = await submitContact({ input: { name: "Addact" } });
 * if (res.ok) { ... }
 */
export function createMutation<TData, TVariables = Record<string, unknown>>(
  document: string,
  defaultOptions?: QueryOptions
): TypedMutationRunner<TData, TVariables> {
  const runner = (async (
    variables?: TVariables,
    options?: QueryOptions
  ) => {
    const mergedOptions: QueryOptions = { ...defaultOptions, ...options };
    return mutateStrapi<TData, TVariables>(document, variables, mergedOptions);
  }) as TypedMutationRunner<TData, TVariables>;

  runner.document = document;

  return runner;
}
