import type { Metadata } from "next";
import { getTermsConditions } from "@/graphql/queries/getTermsConditions";
import DynamicZoneRenderer from "@/components/dynamic-zone/DynamicZoneRenderer";
import { generateStrapiMetadata } from "@/lib/seo";
import { getPageHeading } from "@/lib/schemas/dynamicZoneSchema";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getTermsConditions();
  const seo = data?.termsAndCondition?.pageHeading?.seo;

  return generateStrapiMetadata(seo);
}

export default async function TermsConditionsPage() {
  const data = await getTermsConditions();
  const heading = getPageHeading(data?.termsAndCondition, "Terms of Use");
  const sections = data?.termsAndCondition?.Section;

  return (
    <main className="bg-white company-policy min-h-screen">
      <div className="container-main">
        <h1>{heading}</h1>

        {sections && sections.length > 0 ? (
          <DynamicZoneRenderer sections={sections} />
        ) : (
          <p className="text-gray-500">
            No content available yet. (Please check Strapi Admin to publish content or enable API permissions).
          </p>
        )}
      </div>
    </main>
  );
}