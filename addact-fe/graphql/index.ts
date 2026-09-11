/**
 * Central GraphQL entrypoint
 * Provides query/mutation factory, tagged gql template literal, queries, and types.
 */

export { gql } from "graphql-request";

// Factory & Runner
export * from "./factory";
export * from "./types";
export * from "./dynamic";

// Queries
export * from "./queries/getHeader";
export * from "./queries/getFooter";
export * from "./queries/getPageBySlug";
export * from "./queries/getGlobalSetting";
