import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Stripe webhook events we handle
const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
])

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  // Only process relevant events
  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true })
  }

  try {
    // Forward event to Strapi for processing
    const strapiResponse = await fetch(
      `${process.env.STRAPI_URL}/api/stripe-webhook`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STRAPI_WEBHOOK_TOKEN}`,
          "X-Stripe-Event-Id": event.id,
          "X-Stripe-Event-Type": event.type,
        },
        body: JSON.stringify({
          id: event.id,
          type: event.type,
          data: event.data,
          created: event.created,
          livemode: event.livemode,
        }),
      }
    )

    if (!strapiResponse.ok) {
      throw new Error(
        `Strapi webhook processing failed: ${strapiResponse.statusText}`
      )
    }

    // Handle specific events on Next.js side if needed
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutComplete(
          event.data.object as Stripe.Checkout.Session
        )
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        )
        break

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Webhook processing error:", error)
    // Return 200 to prevent Stripe from retrying
    // Log error for investigation
    return NextResponse.json(
      { received: true, error: "Processing error logged" },
      { status: 200 }
    )
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  // eslint-disable-next-line no-console
  console.log("Checkout completed:", session.id)

  // Send confirmation email
  // Update user session/cache if needed
  // Track conversion analytics
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // eslint-disable-next-line no-console
  console.log("Subscription deleted:", subscription.id)

  // Clear user cache
  // Send cancellation email
  // Schedule data retention tasks
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // eslint-disable-next-line no-console
  console.log("Payment failed for invoice:", invoice.id)

  // Send payment failure email
  // Update user UI to show payment issues
  // Start grace period if configured
}
