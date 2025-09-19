# Project Download Platform — Implementation Spec

## 1. Vision & Success Criteria

- Deliver a subscription-gated catalogue of premium Framer templates.
- Guarantee authenticated delivery backed by clear, enforceable daily download limits and template request quotas.
- Leverage Cloudflare Pages for the UI, Strapi v5 (with PostgreSQL) for content + billing state, and Cloudflare Workers as an edge API/cache layer.
- Provide instant in-app downloads (copy/open link) while logging auditable transactions for billing and compliance.
- Keep operations lightweight so a solo founder can manage catalogue, user support, and growth experiments without heavy DevOps overhead.

Success metrics: paid conversion rate, quota accuracy (no over-delivery), Stripe churn/failed payment recovery rate, and ability to recover from incidents (RTO < 4 hours).

## 2. System Architecture Overview

1. **Frontend (Next.js on Cloudflare Pages)**

   - App Router + Shadcn UI (dark-first, toggleable). Deployed to Pages with static asset caching.
   - Uses NextAuth with httpOnly cookie sessions; tokens never exposed to JavaScript.
   - Talks to a Cloudflare Worker gateway (`/api/*`) that forwards to Strapi, handles caching, and enforces rate limits.

2. **Backend (Strapi v5 on managed Node hosting)**

   - Run Strapi on Fly.io, Railway, Render, or VPS with persistent filesystem access.
   - PostgreSQL (managed) as primary database with automated backups/PITR.
   - REST endpoints secured via API tokens + session cookies proxied through Worker.
   - Maintain append-only audit logs for downloads, quota changes, Stripe events.

3. **Edge Gateway (Cloudflare Worker)**
   - Terminates TLS, validates session cookies, injects origin headers.

- Applies per-user/IP rate limits on sensitive routes (downloads, template requests, auth).
- Caches public catalogue responses with short TTL and revalidation tokens.

4. **Asset Storage (Cloudflare R2)**

   - Environment-specific buckets (e.g., `proj-files-dev`, `proj-files-prod`).
   - Assets served via Strapi-generated signed URLs (≤120s expiry, single-use) hashed in DB.
   - Nightly lifecycle rules copy assets to secondary bucket/backups.

5. **Billing (Stripe)**

   - Products/prices for revised tiers (day-pass, monthly, lifetime).
   - Webhook consumer (co-located with Strapi) verifies signatures, stores payloads with idempotency keys, and processes via outbox + retry queue.
   - Stripe customer portal enabled; grace period for failed payments configurable.

6. **Observability & Compliance**
   - Centralized logging (Sentry/Logtail) for Strapi & Worker, health endpoints (`/healthz`, `/__edge-status`).
   - GDPR readiness: document retention, enable data export/delete, update privacy policy.

## 3. Data Model (Strapi Collections & Components)

### Core Collections

- **`Project`**

  - Fields: title, slug, summary, heroMedia (Asset), remixLink, tag taxonomy, requiredPlan (enum), status, currentVersion, r2ObjectPath, previewGallery (repeatable media), featured, releasedAt
  - Additional: downloadCount (int), lastUpdated, videoPreviewUrl, livePreviewUrl, complexity (enum: beginner/intermediate/advanced)
  - SEO: metaTitle, metaDescription, ogImage
  - Component: `project_version` (version label, changelog, R2 path, releasedAt) to retain history

- **`Plan`**

  - Fields: name, slug, stripePriceId, stripePriceIdAnnual, billingCycle (day/month/year/lifetime), dailyDownloadLimit, templateRequestLimit (per cycle), isLifetime, perksRichText, priority, promoBadge
  - Additional: monthlyPrice, annualPrice, savings, popularBadge (bool), features (JSON array), supportSLA (hours)
  - Tier-gating: allowsFavorites (bool), allowsBulkDownload (bool), allowsCollections (bool)

- **`UserProfile`**

  - Relation: 1:1 with Strapi user
  - Core: plan (relation), planExpiresAt, dailyDownloadsUsed, dailyResetAt, templateRequestsUsed, stripeCustomerId
  - Preferences: timezone (string), theme (light/dark/system), language, emailNotifications (JSON)
  - Security: twoFactorEnabled (bool), lastPasswordChange, activeSessions (JSON)
  - State: subscriptionState (enum: active/trial/past_due/grace/suspended/canceled), gracePeriodUntil
  - Features: favorites (many-to-many Projects), collections (JSON), downloadLockVersion
  - Analytics: lastLoginAt, totalDownloads, accountCreatedAt, referralSource

- **`DownloadLog`**

  - Fields: project (relation), user (relation), status (pending/success/failed/expired), signedUrlHash, issuedAt, completedAt
  - Tracking: sourceIp, userAgent, attemptNumber (1-3), retryOf (self-relation)
  - Error handling: errorReason, errorCode, supportTicketId
  - Performance: downloadDuration (ms), fileSize (bytes)
  - Append-only via lifecycle hooks

- **`TemplateRequest`**

  - Relations: requester (user), assignee (admin user), project (when fulfilled)
  - Core: title, description, category, referenceLinks (JSON array), attachments (media)
  - Workflow: status (new/reviewing/in_progress/ready/delivered), priority (standard/priority/rush)
  - Tracking: submittedAt, estimatedDelivery, actualDelivery, responseNotes
  - Communication: comments (component repeatable), lastUpdatedBy
  - SLA: slaHours, isLate (computed)

- **`SubscriptionEvent`**
  - Fields: user, stripeCustomerId, stripeSubscriptionId, eventType, payload (JSON)
  - Processing: receivedAt, processedAt, retryCount, errorMessage
  - Integrity: idempotencyKey, signature, webhookId

### Supporting Collections

- **`EmailVerification`**

  - Fields: email, code (6 digits), expiresAt, attempts, verifiedAt
  - Security: ipAddress, userAgent

- **`PasswordReset`**

  - Fields: user (relation), token (hashed), expiresAt, usedAt
  - Security: requestIp, resetIp

- **`SupportTicket`**

  - Fields: user (relation), type (enum), subject, description, status
  - Relations: relatedDownload, relatedRequest
  - Tracking: priority, assignee, resolvedAt

- **`AuditLog`**
  - Fields: user, action, entity, entityId, changes (JSON), timestamp
  - Context: ipAddress, userAgent, sessionId

Supporting tables outside Strapi: `quota_snapshot` (daily counters), `audit_trail` if deeper compliance needed.

## 4. Security & Access Control

- NextAuth credentials provider backed by Strapi; sessions stored in httpOnly, Secure cookies (SameSite=Lax).
- Worker injects CSRF token for POST/PUT/DELETE; frontend includes header.
- Per-route rate limits (downloads, login, template requests, Stripe webhooks).
- Signed download URLs scoped to user + request; store hash only. On access, Strapi validates the hash, marks the token used, and blocks subsequent attempts. Retries issue a fresh token while marking the original as spent.
- Allowlist remix domains; validate all user inputs server-side.

## 5. Core Flows

### 5.1 Auth & Subscription Sync

1. User logs in → NextAuth → Strapi validates credentials and returns session-safe payload.
   - Simple email/password authentication only
   - Email verification required before full access (6-digit code, 10min expiry)
   - Password reset flow with secure token (1hr expiry)
   - Session duration: 7 days with "remember me", otherwise browser session
   - Two-factor authentication optional (TOTP-based)
2. Worker validates cookie, fetches `/users/me` (cached 20s by default) for plan/quota state.
   - Include subscription state machine status (Active/Trial/Grace/Suspended)
   - Return timezone preference for quota calculations
   - Include add-ons and feature flags
3. Stripe checkout success → `/account/thanks` page with detailed status:
   - Progressive status messages during polling (every 2s, max 45s)
   - Status stages: "Payment received" → "Activating plan" → "Setting up benefits"
   - Timeout handling with auto-created support ticket
   - Clear success state with quota summary and CTAs
4. Clients call `/api/me/refresh` to bypass cache after:
   - Payment retry/recovery
   - Plan changes (upgrade/downgrade)
   - Add-on purchases (Fast Turnaround)
   - Timezone updates affecting quota reset

### 5.2 Download Flow

1. User clicks Download with pre-validation:
   - Button displays remaining quota inline
   - Disabled state if quota exhausted
   - Warning indicator for last download
2. Frontend POST `/api/downloads` with projectId + CSRF token.
3. Worker verifies session, forwards to Strapi service which:
   - Begins Postgres transaction with timeout (5s max)
   - `SELECT ... FOR UPDATE NOWAIT` on `UserProfile` (fail fast on lock)
   - Validates: `dailyDownloadsUsed < dailyDownloadLimit`, plan active, subscription state
   - Inserts `DownloadLog` (status: pending, attempt: 1 of 3)
   - Generates signed R2 URL (15-minute expiry, allows Range headers for resume)
   - Increments counters, commits transaction
4. Response includes:
   ```json
   {
     "link": "signed_url",
     "expiresAt": "ISO8601",
     "quotaRemaining": { "daily": 5, "resetAt": "ISO8601" },
     "downloadId": "uuid"
   }
   ```
5. Frontend behavior:
   - Auto-copies link to clipboard
   - Initiates download via hidden iframe
   - Shows non-blocking toast with progress
   - Tracks completion: POST `/api/downloads/{id}/complete`
6. Error handling:
   - Quota exceeded: Shows visual timeline, exact reset time, upgrade CTA
   - Lock timeout: Retry with exponential backoff (1s, 2s, 4s)
   - Network failure: Enable retry button (no quota charge)
   - After 3 attempts: Auto-create support ticket

### 5.3 Template Request Flow

1. Request initiation from multiple entry points:
   - Dashboard widget, template detail page, search no-results
2. Form submission with validation:
   - Check `templateRequestsUsed < limit` for billing cycle
   - Detect duplicate/similar requests
   - Calculate SLA based on plan + add-ons
3. Backend processing:
   - Transaction-safe increment of request counter
   - Create `TemplateRequest` with initial status
   - Queue notifications (admin email/Slack, user confirmation)
   - Return request ID and tracking URL
4. Status tracking:
   - Webhook on status changes
   - Real-time updates via WebSocket or SSE
   - Comment thread between user and admin
5. Fulfillment:
   - Admin uploads to designated Project
   - User notified with direct download link
   - Request marked complete with satisfaction tracking

### 5.4 Quota Reset & Management

1. **Daily reset mechanism**:
   - Scheduled job runs at midnight user timezone
   - Batch process groups users by timezone
   - Atomic counter reset with audit log
   - Snapshot previous day's usage for analytics
2. **Timezone handling**:
   - User selects during onboarding
   - Changeable in account settings
   - Display all times in user's zone
   - UTC fallback for unset preferences
3. **Plan change impacts**:
   - Upgrade: Immediate quota refresh to new limits
   - Downgrade: Applies at next billing cycle
   - Add-on purchase: Instant feature activation
4. **Retry & recovery logic**:
   - Failed downloads get 3 retry attempts (no quota charge)
   - Each retry invalidates previous link
   - Manual support override for edge cases
   - Bulk retry for multiple failures

### 5.5 Subscription State Machine

#### States and Transitions

```
Active → Past Due → Grace → Suspended → Active (on recovery)
   ↓                              ↑
   └────── Canceled ──────────────┘
```

#### State Definitions

- **Active**: Full access, normal quota resets, no warnings
- **Trial**: Time-limited full access (7 days), conversion prompts
- **Past Due**: Payment failed, yellow warnings, full access maintained
- **Grace** (3 days): Orange warnings, countdown timer, deprioritized support
- **Suspended**: Red alerts, downloads blocked, read-only access
- **Canceled**: Voluntary cancellation, immediate downgrade to free

#### UI Requirements by State

- **Header indicator**: Colored badge with state name
- **Dashboard widget**: Detailed status with action buttons
- **Modal overlays**: State-specific messaging during critical actions
- **Email campaigns**: Automated sequences per state transition

#### State Persistence

- Store in `UserProfile.subscriptionState` enum
- Log all transitions in `SubscriptionEvent` table
- Cache state in Worker (5 min TTL)
- Include in all `/api/me` responses

### 5.6 Stripe Event Handling

#### Webhook Processing Pipeline

1. **Ingestion Layer**:
   - Verify Stripe signature (reject if invalid)
   - Check idempotency key for duplicates
   - Store raw payload in `SubscriptionEvent` table
   - Return 200 immediately (avoid timeout)
2. **Processing Queue**:
   - Background worker polls outbox table
   - Process events in order (FIFO per customer)
   - Update `UserProfile` based on event type
   - Trigger state machine transitions
3. **Event Handlers**:
   - `checkout.session.completed`: Activate subscription
   - `invoice.payment_succeeded`: Extend plan, reset quotas
   - `invoice.payment_failed`: Transition to Past Due
   - `customer.subscription.updated`: Handle plan changes
   - `customer.subscription.deleted`: Move to Canceled state
4. **Retry & Recovery**:
   - Exponential backoff: 1s, 5s, 30s, 5m, 30m
   - Dead letter queue after 5 attempts
   - Manual retry interface in admin
   - Alert on repeated failures (PagerDuty/Slack)

### 5.7 Error & Retry UX

#### Error State Specifications

1. **Network Errors**:
   - Show inline retry button (no modal)
   - Preserve form state in localStorage
   - Auto-retry with exponential backoff
   - Offline queue for non-critical actions
2. **Quota Exceeded**:
   - Visual quota timeline display
   - Exact reset time in user timezone
   - One-click upgrade path
   - Email notification option for reset
3. **Plan Expired/Suspended**:
   - Full-screen takeover with clear CTA
   - Payment update form inline
   - Support contact prominently displayed
   - Data export still allowed
4. **Server Errors (5xx)**:
   - Generic friendly message
   - Auto-reported to monitoring
   - Reference ID for support
   - Status page link

#### Retry Mechanisms

- Downloads: 3 attempts per link, no quota charge
- API calls: Automatic retry for idempotent operations
- Payments: Manual retry with saved card
- Form submissions: Draft saved locally

## 6. Pricing & Plans

Market scan (UI8, Framer Marketplace, Flowbase, Gumroad sellers) shows:

- Single templates: $29–$99.
- Subscription clubs: $12–$29/month, often unlimited downloads.
- Lifetime bundles: $199–$599 with ongoing updates.

Recommended tiers:

- `day-pass` — $12 one-time, 4 downloads in 24h.
- `solo-monthly` — $24/month, 6 downloads/day, 1 template request/month.
- `studio-monthly` — $49/month, 15 downloads/day, 3 template requests/month, favorites collection.
- `agency-monthly` — $89/month, 40 downloads/day, 8 template requests/month, priority support (typical response within 12–24h).
- `lifetime-core` — $249 one-time, 8 downloads/day, 30 template requests lifetime, ongoing catalogue updates (targets 48h responses).
- `lifetime-plus` — $499 one-time, 20 downloads/day, unlimited template requests, dedicated support channel (24h typical).

Add-ons & promos:

- Fast Turnaround add-on (+$19/month) prioritizes template requests with typical response within 24h; clarify this is a best-effort SLA for a solo operator.
- Launch coupons (EARLYBIRD30) & flash deals; track `promoBadge` on Plan.
- Annual billing with ~2 months free (Solo $240/yr, Studio $480/yr).

## 7. Operations & Reliability

- Hosting: Strapi on managed platform with rolling deploys, >=2 instances.
- Database: Managed Postgres with nightly snapshots + PITR; documented restore procedure.
- R2: Versioning enabled; weekly exports to secondary storage (e.g., Backblaze B2).
- Monitoring: SLO dashboard for uptime/latency. Health endpoints `/healthz`, `/__edge-status`.
- Incident response: Alerts on webhook failures, quota lock contention, R2 errors.
- Cost optimization: Cache catalogue in Worker (5m TTL), consider Redis/memory cache for frequently accessed metadata.

## 8. UI Component Specifications

### Critical Components

#### Template Card

```typescript
interface TemplateCardProps {
  template: Project
  quotaRemaining: number
  userPlan: Plan
  isFavorited: boolean
  onFavorite: () => void
  onDownload: () => void
}
```

- Hover state: Video preview auto-plays
- Badge positioning: Plan requirement top-left, quota bottom-right
- Accessibility: Full keyboard navigation, ARIA labels
- Loading states: Skeleton while fetching, optimistic updates

#### Subscription State Banner

```typescript
interface StateBannerProps {
  state: "active" | "trial" | "past_due" | "grace" | "suspended"
  daysRemaining?: number
  onAction: () => void
}
```

- Color coding: Green/Blue/Yellow/Orange/Red by state
- Persistent across all pages when not active
- Dismissible for active state only
- Countdown timer for grace period

#### Download Modal

```typescript
interface DownloadModalProps {
  template: Project
  quota: QuotaInfo
  onConfirm: () => void
  onCancel: () => void
}
```

- Progressive disclosure: Basic info → Details on expand
- Auto-copy functionality with fallback
- Download progress indication
- Error recovery UI inline

#### Search Component

```typescript
interface SearchProps {
  onSearch: (query: string) => void
  suggestions: string[]
  recentSearches: string[]
}
```

- Debounced input (300ms)
- Instant suggestions dropdown
- Recent searches in localStorage
- Clear button and ESC to reset

### Design System Requirements

#### Colors (Dark Mode First)

```css
--primary: #8b5cf6; /* Purple */
--success: #10b981; /* Green */
--warning: #f59e0b; /* Orange */
--danger: #ef4444; /* Red */
--info: #3b82f6; /* Blue */
--background: #0f0f0f; /* Near black */
--surface: #1a1a1a; /* Raised surface */
--text-primary: #f3f4f6; /* Light gray */
--text-secondary: #9ca3af; /* Mid gray */
```

#### Typography

- Font: Inter for UI, JetBrains Mono for code
- Scale: 12/14/16/18/20/24/32/48px
- Line height: 1.5 for body, 1.2 for headings
- Letter spacing: -0.02em for headings

#### Spacing System

- Base unit: 4px
- Scale: 4/8/12/16/20/24/32/48/64/96px
- Consistent padding: 16px mobile, 24px desktop
- Card gap: 16px mobile, 24px desktop

#### Breakpoints

```css
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1440px;
```

## 9. Testing & QA

### Test Coverage Requirements

- Unit tests: 80% coverage minimum
  - Strapi services: Quota calculations, state transitions
  - React components: User interactions, error states
  - Worker functions: Caching, rate limiting
- Integration tests:
  - API endpoints with database
  - Stripe webhook processing
  - Authentication flows
- E2E tests (Playwright):
  - Critical paths: Signup → Purchase → Download
  - Error scenarios: Payment failure, quota exceeded
  - Mobile and desktop viewports

### Testing Strategy

```javascript
// Example E2E test
test("download flow with quota enforcement", async ({ page }) => {
  await page.goto("/templates/premium-template")
  await page.click('[data-testid="download-btn"]')
  await expect(page.locator('[data-testid="quota-display"]')).toBeVisible()
  await page.click('[data-testid="confirm-download"]')
  await expect(page.locator('[data-testid="success-toast"]')).toContainText(
    "Download started"
  )
})
```

### Performance Benchmarks

- Page load: <3s on 3G
- Time to interactive: <5s
- API response: p95 <500ms
- Download initiation: <2s
- Search results: <300ms

### CI/CD Pipeline

```yaml
# GitHub Actions workflow
- Lint & format check
- Type checking
- Unit tests with coverage
- Build all apps
- Integration tests
- E2E tests on staging
- Performance tests
- Deploy to preview
- Manual approval for production
```

## 9. Security & Compliance

- Immutable audit trail for downloads/subscription changes/admin actions.
- GDPR/CCPA: user data export/delete, documented retention (delete inactive users after 24 months), cookie/analytics consent.
- Dependency scanning, periodic security reviews (OWASP checklist).

## 10. Analytics & Growth

- Implement PostHog or Plausible for funnel tracking; key events: signup, checkout start/complete, download success/fail, template request submit, plan upgrade.
- Feature flag service (GrowthBook) for pricing/CTA experiments.
- Weekly KPI digest email (downloads by plan, churn, revenue, request backlog).

## 11. Roadmap & Phasing

1. **Phase 0**: Provision hosting (Strapi, Postgres), Cloudflare assets (Pages, Worker, R2), Stripe products, logging/monitoring, backup policies.
2. **Phase 1**: Implement data model, auth, catalogue listing, daily quota enforcement, download logging, pricing page.
3. **Phase 2**: Template requests, account dashboard, favorites, analytics instrumentation.
4. **Phase 3**: Promotions/coupons, add-on purchase flow, failure/retry UX, webhook retry queue.
5. **Phase 4**: Admin tooling, A/B testing, multi-region caching, growth experiments.

## 12. API Endpoint Specifications

### Public Endpoints (No Auth)

- `GET /api/projects` - List templates with filtering
- `GET /api/projects/:slug` - Template detail page
- `GET /api/plans` - Pricing information
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/verify-email` - Email verification

### Authenticated Endpoints

- `GET /api/me` - User profile with plan/quota
- `POST /api/me/refresh` - Force cache refresh
- `PATCH /api/me/preferences` - Update timezone/theme
- `POST /api/downloads` - Initiate download
- `POST /api/downloads/:id/complete` - Mark download complete
- `POST /api/downloads/:id/retry` - Retry failed download
- `GET /api/downloads/history` - Download history
- `POST /api/favorites/toggle` - Add/remove favorite
- `GET /api/favorites` - List favorites
- `POST /api/template-requests` - Submit request
- `GET /api/template-requests` - List user's requests
- `POST /api/stripe/create-checkout-session` - Start purchase
- `POST /api/stripe/create-portal-session` - Billing management

### Admin Endpoints

- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id` - Update user
- `GET /api/admin/template-requests` - All requests
- `PATCH /api/admin/template-requests/:id` - Update status
- `GET /api/admin/analytics` - Platform metrics
- `POST /api/admin/support-tickets` - Create ticket

### Webhook Endpoints

- `POST /api/webhooks/stripe` - Stripe events
- `POST /api/webhooks/status` - Status page updates

## 13. Mobile & Progressive Web App

### Mobile-First Considerations

- **Touch interactions**: 44px minimum touch targets
- **Gesture support**: Swipe galleries, pull-to-refresh
- **Bottom sheets**: Replace center modals on mobile
- **Thumb zones**: Primary actions in lower third
- **Offline mode**: Service worker for catalogue caching

### PWA Implementation

```javascript
// Service Worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

// Manifest.json
{
  "name": "Framer Templates Platform",
  "short_name": "Templates",
  "display": "standalone",
  "theme_color": "#8B5CF6",
  "background_color": "#0F0F0F"
}
```

### App Install Prompt

- Show after 3 visits or 1 download
- Dismissible with "Not now" option
- Re-prompt after 30 days

## 14. Monitoring & Analytics

### Key Metrics

- **Business**: MRR, churn rate, LTV, CAC
- **Product**: Activation rate, feature adoption, NPS
- **Technical**: Uptime, response times, error rates
- **User**: Session duration, pages/session, bounce rate

### Monitoring Stack

- **APM**: Sentry for errors, New Relic for performance
- **Logs**: Logtail aggregation, CloudWatch for AWS
- **Uptime**: BetterUptime with status page
- **Analytics**: PostHog for product, Plausible for web

### Alerting Thresholds

- Payment failures: Alert after 3 in 1 hour
- Quota lock timeouts: Alert after 5 in 5 minutes
- API latency: Alert if p95 > 1s
- Error rate: Alert if > 1% of requests

## 15. Open Questions & Decisions

### Immediate Decisions Needed

- Grace period length: 3 days sufficient or need 5?
- Free tier: Offer limited free plan or trials only?
- Mobile app: Native apps or PWA sufficient?
- Trial period: Offer 7-day trial before payment?

### Future Considerations

- Team accounts: Multi-seat plans needed?
- API access: Public API for enterprise customers?
- White-label: Allow custom branding for agencies?
- Affiliate program: Revenue sharing for referrals?
- Localization: Which languages to support first?

### Infrastructure Choices

- **Strapi hosting**: Fly.io (recommended), Railway, Render?
- **Database**: Supabase, PlanetScale, Neon, RDS?
- **CDN**: Cloudflare (chosen), alternatives?
- **Email**: SendGrid, Postmark, AWS SES?
- **SMS**: Twilio for 2FA or email only?

Review and update this document as requirements evolve and decisions are made.
