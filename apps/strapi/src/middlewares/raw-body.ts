import { Core } from "@strapi/strapi"

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    // Only apply to Stripe webhook endpoint
    if (ctx.request.url === "/api/stripe/webhook") {
      // Store the raw body for signature verification
      ctx.request.body = ctx.request.body || ctx.request.rawBody
    }

    await next()
  }
}
