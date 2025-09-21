import { Env } from "../index"
import { createErrorResponse, verifyJWT } from "../utils"

const PUBLIC_ENDPOINTS = [
  "/api/pages",
  "/api/projects",
  "/api/categories",
  "/api/tags",
  "/api/plans",
]

export async function proxyToStrapi(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname
  const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
    path.startsWith(endpoint)
  )

  // Check authentication for protected endpoints
  if (!isPublicEndpoint) {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return createErrorResponse("Authentication required", 401, corsHeaders)
    }

    const token = authHeader.replace("Bearer ", "")
    const payload = await verifyJWT(token, env.JWT_SECRET)

    if (!payload) {
      return createErrorResponse("Invalid token", 401, corsHeaders)
    }

    // Add user context to forwarded headers
    const headers = new Headers(request.headers)
    headers.set("X-User-Id", payload.userId || "")
    headers.set("X-User-Plan", payload.plan || "")
  }

  // Construct Strapi URL
  const strapiPath = path.replace("/api", "/api")
  const strapiUrl = `${env.STRAPI_URL}${strapiPath}${url.search}`

  try {
    // Forward request to Strapi
    const strapiResponse = await fetch(strapiUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    })

    // Clone response and add CORS headers
    const response = new Response(strapiResponse.body, strapiResponse)
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Add cache headers for public endpoints
    if (isPublicEndpoint && request.method === "GET") {
      response.headers.set("Cache-Control", "public, max-age=60, s-maxage=3600")
      response.headers.set("CDN-Cache-Control", "max-age=3600")
    }

    return response
  } catch (error) {
    console.error("Proxy error:", error)
    return createErrorResponse("Failed to proxy request", 502, corsHeaders)
  }
}
