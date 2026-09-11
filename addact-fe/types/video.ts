import type { SharedLink } from "./common";
import type {
  VideoRelationBlockData,
  VideoListingEntityData,
  MediaIFrameData,
} from "@/lib/schemas/dynamicZoneSchema";

/**
 * Reusable type aliases - Reusing global SharedLink
 */
export type VideoLink = SharedLink;
export type VideoIFrameData = MediaIFrameData;
export type VideoListingItem = VideoListingEntityData;

/**
 * Video Content Info Structure
 * Reuses global SharedLink properties (id, href, label, target, isExternal, subDisc)
 */
export interface VideoContent {
  Title: string;
  Description: string;
  Link?: SharedLink | null;
}

/**
 * Video Iframe Richtext Structure
 */
export interface VideoIframe {
  Richtext: string;
}

/**
 * Unified Video Item Type
 * Supports both normalized { Content, Iframe } and Strapi { Video } format
 */
export interface VideoContentType {
  id?: string | number;
  documentId?: string;
  internalName?: string;
  Content: VideoContent;
  Iframe: VideoIframe;
  Video?: MediaIFrameData | null;
}

/**
 * Props for VideoList Organism Component
 */
export interface VideoListProps {
  videoList: VideoContentType[];
  className?: string;
}

/**
 * Props for VideoRelationBlock (Dynamic Zone Component)
 */
export interface VideoRelationBlockProps
  extends Partial<VideoRelationBlockData> {
  className?: string;
}
