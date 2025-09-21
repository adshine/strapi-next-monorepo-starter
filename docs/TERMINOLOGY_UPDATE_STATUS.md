# Terminology Update Status

## Current Situation

As of 2024-01-20, the platform has been updated to use "remix" terminology throughout, correctly reflecting that Framer templates are **remixed** (duplicated in user's Framer account), not downloaded as files.

## Completed ✅

1. Created `CLAUDE.md` with terminology guidelines
2. Created `docs/schema-migration-plan.md` for database field renames
3. Updated project schema description in Strapi
4. Added Task Master task #62 for tracking migration
5. Created `docs/terminology-update-guide.md` with comprehensive update list

## Completed ✅

1. Updated all documentation files to use "remix" terminology
2. Updated platform user flows and implementation specs
3. Updated UI component specifications and interfaces
4. Updated API endpoint specifications
5. Updated test examples and error handling

## Remaining Work 🚧

### Critical User-Facing Updates (38 files)

- **UI Components**: 4 files (`download-modal.tsx`, `app-header.tsx`, etc.)
- **Pages**: 6 files (dashboard, templates, pricing pages)
- **API Routes**: 2 files (`/api/download/[projectId]`)
- **Type Definitions**: 3 files (auth.ts, templates.ts)
- **Hooks & Lib**: 7 files
- **Tests**: 4 files
- **Backend**: 12 files (comment-only updates)

### Estimated Effort

- **Small** (1-2 hours): Update user-facing strings in existing files
- **Medium** (2-4 hours): Rename components and update imports
- **Large** (4-8 hours): Update API routes, types, and all references

## Recommended Approach

### Phase 1: Quick Wins (Do Now)

1. Update all button/CTA text from "Download" to "Remix"
2. Update page titles and headings
3. Update dashboard labels
4. Add TODO comments to backend files

### Phase 2: Component Updates

1. Rename download-modal to remix-modal
2. Update modal content and behavior
3. Update navigation labels

### Phase 3: Route & Type Updates

1. Create new API routes with correct names
2. Deprecate old routes
3. Update type definitions
4. Update all imports

### Phase 4: Backend Preparation

1. Add field aliases in Strapi
2. Document migration plan
3. Prepare dual-write logic

## Why This Matters

- **User Confusion**: "Download" implies getting files, but users get Framer project access
- **Brand Alignment**: Framer uses "Remix" terminology officially
- **Accuracy**: Reflects actual functionality of the platform
- **Future-Proofing**: Aligns terminology before platform scales

## Next Steps

1. Get approval for terminology change
2. Update user-facing strings first (low risk)
3. Plan component/route renames for next sprint
4. Schedule database migration for major release

## Files Needing Immediate Attention

These files have the most user-visible "download" references that need to be updated to "remix":

1. `apps/ui/src/app/[locale]/dashboard/downloads/page.tsx` - Entire page about "downloads" → "remixes"
2. `apps/ui/src/components/download-modal.tsx` - Primary user action modal → "remix modal"
3. `apps/ui/src/app/[locale]/templates/[slug]/page.tsx` - Template detail page CTA → "Remix Template"
4. `apps/ui/src/app/[locale]/pricing/page.tsx` - Pricing page features → "remix limits"
5. `apps/ui/src/components/ui/app-header.tsx` - Navigation menu → "My Templates" or "Remixes"

---

_Note: This is a breaking change for any external consumers of the API. Proper deprecation notices and migration period required._
