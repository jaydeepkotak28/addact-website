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

  // Respect explicit unoptimized prop if passed, otherwise let Next.js optimize
  const shouldBeUnoptimized = unoptimized ?? false;

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
