# Stripe Setup Guide

Complete configuration for Stripe products, prices, webhooks, and testing.

## MCP Tool Automation

```bash
# Use Stripe MCP to create products and prices automatically

# Get account info first
mcp__stripe__get_stripe_account_info

# Create products using the specifications below
mcp__stripe__create_product \
  --name "Solo Plan" \
  --description "Perfect for individual creators"

# Create prices for products
mcp__stripe__create_price \
  --product "prod_xxx" \
  --unit_amount 2400 \
  --currency "usd" \
  --recurring '{"interval": "month"}'

# List created products to get IDs
mcp__stripe__list_products --limit 10

# Create payment link for testing
mcp__stripe__create_payment_link \
  --price "price_xxx" \
  --quantity 1
```

## Account Setup

### 1. Create Stripe Account

1. Sign up at <https://dashboard.stripe.com>
2. Complete business verification
3. Enable Customer Portal: Settings → Billing → Customer Portal
4. Configure tax settings if needed: Settings → Tax

### 2. API Keys

Navigate to Developers → API Keys

**Test Mode:**

```bash
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
```

**Live Mode (after testing):**

```bash
STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_SECRET_KEY=sk_live_51...
```

## Product & Price Configuration

### Create Products in Stripe Dashboard

Navigate to Products → Add Product for each:

#### 1. Day Pass

```javascript
{
  name: "Day Pass",
  description: "24-hour access to remix templates",
  metadata: {
    tier: "day_pass",
    dailyRemixes: "4",
    templateRequests: "0",
    duration: "24_hours"
  }
}
// Create Price:
{
  pricing: "One time",
  amount: 12.00,
  currency: "USD"
}
// Record IDs:
STRIPE_PRODUCT_DAY_PASS=prod_xxx
STRIPE_PRICE_DAY_PASS=price_xxx
```

#### 2. Solo Plan

```javascript
{
  name: "Solo Plan",
  description: "Perfect for individual creators",
  metadata: {
    tier: "solo",
    dailyRemixes: "6",
    templateRequests: "1",
    favorites: "false"
  }
}
// Create Prices:
// Monthly:
{
  pricing: "Recurring",
  amount: 24.00,
  currency: "USD",
  interval: "Monthly"
}
// Annual (20% discount):
{
  pricing: "Recurring",
  amount: 230.00, // $23/month
  currency: "USD",
  interval: "Yearly"
}
// Record IDs:
STRIPE_PRODUCT_SOLO=prod_xxx
STRIPE_PRICE_SOLO_MONTHLY=price_xxx
STRIPE_PRICE_SOLO_ANNUAL=price_xxx
```

#### 3. Studio Plan

```javascript
{
  name: "Studio Plan",
  description: "For growing design studios",
  metadata: {
    tier: "studio",
    dailyRemixes: "15",
    templateRequests: "3",
    favorites: "true",
    badge: "Most Popular"
  }
}
// Monthly: $49
// Annual: $470 ($47/month)
// Record IDs:
STRIPE_PRODUCT_STUDIO=prod_xxx
STRIPE_PRICE_STUDIO_MONTHLY=price_xxx
STRIPE_PRICE_STUDIO_ANNUAL=price_xxx
```

#### 4. Agency Plan

```javascript
{
  name: "Agency Plan",
  description: "Unlimited potential for agencies",
  metadata: {
    tier: "agency",
    dailyRemixes: "40",
    templateRequests: "8",
    favorites: "true",
    bulkAccess: "true",
    prioritySupport: "true"
  }
}
// Monthly: $89
// Annual: $850 ($85/month)
// Record IDs:
STRIPE_PRODUCT_AGENCY=prod_xxx
STRIPE_PRICE_AGENCY_MONTHLY=price_xxx
STRIPE_PRICE_AGENCY_ANNUAL=price_xxx
```

#### 5. Lifetime Plans

```javascript
// Lifetime Core
{
  name: "Lifetime Core",
  description: "One-time purchase, lifetime access",
  metadata: {
    tier: "lifetime_core",
    dailyRemixes: "8",
    templateRequests: "30",
    lifetime: "true"
  }
}
// One-time: $249
STRIPE_PRODUCT_LIFETIME=prod_xxx
STRIPE_PRICE_LIFETIME_CORE=price_xxx

// Lifetime Plus
{
  name: "Lifetime Plus",
  description: "Ultimate lifetime access",
  metadata: {
    tier: "lifetime_plus",
    dailyRemixes: "20",
    templateRequests: "unlimited",
    lifetime: "true",
    prioritySupport: "true"
  }
}
// One-time: $499
STRIPE_PRICE_LIFETIME_PLUS=price_xxx
```

#### 6. Add-ons

```javascript
{
  name: "Fast Turnaround",
  description: "Priority template request processing",
  metadata: {
    type: "addon",
    feature: "fast_turnaround",
    sla_hours: "24"
  }
}
// Recurring: $19/month
STRIPE_PRODUCT_FAST_TURNAROUND=prod_xxx
STRIPE_PRICE_FAST_TURNAROUND=price_xxx
```

## Webhook Configuration

### 1. Create Webhook Endpoint

Navigate to Developers → Webhooks → Add Endpoint

```
Endpoint URL: https://api.yourdomain.com/api/webhooks/stripe
```

### 2. Select Events to Listen

Required events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `invoice.payment_action_required`
- `customer.updated`
- `payment_method.attached`
- `payment_method.detached`

### 3. Get Webhook Secret

After creating endpoint:

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### 4. Webhook Handler Implementation

```javascript
// apps/strapi/src/api/webhook/controllers/stripe.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports = {
  async handle(ctx) {
    const sig = ctx.request.headers["stripe-signature"]
    const body = ctx.request.body[Symbol.for("unparsedBody")]

    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      ctx.status = 400
      return { error: "Invalid signature" }
    }

    // Handle events
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutComplete(event.data.object)
        break
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object)
        break
      // ... other cases
    }

    return { received: true }
  },
}
```

## Customer Portal Configuration

### 1. Enable Customer Portal

Settings → Billing → Customer Portal → Activate

### 2. Configure Features

- ✅ Allow customers to update payment methods
- ✅ Allow customers to update email/address
- ✅ Allow customers to cancel subscriptions
- ✅ Allow customers to switch plans
- ⚠️ Cancellation reason required
- ⚠️ Proration enabled for plan changes

### 3. Customize Branding

- Upload logo
- Set brand colors
- Custom domain (optional)

### 4. Configure Business Information

- Privacy policy URL
- Terms of service URL
- Customer support email/phone

## Testing Configuration

### 1. Test Cards

```javascript
// Successful payment
4242 4242 4242 4242

// Requires authentication
4000 0025 0000 3155

// Declined
4000 0000 0000 9995

// Insufficient funds
4000 0000 0000 9995
```

### 2. Test Webhooks Locally

Install Stripe CLI:

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:1337/api/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
```

### 3. Test Scenarios

```bash
# Test successful subscription
stripe fixtures ./test/fixtures/subscription-success.json

# Test payment failure
stripe fixtures ./test/fixtures/payment-failure.json

# Test grace period
stripe fixtures ./test/fixtures/grace-period.json
```

## Checkout Session Configuration

```javascript
// Create checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [
    {
      price: process.env.STRIPE_PRICE_STUDIO_MONTHLY,
      quantity: 1,
    },
    {
      // Add-on
      price: process.env.STRIPE_PRICE_FAST_TURNAROUND,
      quantity: 1,
    },
  ],
  mode: "subscription",
  success_url: `${process.env.APP_PUBLIC_URL}/account/thanks?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.APP_PUBLIC_URL}/pricing`,
  customer_email: user.email,
  client_reference_id: user.id,
  metadata: {
    userId: user.id,
    plan: "studio",
    billingCycle: "monthly",
    addons: "fast_turnaround",
  },
  subscription_data: {
    trial_period_days: 0, // Set to 7 for trial
    metadata: {
      userId: user.id,
    },
  },
  allow_promotion_codes: true,
  billing_address_collection: "auto",
  tax_id_collection: {
    enabled: false, // Enable for EU customers
  },
})
```

## Subscription Management

### Update Subscription

```javascript
const subscription = await stripe.subscriptions.update(subscriptionId, {
  items: [
    {
      id: itemId,
      price: newPriceId,
    },
  ],
  proration_behavior: "create_prorations",
  metadata: {
    updatedBy: "user",
    previousPlan: "solo",
    newPlan: "studio",
  },
})
```

### Cancel Subscription

```javascript
const subscription = await stripe.subscriptions.update(subscriptionId, {
  cancel_at_period_end: true,
  cancellation_details: {
    comment: "Too expensive",
    feedback: "too_expensive",
  },
})
```

### Pause Subscription (Collection)

```javascript
const subscription = await stripe.subscriptions.update(subscriptionId, {
  pause_collection: {
    behavior: "void",
    resumes_at: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
  },
})
```

## Grace Period Implementation

```javascript
// Handle failed payment with grace period
async function handlePaymentFailed(invoice) {
  const user = await getUserByCustomerId(invoice.customer)

  // Set grace period (3 days)
  const gracePeriodEnd = new Date()
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 3)

  await strapi.entityService.update(
    "api::user-profile.user-profile",
    user.profile.id,
    {
      data: {
        subscriptionState: "grace",
        gracePeriodUntil: gracePeriodEnd,
      },
    }
  )

  // Send email notification
  await sendEmail(user.email, "payment-failed", {
    gracePeriodEnd,
    updatePaymentUrl: `${process.env.APP_PUBLIC_URL}/account/billing`,
  })
}
```

## Reporting & Analytics

### Key Metrics to Track

```sql
-- Monthly Recurring Revenue (MRR)
SELECT
  SUM(amount) as mrr
FROM subscriptions
WHERE status = 'active'
  AND recurring = true;

-- Churn Rate
SELECT
  COUNT(CASE WHEN status = 'canceled' THEN 1 END) * 100.0 /
  COUNT(*) as churn_rate
FROM subscriptions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Average Revenue Per User (ARPU)
SELECT
  AVG(amount) as arpu
FROM subscriptions
WHERE status = 'active';
```

### Stripe Dashboard Reports

- Revenue → Overview (MRR, churn, growth)
- Customers → Cohorts (retention analysis)
- Billing → Subscriptions (plan distribution)
- Radar → Reviews (fraud prevention)

## Production Checklist

- [ ] Switch to live API keys
- [ ] Update webhook endpoint to production URL
- [ ] Configure production webhook secret
- [ ] Enable Stripe Tax if needed
- [ ] Set up Stripe Radar rules
- [ ] Configure payout schedule
- [ ] Add team members with appropriate roles
- [ ] Enable two-factor authentication
- [ ] Set up invoice customization
- [ ] Configure email receipts
- [ ] Test live mode with small transaction
- [ ] Document all product/price IDs
- [ ] Set up monitoring alerts
- [ ] Create runbook for common issues

## Common Issues & Solutions

### "No such price"

- Ensure using correct environment (test vs live)
- Verify price ID exists in dashboard
- Check price is active

### "Webhook signature verification failed"

- Verify webhook secret matches
- Ensure raw body is used (not parsed JSON)
- Check for middleware modifying body

### "Customer not found"

- Ensure customer created before subscription
- Link Stripe customer ID to user profile
- Handle customer.deleted webhook

### "Payment requires authentication"

- Implement 3D Secure handling
- Use Payment Intents API
- Handle requires_action status

### "Subscription already exists"

- Check for existing subscription before creating
- Handle multiple subscription products
- Implement idempotency keys
