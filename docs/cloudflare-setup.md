# Cloudflare Infrastructure Setup Guide

## Overview

This guide walks through setting up Cloudflare infrastructure for the Framer Templates platform, including Workers (API Gateway), Pages (Frontend hosting), and R2 (Object storage).

## Prerequisites

- Cloudflare account (Free tier is sufficient to start)
- Wrangler CLI installed (`npm install -g wrangler`)
- Git repository connected for Pages deployment

## 1. Cloudflare Account Setup

### 1.1 Create/Access Account

1. Sign up at [cloudflare.com](https://cloudflare.com) or log in to existing account
2. Navigate to your account dashboard
3. Note your **Account ID** from the right sidebar (you'll need this)

### 1.2 Generate API Tokens

#### Global API Token (for Wrangler CLI)

1. Go to **My Profile > API Tokens**
2. Click **Create Token**
3. Use **Custom token** template with these permissions:
   - **Account** - Cloudflare Workers Scripts:Edit
   - **Account** - Cloudflare Pages:Edit
   - **Account** - Worker R2 Storage:Edit
   - **Zone** - Zone:Read (if using custom domain)
4. Save the token securely - you won't see it again!

#### R2 API Token

1. Create another token specifically for R2 access:
   - **Account** - Worker R2 Storage:Edit
2. Generate R2 Access Keys:
   - Go to **R2 > Manage R2 API tokens**
   - Create new API token
   - Save both Access Key ID and Secret Access Key

## 2. Cloudflare Workers (API Gateway)

### 2.1 Initialize Worker Project

```bash
cd apps/worker
wrangler init api-gateway
```

### 2.2 Worker Configuration (wrangler.toml)

```toml
name = "framer-templates-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.development]
vars = { ENVIRONMENT = "development" }
routes = [
  { pattern = "api-dev.yourdomain.com/*", zone_name = "yourdomain.com" }
]

[env.staging]
vars = { ENVIRONMENT = "staging" }
routes = [
  { pattern = "api-staging.yourdomain.com/*", zone_name = "yourdomain.com" }
]

[env.production]
vars = { ENVIRONMENT = "production" }
routes = [
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
]

[[r2_buckets]]
binding = "TEMPLATES_BUCKET"
bucket_name = "framer-templates-dev"
preview_bucket_name = "framer-templates-preview"
```

### 2.3 Basic Worker Implementation

```typescript
// src/index.ts
export interface Env {
  TEMPLATES_BUCKET: R2Bucket
  STRAPI_URL: string
  ENVIRONMENT: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // Health check
    if (url.pathname === "/health") {
      return new Response("OK", { status: 200 })
    }

    // Proxy to Strapi with auth validation
    if (url.pathname.startsWith("/api/")) {
      // Add auth validation logic here
      const strapiUrl = `${env.STRAPI_URL}${url.pathname.replace("/api", "")}`
      return fetch(strapiUrl, request)
    }

    return new Response("Not Found", { status: 404 })
  },
}
```

### 2.4 Deploy Worker

```bash
# Development
wrangler deploy --env development

# Staging
wrangler deploy --env staging

# Production
wrangler deploy --env production
```

## 3. Cloudflare Pages (Frontend Hosting)

### 3.1 Create Pages Project

1. Go to **Workers & Pages > Create application > Pages**
2. Connect to Git provider (GitHub/GitLab)
3. Select your repository
4. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `cd apps/ui && yarn build`
   - **Build output directory**: `apps/ui/.next`
   - **Root directory**: `/`

### 3.2 Environment Variables

Add these in Pages settings:

```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STRAPI_URL=https://api.yourdomain.com
STRAPI_REST_READONLY_API_KEY=<from-strapi>
```

### 3.3 Custom Domain

1. Go to **Custom domains** tab
2. Add your domain
3. Follow DNS configuration instructions

## 4. R2 Buckets (Object Storage)

### 4.1 Create Buckets

```bash
# Development bucket
wrangler r2 bucket create framer-templates-dev

# Staging bucket
wrangler r2 bucket create framer-templates-staging

# Production bucket
wrangler r2 bucket create framer-templates-prod

# Backup bucket
wrangler r2 bucket create framer-templates-backups
```

### 4.2 Configure CORS

Create `cors.json`:

```json
{
  "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}
```

Apply CORS:

```bash
wrangler r2 bucket cors put framer-templates-dev --file cors.json
wrangler r2 bucket cors put framer-templates-staging --file cors.json
wrangler r2 bucket cors put framer-templates-prod --file cors.json
```

### 4.3 Bucket Lifecycle Rules

```bash
# Set up 30-day expiration for temporary files
wrangler r2 bucket lifecycle add framer-templates-dev \
  --prefix "temp/" \
  --expire-days 30
```

## 5. Cross-Service Integration

### 5.1 Worker Secrets

```bash
# Add secrets to Worker
wrangler secret put STRAPI_URL --env development
wrangler secret put JWT_SECRET --env development
wrangler secret put R2_ACCESS_KEY_ID --env development
wrangler secret put R2_SECRET_ACCESS_KEY --env development
```

### 5.2 Pages Integration with Worker

In Pages settings, add environment variable:

```
NEXT_PUBLIC_API_URL=https://api-dev.yourdomain.com
```

### 5.3 R2 Signed URLs in Worker

```typescript
// Generate signed URL for template remix access
async function generateSignedUrl(
  bucket: R2Bucket,
  key: string,
  expiresIn: number = 900
): Promise<string> {
  const object = await bucket.get(key)
  if (!object) {
    throw new Error("Object not found")
  }

  // Implementation depends on your auth strategy
  return await bucket.createSignedUrl(key, { expiresIn })
}

// TODO: Future schema rename - downloadUrl → remixUrl
// TODO: Future schema rename - downloadCount → remixCount
// TODO: Future schema rename - monthlyDownloadLimit → monthlyRemixLimit
```

## 6. Environment Variables Summary

Update your `.env` file with actual values:

```env
# Cloudflare Account
CLOUDFLARE_ACCOUNT_ID=<your-32-char-account-id>
CLOUDFLARE_API_TOKEN=<your-api-token>

# R2 Storage
R2_ACCESS_KEY_ID=<your-r2-access-key-id>
R2_SECRET_ACCESS_KEY=<your-r2-secret-access-key>
R2_BUCKET_NAME_DEV=framer-templates-dev
R2_BUCKET_NAME_STAGING=framer-templates-staging
R2_BUCKET_NAME_PROD=framer-templates-prod
R2_REGION=auto
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

# Worker
WORKER_URL=https://api-dev.yourdomain.com
WORKER_ENV=development

# Pages
PAGES_PROJECT_NAME=framer-templates-ui
```

## 7. Verification Steps

### 7.1 Test Worker Deployment

```bash
# Check worker status
wrangler tail --env development

# Test health endpoint
curl https://api-dev.yourdomain.com/health
```

### 7.2 Test R2 Access

```bash
# List buckets
wrangler r2 bucket list

# Upload test file
echo "test" > test.txt
wrangler r2 object put framer-templates-dev/test.txt --file test.txt

# Verify upload
wrangler r2 object get framer-templates-dev/test.txt
```

### 7.3 Test Pages Deployment

- Push a commit to trigger build
- Check build logs in Cloudflare dashboard
- Verify deployment at provided URL

## 8. Security Checklist

- [ ] API tokens use least privilege principle
- [ ] Secrets stored in Wrangler secrets, not in code
- [ ] CORS configured for specific origins only
- [ ] R2 buckets are private by default
- [ ] Worker implements authentication checks
- [ ] Rate limiting configured on Worker routes
- [ ] DDoS protection enabled (automatic with Cloudflare)
- [ ] SSL/TLS enforced on all endpoints

## 9. Cost Considerations

### Free Tier Limits

- Workers: 100,000 requests/day
- R2: 10GB storage, 1M Class A operations, 10M Class B operations
- Pages: Unlimited sites, 500 builds/month

### Estimated Monthly Costs (at scale)

- Workers: ~$5-15/month for moderate traffic
- R2: ~$15/month per TB stored + operations
- Pages: Free for most use cases

## 10. Troubleshooting

### Common Issues

#### Worker not deploying

```bash
# Check authentication
wrangler whoami

# Re-authenticate
wrangler login
```

#### R2 access denied

- Verify API token has R2 permissions
- Check bucket name matches exactly
- Ensure CORS is configured

#### Pages build failing

- Check Node version compatibility
- Verify environment variables are set
- Review build logs for specific errors

## Next Steps

1. Set up monitoring with Cloudflare Analytics
2. Configure caching rules for optimal performance
3. Implement backup strategy for R2 data
4. Set up staging environment pipeline
5. Configure custom error pages

## Support Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [R2 Storage Docs](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
