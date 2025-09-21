"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface UserProfile {
  id: string
  userId: number
  email: string
  currentPlan: string
  monthlyDownloadsLimit: number // TODO: Backend still uses this field name
  monthlyDownloadsUsed: number // TODO: Backend still uses this field name
  quotaResetDate: string
  totalDownloads: number // TODO: Backend still uses this field name
  subscriptionStatus: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  gracePeriodEnd?: string
}

export function useUserProfile() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile")
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await response.json()
        setProfile(data.attributes || data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session, status])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!session) throw new Error("Not authenticated")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const data = await response.json()
      setProfile(data.attributes || data)
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const incrementRemixCount = async () => {
    if (!profile) return

    const updated = await updateProfile({
      monthlyDownloadsUsed: profile.monthlyDownloadsUsed + 1, // TODO: Backend still uses monthlyDownloadsUsed
      totalDownloads: profile.totalDownloads + 1, // TODO: Backend still uses totalDownloads
    })

    return updated
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    incrementRemixCount,
  }
}
