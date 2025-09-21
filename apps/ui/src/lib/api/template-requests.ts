import { PrivateStrapiClient } from "@/lib/strapi-client"

export interface TemplateRequest {
  id: string
  title: string
  description: string
  category?: string
  priority: "low" | "medium" | "high" | "urgent"
  budget?: string
  timeline?: string
  status:
    | "pending"
    | "under_review"
    | "approved"
    | "in_development"
    | "completed"
    | "rejected"
  referenceUrl?: string
  adminNotes?: string
  responseMessage?: string
  estimatedDeliveryDate?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    email: string
    username: string
  }
}

export interface CreateTemplateRequestInput {
  title: string
  description: string
  category?: string
  priority?: "low" | "medium" | "high" | "urgent"
  budget?: string
  timeline?: string
  referenceUrl?: string
}

class TemplateRequestsAPI {
  private client: typeof PrivateStrapiClient

  constructor() {
    this.client = PrivateStrapiClient
  }

  async create(data: CreateTemplateRequestInput): Promise<TemplateRequest> {
    try {
      const response = await this.client.post("/template-requests", {
        data: {
          ...data,
          status: "pending",
          priority: data.priority || "medium",
        },
      })
      return this.formatTemplateRequest(response.data)
    } catch (error) {
      console.error("Failed to create template request:", error)
      throw new Error("Failed to submit template request")
    }
  }

  async getUserRequests(): Promise<TemplateRequest[]> {
    try {
      const response = await this.client.get("/template-requests", {
        filters: {
          user: {
            id: {
              $eq: "me", // This will be replaced with actual user ID by the backend
            },
          },
        },
        populate: ["user"],
        sort: ["createdAt:desc"],
      })
      return response.data.map((item: any) => this.formatTemplateRequest(item))
    } catch (error) {
      console.error("Failed to fetch template requests:", error)
      return []
    }
  }

  async getById(id: string): Promise<TemplateRequest | null> {
    try {
      const response = await this.client.get(`/template-requests/${id}`, {
        populate: ["user"],
      })
      return this.formatTemplateRequest(response.data)
    } catch (error) {
      console.error("Failed to fetch template request:", error)
      return null
    }
  }

  async update(
    id: string,
    data: Partial<CreateTemplateRequestInput>
  ): Promise<TemplateRequest> {
    try {
      const response = await this.client.put(`/template-requests/${id}`, {
        data,
      })
      return this.formatTemplateRequest(response.data)
    } catch (error) {
      console.error("Failed to update template request:", error)
      throw new Error("Failed to update template request")
    }
  }

  private formatTemplateRequest(data: any): TemplateRequest {
    const attributes = data.attributes || data
    return {
      id: data.id || attributes.id,
      title: attributes.title,
      description: attributes.description,
      category: attributes.category,
      priority: attributes.priority || "medium",
      budget: attributes.budget,
      timeline: attributes.timeline,
      status: attributes.status || "pending",
      referenceUrl: attributes.referenceUrl,
      adminNotes: attributes.adminNotes,
      responseMessage: attributes.responseMessage,
      estimatedDeliveryDate: attributes.estimatedDeliveryDate,
      completedAt: attributes.completedAt,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      user: attributes.user?.data
        ? {
            id: attributes.user.data.id,
            email: attributes.user.data.attributes.email,
            username: attributes.user.data.attributes.username,
          }
        : undefined,
    }
  }
}

export const templateRequestsAPI = new TemplateRequestsAPI()
