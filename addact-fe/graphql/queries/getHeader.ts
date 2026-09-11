import { gql } from "graphql-request";
import { fetchStrapi } from "@/lib/fetchStrapi";

import type {
  HeaderImage,
  HeaderLink,
  HeaderCard,
  HeaderSubLayer2,
  HeaderSubLayer,
  HeaderMenuItem,
  AddactHeaderData,
  HeadersQueryResponse,
  HeaderProps,
} from "@/types/header";

export type {
  HeaderImage,
  HeaderLink,
  HeaderCard,
  HeaderSubLayer2,
  HeaderSubLayer,
  HeaderMenuItem,
  AddactHeaderData,
  HeadersQueryResponse,
  HeaderProps,
};

import {
  MEDIA_FIELDS,
  LINK_FIELDS,
  CARD_FIELDS,
} from "@/graphql/fragments/shared";

export const GET_HEADER = gql`
  query GetHeaders($region: String) {
    headers(filters: { region: { eq: $region } }) {
      documentId
      internalName
      region
      additionalText
      logo {
        ...MediaFields
      }
      contactButton {
        ...CardFields
      }
      contactDetails(pagination: { limit: -1 }) {
        ...LinkFields
      }
      menu(pagination: { limit: -1 }) {
        id
        label
        isCardShow
        isNavHide
        link {
          ...LinkFields
        }
        card {
          ...CardFields
        }
        subLayers(pagination: { limit: -1 }) {
          id
          label
          isCardShow
          isNavHide
          link {
            ...LinkFields
          }
          card {
            ...CardFields
          }
          subLayers(pagination: { limit: -1 }) {
            id
            label
            isCardShow
            isNavHide
            link {
              ...LinkFields
            }
            card {
              ...CardFields
            }
          }
        }
      }
    }
  }
  ${MEDIA_FIELDS}
  ${LINK_FIELDS}
  ${CARD_FIELDS}
`;

function normalizeHeader(data: AddactHeaderData): AddactHeaderData {
  if (!data) return data;

  const normalizeLink = (l?: HeaderLink | null): HeaderLink | undefined => {
    if (!l) return undefined;
    return {
      ...l,
      SubDisc: l.SubDisc || l.subDisc,
      Icon: l.Icon || l.icon,
    };
  };

  const normalizeCard = (c?: HeaderCard | null): HeaderCard | undefined => {
    if (!c) return undefined;
    return {
      ...c,
      link: normalizeLink(c.link),
      Image: c.Image || c.image,
      image: c.image || c.Image,
    };
  };

  return {
    ...data,
    contactDetails: (data.contactDetails || []).map(normalizeLink) as HeaderLink[],
    contactButton: normalizeCard(data.contactButton),
    menu: (data.menu || []).map(m => ({
      ...m,
      link: normalizeLink(m.link),
      card: normalizeCard(m.card),
      subLayers: (m.subLayers || []).map(s => ({
        ...s,
        link: normalizeLink(s.link),
        card: normalizeCard(s.card),
        subLayers: (s.subLayers || []).map(deep => ({
          ...deep,
          link: normalizeLink(deep.link),
          card: normalizeCard(deep.card),
        }))
      }))
    }))
  };
}

export async function getHeaderData(region: string = "global"): Promise<AddactHeaderData | null> {
  const data = await fetchStrapi<HeadersQueryResponse>(
    GET_HEADER,
    { region },
    "GetHeaders"
  );
  if (data?.headers && data.headers.length > 0) {
    return normalizeHeader(data.headers[0]);
  }
  // Fallback to global if specific region not found
  if (region !== "global") {
    const fallback = await fetchStrapi<HeadersQueryResponse>(
      GET_HEADER,
      { region: "global" },
      "GetHeadersFallback"
    );
    return fallback?.headers?.[0] ? normalizeHeader(fallback.headers[0]) : null;
  }
  return null;
}

export default getHeaderData;
