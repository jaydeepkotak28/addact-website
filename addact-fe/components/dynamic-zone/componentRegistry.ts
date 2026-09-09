import React from "react";
import ContentBlock from "./blocks/ContentBlock";
import ContentRelationBlock from "./blocks/ContentRelationBlock";

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
  "feature.content": ContentBlock,

  // Strapi GraphQL __typename for component 'content-relation.content-relation'
  ComponentContentRelationContentRelation: ContentRelationBlock,
  "content-relation.content-relation": ContentRelationBlock,
};

export type ComponentRegistryType = typeof componentRegistry;
