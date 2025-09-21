#!/usr/bin/env node

const required = {
  common: [
    "APP_PUBLIC_URL",
    "STRAPI_URL",
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "JWT_SECRET",
  ],
  strapi: [
    "APP_KEYS",
    "API_TOKEN_SALT",
    "ADMIN_JWT_SECRET",
    "STRAPI_REST_READONLY_API_KEY",
  ],
  stripe: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
  cloudflare: [
    "CLOUDFLARE_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME_DEV",
  ],
  email: ["EMAIL_PROVIDER"],
}

const env = process.env.APP_ENV || "development"
console.log(`Validating environment variables for: ${env}`)

let missing = []
let warnings = []

// Check required variables based on environment
Object.entries(required).forEach(([category, vars]) => {
  // Skip cloudflare in development
  if (category === "cloudflare" && env === "development") {
    return
  }

  vars.forEach((key) => {
    if (!process.env[key]) {
      missing.push(`${category}: ${key}`)
    }
  })
})

// Check for email provider specific requirements
if (process.env.EMAIL_PROVIDER === "sendgrid") {
  if (!process.env.SENDGRID_API_KEY) {
    missing.push("email: SENDGRID_API_KEY")
  }
  if (!process.env.SENDGRID_FROM_EMAIL) {
    missing.push("email: SENDGRID_FROM_EMAIL")
  }
} else if (process.env.EMAIL_PROVIDER === "smtp") {
  if (!process.env.SMTP_HOST) {
    missing.push("email: SMTP_HOST")
  }
  if (!process.env.SMTP_PORT) {
    missing.push("email: SMTP_PORT")
  }
}

// Check for insecure values in production
if (env === "production") {
  if (process.env.DEBUG === "true") {
    warnings.push("DEBUG is enabled in production")
  }
  if (process.env.STRIPE_SECRET_KEY?.includes("test")) {
    warnings.push("Using test Stripe keys in production")
  }
  if (!process.env.REDIS_ENABLED === "true") {
    warnings.push("Redis not enabled in production")
  }
}

// Report results
if (missing.length > 0) {
  console.error("❌ Missing required environment variables:")
  missing.forEach((m) => console.error(`  - ${m}`))
  process.exit(1)
}

if (warnings.length > 0) {
  console.warn("⚠️  Environment warnings:")
  warnings.forEach((w) => console.warn(`  - ${w}`))
}

console.log("✅ Environment validation passed")
