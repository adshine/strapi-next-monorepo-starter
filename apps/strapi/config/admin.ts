import { UID } from "@strapi/strapi"

import { StrapiPreviewConfig } from "../types/internals"

type StrapiEnv = {
  (key: string, defaultValue?: any): any
}

export default ({ env }: { env: StrapiEnv }) => {
  const strapiPreviewConfig: StrapiPreviewConfig = {
    enabled: env("STRAPI_PREVIEW_ENABLED") === "true",
    previewSecret: env("STRAPI_PREVIEW_SECRET"),
    clientUrl: env("CLIENT_URL"),
    enabledContentTypeUids: ["api::page.page"],
  }
  return {
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
    },
    apiToken: {
      salt: env("API_TOKEN_SALT"),
    },
    transfer: {
      token: {
        salt: env("TRANSFER_TOKEN_SALT"),
      },
    },
    preview: {
      enabled: strapiPreviewConfig.enabled,
      config: {
        allowedOrigins: env("CLIENT_URL"),
        handler: async (
          uid: UID.CollectionType,
          {
            documentId,
            locale,
            status,
          }: { documentId: string; locale?: string; status?: string }
        ) => {
          // Fetch the complete document from Strapi
          if (
            !strapiPreviewConfig.enabledContentTypeUids.includes(uid) ||
            typeof strapiPreviewConfig.previewSecret !== "string" ||
            typeof strapiPreviewConfig.clientUrl !== "string"
          ) {
            return null
          }
          const document = await strapi
            .documents(uid)
            .findOne({ documentId, locale })
          const pathname = (document as { fullPath?: string })?.fullPath // not all collections have the fullPath attribute
          // Disable preview if the pathname is not found
          if (!pathname) {
            return null // returning null diables the preview button in the UI
          }
          // Use Next.js draft mode passing it a secret key and the content-type status
          const urlSearchParams = new URLSearchParams()
          urlSearchParams.set("url", pathname)
          if (locale) urlSearchParams.set("locale", locale)
          urlSearchParams.set("secret", strapiPreviewConfig.previewSecret)
          if (status) urlSearchParams.set("status", status)

          return `${strapiPreviewConfig.clientUrl}/api/preview?${urlSearchParams.toString()}`
        },
      },
    },
    watchIgnoreFiles: ["**/config/sync/**"],
  }
}
