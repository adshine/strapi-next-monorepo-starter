const { errors } = require("@strapi/utils")

module.exports = {
  /**
   * Enforce append-only behavior with limited updates for status transitions.
   * Critical fields remain immutable once set.
   */
  async beforeUpdate(event) {
    const { params, data } = event
    const { where } = params

    // Get the existing template access log
    const existingLog = await strapi.entityService.findOne(
      "api::template-access-log.template-access-log",
      where.id,
      {
        populate: ["user", "project"],
      }
    )

    if (!existingLog) {
      throw new errors.NotFoundError("Template access log not found")
    }

    // Define immutable fields that cannot be changed once set
    const immutableFields = [
      "accessId",
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
            `Field '${field}' is immutable and cannot be modified once set. Template access logs are append-only audit records.`
          )
        }
      }
    }

    // Only allow specific status transitions
    if (data.status && data.status !== existingLog.status) {
      const allowedTransitions = {
        pending: ["success", "failed", "expired"],
        success: [], // Terminal state - no changes allowed
        failed: ["success"], // Allow retry to succeed
        expired: [], // Terminal state - no changes allowed
      }

      const currentStatus = existingLog.status || "pending"
      const allowedNextStatuses = allowedTransitions[currentStatus] || []

      if (!allowedNextStatuses.includes(data.status)) {
        throw new errors.ForbiddenError(
          `Invalid status transition from '${currentStatus}' to '${data.status}'. Template access logs enforce append-only audit trail.`
        )
      }

      // Set completedAt timestamp when transitioning to terminal states
      if (
        ["success", "failed", "expired"].includes(data.status) &&
        !existingLog.completedAt
      ) {
        data.completedAt = data.completedAt || new Date()

        // Calculate access duration if not already set
        if (!data.accessDuration && existingLog.initiatedAt) {
          const duration =
            new Date().getTime() - new Date(existingLog.initiatedAt).getTime()
          data.accessDuration = Math.floor(duration / 1000) // Convert to seconds
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
      updateUser: event.params?.user?.id || "system",
      updateHistory: [
        ...(existingLog.metadata?.updateHistory || []),
        {
          timestamp: new Date().toISOString(),
          previousStatus: existingLog.status,
          newStatus: data.status || existingLog.status,
          user: event.params?.user?.id || "system",
          reason: data.metadata?.updateReason || "Status change",
          ip: event.params?.ctx?.request?.ip,
        },
      ],
    }

    data.metadata = updateMetadata
  },

  /**
   * Completely prevent deletion of template access logs - they are permanent audit records.
   */
  async beforeDelete(event) {
    throw new errors.ForbiddenError(
      "Template access logs cannot be deleted. They are append-only audit records required for compliance and tracking."
    )
  },

  /**
   * Prevent bulk deletion of template access logs.
   */
  async beforeDeleteMany(event) {
    throw new errors.ForbiddenError(
      "Template access logs cannot be deleted. They are append-only audit records required for compliance and tracking."
    )
  },

  /**
   * Enrich template access log creation with required metadata and defaults.
   */
  async beforeCreate(event) {
    const { data } = event.params

    // Set default values for required fields
    data.initiatedAt = data.initiatedAt || new Date()
    data.status = data.status || "pending"

    // Generate unique accessId if not provided
    if (!data.accessId) {
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      data.accessId = `rmx_${timestamp}_${random}` // rmx = remix
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

    // Capture request metadata from context
    const ctx = strapi.requestContext?.get() || event.params?.ctx
    if (ctx && ctx.request) {
      // Capture IP address with multiple fallbacks
      if (!data.ipAddress) {
        data.ipAddress =
          ctx.request.headers["x-forwarded-for"]?.split(",")[0].trim() ||
          ctx.request.headers["x-real-ip"] ||
          ctx.request.headers["cf-connecting-ip"] || // Cloudflare
          ctx.request.ip ||
          ctx.request.connection?.remoteAddress ||
          "unknown"
      }

      // Store source IP separately for CloudFlare deployments
      if (!data.sourceIp) {
        data.sourceIp =
          ctx.request.headers["cf-connecting-ip"] || data.ipAddress
      }

      // Capture user agent
      if (!data.userAgent) {
        data.userAgent = ctx.request.headers["user-agent"] || "unknown"
      }
    }

    // Initialize metadata with creation info
    data.metadata = {
      ...data.metadata,
      createdAt: new Date().toISOString(),
      createdBy: event.params?.user?.id || "system",
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
        // Find the original access and count retry attempts
        const originalLog = await strapi.entityService.findOne(
          "api::template-access-log.template-access-log",
          data.retryOf,
          { fields: ["attemptNumber"] }
        )

        if (originalLog) {
          data.attemptNumber = (originalLog.attemptNumber || 1) + 1

          // Enforce maximum retry limit
          if (data.attemptNumber > 3) {
            throw new errors.ForbiddenError(
              "Maximum retry attempts (3) exceeded for this template access"
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
          "Could not find original template access log for retry:",
          error
        )
      }
    } else {
      data.attemptNumber = 1
    }
  },

  /**
   * Post-creation actions including logging and scheduled expiration.
   */
  async afterCreate(event) {
    const { result } = event

    // Log creation for audit purposes
    strapi.log.info(
      `Template access log created: ${result.accessId} for user ${result.user?.id || "anonymous"} - Project: ${result.project?.id || "unknown"}`
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
              "api::template-access-log.template-access-log",
              result.id,
              { fields: ["status"] }
            )

            // Only mark as expired if still pending
            if (currentLog && currentLog.status === "pending") {
              await strapi.entityService.update(
                "api::template-access-log.template-access-log",
                result.id,
                {
                  data: {
                    status: "expired",
                    metadata: {
                      updateReason: "Automatic expiration after timeout",
                      expiredAt: new Date().toISOString(),
                    },
                  },
                }
              )

              strapi.log.info(
                `Template access log ${result.accessId} automatically expired`
              )
            }
          } catch (error) {
            strapi.log.error(
              `Failed to expire template access log ${result.accessId}:`,
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
  async afterUpdate(event) {
    const { result, params } = event

    // Log significant status changes
    if (result.status === "success") {
      strapi.log.info(
        `Template access completed: ${result.accessId} for user ${result.user?.id || "anonymous"} - Duration: ${result.accessDuration}s`
      )

      // Send analytics event if enabled
      if (process.env.ENABLE_ANALYTICS === "true") {
        strapi.log.debug("Analytics event: template_access_completed", {
          accessId: result.accessId,
          projectId: result.project?.id,
          userId: result.user?.id,
          duration: result.accessDuration,
          templateSize: result.templateSize,
        })
      }
    } else if (result.status === "failed") {
      strapi.log.warn(`Template access failed: ${result.accessId}`, {
        errorReason: result.errorReason,
        errorCode: result.errorCode,
        userId: result.user?.id || "anonymous",
      })

      // Track failure metrics
      if (process.env.ENABLE_ANALYTICS === "true") {
        strapi.log.debug("Analytics event: template_access_failed", {
          accessId: result.accessId,
          errorCode: result.errorCode,
          projectId: result.project?.id,
          userId: result.user?.id,
        })
      }
    } else if (result.status === "expired") {
      strapi.log.info(
        `Template access expired: ${result.accessId} for user ${result.user?.id || "anonymous"}`
      )
    }
  },
}
