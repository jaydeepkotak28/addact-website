import { GraphQLClient } from "graphql-request";

const endpoint =
  process.env.STRAPI_GRAPHQL_ENDPOINT ||
  process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT ||
  "http://localhost:1337/graphql";

const token =
  process.env.STRAPI_API_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// Best Practice: Revalidation time in seconds (ISR)
export const STRAPI_REVALIDATE_SECONDS = 60;

export const strapiClient = new GraphQLClient(endpoint, {
  headers: {
    ...(token && token !== "dummy_static_token"
      ? { Authorization: `Bearer ${token}` }
      : {}),
  },
  fetch: (url, options) =>
    fetch(url, {
      ...options,
      next: {
        revalidate: STRAPI_REVALIDATE_SECONDS,
        tags: ["strapi"],
      },
    }),
});

export default strapiClient;
