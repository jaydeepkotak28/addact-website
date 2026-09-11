import { GraphQLClient } from "graphql-request";
import { getStrapiMediaUrl } from "./media";

export { getStrapiMediaUrl };

// Best Practice: Revalidation time in seconds (ISR)
export const STRAPI_REVALIDATE_SECONDS = 60;

function getEndpoint(): string {
  return (
    process.env.STRAPI_GRAPHQL_ENDPOINT ||
    process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_ENDPOINT ||
    "http://localhost:1337/graphql"
  );
}

function getToken(): string | undefined {
  let token =
    process.env.STRAPI_API_TOKEN ||
    process.env.NEXT_PUBLIC_STRAPI_TOKEN;

  // Fallback: If dev server was started before .env.local was updated, read from file directly
  if ((!token || token === "dummy_static_token") && typeof window === "undefined") {
    try {
      const fs = require("fs");
      const path = require("path");
      const envPath = path.resolve(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        const match =
          content.match(/STRAPI_API_TOKEN=(.+)/) ||
          content.match(/NEXT_PUBLIC_STRAPI_TOKEN=(.+)/);
        if (match && match[1]) {
          token = match[1].trim();
        }
      }
    } catch {
      // Ignored in non-Node environments
    }
  }

  return token;
}

export function getStrapiClient(): GraphQLClient {
  const endpoint = getEndpoint();
  const token = getToken();

  return new GraphQLClient(endpoint, {
    headers: {
      ...(token && token !== "dummy_static_token"
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
    fetch: (url, options) =>
      fetch(url, {
        ...options,
        cache: "default",
        next: { revalidate: STRAPI_REVALIDATE_SECONDS, tags: ["strapi"] },
      }),
  });
}

export const strapiClient = getStrapiClient();

export default strapiClient;
