# Terminology Update Guide: Download → Remix

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

- [ ] `apps/ui/src/components/download-modal.tsx` → Rename to `remix-modal.tsx`, update all text
- [ ] `apps/ui/src/components/ui/download-modal.tsx` → Rename to `ui/remix-modal.tsx`, update all text
- [x] `apps/ui/src/components/ui/app-header.tsx` → Updated navigation labels from "Downloads" to "My Templates"
- [ ] `apps/ui/src/components/marketing/landing-page.tsx` → Update marketing copy

### Priority 2: API Routes & Types

#### API Routes

- [x] `apps/ui/src/app/api/remix/[projectId]/route.ts` → Updated with TODO comments for backend field renames
- [ ] `apps/worker/src/handlers/download.ts` → Rename to `remix.ts` or `access.ts`

#### Type Definitions

- [x] `apps/ui/src/types/auth.ts` → Already updated to use `remixesToday`, `remixesReset`
- [ ] `apps/ui/src/types/templates.ts` → Update download-related types

### Priority 3: Hooks & Lib Functions

#### Hooks

- [x] `apps/ui/src/hooks/use-user-profile.ts` → Updated function name to `incrementRemixCount` and added TODO comments

#### Lib Functions

- [x] `apps/ui/src/lib/api/projects.ts` → Updated function name to `trackRemix` and added TODO comments
- [x] `apps/ui/src/lib/api/plans.ts` → Added TODO comments for backend field names
- [x] `apps/ui/src/lib/api/user-profiles.ts` → Added TODO comments for backend field names
- [x] `apps/ui/src/lib/strapi-api/base.ts` → Added TODO comments for download-logs endpoint
- [x] `apps/ui/src/lib/files.ts` → Added TODO comment for future rename

### Priority 4: Backend/Strapi (Comment Only - No Rename)

These files should have comments added noting the planned rename, but field names remain unchanged:

#### Controllers & Services

- [x] `apps/strapi/src/api/download-log/*` → Already has TODO comments for renaming to template-access-log
- [x] `apps/strapi/src/lifeCycles/download-log.ts` → Added TODO comments throughout for field renames
- [x] `apps/strapi/src/api/stripe-webhook/controllers/stripe-webhook.ts` → Added field rename comments

### Priority 5: Tests

- [x] `apps/ui/tests/e2e/checkout.spec.ts` → Test example updated in platform-implementation-spec.md
- [ ] `apps/ui/tests/e2e/catalog.spec.ts` → Update catalog test copy
- [ ] `apps/ui/tests/e2e/templates-catalog.spec.ts` → Update template test copy
- [ ] `apps/ui/tests/e2e/pricing.spec.ts` → Update pricing test copy

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

**Important**: Keep database field names unchanged to avoid breaking changes. Only update:

- User-visible text
- Component/file names
- Route paths
- Variable names in frontend code
- Comments and documentation

Backend field names (`downloadUrl`, `downloadCount`, etc.) remain as-is with TODO comments for future migration.
