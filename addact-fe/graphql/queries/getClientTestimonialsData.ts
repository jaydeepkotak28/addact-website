import { gql } from "@/graphql";
import { MEDIA_FIELDS } from "@/graphql/fragments/media";
import { fetchStrapi } from "@/lib/fetchStrapi";
import { cache } from "react";
import type { StrapiMedia } from "@/types/common";

export const GET_CLIENT_TESTIMONIALS = gql`
  query GetClientTestimonials {
    clientTestimonials {
      documentId
      Title
      bgText
      rating
      Item {
        quote
        author_name
        author_position
        rating
      }
      ratingImage {
        ...MediaFields
      }
    }
  }
  ${MEDIA_FIELDS}
`;

export type TestimonialItem = {
  quote?: {
    type?: string;
    children?: {
      text?: string;
      type?: string;
    }[];
  }[];
  author_name?: string;
  author_position?: string;
  rating?: string;
};

export type ClientTestimonialsData = {
  documentId?: string;
  Title: string;
  Item: TestimonialItem[];
  bgText?: string;
  rating: string;
  ratingImage?: StrapiMedia | null;
};

export type ClientTestimonialsResponse = {
  clientTestimonials: ClientTestimonialsData[];
};

export const getClientTestimonialsData = cache(
  async (): Promise<ClientTestimonialsData | null> => {
    try {
      const data = await fetchStrapi<ClientTestimonialsResponse>(
        GET_CLIENT_TESTIMONIALS,
        undefined,
        {
          queryName: "GetClientTestimonials",
          tags: ["clientTestimonials", "client-testimonial"],
          revalidate: 60,
        }
      );
      return data?.clientTestimonials?.[0] || null;
    } catch (error) {
      console.error("Error fetching client testimonials:", error);
      return null;
    }
  }
);
