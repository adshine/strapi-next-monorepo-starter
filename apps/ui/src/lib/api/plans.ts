import { PrivateClient } from "@/lib/strapi-api/private"
import { PublicClient } from "@/lib/strapi-api/public"

export interface Plan {
  id: string
  name: string
  slug: string
  description?: string
  monthlyPrice: number
  annualPrice: number
  stripePriceId: string
  stripePriceIdAnnual: string
  billingCycle: "day" | "month" | "year" | "lifetime"
  dailyDownloadLimit: number // TODO: Backend still uses this field name
  templateRequestLimit: number
  monthlyDownloadLimit: number // TODO: Backend still uses this field name
  isLifetime: boolean
  perksRichText?: string
  priority: number
  promoBadge?: string
  features?: any[]
  savings?: number
  popularBadge: boolean
  supportSLA?: number
  allowsFavorites: boolean
  allowsBulkDownload: boolean // TODO: Backend still uses this field name
  allowsCollections: boolean
  tier: "free" | "starter" | "professional" | "enterprise"
  recommended: boolean
  sortOrder: number
  isActive: boolean
}

class PlansAPI {
  private publicClient: PublicClient
  private privateClient: PrivateClient

  constructor() {
    this.publicClient = new PublicClient()
    this.privateClient = new PrivateClient()
  }

  async getAllPlans(): Promise<Plan[]> {
    try {
      const response = await this.publicClient.fetchMany("api::plan.plan", {
        filters: {
          isActive: {
            $eq: true,
          },
        },
        sort: ["sortOrder:asc", "priority:desc"],
      })

      return response.data.map(this.formatPlan)
    } catch (error) {
      console.error("Failed to fetch plans:", error)
      return []
    }
  }

  async getPlanById(id: string): Promise<Plan | null> {
    try {
      const response = await this.publicClient.fetchOne("api::plan.plan", id)
      return response.data ? this.formatPlan(response.data) : null
    } catch (error) {
      console.error("Failed to fetch plan:", error)
      return null
    }
  }

  async getPlanBySlug(slug: string): Promise<Plan | null> {
    try {
      const response = await this.publicClient.fetchOneBySlug(
        "api::plan.plan",
        slug
      )
      return response.data ? this.formatPlan(response.data) : null
    } catch (error) {
      console.error("Failed to fetch plan by slug:", error)
      return null
    }
  }

  async getPlanByTier(tier: string): Promise<Plan | null> {
    try {
      const response = await this.publicClient.fetchMany("api::plan.plan", {
        filters: {
          tier: {
            $eq: tier,
          },
          isActive: {
            $eq: true,
          },
        },
        pagination: {
          limit: 1,
        },
      })

      return response.data?.[0] ? this.formatPlan(response.data[0]) : null
    } catch (error) {
      console.error("Failed to fetch plan by tier:", error)
      return null
    }
  }

  private formatPlan(data: any): Plan {
    return {
      id: data.id || data.documentId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      monthlyPrice: parseFloat(data.monthlyPrice || 0),
      annualPrice: parseFloat(data.annualPrice || 0),
      stripePriceId: data.stripePriceId || data.stripePriceIdMonthly,
      stripePriceIdAnnual: data.stripePriceIdAnnual,
      billingCycle: data.billingCycle || "month",
      dailyDownloadLimit: data.dailyDownloadLimit || 0, // TODO: Backend still uses this field name
      templateRequestLimit: data.templateRequestLimit || 0,
      monthlyDownloadLimit: data.monthlyDownloadLimit || 0, // TODO: Backend still uses this field name
      isLifetime: data.isLifetime || false,
      perksRichText: data.perksRichText,
      priority: data.priority || 0,
      promoBadge: data.promoBadge,
      features: data.features || [],
      savings: data.savings ? parseFloat(data.savings) : undefined,
      popularBadge: data.popularBadge || false,
      supportSLA: data.supportSLA,
      allowsFavorites: data.allowsFavorites || false,
      allowsBulkDownload: data.allowsBulkDownload || false, // TODO: Backend still uses this field name
      allowsCollections: data.allowsCollections || false,
      tier: data.tier,
      recommended: data.recommended || false,
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive !== false,
    }
  }
}

export const plansAPI = new PlansAPI()
