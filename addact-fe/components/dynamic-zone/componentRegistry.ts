import React from "react";
import ContentBlock from "./blocks/ContentBlock";

/**
 * Component Registry
 * Maps Strapi Dynamic Zone __typename to React Components.
 * 
 * To add a new component from Strapi:
 * 1. Build your React block component in ./blocks
 * 2. Add a single entry to this registry map.
 */
export const componentRegistry: Record<
  string,
  React.ComponentType<any>
> = {
  // Strapi GraphQL __typename for component 'feature.content'
  ComponentFeatureContent: ContentBlock,

  // Fallback alias if REST API or different naming is used:
  "feature.content": ContentBlock,
};

export type ComponentRegistryType = typeof componentRegistry;
