"use client";

import React from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";

interface ImageProps extends Omit<NextImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
}

const Image = ({
  src,
  alt,
  className = "",
  width,
  height,
  fill,
  priority = false,
  unoptimized = false,
  ...rest
}: ImageProps) => {
  return (
    <NextImage
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      fill={fill}
      priority={priority}
      unoptimized={unoptimized}
      {...rest}
    />
  );
};

export default Image;
