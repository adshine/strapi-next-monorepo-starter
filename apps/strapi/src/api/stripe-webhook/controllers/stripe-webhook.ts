import { Core } from "@strapi/strapi"
import Stripe from "stripe"

// TODO: Update field references throughout this file:
// TODO: Backend field renames planned:
// - monthlyDownloadsLimit → monthlyTemplateLimit
// - monthlyDownloadsUsed → monthlyTemplateAccesses
// - totalDownloads → totalRemixes
// These fields appear when updating user profiles in subscription events

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-08-27.basil",
})

export default {
  async handleWebhook(ctx: any) {
    const sig = ctx.request.headers["stripe-signature"]
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!sig || !endpointSecret) {
      return ctx.badRequest("Missing signature or webhook secret")
    }

    let event: Stripe.Event

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        ctx.request.body,
        sig,
        endpointSecret
      )
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return ctx.badRequest(`Webhook Error: ${err.message}`)
    }

    // Check if we've already processed this event (idempotency)
    const existingEvent = await strapi.db
      .query("api::subscription-event.subscription-event")
      .findOne({
        where: { stripeEventId: event.id },
      })

    if (existingEvent) {
      console.log(`Event ${event.id} already processed`)
      return ctx.send({ received: true, message: "Event already processed" })
    }

    try {
      // Record the event
      await strapi.db
        .query("api::subscription-event.subscription-event")
        .create({
          data: {
            stripeEventId: event.id,
            stripeCustomerId: (event.data.object as any).customer || "",
            stripeSubscriptionId: (event.data.object as any).id || "",
            eventType: event.type,
            eventData: event.data.object,
            processedAt: new Date(),
            status: "pending",
          },
        })

      // Handle different event types
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session
          )
          break

        case "customer.subscription.created":
        case "customer.subscription.updated":
          await handleSubscriptionUpdate(
            event.data.object as Stripe.Subscription
          )
          break

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          )
          break

        case "invoice.payment_succeeded":
          await handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice
          )
          break

        case "invoice.payment_failed":
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      // Mark event as processed
      await strapi.db
        .query("api::subscription-event.subscription-event")
        .update({
          where: { stripeEventId: event.id },
          data: { status: "processed" },
        })

      return ctx.send({ received: true })
    } catch (error: any) {
      console.error("Error processing webhook:", error)

      // Mark event as failed
      await strapi.db
        .query("api::subscription-event.subscription-event")
        .update({
          where: { stripeEventId: event.id },
          data: {
            status: "failed",
            errorMessage: error.message,
          },
        })

      return ctx.internalServerError("Webhook processing failed")
    }
  },
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  if (!customerId || !subscriptionId) {
    console.error("Missing customer or subscription ID in checkout session")
    return
  }

  // Find user by Stripe customer ID
  const userProfile = await strapi.db
    .query("api::user-profile.user-profile")
    .findOne({
      where: { stripeCustomerId: customerId },
      populate: ["user"],
    })

  if (!userProfile) {
    console.error(`No user found for Stripe customer ${customerId}`)
    return
  }

  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Get plan details based on price ID
  const priceId = subscription.items.data[0]?.price.id
  const plan = await strapi.db.query("api::plan.plan").findOne({
    where: {
      $or: [
        { stripePriceIdMonthly: priceId },
        { stripePriceIdAnnual: priceId },
      ],
    },
  })

  if (!plan) {
    console.error(`No plan found for price ID ${priceId}`)
    return
  }

  // Update user profile with subscription details
  await strapi.db.query("api::user-profile.user-profile").update({
    where: { id: userProfile.id },
    data: {
      currentPlan: plan.id,
      subscriptionStatus: subscription.status,
      subscriptionStartDate: new Date(
        (subscription as any).current_period_start * 1000
      ),
      subscriptionEndDate: new Date(
        (subscription as any).current_period_end * 1000
      ),
      monthlyDownloadsLimit: plan.monthlyDownloadLimit, // TODO: Rename to monthlyTemplateLimit
      monthlyDownloadsUsed: 0, // TODO: Rename to monthlyTemplateAccesses
      quotaResetDate: new Date((subscription as any).current_period_end * 1000),
    },
  })

  console.log(`Subscription created for user ${userProfile.user?.id}`)
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const userProfile = await strapi.db
    .query("api::user-profile.user-profile")
    .findOne({
      where: { stripeCustomerId: customerId },
    })

  if (!userProfile) {
    console.error(`No user found for Stripe customer ${customerId}`)
    return
  }

  // Get plan details based on price ID
  const priceId = subscription.items.data[0]?.price.id
  const plan = await strapi.db.query("api::plan.plan").findOne({
    where: {
      $or: [
        { stripePriceIdMonthly: priceId },
        { stripePriceIdAnnual: priceId },
      ],
    },
  })

  // Update subscription status
  await strapi.db.query("api::user-profile.user-profile").update({
    where: { id: userProfile.id },
    data: {
      currentPlan: plan?.id || userProfile.currentPlan,
      subscriptionStatus: subscription.status,
      subscriptionEndDate: new Date(
        (subscription as any).current_period_end * 1000
      ),
      monthlyDownloadsLimit:
        plan?.monthlyDownloadLimit || userProfile.monthlyDownloadsLimit, // TODO: Rename to monthlyTemplateLimit
    },
  })

  console.log(`Subscription updated for user ${userProfile.id}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const userProfile = await strapi.db
    .query("api::user-profile.user-profile")
    .findOne({
      where: { stripeCustomerId: customerId },
    })

  if (!userProfile) {
    console.error(`No user found for Stripe customer ${customerId}`)
    return
  }

  // Get free plan
  const freePlan = await strapi.db.query("api::plan.plan").findOne({
    where: { tier: "free" },
  })

  // Downgrade to free plan
  await strapi.db.query("api::user-profile.user-profile").update({
    where: { id: userProfile.id },
    data: {
      currentPlan: freePlan?.id || null,
      subscriptionStatus: "canceled",
      subscriptionEndDate: new Date(),
      monthlyDownloadsLimit: freePlan?.monthlyDownloadLimit || 0, // TODO: Rename to monthlyTemplateLimit
    },
  })

  console.log(`Subscription canceled for user ${userProfile.id}`)
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = (invoice as any).subscription as string

  const userProfile = await strapi.db
    .query("api::user-profile.user-profile")
    .findOne({
      where: { stripeCustomerId: customerId },
    })

  if (!userProfile) {
    console.error(`No user found for Stripe customer ${customerId}`)
    return
  }

  // Reset monthly quota if this is a renewal payment
  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    await strapi.db.query("api::user-profile.user-profile").update({
      where: { id: userProfile.id },
      data: {
        subscriptionStatus: "active",
        monthlyDownloadsUsed: 0, // TODO: Rename to monthlyTemplateAccesses
        quotaResetDate: new Date(
          (subscription as any).current_period_end * 1000
        ),
      },
    })

    console.log(`Payment succeeded and quota reset for user ${userProfile.id}`)
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  const userProfile = await strapi.db
    .query("api::user-profile.user-profile")
    .findOne({
      where: { stripeCustomerId: customerId },
    })

  if (!userProfile) {
    console.error(`No user found for Stripe customer ${customerId}`)
    return
  }

  // Update subscription status to past_due
  await strapi.db.query("api::user-profile.user-profile").update({
    where: { id: userProfile.id },
    data: {
      subscriptionStatus: "past_due",
    },
  })

  // TODO: Send email notification about failed payment

  console.log(`Payment failed for user ${userProfile.id}`)
}
