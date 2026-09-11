/**
 * Central GraphQL entrypoint
 * Provides query/mutation factory, tagged gql template literal, queries, and types.
 */

export { gql } from "graphql-request";

// Factory & Runner
export * from "./factory";
export * from "./types";
export * from "./dynamic";

// Fragments
export * from "./fragments/media";
export * from "./fragments/shared";

// Queries
export * from "./queries/getHeader";
export * from "./queries/getFooter";
export * from "./queries/getPageBySlug";
export * from "./queries/getGlobalSetting";
export * from "./queries/getClientTestimonialsData";
