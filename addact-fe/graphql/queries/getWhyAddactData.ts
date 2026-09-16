import { gql } from "@/graphql";
import { fetchStrapi } from "@/lib/fetchStrapi";
import { cache } from "react";
import { normalizeWhyAddact } from "@/lib/normalizers";

export const GET_WHY_ADDACT = gql`
  query GetWhyAddact($internalName: String) {
    whyAddacts(filters: { internalName: { contains: $internalName } }) {
      documentId
      internalName
      title {
        title
        tag
      }
      content {
        documentId
        internalName
        Body {
          title
          description
        }
      }
    }
  }
`;

export interface WhyAddactItem {
  documentId: string;
  internalName: string;
  title?: {
    title?: string;
    tag?: string;
  };
  content?: {
    documentId: string;
    internalName: string;
    Body?: {
      title?: string;
      description?: string;
    };
  }[];
}

export interface WhyAddactResponse {
  whyAddacts: WhyAddactItem[];
}

export const getWhyAddactData = cache(
  async (internalName?: string) => {
    try {
      const data = await fetchStrapi<WhyAddactResponse>(
        GET_WHY_ADDACT,
        internalName ? { internalName } : undefined,
        {
          queryName: "GetWhyAddact",
          tags: ["why-addacts", "why-addact", `why-addact:${internalName || "all"}`],
          revalidate: 60,
        }
      );
      const item = data?.whyAddacts?.[0];
      return item ? normalizeWhyAddact(item) : null;
    } catch (error) {
      console.error("Error fetching WhyAddact data:", error);
      return null;
    }
  }
);
