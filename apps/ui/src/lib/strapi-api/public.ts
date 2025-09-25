import { env } from "@/env.mjs"
import qs from "qs"

import { CustomFetchOptions } from "@/types/general"

import BaseStrapiClient from "@/lib/strapi-api/base"
import { createStrapiAuthHeader } from "@/lib/strapi-api/request-auth"

export class PublicClient extends BaseStrapiClient {
  protected async prepareRequest(
    path: string,
    params: object,
    requestInit?: RequestInit,
    options?: CustomFetchOptions
  ): Promise<{ url: string; headers: Record<string, string> }> {
    const queryString =
      typeof params === "object" ? qs.stringify(params) : params

    let completeUrl = ""
    let headers: Record<string, string> = {}

    // Auto-detect browser environment if useProxy is not explicitly set
    const shouldUseProxy = options?.useProxy ?? typeof window !== "undefined"

    if (shouldUseProxy) {
      // For proxy, we need to construct the path with /api prefix
      let proxyPath = `/api${path.startsWith("/") ? path : `/${path}`}`
      if (queryString != null && queryString?.length > 0) {
        proxyPath += `?${queryString}`
      }

      // Use the public-proxy endpoint for client-side requests
      completeUrl = `/api/public-proxy${proxyPath}`

      if (typeof window === "undefined") {
        // SSR components do not support relative URLs, so we have to prefix it with local app URL
        // @deprecated: SSR components should not use proxy, they should use the Strapi URL directly
        completeUrl = `${env.APP_PUBLIC_URL}${completeUrl}`
      }
    } else {
      // Directly use the Strapi URL (server-side only)
      // Throw error if someone tries to force direct connection from client
      if (typeof window !== "undefined") {
        throw new Error(
          "Direct Strapi connection is not allowed from the browser. Remove useProxy: false or let it auto-detect."
        )
      }

      // For direct connection, construct the URL with /api prefix
      let directPath = `/api${path.startsWith("/") ? path : `/${path}`}`
      if (queryString != null && queryString?.length > 0) {
        directPath += `?${queryString}`
      }

      completeUrl = `${env.STRAPI_URL}${directPath}`

      // If there is no method specified in requestInit, default is GET
      const isReadOnly = ["GET", "HEAD"].includes(requestInit?.method ?? "GET")
      const authHeader = await createStrapiAuthHeader({
        isReadOnly,
        isPrivate: false,
      })

      headers = {
        ...authHeader,
      }
    }

    const isFormData = requestInit?.body instanceof FormData

    return {
      url: completeUrl,
      headers: {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-type": "application/json" }),
        ...headers,
      },
    }
  }
}
