import type { Metadata } from "next";
import { getTermsConditions } from "@/graphql/queries/getTermsConditions";
import DynamicZoneRenderer from "@/components/dynamic-zone/DynamicZoneRenderer";
import { generateStrapiMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getTermsConditions();
  const seo = data?.termsAndCondition?.pageHeading?.seo;

  return generateStrapiMetadata(seo);
}

export default async function TermsConditionsPage() {
  const data = await getTermsConditions();
  const sections = data?.termsAndCondition?.Section;

  const contentTitle = sections?.find(
    (s) => s?.content?.Body?.title
  )?.content?.Body?.title;

  const heading =
    contentTitle ||
    data?.termsAndCondition?.pageHeading?.PageHeading?.pageTitle ||
    "Terms of Use";

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