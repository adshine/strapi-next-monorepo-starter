import { Data } from "@strapi/strapi"

const MUTABLE_FIELDS = [
  "status",
  "remixUrl",
  "processingState",
  "errorMessage",
  "metadata",
  "retryCount",
  "processingCompletedAt",
] as const

type MutableField = (typeof MUTABLE_FIELDS)[number]

async function validateLifecycleEvent(event: any, action: "create" | "update") {
  const data = event.params?.data

  if (!data) {
    throw new Error(`No data provided for ${action} operation`)
  }

  if (action === "create") {
    // Validate required fields
    const requiredFields = ["projectId", "userId"]
    const missingFields = requiredFields.filter((field) => !data[field])

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields for template access log: ${missingFields.join(
          ", "
        )}`
      )
    }

    // Set default values
    data.status = data.status || "pending"
    data.processingState = data.processingState || "initialized"
    data.retryCount = data.retryCount || 0
    data.ipAddress = data.ipAddress || null
    data.userAgent = data.userAgent || null
  }

  if (action === "update") {
    const documentId = event.params?.where?.documentId

    if (!documentId) {
      throw new Error("No documentId provided for update operation")
    }

    // Fetch existing record
    const existingLog = await strapi
      .documents("api::template-access-log.template-access-log")
      .findOne({ documentId })

    if (!existingLog) {
      throw new Error(`Template access log not found: ${documentId}`)
    }

    // Prevent modifying immutable fields
    const immutableFields = Object.keys(data).filter(
      (field) => !MUTABLE_FIELDS.includes(field as MutableField)
    )

    if (immutableFields.length > 0) {
      // Check if any immutable field is actually being changed
      const changedImmutableFields = immutableFields.filter((field) => {
        if (data[field] !== undefined && (existingLog as any)[field] !== null) {
          // Field is being set and exists in the record
          if ((existingLog as any)[field] !== data[field]) {
            return true
          }
        }
        return false
      })

      if (changedImmutableFields.length > 0) {
        throw new Error(
          `Cannot modify immutable fields: ${changedImmutableFields.join(", ")}`
        )
      }
    }

    // Validate status transitions
    if (data.status && existingLog.status !== data.status) {
      const validTransitions: Record<string, string[]> = {
        pending: ["processing", "failed"],
        processing: ["completed", "failed"],
        failed: ["processing"], // Allow retry
        completed: [], // No transitions from completed
      }

      const currentStatus = existingLog.status || "pending"
      const allowedTransitions = validTransitions[currentStatus] || []

      if (!allowedTransitions.includes(data.status)) {
        throw new Error(
          `Invalid status transition from ${currentStatus} to ${data.status}`
        )
      }
    }

    // Auto-set processing completed timestamp
    if (data.status === "completed" && !data.processingCompletedAt) {
      data.processingCompletedAt = new Date()
    }

    // Increment retry count if transitioning from failed to processing
    if (existingLog.status === "failed" && data.status === "processing") {
      data.retryCount = ((existingLog as any).retryCount || 0) + 1
    }
  }

  // Validate metadata if provided
  if (data.metadata) {
    try {
      if (typeof data.metadata === "string") {
        JSON.parse(data.metadata)
      } else {
        data.metadata = JSON.stringify(data.metadata)
      }
    } catch (error) {
      throw new Error("Invalid metadata format. Must be valid JSON.")
    }
  }

  // Set expiration date (30 days from creation)
  if (action === "create" && !data.expiresAt) {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 30)
    data.expiresAt = expirationDate
  }
}

export default {
  async beforeCreate(event: any) {
    await validateLifecycleEvent(event, "create")
  },

  async beforeUpdate(event: any) {
    await validateLifecycleEvent(event, "update")
  },

  async afterCreate(event: any) {
    const { result, params } = event

    // Log the template access event
    strapi.log.info(
      `Template access log created: ${result.documentId} for project ${params.data.projectId} by user ${params.data.userId}`
    )

    // You could emit an event here for analytics
    // strapi.eventHub.emit('template.accessed', { ...result })
  },

  async afterUpdate(event: any) {
    const { result } = event

    if (result.status === "completed") {
      strapi.log.info(
        `Template access completed: ${result.documentId} for project ${result.projectId}`
      )
    } else if (result.status === "failed") {
      strapi.log.error(
        `Template access failed: ${result.documentId} for project ${result.projectId}. Error: ${result.errorMessage}`
      )
    }
  },
}
