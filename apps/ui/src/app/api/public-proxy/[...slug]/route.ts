import { NextResponse } from "next/server"
import { env } from "@/env.mjs"

import {
  createStrapiAuthHeader,
  isAllowedToReadStrapiEndpoint,
} from "@/lib/strapi-api/request-auth"

/**
 * This route handler acts as a public proxy for frontend requests with two primary goals:
 * - Hide the authenticated API token from the client (for both SSR and client-side components).
 * - Hide the backend URL, so it cannot be accessed directly.
 *
 * It is a public proxy that injects the Strapi API token (https://docs.strapi.io/cms/features/api-tokens) into the request.
 *
 * Since the STRAPI_REST_READONLY_API_KEY is injected into every GET request and Strapi does not block findOne and findMany
 * operations for any content type, this proxy checks if the requested content type is allowed to be fetched.
 */
async function handler(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const path = Array.isArray(slug) ? slug.join("/") : slug
  const isReadOnly = request.method === "GET" || request.method === "HEAD"

  const isAllowedToRead = isReadOnly
    ? isAllowedToReadStrapiEndpoint(path)
    : true

  if (!isAllowedToRead) {
    return NextResponse.json(
      {
        error: {
          message: `Endpoint "${path}" is not allowed for GET requests`,
          name: "Forbidden",
        },
      },
      { status: 403 }
    )
  }

  const { search } = new URL(request.url)
  const url = `${env.STRAPI_URL}/${path}${search ?? ""}`

  const clonedRequest = request.clone()
  // Extract the body explicitly from the cloned request
  let body: string | Blob | undefined
  if (!isReadOnly) {
    const contentType = clonedRequest.headers.get("content-type")
    if (contentType?.includes("multipart/form-data")) {
      // File upload - preserve FormData as blob
      body = await clonedRequest.blob()
    } else {
      // Regular API call - use text for JSON
      body = await clonedRequest.text()
    }
  }

  const authHeader = await createStrapiAuthHeader({
    isReadOnly,
    isPrivate: false,
  })

  // Debug logging - more detailed
  console.log("[Public Proxy] Request:", {
    path,
    url,
    isReadOnly,
    authHeaderPresent: !!authHeader.Authorization,
    authHeaderLength: authHeader.Authorization
      ? authHeader.Authorization.length
      : 0,
    tokenPrefix: authHeader.Authorization
      ? authHeader.Authorization.substring(0, 20)
      : "NO TOKEN",
    envTokenLength: env.STRAPI_REST_READONLY_API_KEY
      ? env.STRAPI_REST_READONLY_API_KEY.length
      : 0,
  })

  const requestHeaders = {
    // Convert headers to object
    ...Object.fromEntries(clonedRequest.headers),
    // Override the Authorization header with the injected token
    ...authHeader,
  }

  console.log("[Public Proxy] Headers being sent:", {
    hasAuth: !!requestHeaders.Authorization,
    authLength: requestHeaders.Authorization
      ? requestHeaders.Authorization.length
      : 0,
  })

  const response = await fetch(url, {
    headers: requestHeaders,
    body,
    // this needs to be explicitly stated, because it is defaulted to GET
    method: request.method,
  })

  // Remove encoding headers, because the body is no longer compressed and the browser/client will choke on it.
  // (Built-in fetch in Node.js decompresses the body if the response has Content-Encoding: gzip
  // and gives the decompressed stream.)
  const responseHeaders = new Headers(response.headers)
  responseHeaders.delete("content-encoding")
  responseHeaders.delete("content-length")

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
}

export {
  handler as HEAD,
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
}
