import { env } from "@/env.mjs"
import qs from "qs"

import { CustomFetchOptions } from "@/types/general"

import BaseStrapiClient from "@/lib/strapi-api/base"
import {
  createStrapiAuthHeader,
  formatStrapiAuthorizationHeader,
} from "@/lib/strapi-api/request-auth"

export class PrivateClient extends BaseStrapiClient {
  /**
   * GET request wrapper
   */
  public async get(path: string, params?: any, options?: CustomFetchOptions) {
    return this.fetchAPI(path, params, { method: "GET" }, options)
  }

  /**
   * POST request wrapper
   */
  public async post(
    path: string,
    body?: any,
    params?: any,
    options?: CustomFetchOptions
  ) {
    const requestInit: RequestInit = {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }
    return this.fetchAPI(path, params || {}, requestInit, options)
  }

  /**
   * PUT request wrapper
   */
  public async put(
    path: string,
    body?: any,
    params?: any,
    options?: CustomFetchOptions
  ) {
    const requestInit: RequestInit = {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }
    return this.fetchAPI(path, params || {}, requestInit, options)
  }

  /**
   * DELETE request wrapper
   */
  public async delete(
    path: string,
    params?: any,
    options?: CustomFetchOptions
  ) {
    return this.fetchAPI(path, params, { method: "DELETE" }, options)
  }

  protected async prepareRequest(
    path: string,
    params: object,
    requestInit?: RequestInit,
    options?: CustomFetchOptions
  ): Promise<{ url: string; headers: Record<string, string> }> {
    let url = `/api${path.startsWith("/") ? path : `/${path}`}`

    const queryString =
      typeof params === "object" ? qs.stringify(params) : params
    if (queryString != null && queryString?.length > 0) {
      url += `?${queryString}`
    }

    let completeUrl = ""
    let headers: Record<string, string> = {}

    if (options?.useProxy) {
      // If useProxy is set, we need to use the public-proxy endpoint here in Next.js
      // (for client-side requests)
      completeUrl = `/api/private-proxy${url}`

      if (typeof window === "undefined") {
        // SSR components do not support relative URLs, so we have to prefix it with local app URL
        // @deprecated: SSR components should not use proxy, they should use the Strapi URL directly
        completeUrl = `${env.APP_PUBLIC_URL}${completeUrl}`
      }
    } else {
      // Directly use the Strapi URL. Same logic as in proxy route handler must be applied
      // (for SSR components and server actions/context)
      completeUrl = `${env.STRAPI_URL}${url}`
    }

    if (!options?.omitUserAuthorization) {
      if (options?.userJWT) {
        headers = {
          ...formatStrapiAuthorizationHeader(options.userJWT),
        }
      } else {
        const authHeader = await createStrapiAuthHeader({ isPrivate: true })

        headers = { ...authHeader }
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
