/**
 * Client-safe Strapi media URL resolver.
 * Handles strings, objects with .url, objects with .data.attributes.url,
 * and handles both relative paths (/uploads/...) and full external URLs.
 */
export function getStrapiMediaUrl(media?: any): string {
  if (!media) return "";
  let url = "";

  if (typeof media === "string") {
    url = media;
  } else if (typeof media === "object") {
    if (media.url && typeof media.url === "string") {
      url = media.url;
    } else if (media.data?.attributes?.url && typeof media.data.attributes.url === "string") {
      url = media.data.attributes.url;
    } else if (media.Image?.url && typeof media.Image.url === "string") {
      url = media.Image.url;
    } else if (media.image?.url && typeof media.image.url === "string") {
      url = media.image.url;
    }
  }

  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const apiEndpoint =
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    process.env.STRAPI_API_URL ||
    "http://localhost:1337";

  const cleanBase = apiEndpoint.replace(/\/$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

export default getStrapiMediaUrl;
