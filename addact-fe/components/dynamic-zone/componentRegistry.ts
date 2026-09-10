import React from "react";
import ContentBlock from "./blocks/ContentBlock";
import ContentRelationBlock from "./blocks/ContentRelationBlock";
import PromoBlock from "./blocks/PromoBlock";
import PromoRelationBlock from "./blocks/PromoRelationBlock";
import type { DynamicZoneComponentMap } from "@/lib/schemas/dynamicZoneSchema";

/**
 * Type-Safe Component Registry Type
 * Provides IDE autocomplete for all registered Strapi component typenames.
 */
export type ComponentRegistryType = {
  [K in keyof DynamicZoneComponentMap]?: React.ComponentType<any>;
} & Record<string, React.ComponentType<any>>;

/**
 * Component Registry (Single Source of Truth for Dynamic Zone Rendering)
 * Maps Strapi Dynamic Zone __typename to React Components.
 * 
 * To add a new component from Strapi:
 * 1. Build your React block in ./blocks
 * 2. Add an entry here (IDE will autocomplete the __typename)
 */
export const componentRegistry: ComponentRegistryType = {
  // Strapi GraphQL __typename for component 'feature.content'
  ComponentFeatureContent: ContentBlock,
  "feature.content": ContentBlock,

  // Strapi GraphQL __typename for component 'content-relation.content-relation'
  ComponentContentRelationContentRelation: ContentRelationBlock,
  "content-relation.content-relation": ContentRelationBlock,

  // Strapi GraphQL __typename for component 'content-relation.promo-relation'
  ComponentContentRelationPromoRelation: PromoRelationBlock,
  "content-relation.promo-relation": PromoRelationBlock,

  // Strapi GraphQL __typename for component 'feature.promo'
  ComponentFeaturePromo: PromoBlock,
  "feature.promo": PromoBlock,
};

