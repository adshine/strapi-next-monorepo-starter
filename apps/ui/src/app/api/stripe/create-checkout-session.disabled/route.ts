import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import Stripe from "stripe"

import { plansAPI } from "@/lib/api/plans"
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

    const body = await req.json()
    const { planId, billingCycle, addOns = [] } = body

    // Validate input
    if (!planId || !billingCycle) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get plan details
    const plan = await plansAPI.getPlanById(planId)
    if (!plan) {
      return NextResponse.json(
        { error: "INVALID_PLAN", message: "Plan not found" },
        { status: 400 }
      )
    }

    // Get user profile
    const userProfile = await userProfileAPI.getMyProfile()

    // Check if user already has an active subscription
    if (
      userProfile?.subscriptionState === "active" &&
      userProfile.plan?.id === planId
    ) {
      return NextResponse.json(
        {
          error: "ALREADY_SUBSCRIBED",
          message: "You are already subscribed to this plan",
        },
        { status: 400 }
      )
    }

    // Determine price ID based on billing cycle
    const priceId =
      billingCycle === "annual" ? plan.stripePriceIdAnnual : plan.stripePriceId

    if (!priceId) {
      return NextResponse.json(
        {
          error: "INVALID_PLAN",
          message: "Selected billing cycle not available for this plan",
        },
        { status: 400 }
      )
    }

    // Create line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: priceId,
        quantity: 1,
      },
    ]

    // Add any add-ons
    for (const addOnId of addOns) {
      // In production, look up add-on price IDs from database
      lineItems.push({
        price: addOnId,
        quantity: 1,
      })
    }

    // Create or retrieve Stripe customer
    let customerId = userProfile?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: {
          userId: session.user.id,
          strapiUserId: userProfile?.id,
        },
      })
      customerId = customer.id

      // Update user profile with Stripe customer ID
      try {
        await userProfileAPI.updateProfile({
          stripeCustomerId: customerId,
        })
      } catch (updateError) {
        console.error(
          "Failed to update user profile with Stripe customer ID:",
          updateError
        )
        // Continue with checkout even if profile update fails
      }
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: billingCycle === "lifetime" ? "payment" : "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: session.user.id,
        planId: plan.id,
        billingCycle,
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_update: {
        address: "auto",
      },
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error) {
    console.error("Create checkout session error:", error)
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
