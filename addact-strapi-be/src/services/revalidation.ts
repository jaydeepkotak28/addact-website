/**
 * Generic Next.js On-Demand Cache Revalidation Service for Strapi 5
 * 
 * 100% Dynamic & Schema-Aware:
 * Automatically inspects Strapi Content-Type schemas (singleType vs collectionType),
 * plural names, and entry slugs without needing hardcoded switch-cases.
 */

import type { Core } from "@strapi/strapi";

const DEFAULT_SECRET = "addact_super_secret_revalidation_token_2026";

function getFrontendUrl(): string {
  return (
    process.env.FRONTEND_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

function getRevalidationSecret(): string {
  return process.env.REVALIDATION_TOKEN || DEFAULT_SECRET;
}

interface TriggerParams {
  uid: string;
  action: string;
  entry?: any;
  strapi?: Core.Strapi;
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
}

/**
 * Dynamically extracts a slug from any entry regardless of nesting
 */
function extractSlug(entry?: any): string | null {
  if (!entry || typeof entry !== "object") return null;

  const raw =
    entry.pageHeading?.PageHeading?.slug ||
    entry.pageHeading?.slug ||
    entry.slug ||
    null;

  if (typeof raw === "string") {
    return raw.trim();
  }
  return null;
}

/**
 * Dynamically resolves Next.js cache tags and URL paths
 * using Strapi's schema metadata (kind, pluralName, singularName, attributes).
 */
function resolveTagsAndPaths(
  uid: string,
  entry?: any,
  strapi?: Core.Strapi
): { tags: string[]; paths: string[] } {
  const tags: Set<string> = new Set(["strapi"]);
  const paths: Set<string> = new Set();

  const cleanModel = uid.replace(/^api::/, "").split(".")[0];
  const camelModel = toCamelCase(cleanModel);

  tags.add(cleanModel);
  if (camelModel !== cleanModel) {
    tags.add(camelModel);
  }

  // Inspect Strapi schema metadata dynamically
  const strapiInstance = strapi || (global as any).strapi;
  const schema = strapiInstance?.contentType ? strapiInstance.contentType(uid) : null;

  const isSingleType = schema?.kind === "singleType";
  const pluralName = schema?.info?.pluralName || `${cleanModel}s`;
  const singularName = schema?.info?.singularName || cleanModel;

  tags.add(pluralName);

  // 1. Single Types (e.g. header, footer, global-setting, announcement, etc.)
  if (isSingleType) {
    tags.add("global");
    tags.add("layout");
    paths.add("/"); // Single types almost always affect the global layout or home
    return {
      tags: Array.from(tags),
      paths: Array.from(paths),
    };
  }

  // 2. Collection Types & Page-Level Content (page, service, blog, case-study, industry, etc.)
  const slug = extractSlug(entry);

  if (slug) {
    const cleanSlug = slug.replace(/^\/+/, "");

    if (!cleanSlug || cleanSlug === "home") {
      paths.add("/");
    } else {
      // 1. Direct path matching Next.js [...slug] (e.g. /sitecore-development or /services/sitecore)
      paths.add(`/${cleanSlug}`);

      // 2. Sub-paths with plural/singular prefix if not already prefixed
      if (!cleanSlug.startsWith(`${pluralName}/`)) {
        paths.add(`/${pluralName}/${cleanSlug}`);
      }
      if (!cleanSlug.startsWith(`${cleanModel}/`)) {
        paths.add(`/${cleanModel}/${cleanSlug}`);
      }
    }

    // Always revalidate root page because new services/blogs/case-studies often appear in home page sections
    paths.add("/");

    // Tags for granular and bulk invalidation
    tags.add("pages");
    tags.add(cleanModel);
    tags.add(pluralName);
    tags.add(`${cleanModel}:${cleanSlug}`);
    tags.add(`${pluralName}:${cleanSlug}`);
  } else {
    // Non-slug items (e.g. testimonials, faqs, banners, promos, categories, or single types)
    // These almost always render inside pages / dynamic zones / homepage
    tags.add("pages");
    tags.add("layout");
    paths.add("/");
  }

  return {
    tags: Array.from(tags),
    paths: Array.from(paths),
  };
}

/**
 * Sends a non-blocking revalidation request to the Next.js frontend
 */
export async function triggerNextRevalidation({ uid, action, entry, strapi }: TriggerParams) {
  const frontendUrl = getFrontendUrl();
  const secret = getRevalidationSecret();
  const endpoint = `${frontendUrl}/api/revalidate`;

  const { tags, paths } = resolveTagsAndPaths(uid, entry, strapi);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret,
        model: uid,
        event: action,
        tags,
        paths,
      }),
      // Short timeout so Strapi Admin UI is never blocked
      signal: AbortSignal.timeout(5000),
    });

    const data: any = await response.json().catch(() => ({}));

    if (response.ok) {
      strapi?.log?.info
        ? strapi.log.info(
            `⚡ [Revalidation] Next.js cache purged for '${uid}' (${action}) -> Tags: [${tags.join(", ")}], Paths: [${paths.join(", ")}]`
          )
        : console.log(
            `⚡ [Revalidation] Next.js cache purged for '${uid}' (${action}) -> Tags: [${tags.join(", ")}], Paths: [${paths.join(", ")}]`
          );
    } else {
      strapi?.log?.warn
        ? strapi.log.warn(
            `⚠️ [Revalidation] Next.js returned ${response.status}: ${data?.message || "Unknown error"}`
          )
        : console.warn(
            `⚠️ [Revalidation] Next.js returned ${response.status}: ${data?.message || "Unknown error"}`
          );
    }
  } catch (error: any) {
    // Graceful fallback - Next.js dev server might be offline or starting up
    const msg = `⚠️ [Revalidation] Could not reach Next.js at ${endpoint}: ${error?.message || error}`;
    strapi?.log?.warn ? strapi.log.warn(msg) : console.warn(msg);
  }
}

/**
 * Registers Strapi 5 Document Service middleware to listen to publishing & updates
 */
export function registerRevalidationMiddleware(strapi: Core.Strapi) {
  if (!strapi.documents) {
    strapi.log.warn("⚠️ [Revalidation] Document service not available on Strapi instance");
    return;
  }

  strapi.documents.use(async (context, next) => {
    const result = await next();

    try {
      const isApi = context.uid && context.uid.startsWith("api::");
      if (!isApi) {
        return result;
      }

      const isPublishAction =
        context.action === "publish" ||
        context.action === "unpublish" ||
        context.action === "discardDraft" ||
        context.action === "delete";

      const isUpdateAction =
        context.action === "update" || context.action === "create";

      if (isPublishAction || isUpdateAction) {
        setImmediate(() => {
          triggerNextRevalidation({
            uid: context.uid,
            action: context.action,
            entry: result,
            strapi,
          }).catch(() => {});
        });
      }
    } catch (err: any) {
      strapi.log.warn(`⚠️ [Revalidation] Middleware error: ${err?.message || err}`);
    }

    return result;
  });

  strapi.log.info("🚀 [Revalidation] Fully Dynamic Schema-Aware Revalidation Middleware registered!");
}
