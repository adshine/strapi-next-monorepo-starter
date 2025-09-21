import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import Stripe from "stripe"

import { userProfileAPI } from "@/lib/api/user-profiles"
import { authOptions } from "@/lib/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Authentication required" },
        { status: 401 }
      )
    }

    // Get user profile
    const userProfile = await userProfileAPI.getMyProfile()

    if (!userProfile?.stripeCustomerId) {
      return NextResponse.json(
        { error: "NO_SUBSCRIPTION", message: "No subscription found" },
        { status: 403 }
      )
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userProfile.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    })

    return NextResponse.json({
      url: portalSession.url,
    })
  } catch (error) {
    console.error("Create portal session error:", error)
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to create portal session" },
      { status: 500 }
    )
  }
}
