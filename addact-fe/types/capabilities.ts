import type {
  StrapiMedia,
  SharedLink,
  SharedTitle,
  CapabilitiesRelationBlockData,
} from "@/lib/schemas/dynamicZoneSchema";

/**
 * Reusable type aliases - Reusing global SharedLink and StrapiMedia
 */
export type CapabilityLink = SharedLink;
export type CapabilityImage = StrapiMedia;

/**
 * Single Capability Tab Item
 */
export interface CapabilityItem {
  id?: string | number;
  title: string;
  description?: string | null;
  link?: SharedLink | null;
  image?: StrapiMedia | null;
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
