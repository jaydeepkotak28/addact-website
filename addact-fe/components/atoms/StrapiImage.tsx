import React from "react";
import Image, { type ImageProps } from "next/image";
import { getStrapiMediaUrl } from "@/lib/media";

export interface StrapiImageProps
  extends Omit<ImageProps, "src" | "alt"> {
  src?: any;
  alt?: string | null;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  unoptimized?: boolean;
}

export const StrapiImage: React.FC<StrapiImageProps> = ({
  src,
  alt = "",
  width = 800,
  height = 500,
  fill,
  className = "",
  unoptimized,
  ...rest
}) => {
  const fullUrl = getStrapiMediaUrl(src);
  if (!fullUrl) return null;

  // In Next.js, local Strapi URLs on localhost:1337 return 400 Bad Request
  // if not unoptimized, unless the dev server was started with exact remotePatterns.
  // Using unoptimized for local dev ensures images are always visible.
  const isLocal =
    fullUrl.includes("localhost") ||
    fullUrl.includes("127.0.0.1") ||
    process.env.NODE_ENV === "development";
  const shouldBeUnoptimized = unoptimized ?? isLocal;

  if (fill) {
    return (
      <Image
        src={fullUrl}
        alt={alt || ""}
        fill
        unoptimized={shouldBeUnoptimized}
        className={className}
        {...rest}
      />
    );
  }

  return (
    <Image
      src={fullUrl}
      alt={alt || ""}
      width={width}
      height={height}
      unoptimized={shouldBeUnoptimized}
      className={className}
      {...rest}
    />
  );
};

export default StrapiImage;
