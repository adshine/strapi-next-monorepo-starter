# Terminology Update Guide: Download → Remix

## Files Requiring Updates

### Priority 1: User-Facing UI Components & Pages

#### Pages

- [ ] `apps/ui/src/app/[locale]/dashboard/downloads/page.tsx` → Rename to `/dashboard/templates` or `/dashboard/remixes`
- [ ] `apps/ui/src/app/[locale]/templates/page.tsx` → Update copy to use "Remix" CTAs
- [ ] `apps/ui/src/app/[locale]/templates/[slug]/page.tsx` → Update "Download" button to "Remix Template"
- [ ] `apps/ui/src/app/[locale]/pricing/page.tsx` → Change "downloads" to "template remixes" in plan features
- [ ] `apps/ui/src/app/[locale]/dashboard/page.tsx` → Update dashboard stats from "Downloads" to "Remixes"
- [ ] `apps/ui/src/app/[locale]/account/thanks/page.tsx` → Update success message

#### Components

- [ ] `apps/ui/src/components/download-modal.tsx` → Rename to `remix-modal.tsx`, update all text
- [ ] `apps/ui/src/components/ui/download-modal.tsx` → Rename to `ui/remix-modal.tsx`, update all text
- [ ] `apps/ui/src/components/ui/app-header.tsx` → Update navigation labels
- [ ] `apps/ui/src/components/marketing/landing-page.tsx` → Update marketing copy

### Priority 2: API Routes & Types

#### API Routes

- [ ] `apps/ui/src/app/api/download/[projectId]/route.ts` → Rename to `/api/remix/[projectId]` or `/api/access/[projectId]`
- [ ] `apps/worker/src/handlers/download.ts` → Rename to `remix.ts` or `access.ts`

#### Type Definitions

- [ ] `apps/ui/src/types/auth.ts` → Update `downloadsToday`, `downloadsReset` to `remixesToday`, `remixesReset`
- [ ] `apps/ui/src/types/templates.ts` → Update download-related types

### Priority 3: Hooks & Lib Functions

#### Hooks

- [ ] `apps/ui/src/hooks/use-user-profile.ts` → Update download quota references

#### Lib Functions

- [ ] `apps/ui/src/lib/api/projects.ts` → Update download methods to remix methods
- [ ] `apps/ui/src/lib/api/plans.ts` → Update plan feature descriptions
- [ ] `apps/ui/src/lib/api/user-profiles.ts` → Update profile quota fields
- [ ] `apps/ui/src/lib/strapi-api/base.ts` → Update endpoint references
- [ ] `apps/ui/src/lib/files.ts` → Update file handling methods if needed

### Priority 4: Backend/Strapi (Comment Only - No Rename)

These files should have comments added noting the planned rename, but field names remain unchanged:

#### Controllers & Services

- [ ] `apps/strapi/src/api/download-log/*` → Add comment: `// TODO: Rename to template-access-log`
- [ ] `apps/strapi/src/lifeCycles/download-log.ts` → Add migration comment
- [ ] `apps/strapi/src/api/stripe-webhook/controllers/stripe-webhook.ts` → Add field rename comments

### Priority 5: Tests

- [ ] `apps/ui/tests/e2e/checkout.spec.ts` → Update test descriptions and assertions
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
