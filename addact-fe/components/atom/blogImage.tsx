type ImageProps = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

export default function StrapiImage({ src, alt, width, height }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt || ""}
      width={width}
      height={height}
      className="rounded-lg w-full my-4"
    />
  );
}
