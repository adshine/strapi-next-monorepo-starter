import { handleTemplateRemix } from "./handlers/remix"
import { handleHealthCheck } from "./handlers/health"
import { proxyToStrapi } from "./handlers/proxy"
import { createErrorResponse, createSuccessResponse, verifyJWT } from "./utils"

export interface Env {
  TEMPLATES_BUCKET: R2Bucket
  BACKUPS_BUCKET: R2Bucket
  STRAPI_URL: string
  JWT_SECRET: string
  ENVIRONMENT: string
  RATE_LIMITER: any
  ANALYTICS: AnalyticsEngineDataset
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin":
        env.ENVIRONMENT === "production" ? "https://framer-templates.com" : "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      })
    }

    try {
      // Health check
      if (path === "/health") {
        return handleHealthCheck(env)
      }

      // Rate limiting check (except health endpoint)
      const clientIp = request.headers.get("CF-Connecting-IP") || "unknown"
      const rateLimitKey = `${clientIp}:${path}`

      if (env.RATE_LIMITER) {
        const { success } = await env.RATE_LIMITER.limit({ key: rateLimitKey })
        if (!success) {
          return createErrorResponse("Rate limit exceeded", 429, corsHeaders)
        }
      }

      // Template remix endpoint (requires auth)
      if (path.startsWith("/remix/")) {
        const authHeader = request.headers.get("Authorization")
        if (!authHeader) {
          return createErrorResponse("Unauthorized", 401, corsHeaders)
        }

        const token = authHeader.replace("Bearer ", "")
        const payload = await verifyJWT(token, env.JWT_SECRET)

        if (!payload) {
          return createErrorResponse("Invalid token", 401, corsHeaders)
        }

        return handleTemplateRemix(request, env, payload)
      }

      // Proxy authenticated API requests to Strapi
      if (path.startsWith("/api/")) {
        return proxyToStrapi(request, env, corsHeaders)
      }

      // Analytics tracking
      if (env.ANALYTICS) {
        ctx.waitUntil(
          env.ANALYTICS.writeDataPoint({
            blobs: [path, request.method],
            doubles: [Date.now()],
            indexes: [clientIp],
          })
        )
      }

      return createErrorResponse("Not Found", 404, corsHeaders)
    } catch (error) {
      console.error("Worker error:", error)
      return createErrorResponse("Internal Server Error", 500, corsHeaders)
    }
  },
}
