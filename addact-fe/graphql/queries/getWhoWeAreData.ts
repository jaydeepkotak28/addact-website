import { gql } from "@/graphql";
import { fetchStrapi } from "@/lib/fetchStrapi";
import { cache } from "react";
import { normalizeWhoAreWe } from "@/lib/normalizers";

export const GET_WHO_WE_ARE = gql`
  query GetWhoWeAre($internalName: String) {
    whoAreWes(filters: { internalName: { contains: $internalName } }) {
      documentId
      internalName
      description {
        body
      }
      counterCards {
        documentId
        internalName
        card {
          title
          counter
        }
      }
    }
  }
`;

export interface WhoAreWeItem {
  documentId: string;
  internalName: string;
  description?: {
    body?: string;
  };
  counterCards?: {
    documentId: string;
    internalName: string;
    card?: {
      title?: string;
      counter?: string;
    };
  }[];
}

export interface WhoAreWeResponse {
  whoAreWes: WhoAreWeItem[];
}

export const getWhoWeAreData = cache(
  async (internalName?: string) => {
    try {
      const data = await fetchStrapi<WhoAreWeResponse>(
        GET_WHO_WE_ARE,
        internalName ? { internalName } : undefined,
        {
          queryName: "GetWhoWeAre",
          tags: ["who-are-wes", "who-are-we", `who-are-we:${internalName || "all"}`],
          revalidate: 60,
        }
      );
      const item = data?.whoAreWes?.[0];
      return item ? normalizeWhoAreWe(item) : null;
    } catch (error) {
      console.error("Error fetching WhoWeAre data:", error);
      return null;
    }
  }
);
