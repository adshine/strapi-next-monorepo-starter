import { Event } from "@strapi/database/dist/lifecycles"
import { Core } from "@strapi/strapi"
import { errors } from "@strapi/utils"

/**
 * TODO: Rename this file to template-access-log.ts or remix-log.ts
 * TODO: Update all references from "download" to "remix" or "template access"
 *
 * Download Log Lifecycle Hook
 * Enforces append-only behavior for download logs as audit records.
 * Download logs cannot be deleted and have restricted update capabilities.
 */
export const registerDownloadLogSubscriber = async ({
  strapi,
}: {
  strapi: Core.Strapi
}) => {
  strapi.db.lifecycles.subscribe({
    models: ["api::download-log.download-log"],

    /**
     * Enrich download log creation with required metadata and defaults.
     */
    async beforeCreate(event: Event) {
      const { data } = event.params

      // Set default values for required fields
      data.initiatedAt = data.initiatedAt || new Date()
      data.status = data.status || "pending"

      // Generate unique downloadId if not provided
      if (!data.downloadId) {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(7)
        data.downloadId = `dl_${timestamp}_${random}`
      }

      // Set issuedAt if not provided
      if (!data.issuedAt) {
        data.issuedAt = new Date()
      }

      // Set expiration time (default to 15 minutes from now per spec)
      if (!data.expiresAt) {
        const expirationTime = new Date()
        expirationTime.setMinutes(expirationTime.getMinutes() + 15)
        data.expiresAt = expirationTime
      }

      // Initialize metadata with creation info
      data.metadata = {
        ...data.metadata,
        createdAt: new Date().toISOString(),
        createdBy: "system",
        environment: process.env.NODE_ENV || "development",
        strapiVersion: strapi.config.get("info.strapi", "5.x"),
        apiVersion: strapi.config.get("info.version", "1.0.0"),
        updateHistory: [],
        // Additional tracking metadata
        serverHost: process.env.HOSTNAME || require("os").hostname(),
        region: process.env.REGION || process.env.CF_REGION || "unknown",
      }

      // Set attempt number based on retryOf relationship
      if (data.retryOf) {
        try {
          // Find the original download and count retry attempts
          const originalLog = await strapi.entityService.findOne(
            "api::download-log.download-log",
            data.retryOf,
            { fields: ["attemptNumber"] }
          )

          if (originalLog) {
            data.attemptNumber = (originalLog.attemptNumber || 1) + 1

            // Enforce maximum retry limit
            if (data.attemptNumber > 3) {
              throw new errors.ForbiddenError(
                "Maximum retry attempts (3) exceeded for this download"
              )
            }
          }
        } catch (error) {
          if (error instanceof errors.ForbiddenError) {
            throw error
          }
          // If we can't find the original, default to attempt 1
          data.attemptNumber = 1
          strapi.log.warn(
            "Could not find original download log for retry:",
            error
          )
        }
      } else {
        data.attemptNumber = 1
      }
    },

    /**
     * Enforce append-only behavior with limited updates for status transitions.
     * Critical fields remain immutable once set.
     */
    async beforeUpdate(event: Event) {
      const { data, where } = event.params

      // Get the existing download log
      const existingLog = await strapi.entityService.findOne(
        "api::download-log.download-log",
        where.id,
        {
          populate: ["user", "project"],
        }
      )

      if (!existingLog) {
        throw new errors.NotFoundError("Download log not found")
      }

      // Define immutable fields that cannot be changed once set
      const immutableFields = [
        "downloadId",
        "user",
        "project",
        "initiatedAt",
        "ipAddress",
        "userAgent",
        "sourceIp",
        "retryOf",
        "quotaCharged",
        "issuedAt",
      ]

      // Check for attempts to modify immutable fields
      for (const field of immutableFields) {
        if (data[field] !== undefined && existingLog[field] !== null) {
          // Allow setting null fields for the first time, but not modifying existing values
          if (existingLog[field] !== data[field]) {
            throw new errors.ForbiddenError(
              `Field '${field}' is immutable and cannot be modified once set. Download logs are append-only audit records.`
            )
          }
        }
      }

      // Only allow specific status transitions
      if (data.status && data.status !== existingLog.status) {
        const allowedTransitions: Record<string, string[]> = {
          pending: ["success", "failed", "expired"],
          success: [], // Terminal state - no changes allowed
          failed: ["success"], // Allow retry to succeed
          expired: [], // Terminal state - no changes allowed
        }

        const currentStatus = existingLog.status || "pending"
        const allowedNextStatuses = allowedTransitions[currentStatus] || []

        if (!allowedNextStatuses.includes(data.status)) {
          throw new errors.ForbiddenError(
            `Invalid status transition from '${currentStatus}' to '${data.status}'. Download logs enforce append-only audit trail.`
          )
        }

        // Set completedAt timestamp when transitioning to terminal states
        if (
          ["success", "failed", "expired"].includes(data.status) &&
          !existingLog.completedAt
        ) {
          data.completedAt = data.completedAt || new Date()

          // Calculate download duration if not already set
          if (!data.downloadDuration && existingLog.initiatedAt) {
            const duration =
              new Date().getTime() - new Date(existingLog.initiatedAt).getTime()
            data.downloadDuration = Math.floor(duration / 1000) // Convert to seconds
          }
        }
      }

      // Record update metadata for audit trail
      if (!data.metadata) {
        data.metadata = existingLog.metadata || {}
      }

      // Add audit trail to metadata
      const updateMetadata = {
        ...data.metadata,
        lastUpdated: new Date().toISOString(),
        updateReason: data.metadata?.updateReason || "Status change",
        updateUser: "system",
        updateHistory: [
          ...((existingLog.metadata as any)?.updateHistory || []),
          {
            timestamp: new Date().toISOString(),
            previousStatus: existingLog.status,
            newStatus: data.status || existingLog.status,
            user: "system",
            reason: data.metadata?.updateReason || "Status change",
          },
        ],
      }

      data.metadata = updateMetadata
    },

    /**
     * Completely prevent deletion of download logs - they are permanent audit records.
     */
    async beforeDelete(event: Event) {
      throw new errors.ForbiddenError(
        "Download logs cannot be deleted. They are append-only audit records required for compliance and tracking."
      )
    },

    /**
     * Prevent bulk deletion of download logs.
     */
    async beforeDeleteMany(event: Event) {
      throw new errors.ForbiddenError(
        "Download logs cannot be deleted. They are append-only audit records required for compliance and tracking."
      )
    },

    /**
     * Post-creation actions including logging and scheduled expiration.
     */
    async afterCreate(event: Event) {
      const { result } = event

      // Log creation for audit purposes
      strapi.log.info(
        `Download log created: ${result.downloadId} for user ${result.user?.id || "anonymous"} - Project: ${result.project?.id || "unknown"}`
      )

      // Schedule automatic expiration check
      if (result.expiresAt && result.status === "pending") {
        const expirationTime = new Date(result.expiresAt).getTime()
        const now = Date.now()
        const delay = Math.max(0, expirationTime - now)

        // Only schedule if expiration is in the future and within 24 hours
        if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
          setTimeout(async () => {
            try {
              const currentLog = await strapi.entityService.findOne(
                "api::download-log.download-log",
                result.id,
                { fields: ["status"] }
              )

              // Only mark as expired if still pending
              if (currentLog && currentLog.status === "pending") {
                await strapi.entityService.update(
                  "api::download-log.download-log",
                  result.id,
                  {
                    data: {
                      status: "expired",
                      completedAt: new Date(),
                      metadata: {
                        ...((currentLog.metadata as any) || {}),
                        updateReason: "Automatic expiration after timeout",
                        expiredAt: new Date().toISOString(),
                      },
                    },
                  }
                )

                strapi.log.info(
                  `Download log ${result.downloadId} automatically expired`
                )
              }
            } catch (error) {
              strapi.log.error(
                `Failed to expire download log ${result.downloadId}:`,
                error
              )
            }
          }, delay)
        }
      }
    },

    /**
     * Log significant status changes for monitoring and analytics.
     */
    async afterUpdate(event: Event) {
      const { result } = event

      // Log significant status changes
      if (result.status === "success") {
        strapi.log.info(
          `Download completed: ${result.downloadId} for user ${result.user?.id || "anonymous"} - Duration: ${result.downloadDuration}s`
        )

        // Send analytics event if enabled
        if (process.env.ENABLE_ANALYTICS === "true") {
          strapi.log.debug("Analytics event: download_completed", {
            downloadId: result.downloadId,
            projectId: result.project?.id,
            userId: result.user?.id,
            duration: result.downloadDuration,
            fileSize: result.fileSize,
          })
        }
      } else if (result.status === "failed") {
        strapi.log.warn(`Download failed: ${result.downloadId}`, {
          errorReason: result.errorReason,
          errorCode: result.errorCode,
          userId: result.user?.id || "anonymous",
        })

        // Track failure metrics
        if (process.env.ENABLE_ANALYTICS === "true") {
          strapi.log.debug("Analytics event: download_failed", {
            downloadId: result.downloadId,
            errorCode: result.errorCode,
            projectId: result.project?.id,
            userId: result.user?.id,
          })
        }
      } else if (result.status === "expired") {
        strapi.log.info(
          `Download expired: ${result.downloadId} for user ${result.user?.id || "anonymous"}`
        )
      }
    },
  })
}
