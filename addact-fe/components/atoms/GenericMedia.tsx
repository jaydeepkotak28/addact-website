import React from "react";
import Image from "next/image";
import clsx from "clsx";
import type { ImageType, Nullable } from "@/types/common";
import { getStrapiMediaUrl } from "@/lib/media";

export interface GenericMediaProps {
  media?: Nullable<ImageType | string>;
  videoUrl?: Nullable<string>;
  alt?: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9" | "auto";
  priority?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
}

function isVideoUrl(url: string): boolean {
  const clean = url.toLowerCase().split("?")[0];
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".ogg") ||
    clean.endsWith(".mov")
  );
}

function getEmbedUrl(url: string): string | null {
  if (url.includes("youtube.com/watch")) {
    const v = new URL(url).searchParams.get("v");
    return v ? `https://www.youtube.com/embed/${v}` : null;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}

/**
 * GenericMedia - Polymorphic Media Atom
 * 
 * Automatically resolves and renders:
 * - Strapi & External Images (Next.js Image)
 * - Video Files (HTML5 <video> with controls/autoplay)
 * - Embedded Videos (YouTube / Vimeo responsive iframes)
 */
export const GenericMedia: React.FC<GenericMediaProps> = ({
  media,
  videoUrl,
  alt = "",
  className = "",
  imageClassName = "",
  width = 800,
  height = 450,
  aspectRatio = "auto",
  priority = false,
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  poster,
}) => {
  const resolvedMediaUrl =
    typeof media === "string"
      ? getStrapiMediaUrl(media)
      : media?.url
      ? getStrapiMediaUrl(media.url)
      : "";

  const effectiveVideoUrl = videoUrl || (isVideoUrl(resolvedMediaUrl) ? resolvedMediaUrl : null);
  const resolvedPoster = poster ? getStrapiMediaUrl(poster) : undefined;
  const altText = alt || (typeof media === "object" ? media?.alternativeText || media?.name || "" : "");

  const aspectClass =
    aspectRatio === "16/9"
      ? "aspect-video"
      : aspectRatio === "4/3"
      ? "aspect-[4/3]"
      : aspectRatio === "1/1"
      ? "aspect-square"
      : aspectRatio === "21/9"
      ? "aspect-[21/9]"
      : "";

  // 1. YouTube / Vimeo Embed
  if (effectiveVideoUrl) {
    const embedUrl = getEmbedUrl(effectiveVideoUrl);
    if (embedUrl) {
      return (
        <div className={clsx("relative w-full overflow-hidden rounded-lg aspect-video", className)}>
          <iframe
            src={embedUrl}
            title={altText || "Embedded Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      );
    }

    // 2. HTML5 Video
    return (
      <div className={clsx("relative w-full overflow-hidden rounded-lg", aspectClass, className)}>
        <video
          src={effectiveVideoUrl}
          poster={resolvedPoster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // 3. Image
  if (resolvedMediaUrl) {
    return (
      <div className={clsx("relative overflow-hidden", aspectClass, className)}>
        <Image
          src={resolvedMediaUrl}
          alt={altText}
          width={width}
          height={height}
          priority={priority}
          className={clsx("w-full h-auto object-cover", imageClassName)}
        />
      </div>
    );
  }

  return null;
};

export default GenericMedia;
