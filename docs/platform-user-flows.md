# Platform User Flows

This document maps end-to-end flows for the subscription-gated Framer template platform. It covers primary personas and the journeys that need to be implemented across the Next.js UI, Strapi backend, Cloudflare Worker gateway, and Stripe billing stack.

## Personas

- **Visitor**: Unauthenticated user discovering templates and pricing.
- **Prospective Subscriber**: Registered user without an active plan who is evaluating or purchasing access.
- **Active Subscriber**: Authenticated user with a current plan (day pass, monthly tier, or lifetime) who remixes templates and submits requests.
- **Admin**: Operator managing catalogue content, plans, and request fulfillment inside Strapi.

## 1. Visitor Browsing → Signup

1. Visitor lands on landing/catalogue page via marketing link or search engine.
2. Worker serves cached catalogue data; UI shows featured templates with search bar, filters, and pricing CTA.
3. Visitor clicks template card → navigates to dedicated detail page at `/templates/[slug]` (SEO-friendly, shareable URL).
4. Detail page shows:
   - Full template preview with live demo link or embedded video
   - Version history and changelog
   - Required plan badge with comparison link
   - Remix count and user ratings (if available)
   - Related templates section
5. Visitor clicks "Remix" or "Get access" → auth wall appears as accessible modal overlay.
6. Modal offers simple options:
   - Email/password registration with strength indicator
   - "Already have account?" login link
7. Form submission includes:
   - Email verification requirement (sends 6-digit code)
   - Optional newsletter opt-in
   - Timezone selection for quota management
8. On success → redirect to onboarding flow:
   - Welcome message with value proposition
   - Quick survey (use case, team size, discovery source)
   - Plan recommendation based on survey
   - Browse templates CTA with first-time user hints

## 2. Login & Session Validation

1. User opens login form with options:
   - Email/password with "Forgot password?" link
   - "Remember me" checkbox for extended sessions
2. On password reset request:
   - Email input → sends reset link valid for 1 hour
   - Link opens secure reset form with token validation
   - New password set with confirmation field
   - Auto-login on successful reset
3. On successful login:
   - Worker proxies to Strapi; validates credentials
   - NextAuth sets httpOnly cookie (7 days if "remember me", else session)
   - Worker caches `/api/me` response (20s TTL)
4. Post-login routing:
   - If deep-linked to template → return to template detail page
   - If no active plan → account dashboard with plan selection prompt
   - If active plan → last viewed page or dashboard
5. UI hydrates with user state:
   - Plan badge in header with quota remaining
   - Personalized recommendations based on remix history
   - Subscription state indicator (Active/Trial/Grace/Expired)

## 3. Plan Selection & Checkout

1. User opens pricing page with enhanced features:
   - Interactive calculator showing templates/month value
   - Plan comparison table with expandable feature details
   - "Most Popular" badge on recommended tier
   - Annual/monthly toggle showing savings
   - Add-ons section (Fast Turnaround for +$19/month)
2. Plan selection triggers:
   - Side panel preview of what user gets
   - Quota impact calculator for upgrades/downgrades
   - Pro-rated billing explanation if mid-cycle
3. Checkout initiation:
   - UI validates current quota usage (warns if downloads pending)
   - Calls `/api/stripe/create-checkout-session` with plan + billing period + add-ons
   - Shows loading state: "Preparing secure checkout..."
4. Stripe checkout experience:
   - Pre-filled email from user account
   - Payment method selection with saved cards (if returning)
   - Subscription summary with first charge amount
5. Post-payment processing:
   - Stripe redirects to `/account/thanks?session_id=xxx`
   - UI shows progressive status:
     - "Payment received" (0-5s)
     - "Activating your plan" (5-15s)
     - "Setting up your benefits" (15-30s)
     - "Almost ready..." (30-45s)
     - Escalation: "Taking longer than usual. Support notified." (45s+)
   - Background: polls `/api/me/refresh` every 2s for 45s max
6. On activation success:
   - Confetti animation with plan name
   - Quota summary card (daily/monthly limits)
   - Quick actions: "Browse Templates", "Remix History", "Invite Team" (if applicable)
   - Email confirmation sent with receipt
7. On timeout/failure:
   - Show support ticket auto-created with reference number
   - Direct line to support chat/email
   - "We'll activate within 30 minutes" guarantee

## 4. Template Discovery & Filtering

1. Active subscriber accesses enhanced discovery:
   - Global search with instant suggestions (templates, tags, descriptions)
   - Multi-select filters: categories, styles, industries, complexity
   - Sort options: newest, popular, recently updated, price tier
   - View toggles: grid (default), list (detailed), compact
2. Template cards show rich information:
   - Thumbnail with hover video preview
   - Title, category, and description excerpt
   - Required plan badge (highlighted if user lacks access)
   - Remix count and freshness indicator
   - Remaining daily quota badge (e.g., "3 remixes left today")
   - Favorite heart icon (tier-gated with tooltip if unavailable)
3. Search and filter behavior:
   - URL updates for shareable filtered views
   - "No results" state suggests removing filters or browsing similar
   - Recent searches saved locally
   - Filter combinations cached by Worker (5 min TTL)
4. Favorites management (Studio tier and above):
   - Heart icon toggles with optimistic UI update
   - POST `/api/favorites` with debouncing for multiple quick toggles
   - Favorites section in account shows collections
   - "Upgrade to use favorites" upsell for lower tiers

## 5. Remix Flow (Quota-Enforced)

1. User clicks "Remix template" with smart pre-validation:
   - Button shows quota state: "Remix (3 left today)"
   - Disabled with tooltip if quota exhausted
   - Warning badge if last remix of the day
2. Remix confirmation modal displays:
   - Template name and version
   - File size estimate
   - Current quota usage bar (visual)
   - "After this: X remixes remaining until [reset time]"
   - Checkbox: "Add to remix queue" (for bulk operations)
3. On confirmation:
   - UI immediately shows "Preparing remix..." spinner
   - POSTs `/api/remix` with projectId + CSRF token
   - Optimistic UI: decrements quota badge
4. Backend processing:
   - Worker validates session and rate limits
   - Strapi service with transaction:
     - Locks UserProfile row (with timeout handling)
     - Validates plan state and quota
     - Creates TemplateAccessLog entry
     - Generates signed R2 URL (15-minute expiry, 3 attempts allowed)
     - Updates counters atomically
5. Success response handling:
   - Auto-copies link to clipboard
   - Shows non-modal toast: "Link copied! Remix starting..."
   - Initiates remix in hidden iframe (better than new tab)
   - Updates remix history in background
6. Remix completion tracking:
   - Client sends POST `/api/remix/{id}/complete` when iframe loads
   - Marks TemplateAccessLog as completed for accurate analytics
   - Shows subtle success indicator in UI
7. Error recovery:
   - Network failure: "Remix interrupted" with retry button
   - Retry uses `/api/remix/{id}/retry` (no quota charge)
   - Expired link: auto-generates new one if within 1 hour
   - After 3 failed attempts: creates support ticket
8. Quota exceeded flow:
   - Modal shows visual quota timeline
   - Exact reset time in user's timezone
   - "Get more now" → plan upgrade
   - "Notify me" → email when quota resets
   - "Request exception" → template request flow

## 6. Template Request Submission

1. Entry points for template requests:
   - "Request custom template" in main nav (if quota available)
   - "Can't find what you need?" on search no-results
   - "Request this style" on similar template pages
   - Dashboard card showing request quota remaining
2. Request form with guided fields:
   - Title (required, auto-suggests based on typing)
   - Category selection (matches existing taxonomy)
   - Description (rich text with examples)
   - Reference links (up to 3, with preview fetch)
   - Use case explanation (helps prioritization)
   - Urgency selector with SLA display:
     - Standard: 48-72 hours (included)
     - Priority: 24 hours (requires Fast Turnaround add-on)
     - Rush: 12 hours (additional fee)
   - File attachments (mockups, brand guides)
3. Pre-submit validation:
   - Shows quota usage: "This will be request 2 of 3 this month"
   - Duplicate check: "Similar request found - view instead?"
   - SLA calculator based on plan and add-ons
4. Submission processing:
   - POST `/api/template-requests` with all form data
   - Optimistic UI: shows "Submitting..." then ticket number
   - Backend creates request, sends notifications
5. Post-submission experience:
   - Success page with:
     - Request ID and tracking link
     - Expected delivery time with countdown
     - "What happens next" timeline
     - Related templates to browse meanwhile
   - Email confirmation with same details
6. Status tracking in dashboard:
   - Request card with status badge (New/In Review/In Progress/Ready/Delivered)
   - Real-time updates via websocket or polling
   - Comment thread with admin
   - One-click download when fulfilled

## 7. Account Dashboard Management

1. Dashboard URL structure:
   - `/account` - Overview
   - `/account/billing` - Subscription management
   - `/account/downloads` - History and retries
   - `/account/requests` - Template requests
   - `/account/settings` - Profile and preferences
   - `/account/favorites` - Saved templates (tier-gated)
2. Dashboard overview widgets:
   - **Subscription Status Card**:
     - Visual state indicator: Active (green), Trial (blue), Grace (yellow), Suspended (red)
     - Current plan name with upgrade prompt if applicable
     - Billing cycle end date and auto-renewal status
     - Daily/monthly quotas with progress bars
     - Time until next quota reset in user timezone
   - **Quick Stats**:
     - Templates remixed this month
     - Requests submitted/remaining
     - Favorites saved (if available)
     - Account age and loyalty badge
   - **Recent Activity Feed**:
     - Last 5 remixes with one-click re-remix
     - Template request updates
     - New templates matching interests
3. Billing management (`/account/billing`):
   - Current subscription details with cost breakdown
   - Add-ons management (add/remove Fast Turnaround)
   - Billing period toggle (monthly ↔ annual with savings preview)
   - Payment method on file with update option
   - Invoice history with PDF downloads
   - "Manage in Stripe" for advanced options
4. Remix history (`/account/remixes`):
   - Filterable list (date range, status, template name)
   - Each entry shows:
     - Template thumbnail and name
     - Remix timestamp and status
     - Retry button if failed (within 24h)
     - "Remix again" if quota available
   - Bulk retry for failed downloads
   - Export history as CSV
5. Account settings (`/account/settings`):
   - **Profile**: Name, email, avatar, company
   - **Preferences**:
     - Timezone selection (affects quota reset)
     - Email notifications (requests, quota, updates)
     - Theme preference (light/dark/system)
     - Language selection
   - **Security**:
     - Password change
     - Two-factor authentication setup (optional)
     - Active sessions list with revoke
   - **Data & Privacy**:
     - Download my data
     - Delete account (with confirmation flow)

## 8. Favorites & Saved Items (Tier-Gated Feature)

1. Favorite interaction by plan:
   - **Solo/Day Pass**: Heart icon disabled with "Upgrade to save favorites" tooltip
   - **Studio and above**: Full favorites functionality unlocked
2. Adding to favorites:
   - User clicks heart icon → instant visual feedback (optimistic update)
   - Debounced POST to `/api/favorites/toggle` after 500ms
   - If fails, reverts visual state with error toast
3. Favorites management (`/account/favorites`):
   - Grid view of saved templates with sorting
   - Create collections (e.g., "Client Project", "Inspiration")
   - Bulk actions: remix multiple, remove from favorites
   - Share collection via private link (premium feature)
4. Smart recommendations:
   - "Since you liked X, try Y" suggestions
   - Email digest of updates to favorited templates
   - Priority notifications for favorited template updates

## 9. Payment Failure & Grace Period

1. Payment failure detection:
   - Stripe webhook received with `payment_failed` event
   - Strapi processes via outbox queue (idempotent)
   - User profile transitions: Active → Past Due → Grace Period
2. Immediate notifications:
   - Email: "Payment failed - action required" with retry link
   - Dashboard banner: Persistent yellow warning across all pages
   - Modal on next login explaining situation
3. Grace period experience (3 days default):
   - **Day 1**: Soft warnings, full access maintained
     - "Payment failed. Retry now to avoid disruption"
     - Download modal note: "Fix payment to maintain access"
   - **Day 2**: Increased urgency
     - Countdown timer in header: "48 hours until suspension"
     - Email reminder with one-click payment update
   - **Day 3**: Final warnings
     - Red banner: "Last day - service suspends at midnight"
     - Hourly email reminders
     - Download modal: "Final downloads before suspension"
4. During grace period features:
   - All downloads continue working with warnings
   - Template requests allowed but deprioritized
   - Cannot purchase add-ons or upgrade plan
   - Payment retry button prominent everywhere
5. Suspension (grace period expired):
   - Account state: Grace → Suspended
   - Access restrictions:
     - Downloads blocked with "Payment required" modal
     - Template requests disabled
     - Favorites read-only
     - Export data still allowed
   - Recovery CTA: "Reactivate with payment" everywhere
6. Payment recovery:
   - User updates payment method in Stripe portal
   - Successful charge triggers webhook
   - Account immediately reactivated
   - Quotas reset to plan limits
   - Success email: "Welcome back!" with summary

## 10. Admin Request Fulfillment

1. Admin logs into Strapi Admin panel.
2. Navigates to Template Requests collection; filters by status `new`.
3. Reviews request details, adds response notes, sets status to `in-progress` or `fulfilled`.
4. On save, Strapi webhook triggers optional notification (email/Slack) and UI surfaces status update to requester.
5. Admin may update `Project` entries or upload new version assets to R2 via Strapi.

## 11. Incident & Recovery Flows

### Service Degradation

- **Strapi partial outage**:
  - Worker serves cached catalogue data (extended 1hr TTL)
  - Read operations continue, writes queued
  - UI shows amber banner: "Some features delayed"
- **Complete Strapi failure**:
  - Static maintenance page with status.io embed
  - Email to affected users if >30 min
  - Auto-recovery when health checks pass

### Download Failures

- **Link expired (>15 min)**:
  - Modal: "Link expired - Generate new one?"
  - One-click refresh if within 1 hour of generation
  - After 1 hour: requires new quota check
- **Network interruption**:
  - Auto-resume supported via Range headers
  - Manual retry preserves download progress
  - After 3 failures: support ticket created
- **Quota sync issues**:
  - Optimistic UI with reconciliation
  - If mismatch detected: hard refresh from server
  - Manual quota refresh button in settings

### Session Management

- **Token expiry during action**:
  - Action queued in localStorage
  - Redirect to login with return URL
  - Auto-resume action post-login
- **Force logout scenarios**:
  - Password changed elsewhere
  - Suspicious activity detected
  - Manual "Sign out all devices"
- **Normal logout**:
  - Clears all cookies and localStorage
  - Invalidates Worker cache
  - Returns to homepage with "Signed out" toast

## 12. Analytics & Experiment Hooks

### Critical Events to Track

- **Discovery**: `search_performed`, `filter_applied`, `template_viewed`, `preview_played`
- **Conversion**: `auth_wall_shown`, `signup_started`, `signup_completed`, `email_verified`
- **Monetization**: `pricing_viewed`, `plan_selected`, `checkout_started`, `checkout_completed`, `addon_purchased`
- **Engagement**: `download_initiated`, `download_completed`, `download_failed`, `quota_exceeded`, `favorite_toggled`
- **Retention**: `grace_period_entered`, `payment_recovered`, `plan_upgraded`, `plan_downgraded`
- **Support**: `request_submitted`, `request_fulfilled`, `support_contacted`

### A/B Test Opportunities

- Pricing page layout and messaging
- Download limit presentation (daily vs monthly)
- Grace period length and messaging urgency
- Onboarding flow steps and survey
- Template card information density
- Search vs browse discovery paths

## 13. Mobile & Accessibility Requirements

### Mobile Experience

- **Responsive breakpoints**: 320px, 768px, 1024px, 1440px
- **Touch targets**: Minimum 44x44px
- **Gesture support**: Swipe for gallery, pull-to-refresh
- **Mobile-specific features**:
  - Bottom sheet modals instead of center modals
  - Thumb-reachable action buttons
  - Simplified navigation with hamburger menu
  - App download prompt for repeat visitors

### Accessibility Standards (WCAG 2.1 AA)

- **Keyboard navigation**:
  - Tab order matches visual hierarchy
  - Skip links for navigation
  - Esc closes modals, dropdowns
  - Enter/Space activates buttons
- **Screen readers**:
  - ARIA labels for all interactive elements
  - Live regions for status updates
  - Semantic HTML structure
  - Alt text for all images
- **Visual accessibility**:
  - 4.5:1 contrast ratio minimum
  - Focus indicators visible
  - No color-only information
  - Reduced motion option
- **Modal behavior**:
  - Focus trap when open
  - Returns focus on close
  - Announces title on open
  - Background scroll locked

## 14. Offline & Progressive Enhancement

- **Service worker caching**:
  - Cache catalogue data for offline browsing
  - Queue actions for sync when online
  - Show cached templates with "offline" badge
- **Progressive enhancement**:
  - Core functionality works without JavaScript
  - Enhanced features layer on top
  - Graceful degradation for older browsers
- **Network-aware UI**:
  - Detect slow connections
  - Offer reduced data mode
  - Preload critical resources

These flows represent the complete user journey with enhanced UX, accessibility, and recovery mechanisms. Regular updates should incorporate user feedback and analytics insights.
