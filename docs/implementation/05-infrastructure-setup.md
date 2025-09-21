# Infrastructure Setup Guide

Complete deployment guide for the Framer Template Platform across all environments.

## MCP Tool Orchestration

```bash
# Use Docker MCP for containerization
mcp__MCP_DOCKER__docker --args "build -t framer-strapi apps/strapi"
mcp__MCP_DOCKER__docker --args "run -d -p 1337:1337 framer-strapi"

# Use Kubernetes MCP for deployment
mcp__MCP_DOCKER__kubectl_create \
  --resourceType "namespace" \
  --name "framer-templates"

mcp__MCP_DOCKER__kubectl_apply \
  --manifest "$(cat k8s/deployment.yaml)" \
  --namespace "framer-templates"

# Monitor deployment
mcp__MCP_DOCKER__kubectl_get \
  --resourceType "pods" \
  --namespace "framer-templates"

# Check logs
mcp__MCP_DOCKER__kubectl_logs \
  --resourceType "pod" \
  --name "strapi-xxx" \
  --namespace "framer-templates"

# Execute commands in pods
mcp__MCP_DOCKER__exec_in_pod \
  --name "strapi-xxx" \
  --namespace "framer-templates" \
  --command "npm run strapi migrate"
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Cloudflare                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   DNS/CDN    │  │    Worker    │  │  Pages (UI)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                           │                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │              R2 Storage (Templates)               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            │
                            ├── API Requests
                            ├── Cached Responses
                            └── Rate Limiting
                            │
┌──────────────────────────────────────────────────────────┐
│                    Strapi Backend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   REST API   │  │   Services   │  │    Plugins   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                           │                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                  │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
                            │
┌──────────────────────────────────────────────────────────┐
│                    External Services                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Stripe  │  │ SendGrid │  │  Sentry  │  │ Redis  │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 1. Database Setup

### Option A: Supabase (Recommended)

```bash
# 1. Create account at https://supabase.com
# 2. Create new project
# 3. Get connection string from Settings → Database

DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres

# 4. Enable connection pooling for production
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:6543/postgres?pgbouncer=true
```

### Option B: Neon

```bash
# 1. Create account at https://neon.tech
# 2. Create database
# 3. Get connection string

DATABASE_URL=postgresql://[USER]:[PASSWORD]@[ENDPOINT].neon.tech/[DATABASE]?sslmode=require
```

### Option C: Self-Hosted PostgreSQL

```bash
# Docker Compose
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: framer_templates
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
```

### Database Migrations

```bash
# Initial setup
cd apps/strapi
npm run strapi migration:create -- --name initial-schema

# Run migrations
npm run strapi migration:run

# Backup before migrations
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

## 2. Strapi Deployment

### Option A: Fly.io (Recommended)

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Initialize app
cd apps/strapi
fly launch --name framer-templates-api

# fly.toml
app = "framer-templates-api"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  STRAPI_URL = "https://framer-templates-api.fly.dev"

[http_service]
  internal_port = 1337
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true

[[services]]
  protocol = "tcp"
  internal_port = 1337

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

[mounts]
  source = "strapi_uploads"
  destination = "/app/public/uploads"

# Set secrets
fly secrets set DATABASE_URL=$DATABASE_URL
fly secrets set APP_KEYS=$APP_KEYS
fly secrets set JWT_SECRET=$JWT_SECRET

# Deploy
fly deploy

# Scale
fly scale vm shared-cpu-1x --memory 512
```

### Option B: Railway

```bash
# 1. Create account at https://railway.app
# 2. Connect GitHub repo
# 3. Add PostgreSQL service
# 4. Configure environment variables
# 5. Deploy from dashboard

# railway.toml
[build]
  builder = "nixpacks"
  buildCommand = "cd apps/strapi && npm run build"

[deploy]
  startCommand = "cd apps/strapi && npm run start"
  healthcheckPath = "/healthz"
  healthcheckTimeout = 30
  restartPolicyType = "always"
```

### Option C: Docker + VPS

```dockerfile
# apps/strapi/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app .

EXPOSE 1337
CMD ["npm", "start"]
```

```bash
# Build and push to registry
docker build -t your-registry/strapi-api .
docker push your-registry/strapi-api

# Deploy on VPS
docker run -d \
  --name strapi-api \
  -p 1337:1337 \
  -v /data/uploads:/app/public/uploads \
  --env-file .env.production \
  your-registry/strapi-api
```

## 3. Cloudflare Setup

### R2 Storage Buckets

```bash
# Login to Cloudflare Dashboard
# R2 → Create Bucket

# Development
Name: framer-templates-dev
Location: Automatic

# Staging
Name: framer-templates-staging
Location: Automatic

# Production
Name: framer-templates-prod
Location: Automatic

# Configure CORS for each bucket
{
  "AllowedOrigins": ["https://yourdomain.com"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["Content-Length"],
  "MaxAgeSeconds": 3600
}

# Create R2 API Token
# Permissions: Object Read & Write
# Save credentials:
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
```

### Worker Setup

```javascript
// wrangler.toml
name = "framer-templates-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[env.production]
vars = { ENVIRONMENT = "production" }
routes = [
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
]

[env.staging]
vars = { ENVIRONMENT = "staging" }
routes = [
  { pattern = "api-staging.yourdomain.com/*", zone_name = "yourdomain.com" }
]

[[kv_namespaces]]
binding = "CACHE"
id = "xxx"

[[r2_buckets]]
binding = "TEMPLATES"
bucket_name = "framer-templates-prod"

[[durable_objects.bindings]]
name = "RATE_LIMITER"
class_name = "RateLimiter"
```

```javascript
// src/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    }

    // Handle OPTIONS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders })
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(request, env)
    if (!rateLimitResult.allowed) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": rateLimitResult.retryAfter,
          ...corsHeaders,
        },
      })
    }

    // Cache check
    const cacheKey = new Request(url.toString(), request)
    const cache = caches.default
    let response = await cache.match(cacheKey)

    if (!response) {
      // Proxy to Strapi
      const strapiUrl = `${env.STRAPI_URL}${url.pathname}${url.search}`
      response = await fetch(strapiUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      })

      // Cache if appropriate
      if (response.ok && request.method === "GET") {
        const headers = new Headers(response.headers)
        headers.set("Cache-Control", "public, max-age=300")
        response = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        })
        ctx.waitUntil(cache.put(cacheKey, response.clone()))
      }
    }

    // Add CORS headers to response
    const newHeaders = new Headers(response.headers)
    Object.entries(corsHeaders).forEach(([key, value]) => {
      newHeaders.set(key, value)
    })

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    })
  },
}
```

```bash
# Deploy Worker
wrangler publish --env production
```

### Pages Setup (Next.js)

```bash
# Connect GitHub repo to Cloudflare Pages
# Build configuration:
Build command: cd apps/ui && npm run build
Build output directory: apps/ui/.next
Root directory: /
Environment variables: (Add all NEXT_PUBLIC_* vars)

# Deploy
git push origin main  # Auto-deploys
```

## 4. Redis Setup (Optional)

### Option A: Upstash

```bash
# 1. Create account at https://upstash.com
# 2. Create Redis database
# 3. Get credentials

REDIS_URL=rediss://default:[PASSWORD]@[ENDPOINT].upstash.io:6379
```

### Option B: Railway Redis

```bash
# Add Redis service in Railway dashboard
# Auto-configured with your app
```

### Option C: Self-Hosted

```bash
# Docker
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine \
  redis-server --requirepass yourpassword
```

## 5. Email Service Setup

### SendGrid Configuration

```bash
# 1. Create account at https://sendgrid.com
# 2. Verify sender domain
# 3. Create API key with full access
# 4. Create dynamic templates for each email type

SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# 5. Configure DNS records (SPF, DKIM, DMARC)
```

## 6. Monitoring Setup

### Sentry

```bash
# 1. Create account at https://sentry.io
# 2. Create project for each app (Strapi, Next.js, Worker)
# 3. Get DSN for each

SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### BetterUptime

```bash
# 1. Create monitors for:
- https://api.yourdomain.com/healthz
- https://yourdomain.com
- Stripe webhooks endpoint

# 2. Configure alerts (email, Slack, PagerDuty)
# 3. Create status page
```

## 7. CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-strapi:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: |
          cd apps/strapi
          flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  deploy-worker:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: "packages/worker"
          command: "publish --env production"
```

## 8. Domain & DNS Configuration

```bash
# Cloudflare DNS Records

# Main domain
A     @              192.0.2.1    # Cloudflare Pages
AAAA  @              2001:db8::1  # Cloudflare Pages

# API subdomain
CNAME api            framer-templates-api.fly.dev

# Email records
MX    @              10 mx.sendgrid.net
TXT   @              "v=spf1 include:sendgrid.net ~all"
TXT   s1._domainkey  [DKIM record from SendGrid]

# Verification records
TXT   _dmarc         "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

## 9. SSL/TLS Configuration

```bash
# Cloudflare SSL/TLS Settings
SSL/TLS Mode: Full (strict)
Always Use HTTPS: On
Automatic HTTPS Rewrites: On
Minimum TLS Version: 1.2

# HSTS
max-age=31536000; includeSubDomains; preload
```

## 10. Backup Strategy

### Database Backups

```bash
# Automated daily backups
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Weekly full backup to R2
0 3 * * 0 ./scripts/backup-to-r2.sh

# Retention: 30 days daily, 12 weeks weekly, 12 months monthly
```

### R2 Backups

```bash
# Sync to backup bucket
rclone sync r2:framer-templates-prod r2:framer-templates-backup

# Cross-region backup
aws s3 sync s3://framer-templates-prod s3://framer-templates-dr
```

## 11. Deployment Checklist

### Pre-Deployment

- [ ] All environment variables set
- [ ] Database migrations tested
- [ ] Stripe products created
- [ ] Email templates configured
- [ ] DNS records configured
- [ ] SSL certificates active
- [ ] Monitoring configured
- [ ] Backup strategy tested

### Deployment Steps

1. [ ] Deploy database migrations
2. [ ] Deploy Strapi backend
3. [ ] Deploy Cloudflare Worker
4. [ ] Deploy Next.js to Pages
5. [ ] Test health endpoints
6. [ ] Test critical flows
7. [ ] Enable monitoring alerts
8. [ ] Update status page

### Post-Deployment

- [ ] Verify all endpoints responding
- [ ] Check error rates in Sentry
- [ ] Confirm email delivery
- [ ] Test payment flow
- [ ] Monitor performance metrics
- [ ] Document any issues

## 12. Rollback Procedures

### Quick Rollback

```bash
# Strapi on Fly.io
fly releases
fly deploy --image registry.fly.io/framer-templates-api:v123

# Worker
wrangler rollback

# Pages
# Use Cloudflare dashboard to rollback to previous deployment
```

### Database Rollback

```bash
# Stop application
fly scale count 0

# Restore backup
psql $DATABASE_URL < backup_20240101.sql

# Run migrations if needed
npm run strapi migration:run

# Restart application
fly scale count 1
```

## 13. Performance Optimization

### CDN Configuration

```javascript
// Cloudflare Page Rules
*.yourdomain.com/api/*
  Cache Level: Bypass

*.yourdomain.com/images/*
  Cache Level: Cache Everything
  Edge Cache TTL: 1 month

*.yourdomain.com/*
  Cache Level: Standard
  Browser Cache TTL: 4 hours
```

### Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_template_access_user_date ON template_access_logs(user_id, created_at);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_users_email ON users(email);

-- Analyze tables
ANALYZE template_access_logs;
ANALYZE projects;
ANALYZE user_profiles;
```

## 14. Security Hardening

### Headers

```javascript
// Security headers in Worker
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline';",
}
```

### Rate Limiting

```javascript
// Cloudflare Rate Limiting Rules
// API endpoints
(http.request.uri.path contains "/api/auth")
  Rate: 5 requests per 1 minute per IP

(http.request.uri.path contains "/api/template-access")
  Rate: 10 requests per 1 minute per IP

(http.request.uri.path contains "/api/stripe")
  Rate: 3 requests per 1 minute per IP
```

## 15. Troubleshooting Guide

### Common Issues

#### "Database connection timeout"

```bash
# Check connection pool settings
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

# Verify network connectivity
fly ssh console -a framer-templates-api
ping db.supabase.co
```

#### "Worker not caching"

```bash
# Check KV namespace binding
wrangler kv:namespace list

# Verify cache headers
curl -I https://api.yourdomain.com/api/projects
```

#### "Emails not sending"

```bash
# Verify SendGrid API key
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer $SENDGRID_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"noreply@yourdomain.com"},"subject":"Test","content":[{"type":"text/plain","value":"Test"}]}'
```

This infrastructure setup provides a robust, scalable foundation for your Framer Template Platform with proper monitoring, security, and backup strategies.
