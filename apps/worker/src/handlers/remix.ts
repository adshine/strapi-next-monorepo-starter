import { Env } from "../index"
import { createErrorResponse, generateSignedUrl } from "../utils"

interface RemixPayload {
  userId: string
  projectId: string
  plan: string
}

export async function handleTemplateRemix(
  request: Request,
  env: Env,
  payload: RemixPayload
): Promise<Response> {
  const url = new URL(request.url)
  const projectId = url.pathname.split("/").pop()

  if (!projectId) {
    return createErrorResponse("Project ID required", 400)
  }

  // Verify user has access to this project
  try {
    // Call Strapi to verify access and log remix
    // TODO: Backend still uses download-logs endpoint
    const verifyResponse = await fetch(
      `${env.STRAPI_URL}/api/download-logs/verify`, // TODO: Rename to /remix-logs/verify
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: request.headers.get("Authorization") || "",
        },
        body: JSON.stringify({
          userId: payload.userId,
          projectId,
          plan: payload.plan,
        }),
      }
    )

    if (!verifyResponse.ok) {
      const error = await verifyResponse.text()
      return createErrorResponse(error, verifyResponse.status)
    }

    // Generate signed URL for remix link
    const fileKey = `templates/${projectId}/template.zip`
    const signedUrl = await generateSignedUrl(
      env.TEMPLATES_BUCKET,
      fileKey,
      900 // 15 minutes
    )

    if (!signedUrl) {
      return createErrorResponse("Template not found", 404)
    }

    // Log remix event
    // TODO: Backend still uses download-logs endpoint
    await fetch(`${env.STRAPI_URL}/api/download-logs`, { // TODO: Rename to /remix-logs
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("Authorization") || "",
      },
      body: JSON.stringify({
        data: {
          userId: payload.userId,
          projectId,
          timestamp: new Date().toISOString(),
          ipAddress: request.headers.get("CF-Connecting-IP") || "unknown",
          userAgent: request.headers.get("User-Agent") || "unknown",
        },
      }),
    })

    return new Response(
      JSON.stringify({
        url: signedUrl,
        expiresAt: new Date(Date.now() + 900000).toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    )
  } catch (error) {
    console.error("Remix error:", error)
    return createErrorResponse("Failed to process remix", 500)
  }
}
