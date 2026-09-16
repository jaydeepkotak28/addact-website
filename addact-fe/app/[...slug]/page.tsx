import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/graphql/queries/getPageBySlug";
import {
  getServiceBySlug,
  type ServiceItemData,
} from "@/graphql/queries/getServiceBySlug";
import {
  getHireExpertBySlug,
  type HireExpertItemData,
} from "@/graphql/queries/getHireExpertBySlug";
import DynamicZoneRenderer from "@/components/dynamic-zone/DynamicZoneRenderer";
import { generateStrapiMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * Dynamic Metadata Generation from Strapi SEO Component (Page or Service)
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug && slug.length > 0 ? slug.join("/") : "";

  // 1. Try resolving standard Page
  const page = await getPageBySlug(slugPath);
  if (page) {
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

  // 2. Try resolving multi-layer Service
  const service = await getServiceBySlug(slugPath);
  if (service) {
    const seo = service.pageHeading?.seo;
    const fallbackTitle =
      service.pageHeading?.PageHeading?.pageTitle ||
      service.internalName ||
      "Addact Technologies";
    const strapiMeta = generateStrapiMetadata(seo);
    return {
      ...strapiMeta,
      title: seo?.metaTitle || fallbackTitle,
      description: seo?.metaDescription || strapiMeta.description,
    };
  }

  // 3. Try resolving multi-layer Hire Expert
  const hireExpert = await getHireExpertBySlug(slugPath);
  if (hireExpert) {
    const seo = hireExpert.pageHeading?.seo;
    const fallbackTitle =
      hireExpert.roleTitle ||
      hireExpert.pageHeading?.PageHeading?.pageTitle ||
      hireExpert.internalName ||
      "Addact Technologies";
    const strapiMeta = generateStrapiMetadata(seo);
    return {
      ...strapiMeta,
      title: seo?.metaTitle || fallbackTitle,
      description: seo?.metaDescription || strapiMeta.description,
    };
  }

  return {
    title: "Page Not Found",
  };
}

/**
 * Universal Dynamic Catch-All Page & Multi-Layer Service Router
 * Matches any URL (e.g. /career, /development-services/cms-development/sitecore)
 * and dynamically renders Strapi Dynamic Zone components and multi-layer sub-services.
 * 
 * NO static hardcoded banners or static placeholders are used:
 * Whatever components are placed in Strapi's dynamic zone ('sections') will be rendered dynamically.
 */
export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug && slug.length > 0 ? slug.join("/") : "";

  // 1. Check Standard Page
  const page = await getPageBySlug(slugPath);

  if (page) {
    const sections = page.sections || [];

    const isPolicyPage = page.pageType === "LegalPolicy" || page.variant === "legal_policy";
    const isDarkPage = page.pageType === "Dark" || page.variant === "dark";
    const isLightPage = page.pageType === "Light" || page.variant === "light";

    const mainVariantClass = isLightPage
      ? "bg-siteLight text-black"
      : "bg-siteDark text-white";

    return (
      <main className={`${mainVariantClass} min-h-screen`.trim()}>
        {sections.length > 0 && <DynamicZoneRenderer sections={sections} />}
      </main>
    );
  }

  // 2. Check Multi-Layer Service
  const service = await getServiceBySlug(slugPath);

  if (service) {
    const sections = service.sections || [];

    const isPolicyPage = service.pageType === "LegalPolicy" || service.variant === "legal_policy";
    const isDarkPage = service.pageType === "Dark" || service.variant === "dark";
    const isLightPage = service.pageType === "Light" || service.variant === "light";

    if (isPolicyPage) {
      return (
        <main className="bg-white company-policy min-h-screen">
          <div className="container-main">
            {sections.length > 0 && <DynamicZoneRenderer sections={sections} />}
          </div>
        </main>
      );
    }

    const mainVariantClass = isLightPage
      ? "bg-siteLight text-black"
      : "bg-siteDark text-white";

    return (
      <main className={`${mainVariantClass} min-h-screen`.trim()}>
        {sections.length > 0 && <DynamicZoneRenderer sections={sections} />}
      </main>
    );
  }

  // 3. Check Multi-Layer Hire Expert
  const hireExpert = await getHireExpertBySlug(slugPath);

  if (hireExpert) {
    const sections = hireExpert.sections || [];

    const isPolicyPage = hireExpert.pageType === "LegalPolicy" || hireExpert.variant === "legal_policy";
    const isDarkPage = hireExpert.pageType === "Dark" || hireExpert.variant === "dark";
    const isLightPage = hireExpert.pageType === "Light" || hireExpert.variant === "light";

    if (isPolicyPage) {
      return (
        <main className="bg-white company-policy min-h-screen">
          <div className="container-main">
            {sections.length > 0 && <DynamicZoneRenderer sections={sections} />}
          </div>
        </main>
      );
    }

    const mainVariantClass = isLightPage
      ? "bg-siteLight text-black"
      : "bg-siteDark text-white";

    return (
      <main className={`${mainVariantClass} min-h-screen`.trim()}>
        {sections.length > 0 && <DynamicZoneRenderer sections={sections} />}
      </main>
    );
  }

  // Not found in pages, services, or hire experts
  notFound();
}
