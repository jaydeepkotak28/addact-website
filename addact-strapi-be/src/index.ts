import type { Core } from "@strapi/strapi";
import { registerRevalidationMiddleware } from "./services/revalidation";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    registerRevalidationMiddleware(strapi);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
