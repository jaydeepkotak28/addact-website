import type { ImageType, SharedLink, SharedTitle } from "./common";
import type { CapabilitiesRelationBlockData } from "@/lib/schemas/dynamicZoneSchema";

/**
 * Reusable type aliases - Reusing global SharedLink and ImageType
 */
export type CapabilityLink = SharedLink;
export type CapabilityImage = ImageType;

/**
 * Single Capability Tab Item
 */
export interface CapabilityItem {
  id?: string | number;
  title: string;
  description?: string | null;
  link?: SharedLink | null;
  image?: ImageType | null;
  sublinks?: SharedLink[] | null;
}

/**
 * Global OurCapabilities Data Structure
 */
export interface OurCapabilitiesData {
  heading?: string | SharedTitle | null;
  capabilities: CapabilityItem[];
}

/**
 * Props for OurCapabilities Organism
 */
export interface OurCapabilitiesProps {
  data: OurCapabilitiesData;
  className?: string;
}

/**
 * Props for CapabilitiesRelationBlock (Dynamic Zone Component)
 */
export interface CapabilitiesRelationBlockProps
  extends Partial<CapabilitiesRelationBlockData> {
  className?: string;
}
