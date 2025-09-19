# API Contracts

This document defines the exact request/response contracts for all API endpoints. Use these as the source of truth for implementation.

## MCP Tool Integration

```bash
# Use Strapi MCP to implement these endpoints

# Create content types for each model
mcp__strapi-mcp__list_content_types

# Create entries for testing
mcp__strapi-mcp__create_entry \
  --contentType "api::project.project" \
  --data '{"title": "Test Template", "slug": "test-template"}'

# Query entries with filters matching API contracts
mcp__strapi-mcp__get_entries \
  --contentType "api::project.project" \
  --options '{"filters": {"requiredPlan": "solo"}, "populate": ["heroImage"]}'
```

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request:**

```typescript
{
  email: string // valid email format
  password: string // min 8 chars, 1 uppercase, 1 number
  timezone?: string // IANA timezone (default: "UTC")
  newsletter?: boolean // marketing consent
}
```

**Response (200):**

```typescript
{
  success: true
  message: "Verification email sent"
  userId: string
}
```

**Error (400):**

```typescript
{
  error: "VALIDATION_ERROR" | "EMAIL_EXISTS"
  message: string
  fields?: {
    email?: string
    password?: string
  }
}
```

### POST /api/auth/verify-email

Verify email with 6-digit code.

**Request:**

```typescript
{
  email: string
  code: string // 6 digits
}
```

**Response (200):**

```typescript
{
  success: true
  message: "Email verified successfully"
  token: string // auto-login token
}
```

**Error (400):**

```typescript
{
  error: "INVALID_CODE" | "CODE_EXPIRED" | "MAX_ATTEMPTS"
  message: string
  attemptsRemaining?: number
}
```

### POST /api/auth/login

Authenticate user credentials.

**Request:**

```typescript
{
  email: string
  password: string
  rememberMe?: boolean // default: false
}
```

**Response (200):**

```typescript
{
  success: true
  user: {
    id: string
    email: string
    name: string
    hasActiveSubscription: boolean
    subscriptionState: "active" |
      "trial" |
      "past_due" |
      "grace" |
      "suspended" |
      "canceled"
  }
  sessionExpiry: string // ISO8601
}
```

**Error (401):**

```typescript
{
  error: "INVALID_CREDENTIALS" | "EMAIL_NOT_VERIFIED" | "ACCOUNT_LOCKED"
  message: string
}
```

### POST /api/auth/forgot-password

Request password reset email.

**Request:**

```typescript
{
  email: string
}
```

**Response (200):**

```typescript
{
  success: true
  message: "Reset email sent if account exists"
}
```

### POST /api/auth/reset-password

Reset password with token.

**Request:**

```typescript
{
  token: string
  password: string
  confirmPassword: string
}
```

**Response (200):**

```typescript
{
  success: true
  message: "Password reset successfully"
  token: string // auto-login token
}
```

**Error (400):**

```typescript
{
  error: "INVALID_TOKEN" | "TOKEN_EXPIRED" | "PASSWORD_MISMATCH"
  message: string
}
```

## User Endpoints

### GET /api/me

Get current user profile with subscription details.

**Response (200):**

```typescript
{
  id: string
  email: string
  name: string
  timezone: string
  theme: "light" | "dark" | "system"
  subscription: {
    state: "active" | "trial" | "past_due" | "grace" | "suspended" | "canceled"
    plan: {
      id: string
      name: string
      tier: "day_pass" | "solo" | "studio" | "agency" | "lifetime" | "lifetime_plus"
      billingCycle: "day" | "month" | "year" | "lifetime"
    }
    expiresAt: string // ISO8601
    gracePeriodUntil?: string // ISO8601
    addOns: string[] // ["fast_turnaround"]
  }
  quotas: {
    dailyDownloads: {
      used: number
      limit: number
      resetAt: string // ISO8601 in user timezone
    }
    templateRequests: {
      used: number
      limit: number
      cycle: "month" | "lifetime"
    }
  }
  stats: {
    totalDownloads: number
    favoriteCount: number
    memberSince: string // ISO8601
  }
}
```

### POST /api/me/refresh

Force refresh of cached user data.

**Response (200):**

```typescript
// Same as GET /api/me
```

### PATCH /api/me/preferences

Update user preferences.

**Request:**

```typescript
{
  timezone?: string // IANA timezone
  theme?: "light" | "dark" | "system"
  emailNotifications?: {
    downloads?: boolean
    requests?: boolean
    billing?: boolean
    updates?: boolean
  }
}
```

**Response (200):**

```typescript
{
  success: true
  preferences: {
    // Updated preferences
  }
}
```

## Project/Template Endpoints

### GET /api/projects

List all projects with filtering.

**Query Parameters:**

```typescript
{
  search?: string
  tags?: string // comma-separated
  plan?: string // filter by required plan
  sort?: "newest" | "popular" | "updated" | "alphabetical"
  page?: number // default: 1
  limit?: number // default: 24, max: 100
}
```

**Response (200):**

```typescript
{
  projects: [
    {
      id: string
      title: string
      slug: string
      summary: string
      heroImage: string
      thumbnailImage: string
      videoPreview?: string
      tags: string[]
      requiredPlan: string
      downloadCount: number
      complexity: "beginner" | "intermediate" | "advanced"
      currentVersion: string
      lastUpdated: string
      featured: boolean
      isFavorited?: boolean // if authenticated
    }
  ]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
```

### GET /api/projects/:slug

Get project details.

**Response (200):**

```typescript
{
  id: string
  title: string
  slug: string
  summary: string
  description: string // full markdown
  heroImage: string
  gallery: string[] // additional images
  videoPreview?: string
  livePreview?: string
  tags: string[]
  requiredPlan: string
  canDownload: boolean // based on user's plan
  downloadCount: number
  fileSize: string // human readable
  complexity: "beginner" | "intermediate" | "advanced"
  currentVersion: string
  versions: [
    {
      version: string
      changelog: string
      releasedAt: string
    }
  ]
  relatedProjects: [
    // Similar structure to list item
  ]
}
```

## Download Endpoints

### POST /api/downloads

Initiate a download with quota enforcement.

**Request:**

```typescript
{
  projectId: string
  version?: string // default: current
}
```

**Response (200):**

```typescript
{
  downloadId: string
  link: string // signed R2 URL
  expiresAt: string // ISO8601 (15 minutes)
  fileName: string
  fileSize: number // bytes
  quotaRemaining: {
    daily: number
    resetAt: string // ISO8601
  }
}
```

**Error (403):**

```typescript
{
  error: "QUOTA_EXCEEDED" | "PLAN_REQUIRED" | "SUBSCRIPTION_SUSPENDED"
  message: string
  details: {
    quotaResetAt?: string
    requiredPlan?: string
    upgradeUrl?: string
  }
}
```

**Error (429):**

```typescript
{
  error: "RATE_LIMIT"
  message: string
  retryAfter: number // seconds
}
```

### POST /api/downloads/:id/complete

Mark download as completed for tracking.

**Request:**

```typescript
{
  downloadId: string
  success: boolean
  duration?: number // milliseconds
}
```

**Response (200):**

```typescript
{
  success: true
}
```

### POST /api/downloads/:id/retry

Retry a failed download without quota charge.

**Request:**

```typescript
{
  downloadId: string
  reason?: string // optional error description
}
```

**Response (200):**

```typescript
{
  link: string // new signed URL
  expiresAt: string
  attemptsRemaining: number // out of 3
}
```

**Error (403):**

```typescript
{
  error: "MAX_RETRIES" | "EXPIRED"
  message: string
  supportTicketId?: string // auto-created ticket
}
```

### GET /api/downloads/history

Get user's download history.

**Query Parameters:**

```typescript
{
  page?: number
  limit?: number // max: 50
  status?: "success" | "failed" | "pending"
  dateFrom?: string // ISO8601
  dateTo?: string // ISO8601
}
```

**Response (200):**

```typescript
{
  downloads: [
    {
      id: string
      project: {
        id: string
        title: string
        slug: string
        thumbnailImage: string
      }
      status: "success" | "failed" | "pending"
      downloadedAt: string
      fileSize: number
      version: string
      attempts: number
      canRetry: boolean
    }
  ]
  pagination: {
    // Standard pagination
  }
}
```

## Favorites Endpoints

### POST /api/favorites/toggle

Add or remove project from favorites (tier-gated).

**Request:**

```typescript
{
  projectId: string
}
```

**Response (200):**

```typescript
{
  success: true
  isFavorited: boolean
  favoriteCount: number
}
```

**Error (403):**

```typescript
{
  error: "FEATURE_REQUIRES_PLAN"
  message: string
  requiredPlan: string
}
```

### GET /api/favorites

Get user's favorited projects.

**Response (200):**

```typescript
{
  favorites: [
    // Same structure as project list items
  ]
  total: number
}
```

## Template Request Endpoints

### POST /api/template-requests

Submit a custom template request.

**Request:**

```typescript
{
  title: string // max 100 chars
  description: string // max 2000 chars
  category: string
  referenceLinks?: string[] // max 3
  urgency?: "standard" | "priority" | "rush"
  attachments?: string[] // file IDs from separate upload
}
```

**Response (200):**

```typescript
{
  requestId: string
  ticketNumber: string // human-readable
  status: "submitted"
  estimatedDelivery: string // ISO8601
  slaHours: number
}
```

**Error (403):**

```typescript
{
  error: "QUOTA_EXCEEDED" | "PLAN_SUSPENDED"
  message: string
  quotaResetAt?: string
}
```

### GET /api/template-requests

Get user's template requests.

**Response (200):**

```typescript
{
  requests: [
    {
      id: string
      ticketNumber: string
      title: string
      status: "new" | "reviewing" | "in_progress" | "ready" | "delivered"
      submittedAt: string
      estimatedDelivery: string
      actualDelivery?: string
      lastUpdate: string
      comments: [
        {
          id: string
          author: "user" | "admin"
          message: string
          createdAt: string
        }
      ]
      downloadLink?: string // when delivered
    }
  ]
  stats: {
    used: number
    limit: number
    cycle: "month" | "lifetime"
  }
}
```

### POST /api/template-requests/:id/comment

Add comment to template request.

**Request:**

```typescript
{
  message: string // max 1000 chars
}
```

**Response (200):**

```typescript
{
  success: true
  comment: {
    id: string
    message: string
    createdAt: string
  }
}
```

## Billing Endpoints

### GET /api/plans

Get available subscription plans.

**Response (200):**

```typescript
{
  plans: [
    {
      id: string
      name: string
      slug: string
      stripePriceId: string
      stripePriceIdAnnual?: string
      prices: {
        monthly?: number
        annual?: number
        lifetime?: number
      }
      billingCycle: "day" | "month" | "year" | "lifetime"
      features: {
        dailyDownloads: number
        templateRequests: number
        favorites: boolean
        bulkDownload: boolean
        prioritySupport: boolean
        supportSLA: number // hours
      }
      popular: boolean
      badge?: string // "Most Popular", "Best Value"
    }
  ]
  addOns: [
    {
      id: string
      name: string
      stripePriceId: string
      price: number
      description: string
    }
  ]
}
```

### POST /api/stripe/create-checkout-session

Create Stripe Checkout session for plan purchase.

**Request:**

```typescript
{
  planId: string
  billingCycle: "monthly" | "annual" | "lifetime"
  addOns?: string[] // add-on IDs
}
```

**Response (200):**

```typescript
{
  sessionId: string
  url: string // Stripe Checkout URL
}
```

**Error (400):**

```typescript
{
  error: "INVALID_PLAN" | "ALREADY_SUBSCRIBED"
  message: string
}
```

### POST /api/stripe/create-portal-session

Create Stripe Customer Portal session.

**Response (200):**

```typescript
{
  url: string // Portal URL
}
```

**Error (403):**

```typescript
{
  error: "NO_SUBSCRIPTION"
  message: string
}
```

### POST /api/webhooks/stripe

Stripe webhook handler (called by Stripe).

**Headers:**

```
Stripe-Signature: string
```

**Request:**

```typescript
// Raw Stripe event payload
```

**Response (200):**

```typescript
{
  received: true
}
```

**Error (400):**

```typescript
{
  error: "INVALID_SIGNATURE" | "PROCESSING_ERROR"
  message: string
}
```

## Admin Endpoints

### GET /api/admin/users

List all users (admin only).

**Query Parameters:**

```typescript
{
  search?: string // email or name
  plan?: string
  state?: string
  page?: number
  limit?: number
}
```

**Response (200):**

```typescript
{
  users: [
    {
      id: string
      email: string
      name: string
      plan: string
      state: string
      totalDownloads: number
      createdAt: string
      lastLogin: string
    }
  ]
  pagination: {
    // Standard pagination
  }
}
```

### PATCH /api/admin/users/:id

Update user details (admin only).

**Request:**

```typescript
{
  subscriptionState?: string
  quotaOverride?: {
    dailyDownloads?: number
    templateRequests?: number
  }
  notes?: string
}
```

**Response (200):**

```typescript
{
  success: true
  user: {
    // Updated user object
  }
}
```

### GET /api/admin/template-requests

List all template requests (admin only).

**Query Parameters:**

```typescript
{
  status?: string
  assignee?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}
```

**Response (200):**

```typescript
{
  requests: [
    {
      // Extended request object with user info
    }
  ]
  stats: {
    new: number
    inProgress: number
    completed: number
    averageTime: number // hours
  }
}
```

### PATCH /api/admin/template-requests/:id

Update template request status (admin only).

**Request:**

```typescript
{
  status?: string
  assignee?: string
  internalNotes?: string
  responseMessage?: string
  deliveryLink?: string
}
```

**Response (200):**

```typescript
{
  success: true
  request: {
    // Updated request object
  }
}
```

## Error Response Standards

All error responses follow this structure:

```typescript
{
  error: string // CONSTANT_CASE error code
  message: string // Human-readable message
  details?: any // Additional context
  requestId?: string // For support reference
}
```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (not logged in)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error
- **503**: Service Unavailable (maintenance)

## Rate Limiting Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## CORS Headers

All responses include appropriate CORS headers:

```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## Authentication Headers

Authenticated requests must include:

```
Cookie: next-auth.session-token=...
X-CSRF-Token: ... (for mutations)
```
