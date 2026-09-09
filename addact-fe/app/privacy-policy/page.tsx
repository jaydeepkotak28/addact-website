import type { Metadata } from "next";
import { getPrivacyPolicy } from "@/graphql/queries/getPrivacyPolicy";
import DynamicZoneRenderer from "@/components/dynamic-zone/DynamicZoneRenderer";
import { generateStrapiMetadata } from "@/lib/seo";
import { getPageHeading } from "@/lib/schemas/dynamicZoneSchema";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPrivacyPolicy();
  const seo = data?.privacyPolicy?.pageHeading?.seo;

  return generateStrapiMetadata(seo);
}

export default async function PrivacyPolicyPage() {
  const data = await getPrivacyPolicy();
  const heading = getPageHeading(data?.privacyPolicy, "Privacy Policy");
  const sections = data?.privacyPolicy?.Section;

  return (
    <main className="bg-white company-policy min-h-screen">
      <div className="container-main">
        <h1>{heading}</h1>

        {sections && sections.length > 0 ? (
          <DynamicZoneRenderer sections={sections} />
        ) : (
          <p className="text-gray-500">
            No policy content available yet. (Please check Strapi Admin to publish content or enable API permissions).
          </p>
        )}
      </div>
    </main>
  );
}