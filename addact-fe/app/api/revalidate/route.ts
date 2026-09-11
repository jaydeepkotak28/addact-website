import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_SECRET = "addact_super_secret_revalidation_token_2026";

interface RevalidateBody {
  secret?: string;
  tag?: string;
  tags?: string[] | string;
  path?: string;
  paths?: string[] | string;
  model?: string;
  event?: string;
}

function extractSecret(request: NextRequest, body?: RevalidateBody): string | null {
  return (
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-revalidate-token") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    body?.secret ||
    null
  );
}

function processRevalidation(
  tagsInput?: string[] | string,
  pathsInput?: string[] | string
) {
  const revalidatedTags: string[] = [];
  const revalidatedPaths: string[] = [];

  // Revalidate tags
  const rawTags = Array.isArray(tagsInput)
    ? tagsInput
    : typeof tagsInput === "string"
    ? tagsInput.split(",")
    : [];

  for (const t of rawTags) {
    const cleanTag = t?.trim();
    if (cleanTag) {
      try {
        revalidateTag(cleanTag, "default");
        revalidatedTags.push(cleanTag);
      } catch (err) {
        console.warn(`[Revalidate] Failed to revalidate tag '${cleanTag}':`, err);
      }
    }
  }

  // Revalidate paths
  const rawPaths = Array.isArray(pathsInput)
    ? pathsInput
    : typeof pathsInput === "string"
    ? pathsInput.split(",")
    : [];

  for (const p of rawPaths) {
    const cleanPath = p?.trim();
    if (cleanPath) {
      try {
        revalidatePath(cleanPath);
        revalidatedPaths.push(cleanPath);
      } catch (err) {
        console.warn(`[Revalidate] Failed to revalidate path '${cleanPath}':`, err);
      }
    }
  }

  return { revalidatedTags, revalidatedPaths };
}

/**
 * POST /api/revalidate
 * Triggered automatically by Strapi 5 on Publish / Update / Delete
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as RevalidateBody;
    const providedSecret = extractSecret(request, body);
    const expectedSecret = process.env.REVALIDATION_TOKEN || DEFAULT_SECRET;

    if (!providedSecret || providedSecret !== expectedSecret) {
      return NextResponse.json(
        { ok: false, message: "Invalid or missing revalidation secret token" },
        { status: 401 }
      );
    }

    const tags = body.tags || body.tag;
    const paths = body.paths || body.path;

    const { revalidatedTags, revalidatedPaths } = processRevalidation(tags, paths);

    console.log(
      `🔄 [Next.js ISR] Cache revalidated from Strapi (${body.model || "Unknown"}:${body.event || "Update"}) -> Tags: [${revalidatedTags.join(", ")}], Paths: [${revalidatedPaths.join(", ")}]`
    );

    return NextResponse.json({
      ok: true,
      revalidated: true,
      tags: revalidatedTags,
      paths: revalidatedPaths,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("❌ [Next.js ISR] Error executing revalidation:", error);
    return NextResponse.json(
      { ok: false, message: error?.message || "Internal error during revalidation" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/revalidate?secret=...&tag=...&path=...
 * For quick browser verification or manual curl testing
 */
export async function GET(request: NextRequest) {
  const providedSecret = extractSecret(request);
  const expectedSecret = process.env.REVALIDATION_TOKEN || DEFAULT_SECRET;

  if (!providedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json(
      { ok: false, message: "Invalid or missing revalidation secret token" },
      { status: 401 }
    );
  }

  const tagParam = request.nextUrl.searchParams.get("tag") || request.nextUrl.searchParams.get("tags");
  const pathParam = request.nextUrl.searchParams.get("path") || request.nextUrl.searchParams.get("paths");

  const { revalidatedTags, revalidatedPaths } = processRevalidation(tagParam || undefined, pathParam || undefined);

  return NextResponse.json({
    ok: true,
    revalidated: true,
    tags: revalidatedTags,
    paths: revalidatedPaths,
    timestamp: Date.now(),
  });
}
