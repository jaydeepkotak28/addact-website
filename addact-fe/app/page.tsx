import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/graphql/queries/getPageBySlug";
import DynamicZoneRenderer from "@/components/dynamic-zone/DynamicZoneRenderer";
import { generateStrapiMetadata } from "@/lib/seo";

/**
 * Dynamic Metadata Generation for Home Page from Strapi SEO Component
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("");

  if (!page) {
    return {
      title: "Addact Technologies",
    };
  }

  const seo = page.pageHeading?.seo;
  const fallbackTitle =
    page.pageHeading?.PageHeading?.pageTitle ||
    page.internalName ||
    "Addact Technologies";

  const strapiMeta = generateStrapiMetadata(seo);

  return {
    ...strapiMeta,
    title: seo?.metaTitle || fallbackTitle,
    description: seo?.metaDescription || strapiMeta.description,
  };
}

/**
 * Home Page Route (/)
 * Fetches the root page ("/") directly from Strapi and renders Dynamic Zone components.
 */
export default async function HomePage() {
  const page = await getPageBySlug("");

  if (!page) {
    notFound();
  }

  const heading =
    page.pageHeading?.PageHeading?.pageTitle ||
    page.internalName ||
    "";
  const sections = page.sections || [];

  // Dynamic layout selection driven directly by Strapi CMS (pageType / variant field)
  const isPolicyPage =
    page.pageType === "LegalPolicy" || page.variant === "legal_policy";
  const isDarkPage = page.pageType === "Dark" || page.variant === "dark";
  const isLightPage = page.pageType === "Light" || page.variant === "light";

  if (isPolicyPage) {
    return (
      <main className="bg-white company-policy min-h-screen">
        <div className="container-main">
          {heading && <h1>{heading}</h1>}
          {sections.length > 0 && <DynamicZoneRenderer sections={sections} />}
        </div>
      </main>
    );
  }

  const mainVariantClass = isDarkPage
    ? "bg-siteDark text-white"
    : isLightPage
      ? "bg-siteLight"
      : "";

  return (
    <main className={`${mainVariantClass} min-h-screen`.trim()}>
      {sections.length > 0 ? (
        <DynamicZoneRenderer sections={sections} />
      ) : heading ? (
        <div className="container-main py-12 text-center">
          <h1
            className={`text-3xl font-bold font-montserrat ${
              isDarkPage ? "text-white" : "text-black"
            }`}
          >
            {heading}
          </h1>
        </div>
      ) : null}
    </main>
  );
}
