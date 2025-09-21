# Cloudflare Pages Setup for Next.js Frontend

## Overview

Cloudflare Pages will host the Next.js frontend with automatic deployments from GitHub.

## Manual Setup Steps

### 1. Create Pages Project

1. Visit: https://dash.cloudflare.com/82655735d78bf7309c659b5a576715c4/pages/new/provider/github
2. Connect GitHub account (if not connected)
3. Select repository: `strapi-next-monorepo-starter`
4. Click "Begin setup"

### 2. Build Configuration

Configure these exact settings:

| Setting                    | Value                      |
| -------------------------- | -------------------------- |
| **Project name**           | framer-templates-ui        |
| **Production branch**      | main                       |
| **Framework preset**       | None (custom)              |
| **Build command**          | `cd apps/ui && yarn build` |
| **Build output directory** | `/apps/ui/.next`           |
| **Root directory**         | `/`                        |
| **Node version**           | 20                         |

### 3. Environment Variables

Add these in the Pages dashboard under "Environment variables":

#### Required Variables

```env
# Core
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://framer-templates-ui.pages.dev

# Strapi Connection
STRAPI_URL=http://localhost:1337  # Update with production URL
STRAPI_REST_READONLY_API_KEY=      # Get from Strapi Admin

# Authentication
NEXTAUTH_URL=https://framer-templates-ui.pages.dev
NEXTAUTH_SECRET=                    # Generate: openssl rand -base64 32

# Stripe (Public key only)
STRIPE_PUBLISHABLE_KEY=pk_test_    # From Stripe Dashboard

# Worker API
WORKER_URL=https://framer-templates-api.workers.dev
```

#### Preview Environment Variables

For preview deployments, override these:

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=https://preview.framer-templates-ui.pages.dev
NEXTAUTH_URL=https://preview.framer-templates-ui.pages.dev
```

### 4. Deploy

1. Click "Save and Deploy"
2. Initial build takes 5-10 minutes
3. Check build logs for any errors

## Automated Deployment (After Manual Setup)

### Via GitHub Push

```bash
git add .
git commit -m "feat: update frontend"
git push origin main
# Automatically triggers Pages deployment
```

### Via Wrangler CLI

```bash
# Manual deployment
cd apps/ui
yarn build
wrangler pages deploy .next --project-name framer-templates-ui

# Check deployment status
wrangler pages deployment list --project-name framer-templates-ui
```

## Local Development with Pages

### Test Pages Functions Locally

```bash
cd apps/ui
npx wrangler pages dev -- yarn dev
# Access at http://localhost:8788
```

### Environment Variables for Local Development

Create `apps/ui/.dev.vars`:

```env
STRAPI_URL=http://localhost:1337
STRAPI_REST_READONLY_API_KEY=your-local-key
NEXTAUTH_SECRET=dev-secret-32-chars
```

## Custom Domain Setup

### Add Custom Domain

1. Go to "Custom domains" tab in Pages project
2. Add domain: `yourdomain.com`
3. Add www: `www.yourdomain.com`

### DNS Configuration

Add these records to your DNS provider:

| Type  | Name | Content                       | Proxy |
| ----- | ---- | ----------------------------- | ----- |
| CNAME | @    | framer-templates-ui.pages.dev | Yes   |
| CNAME | www  | framer-templates-ui.pages.dev | Yes   |

### SSL Configuration

- SSL is automatic via Cloudflare
- Force HTTPS in Pages settings
- Enable "Always Use HTTPS"

## Build Optimization

### Next.js Configuration

Ensure `next.config.js` has:

```javascript
module.exports = {
  output: "standalone",
  images: {
    unoptimized: true, // For Pages compatibility
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
}
```

### Pages Functions

Place API routes in `apps/ui/functions/api/`:

```typescript
// apps/ui/functions/api/hello.ts
export async function onRequest(context) {
  return new Response("Hello from Pages Function!")
}
```

## Monitoring & Analytics

### Enable Web Analytics

1. Go to Analytics tab
2. Enable Web Analytics
3. Add tracking script to `_app.tsx`

### Build Analytics

View in Pages dashboard:

- Build duration
- Build logs
- Deployment history
- Error rates

## Troubleshooting

### Build Failures

#### Node Version Issues

```toml
# Add to project root
[build]
NODE_VERSION = "20"
```

#### Memory Issues

```toml
[build.environment]
NODE_OPTIONS = "--max-old-space-size=4096"
```

#### Module Resolution

Ensure `tsconfig.json` paths are correct:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Environment Variable Issues

#### Secret Values

Never commit secrets. Use Pages dashboard for:

- API keys
- Auth secrets
- Database URLs

#### Build vs Runtime

- Build-time: Variables starting with `NEXT_PUBLIC_`
- Runtime: Server-side variables

### Deployment Issues

#### Check Logs

```bash
wrangler pages deployment tail --project-name framer-templates-ui
```

#### Rollback

```bash
# List deployments
wrangler pages deployment list --project-name framer-templates-ui

# Rollback to specific deployment
wrangler pages rollback <deployment-id> --project-name framer-templates-ui
```

## Integration with Worker

### API Proxy Configuration

In `apps/ui/src/lib/api-client.ts`:

```typescript
const API_URL =
  process.env.WORKER_URL || "https://framer-templates-api.workers.dev"

export async function apiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
  return response.json()
}
```

### CORS Configuration

Worker should allow Pages domain:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://framer-templates-ui.pages.dev",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}
```

## Performance Optimization

### Caching Strategy

```typescript
// pages/_app.tsx
export const config = {
  runtime: "experimental-edge",
}

// Enable ISR
export const revalidate = 60 // seconds
```

### Image Optimization

Use Cloudflare Image Resizing:

```typescript
const imageLoader = ({ src, width, quality }) => {
  return `https://images.yourdomain.com/cdn-cgi/image/width=${width},quality=${quality || 75}/${src}`
}
```

## Security Checklist

- [ ] Environment variables set correctly
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Authentication working
- [ ] API keys secure (never in code)
- [ ] CORS properly configured
- [ ] Rate limiting enabled

## Next Steps

1. Complete Pages setup in dashboard
2. Verify deployment succeeds
3. Test preview deployments
4. Configure custom domain
5. Enable analytics
6. Set up monitoring alerts

## Support Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Wrangler Pages Commands](https://developers.cloudflare.com/workers/wrangler/commands/#pages)
