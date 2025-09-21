import type { Core } from "@strapi/strapi"

import { registerPopulatePageMiddleware } from "./documentMiddlewares/page"
import { registerAdminUserSubscriber } from "./lifeCycles/adminUser"
import { registerDownloadLogSubscriber } from "./lifeCycles/download-log"
import { registerUserSubscriber } from "./lifeCycles/user"

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    registerAdminUserSubscriber({ strapi })
    registerUserSubscriber({ strapi })
    registerDownloadLogSubscriber({ strapi })

    registerPopulatePageMiddleware({ strapi })

    // Run seeders in development
    if (
      process.env.NODE_ENV === "development" &&
      process.env.SEED_SAMPLE_DATA !== "false"
    ) {
      try {
        const seedDatabase = require("./seeders")
        await seedDatabase(strapi)
      } catch (error) {
        console.error("Seeding failed:", error)
      }
    }
  },
}
