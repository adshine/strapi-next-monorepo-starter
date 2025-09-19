# Environment Configuration

Complete environment variable setup for all components of the Framer Template Platform.

## MCP Tool Setup

````bash
# Use Desktop Commander to manage environment files
mcp__MCP_DOCKER__read_file --path .env.example

# Create local environment file
mcp__MCP_DOCKER__write_file \
  --path .env.local \
  --content "$(cat docs/implementation/03-environment-config.md | sed -n '/^NODE_ENV=development/,/^```$/p')"

# Validate environment variables
mcp__MCP_DOCKER__start_process \
  --command "node scripts/validate-env.js" \
  --timeout_ms 5000

# Set secrets securely (don't commit these!)
mcp__MCP_DOCKER__exec_in_pod \
  --name "strapi-pod" \
  --command "printenv | grep STRIPE"
````

## File Structure

```
.env                    # Shared variables (git-ignored)
.env.local              # Local overrides (git-ignored)
.env.example            # Template for developers (committed)
apps/strapi/.env        # Strapi-specific vars
apps/ui/.env.local      # Next.js-specific vars
```

## Complete Environment Variables

### .env.example (Template)

```bash
# ============================================
# CORE CONFIGURATION
# ============================================

# Application URLs
APP_PUBLIC_URL=http://localhost:3000
STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development
APP_ENV=development

# ============================================
# DATABASE
# ============================================

# PostgreSQL Connection
DATABASE_URL=postgresql://user:password@localhost:5432/framer_templates
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=framer_templates
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false

# Connection Pool
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ============================================
# STRAPI CONFIGURATION
# ============================================

# Admin Panel
STRAPI_ADMIN_URL=/admin
STRAPI_ADMIN_EMAIL=admin@example.com
STRAPI_ADMIN_PASSWORD=Admin123!

# Security Keys
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt

# API Tokens (create in Strapi admin)
STRAPI_REST_READONLY_API_KEY=your-readonly-api-key
STRAPI_REST_FULL_API_KEY=your-full-access-api-key

# File Upload
STRAPI_UPLOAD_PROVIDER=local
# STRAPI_UPLOAD_PROVIDER=cloudinary
# CLOUDINARY_NAME=
# CLOUDINARY_KEY=
# CLOUDINARY_SECRET=

# ============================================
# AUTHENTICATION
# ============================================

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars
NEXTAUTH_SESSION_MAXAGE=604800 # 7 days in seconds

# Email Verification
EMAIL_VERIFICATION_EXPIRE_MINUTES=10
EMAIL_VERIFICATION_MAX_ATTEMPTS=3

# Password Reset
PASSWORD_RESET_EXPIRE_HOURS=1
PASSWORD_MIN_LENGTH=8

# Optional 2FA
TWO_FACTOR_ENABLED=false
TWO_FACTOR_APP_NAME="Framer Templates"

# ============================================
# CLOUDFLARE
# ============================================

# Account
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token

# R2 Storage
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME_DEV=framer-templates-dev
R2_BUCKET_NAME_STAGING=framer-templates-staging
R2_BUCKET_NAME_PROD=framer-templates-prod
R2_REGION=auto
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

# R2 Signed URLs
R2_SIGNED_URL_EXPIRY_SECONDS=900 # 15 minutes
R2_MAX_RETRY_ATTEMPTS=3

# Worker
WORKER_URL=https://api.yourdomain.com
WORKER_ENV=development

# Pages
PAGES_PROJECT_NAME=framer-templates-ui

# ============================================
# STRIPE
# ============================================

# API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Products & Prices (created in Stripe Dashboard)
# Day Pass
STRIPE_PRODUCT_DAY_PASS=prod_...
STRIPE_PRICE_DAY_PASS=price_...

# Solo Monthly
STRIPE_PRODUCT_SOLO=prod_...
STRIPE_PRICE_SOLO_MONTHLY=price_...
STRIPE_PRICE_SOLO_ANNUAL=price_...

# Studio Monthly
STRIPE_PRODUCT_STUDIO=prod_...
STRIPE_PRICE_STUDIO_MONTHLY=price_...
STRIPE_PRICE_STUDIO_ANNUAL=price_...

# Agency Monthly
STRIPE_PRODUCT_AGENCY=prod_...
STRIPE_PRICE_AGENCY_MONTHLY=price_...
STRIPE_PRICE_AGENCY_ANNUAL=price_...

# Lifetime
STRIPE_PRODUCT_LIFETIME=prod_...
STRIPE_PRICE_LIFETIME_CORE=price_...
STRIPE_PRICE_LIFETIME_PLUS=price_...

# Add-ons
STRIPE_PRODUCT_FAST_TURNAROUND=prod_...
STRIPE_PRICE_FAST_TURNAROUND=price_...

# Configuration
STRIPE_SUCCESS_URL=${APP_PUBLIC_URL}/account/thanks
STRIPE_CANCEL_URL=${APP_PUBLIC_URL}/pricing
STRIPE_PORTAL_RETURN_URL=${APP_PUBLIC_URL}/account/billing
STRIPE_TAX_ENABLED=false
STRIPE_CUSTOMER_PORTAL_ENABLED=true

# Grace Period
PAYMENT_GRACE_PERIOD_DAYS=3

# ============================================
# EMAIL SERVICE
# ============================================

# Provider (sendgrid | postmark | ses | smtp)
EMAIL_PROVIDER=sendgrid

# SendGrid
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME="Framer Templates"
SENDGRID_TEMPLATE_WELCOME=d-...
SENDGRID_TEMPLATE_VERIFY=d-...
SENDGRID_TEMPLATE_RESET=d-...
SENDGRID_TEMPLATE_PAYMENT_FAILED=d-...
SENDGRID_TEMPLATE_PAYMENT_SUCCESS=d-...
SENDGRID_TEMPLATE_DOWNLOAD_RECEIPT=d-...
SENDGRID_TEMPLATE_REQUEST_RECEIVED=d-...
SENDGRID_TEMPLATE_REQUEST_UPDATE=d-...

# Postmark (alternative)
# POSTMARK_API_TOKEN=
# POSTMARK_FROM_EMAIL=
# POSTMARK_MESSAGE_STREAM=

# SMTP (fallback)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=
# SMTP_PASS=

# ============================================
# CACHING & PERFORMANCE
# ============================================

# Redis (optional)
REDIS_ENABLED=false
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# Cache TTLs (seconds)
CACHE_TTL_SESSION=20
CACHE_TTL_PROJECTS=300 # 5 minutes
CACHE_TTL_PLANS=3600 # 1 hour
CACHE_TTL_USER_PROFILE=20

# Worker Cache
WORKER_CACHE_ENABLED=true
WORKER_CACHE_TTL_DEFAULT=300

# ============================================
# RATE LIMITING
# ============================================

# Limits per minute
RATE_LIMIT_AUTH=5
RATE_LIMIT_DOWNLOADS=10
RATE_LIMIT_API=100
RATE_LIMIT_STRIPE=3

# Rate limit storage
RATE_LIMIT_STORE=memory # memory | redis

# ============================================
# MONITORING & LOGGING
# ============================================

# Sentry
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# LogTail
LOGTAIL_SOURCE_TOKEN=
LOGTAIL_ENABLED=false

# Analytics
POSTHOG_API_KEY=
POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com

# Status Monitoring
BETTERUPTIME_API_TOKEN=
STATUS_PAGE_URL=https://status.yourdomain.com

# ============================================
# SECURITY
# ============================================

# CORS
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# CSRF
CSRF_SECRET=your-csrf-secret
CSRF_COOKIE_NAME=csrf-token

# Content Security Policy
CSP_ENABLED=false
CSP_REPORT_URI=

# IP Blocking
IP_BLOCKING_ENABLED=false
IP_BLOCKLIST=

# ============================================
# FEATURES FLAGS
# ============================================

FEATURE_DOWNLOADS=true
FEATURE_TEMPLATE_REQUESTS=true
FEATURE_FAVORITES=true
FEATURE_BULK_DOWNLOAD=false
FEATURE_TWO_FACTOR=false
FEATURE_TEAM_ACCOUNTS=false
FEATURE_API_ACCESS=false

# ============================================
# SCHEDULING & JOBS
# ============================================

# Cron Jobs
CRON_QUOTA_RESET=0 0 * * * # Midnight daily
CRON_CLEANUP_LOGS=0 3 * * 0 # 3 AM Sunday
CRON_SEND_REPORTS=0 9 * * 1 # 9 AM Monday
CRON_BACKUP_DATABASE=0 2 * * * # 2 AM daily

# Job Queue
QUEUE_PROVIDER=bull # bull | bee | sqs
QUEUE_REDIS_URL=${REDIS_URL}

# ============================================
# DEVELOPMENT TOOLS
# ============================================

# Debug
DEBUG=false
DEBUG_SQL=false
DEBUG_CACHE=false
DEBUG_STRIPE=false

# Seeds
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin123!
SEED_TEST_USERS=true
SEED_SAMPLE_DATA=true

# ============================================
# DEPLOYMENT
# ============================================

# CI/CD
CI=false
SKIP_PREFLIGHT_CHECK=true
ANALYZE=false

# Build
NEXT_TELEMETRY_DISABLED=1
STRAPI_TELEMETRY_DISABLED=true

# Deployment URLs
PREVIEW_URL=
STAGING_URL=
PRODUCTION_URL=
```

## Environment-Specific Configurations

### Development (.env.local)

```bash
NODE_ENV=development
APP_ENV=development
DEBUG=true
STRIPE_SECRET_KEY=sk_test_...
EMAIL_PROVIDER=smtp # Use local SMTP for dev
REDIS_ENABLED=false
FEATURE_TWO_FACTOR=false
```

### Staging (.env.staging)

```bash
NODE_ENV=production
APP_ENV=staging
DEBUG=false
APP_PUBLIC_URL=https://staging.yourdomain.com
STRAPI_URL=https://api-staging.yourdomain.com
STRIPE_SECRET_KEY=sk_test_... # Still test keys
R2_BUCKET_NAME=${R2_BUCKET_NAME_STAGING}
SENTRY_ENVIRONMENT=staging
```

### Production (.env.production)

```bash
NODE_ENV=production
APP_ENV=production
DEBUG=false
APP_PUBLIC_URL=https://yourdomain.com
STRAPI_URL=https://api.yourdomain.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
R2_BUCKET_NAME=${R2_BUCKET_NAME_PROD}
SENTRY_ENVIRONMENT=production
REDIS_ENABLED=true
RATE_LIMIT_STORE=redis
```

## Validation Script

Create `scripts/validate-env.js`:

```javascript
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
    "R2_BUCKET_NAME_PROD",
  ],
  email: ["EMAIL_PROVIDER", "SENDGRID_API_KEY", "SENDGRID_FROM_EMAIL"],
}

const env = process.env.APP_ENV || "development"
console.log(`Validating environment variables for: ${env}`)

let missing = []
let warnings = []

// Check required variables
Object.entries(required).forEach(([category, vars]) => {
  vars.forEach((key) => {
    if (!process.env[key]) {
      missing.push(`${category}: ${key}`)
    }
  })
})

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
```

## Secret Generation

### Generate secure secrets:

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate API keys
node -e "console.log('ft_' + require('crypto').randomBytes(24).toString('hex'))"

# Generate Strapi APP_KEYS (4 required)
node -e "for(let i=0;i<4;i++) console.log(require('crypto').randomBytes(16).toString('base64'))"
```

## Loading Order

1. `.env` - Base configuration
2. `.env.local` - Local overrides (not committed)
3. `.env.[NODE_ENV]` - Environment-specific
4. `.env.[NODE_ENV].local` - Environment-specific local overrides

## Security Best Practices

1. **Never commit**:

   - `.env.local`
   - `.env.*.local`
   - Any file with real secrets

2. **Use secret management**:

   - AWS Secrets Manager
   - Vault
   - Doppler
   - Vercel/Netlify environment variables

3. **Rotate regularly**:

   - API keys quarterly
   - JWT secrets annually
   - Database passwords quarterly

4. **Monitor access**:
   - Log environment variable access
   - Alert on suspicious patterns
   - Audit secret usage

## Troubleshooting

### Common Issues

1. **"Missing API Token"**

   - Create token in Strapi Admin → Settings → API Tokens
   - Use "Read-only" for `STRAPI_REST_READONLY_API_KEY`

2. **"Invalid Stripe Webhook Secret"**

   - Get from Stripe Dashboard → Webhooks → Signing Secret
   - Different for test/live modes

3. **"R2 Access Denied"**

   - Check R2 API token permissions
   - Verify bucket name matches environment

4. **"Email Not Sending"**

   - Verify SendGrid API key has full access
   - Check from email is verified sender

5. **"Database Connection Failed"**
   - Check DATABASE_URL format
   - Verify SSL settings for cloud databases
   - Check connection pool settings
