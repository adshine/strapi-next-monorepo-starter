# Terminology Update Guide: Download → Remix

## Current Status: ✅ COMPLETED

All frontend UI components, user-facing text, documentation, and backend schema/endpoints now use remix/template-access terminology.

## Files Requiring Updates

### Priority 1: User-Facing UI Components & Pages

#### Pages

- [x] `apps/ui/src/app/[locale]/dashboard/downloads/page.tsx` → Updated page title to "Template History"
- [x] `apps/ui/src/app/[locale]/templates/page.tsx` → Updated copy to use "Remix" CTAs
- [x] `apps/ui/src/app/[locale]/templates/[slug]/page.tsx` → Updated "downloadCount" to "remixCount" and plan references
- [x] `apps/ui/src/app/[locale]/pricing/page.tsx` → Updated "dailyDownloadLimit" to "dailyRemixLimit" in plan features
- [x] `apps/ui/src/app/[locale]/dashboard/page.tsx` → Updated dashboard stats from "downloadsUsed" to "remixesUsed"
- [x] `apps/ui/src/app/[locale]/account/thanks/page.tsx` → Update success message

#### Components

- [x] `apps/ui/src/components/download-modal.tsx` → Rename to `remix-modal.tsx`, update all text
- [x] `apps/ui/src/components/ui/download-modal.tsx` → Rename to `ui/remix-modal.tsx`, update all text
- [x] `apps/ui/src/components/ui/app-header.tsx` → Updated navigation labels from "Downloads" to "My Templates"
- [x] `apps/ui/src/components/marketing/landing-page.tsx` → Marketing copy uses remix terminology

### Priority 2: API Routes & Types

#### API Routes

- [x] `apps/ui/src/app/api/remix/[projectId]/route.ts` → Updated with TODO comments for backend field renames
- [x] `apps/worker/src/handlers/remix.ts` → Already renamed from download.ts
- [x] `apps/ui/src/lib/api/projects.ts` → Methods now use remix terminology and endpoints

#### Type Definitions

- [x] `apps/ui/src/types/auth.ts` → Already updated to use `remixesToday`, `remixesReset`
- [x] `apps/ui/src/types/templates.ts` → Updated with TODO comments for backend field renames

### Priority 3: Hooks & Lib Functions

#### Hooks

- [x] `apps/ui/src/hooks/use-user-profile.ts` → Updated function name to `incrementRemixCount` and added TODO comments

#### Lib Functions

- [x] `apps/ui/src/lib/api/projects.ts` → No download references found (already clean)
- [x] `apps/ui/src/lib/api/plans.ts` → Added TODO comments for backend field names
- [x] `apps/ui/src/lib/api/user-profiles.ts` → Added TODO comments for backend field names
- [x] `apps/ui/src/lib/strapi-api/base.ts` → Added TODO comments for download-logs endpoint
- [x] `apps/ui/src/lib/files.ts` → Added TODO comment for future rename

### Priority 4: Middleware & Documentation

#### Middleware

- [x] `apps/ui/src/middleware.ts` → Already verified routes point to /remix

#### Documentation

- [x] `docs/cloudflare-setup.md` → Updated with "remix/access" wording and TODO comments
- [x] `docs/platform-ui-design.md` → Updated with "remix/access" wording and TODO comments
- [x] `docs/platform-user-flows.md` → Already updated (no download references found)
- [x] `docs/implementation/01-checklist.md` → Already updated (no download references found)
- [x] `docs/implementation/02-api-contracts.md` → Already updated (no download references found)
- [x] `docs/implementation/04-stripe-setup.md` → Already updated (no download references found)
- [x] `docs/implementation/05-infrastructure-setup.md` → Already updated (no download references found)

- Backend schema, controllers, services, and migrations have been renamed (e.g., `template-access-log`, `remixUrl`, `remixLockVersion`).

### Priority 5: Tests

- [x] `apps/ui/tests/e2e/checkout.spec.ts` → Test example updated in platform-implementation-spec.md
- [x] `apps/ui/tests/e2e/*` → Terminology updated where applicable

### Priority 6: Final Verification & Cleanup

- [x] Run final search for remaining "download" references in codebase (✅ Only backend TODOs remain)
- [x] Update helper utilities (e.g., `accessBlob`) to remix terminology
- [x] Run lint, test, and build to ensure everything passes

## Replacement Mapping

### General Terms

- "Download" → "Remix" or "Get Template"
- "Download Template" → "Remix Template"
- "Downloaded" → "Remixed" or "Accessed"
- "Downloads" → "Template Remixes" or "Templates Accessed"
- "Download Count" → "Remix Count" or "Times Remixed"
- "Download Limit" → "Template Limit" or "Remix Quota"
- "Monthly Downloads" → "Monthly Template Access"

### Button/CTA Text

- "Download Now" → "Remix Now"
- "Download Template" → "Remix in Framer"
- "Start Download" → "Open in Framer"
- "Download Free" → "Remix for Free"

### Navigation/Menu Items

- "Downloads" → "My Templates" or "Remixed Templates"
- "Download History" → "Template History" or "Remix History"
- "Download Center" → "Template Library"

### Dashboard/Stats

- "Downloads Today" → "Templates Accessed Today"
- "Download Quota" → "Template Quota"
- "Downloads Remaining" → "Templates Remaining"
- "Total Downloads" → "Total Remixes"

### Error Messages

- "Download failed" → "Failed to access template"
- "Download limit exceeded" → "Template quota exceeded"
- "Cannot download" → "Cannot access template"

### Success Messages

- "Download successful" → "Template ready to remix!"
- "Downloaded successfully" → "Template accessed successfully"
- "File downloaded" → "Template opened in Framer"

## Implementation Notes

1. **Phase 1**: Update all user-facing strings (UI copy, buttons, labels)
2. **Phase 2**: Update component and page file names
3. **Phase 3**: Update route names and API endpoints
4. **Phase 4**: Update type definitions and interfaces
5. **Phase 5**: Add deprecation comments to backend fields

**Update (2025-09-22)**: Backend migration is now COMPLETE:

- Database fields have been migrated (`remixUrl`, `remixCount`, `monthlyRemixesLimit`, `monthlyRemixesUsed`, `totalRemixes`)
- Strapi schema and types have been regenerated
- Frontend has been updated to use the new field names
- Migration script `apps/strapi/database/migrations/rename-download-to-remix.js` executed successfully
- All components, hooks, and API routes now use consistent remix terminology
