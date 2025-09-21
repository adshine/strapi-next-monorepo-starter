import { Env } from "../index"

export async function handleHealthCheck(env: Env): Promise<Response> {
  const health = {
    status: "healthy",
    environment: env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
    services: {
      worker: "operational",
      r2: "unknown",
      strapi: "unknown",
    },
  }

  // Check R2 connectivity
  try {
    const testKey = ".health-check"
    await env.TEMPLATES_BUCKET.put(testKey, "ok", {
      httpMetadata: { contentType: "text/plain" },
    })
    await env.TEMPLATES_BUCKET.delete(testKey)
    health.services.r2 = "operational"
  } catch (error) {
    health.services.r2 = "error"
    health.status = "degraded"
  }

  // Check Strapi connectivity
  try {
    const strapiResponse = await fetch(`${env.STRAPI_URL}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    health.services.strapi = strapiResponse.ok ? "operational" : "error"
    if (!strapiResponse.ok) {
      health.status = "degraded"
    }
  } catch (error) {
    health.services.strapi = "error"
    health.status = "degraded"
  }

  const status = health.status === "healthy" ? 200 : 503
  return new Response(JSON.stringify(health), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}
