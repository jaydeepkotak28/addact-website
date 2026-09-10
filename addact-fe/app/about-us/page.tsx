import type { Metadata } from "next";
import { getAboutUs } from "@/graphql/queries/getAboutUs";
import DynamicZoneRenderer from "@/components/dynamic-zone/DynamicZoneRenderer";
import { generateStrapiMetadata } from "@/lib/seo";
import { getPageHeading } from "@/lib/schemas/dynamicZoneSchema";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAboutUs();
  const seo = data?.aboutUs?.pageHeading?.seo;

  return generateStrapiMetadata(seo);
}

export default async function AboutUsPage() {
  const data = await getAboutUs();
  const page = data?.aboutUs;
  const heading = getPageHeading(page, "About Us");
  const sections = page?.section || page?.Section;

  return (
    <main className="bg-[#f4f4f4] min-h-screen py-10">
      {/* Dynamic Zone Sections */}
      {sections && sections.length > 0 ? (
        <DynamicZoneRenderer sections={sections} />
      ) : (
        <div className="container-main py-12">
          <p className="text-gray-500">
            No sections available yet. (Please check Strapi Admin to add promo relations and publish content).
          </p>
        </div>
      )}
    </main>
  );
}
