import { getStrapiClient } from "./strapi";

/**
 * Generic Reusable Strapi GraphQL Query Executor
 * 
 * @param query - The GraphQL document string (or tagged gql template)
 * @param variables - Optional variables for the GraphQL query
 * @param queryName - Optional name for clear console error logs
 * @returns Promise<T | null>
 */
export async function fetchStrapi<T>(
  query: string,
  variables?: Record<string, any>,
  queryName = "StrapiQuery"
): Promise<T | null> {
  try {
    const client = getStrapiClient();
    const data = await client.request<T>(query, variables);
    return data;
  } catch (error: any) {
    console.error(
      `⚠️ [Strapi] Failed to execute query '${queryName}':`,
      error?.message || error
    );
    return null;
  }
}

export default fetchStrapi;
