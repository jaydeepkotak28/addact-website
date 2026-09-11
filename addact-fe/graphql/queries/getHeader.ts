import { gql } from "graphql-request";
import { fetchStrapi } from "@/lib/fetchStrapi";

export interface HeaderImage {
  alternativeText?: string;
  url?: string;
  width?: number;
  height?: number;
}

export interface HeaderLink {
  id?: string;
  href?: string;
  label?: string;
  target?: string;
  isExternal?: boolean;
  subDisc?: string;
  SubDisc?: string;
  icon?: HeaderImage;
  Icon?: HeaderImage;
}

export interface HeaderCard {
  title?: string;
  description?: string;
  image?: HeaderImage;
  Image?: HeaderImage;
  link?: HeaderLink;
}

export interface HeaderSubLayer2 {
  id?: string;
  link?: HeaderLink;
  card?: HeaderCard;
  isCardShow?: boolean;
  isNavHide?: boolean;
}

export interface HeaderSubLayer {
  id?: string;
  link?: HeaderLink;
  card?: HeaderCard;
  subLayers?: HeaderSubLayer2[];
  isCardShow?: boolean;
  isNavHide?: boolean;
}

export interface HeaderMenuItem {
  id?: string;
  link?: HeaderLink;
  card?: HeaderCard;
  subLayers?: HeaderSubLayer[];
  isCardShow?: boolean;
  isNavHide?: boolean;
}

export interface AddactHeaderData {
  documentId?: string;
  internalName?: string;
  region?: string;
  logo?: HeaderImage;
  contactButton?: HeaderCard;
  menu?: HeaderMenuItem[];
  additionalText?: string;
  contactDetails?: HeaderLink[];
}

export interface HeadersQueryResponse {
  headers: AddactHeaderData[];
}

export const GET_HEADER = gql`
  query GetHeaders($region: String) {
    headers(filters: { region: { eq: $region } }) {
      documentId
      internalName
      region
      additionalText
      logo {
        url
        alternativeText
        width
        height
      }
      contactButton {
        title
        description
        image {
          url
          alternativeText
          width
          height
        }
        link {
          id
          href
          label
          target
          isExternal
          icon {
            url
            alternativeText
            width
            height
          }
        }
      }
      contactDetails(pagination: { limit: -1 }) {
        id
        href
        label
        target
        isExternal
        subDisc
        icon {
          url
          alternativeText
          width
          height
        }
      }
      menu(pagination: { limit: -1 }) {
        id
        isCardShow
        isNavHide
        link {
          id
          href
          label
          target
          isExternal
          subDisc
          icon {
            url
            alternativeText
            width
            height
          }
        }
        card {
          title
          description
          image {
            url
            alternativeText
            width
            height
          }
          link {
            id
            href
            label
            target
            isExternal
          }
        }
        subLayers(pagination: { limit: -1 }) {
          id
          isCardShow
          isNavHide
          link {
            id
            href
            label
            target
            isExternal
            subDisc
            icon {
              url
              alternativeText
              width
              height
            }
          }
          card {
            title
            description
            image {
              url
              alternativeText
              width
              height
            }
            link {
              id
              href
              label
              target
              isExternal
            }
          }
          subLayers(pagination: { limit: -1 }) {
            id
            isCardShow
            isNavHide
            link {
              id
              href
              label
              target
              isExternal
              subDisc
              icon {
                url
                alternativeText
                width
                height
              }
            }
            card {
              title
              description
              image {
                url
                alternativeText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

function normalizeHeader(data: AddactHeaderData): AddactHeaderData {
  if (!data) return data;

  const normalizeLink = (l?: HeaderLink): HeaderLink | undefined => {
    if (!l) return l;
    return {
      ...l,
      SubDisc: l.SubDisc || l.subDisc,
      Icon: l.Icon || l.icon,
    };
  };

  const normalizeCard = (c?: HeaderCard): HeaderCard | undefined => {
    if (!c) return c;
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
