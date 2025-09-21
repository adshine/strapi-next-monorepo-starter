import { PrivateClient } from "@/lib/strapi-api/private"

import { Plan } from "./plans"

export interface UserProfile {
  id: string
  user?: any
  displayName?: string
  bio?: string
  avatar?: any
  stripeCustomerId?: string
  plan?: Plan
  planExpiresAt?: string
  dailyDownloadsUsed: number
  dailyResetAt?: string
  templateRequestsUsed: number
  subscriptionState:
    | "active"
    | "trial"
    | "past_due"
    | "grace"
    | "suspended"
    | "canceled"
  gracePeriodUntil?: string
  subscriptionStatus: string
  subscriptionStartDate?: string
  subscriptionEndDate?: string
  monthlyDownloadsUsed: number
  monthlyDownloadsLimit: number
  quotaResetDate?: string
  totalDownloads: number
  timezone: string
  emailVerified: boolean
  preferences?: any
  theme?: "light" | "dark" | "system"
  language?: string
  emailNotifications?: any
  twoFactorEnabled?: boolean
  lastPasswordChange?: string
  activeSessions?: any
  favorites?: any[]
  collections?: any
  downloadLockVersion?: number
  lastLoginAt?: string
  accountCreatedAt?: string
  referralSource?: string
  lastActiveAt?: string
}

class UserProfileAPI {
  private client: PrivateClient

  constructor() {
    this.client = new PrivateClient()
  }

  async getMyProfile(): Promise<UserProfile | null> {
    try {
      const response = await this.client.get("/user-profiles/me", {
        populate: ["plan", "user", "favorites"],
      })
      return response.data ? this.formatUserProfile(response.data) : null
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      return null
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await this.client.fetchMany(
        "api::user-profile.user-profile",
        {
          filters: {
            user: {
              id: {
                $eq: userId,
              },
            },
          },
          populate: ["plan", "user", "favorites"],
          pagination: {
            limit: 1,
          },
        }
      )

      return response.data?.[0]
        ? this.formatUserProfile(response.data[0])
        : null
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      return null
    }
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const response = await this.client.put("/user-profiles/me", {
        data: {
          displayName: data.displayName,
          bio: data.bio,
          timezone: data.timezone,
          theme: data.theme,
          language: data.language,
          preferences: data.preferences,
          emailNotifications: data.emailNotifications,
          stripeCustomerId: data.stripeCustomerId,
          subscriptionState: data.subscriptionState,
          subscriptionStatus: data.subscriptionStatus,
          planExpiresAt: data.planExpiresAt,
          gracePeriodUntil: data.gracePeriodUntil,
        },
      })
      return response.data ? this.formatUserProfile(response.data) : null
    } catch (error) {
      console.error("Failed to update user profile:", error)
      return null
    }
  }

  async updateQuotaUsage(downloads: number): Promise<boolean> {
    try {
      await this.client.post("/user-profiles/update-quota", {
        downloads,
      })
      return true
    } catch (error) {
      console.error("Failed to update quota usage:", error)
      return false
    }
  }

  private formatUserProfile(data: any): UserProfile {
    return {
      id: data.id || data.documentId,
      user: data.user,
      displayName: data.displayName,
      bio: data.bio,
      avatar: data.avatar,
      stripeCustomerId: data.stripeCustomerId,
      plan: data.plan,
      planExpiresAt: data.planExpiresAt,
      dailyDownloadsUsed: data.dailyDownloadsUsed || 0,
      dailyResetAt: data.dailyResetAt,
      templateRequestsUsed: data.templateRequestsUsed || 0,
      subscriptionState: data.subscriptionState || "active",
      gracePeriodUntil: data.gracePeriodUntil,
      subscriptionStatus: data.subscriptionStatus || "active",
      subscriptionStartDate: data.subscriptionStartDate,
      subscriptionEndDate: data.subscriptionEndDate,
      monthlyDownloadsUsed: data.monthlyDownloadsUsed || 0,
      monthlyDownloadsLimit:
        data.monthlyDownloadsLimit || data.plan?.monthlyDownloadLimit || 0,
      quotaResetDate: data.quotaResetDate,
      totalDownloads: data.totalDownloads || 0,
      timezone: data.timezone || "UTC",
      emailVerified: data.emailVerified || false,
      preferences: data.preferences,
      theme: data.theme,
      language: data.language,
      emailNotifications: data.emailNotifications,
      twoFactorEnabled: data.twoFactorEnabled,
      lastPasswordChange: data.lastPasswordChange,
      activeSessions: data.activeSessions,
      favorites: data.favorites || [],
      collections: data.collections,
      downloadLockVersion: data.downloadLockVersion,
      lastLoginAt: data.lastLoginAt,
      accountCreatedAt: data.accountCreatedAt,
      referralSource: data.referralSource,
      lastActiveAt: data.lastActiveAt,
    }
  }
}

export const userProfileAPI = new UserProfileAPI()
