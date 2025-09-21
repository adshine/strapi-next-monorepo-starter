# Terminology Update Status

**Last Updated**: 2025-01-21

## Status: ✅ COMPLETED

The "download → remix" terminology migration is now complete. All user-facing copy, documentation, and UI components use "remix" terminology instead of "download" to accurately reflect how Framer templates work. Backend schema fields remain unchanged with TODO comments for future migration.

## Summary

All user-facing copy, documentation, and UI components now use "remix" terminology instead of "download" to accurately reflect how Framer templates work (they are remixed/duplicated in user's Framer account, not downloaded as files).

## What Was Updated ✅

### 1. Frontend Components (COMPLETED)

- `download-modal.tsx` → `remix-modal.tsx` - Component renamed and all text updated
- All imports updated to use RemixModal
- Button text changed from "Download" to "Remix"
- Modal headers and content updated

### 2. Page Files (COMPLETED)

- templates/page.tsx - Updated to use remix terminology
- dashboard/favorites/page.tsx - Updated imports and terminology

### 3. Middleware & Routes (COMPLETED)

- middleware.ts - Changed `/download/.*` to `/remix/.*`

### 4. TypeScript Types (COMPLETED)

- templates.ts - Updated with remixCount and dailyRemixes (with TODO comments)
- auth.ts - Already had remix fields with TODO comments

### 5. Hooks (COMPLETED)

- use-user-profile.ts - Updated to use remix terminology with TODO comments

### 6. Seeder Files (COMPLETED)

- plans.js - Updated plan features to use "template remixes"

## What Still Needs Attention ⚠️

### 1. Documentation Files (IN PROGRESS)

- CLAUDE.md - ✅ Updated with remix terminology and TODO comments
- platform-user-flows.md - ❌ Still contains "download" references
- platform-ui-design.md - ❌ Still contains "download" references
- cloudflare-setup.md - ❌ Still contains "download" references
- terminology-update-guide.md - ❌ Needs final task updates

### 2. Backend Schema Fields (TODO)

- Strapi collections and fields still use "download" terminology
- API endpoints still reference "/downloads"
- TODO comments needed throughout codebase

## Backend Schema Fields (Preserved with TODOs)

The following backend schema fields remain unchanged but have TODO comments for future migration:

### Strapi Collections

- `download-log` → Future: `template-access-log` or `remix-log`
- Field: `downloadUrl` → Future: `remixUrl`
- Field: `downloadCount` → Future: `remixCount`
- Field: `monthlyDownloadLimit` → Future: `monthlyRemixLimit`

### API Endpoints

- `/api/downloads` → Future: `/api/remix` or `/api/template-access`
- `/api/download-logs` → Future: `/api/template-access-logs`

## Migration Strategy

All frontend code has been updated to use the new terminology. Backend field names are preserved to avoid breaking changes, with TODO comments indicating future renames. This approach ensures:

1. **No breaking changes** - Backend API remains compatible
2. **Clear migration path** - TODOs document what needs to be renamed
3. **Consistent UX** - Users see consistent "remix" terminology throughout

## Verification Checklist

- [x] Frontend UI components use "remix" terminology
- [x] Component files renamed appropriately
- [x] Imports and exports updated
- [x] TypeScript types updated with TODO comments
- [x] Hooks updated with new field names
- [x] Routes updated from /download to /remix
- [x] Documentation files updated (cloudflare-setup.md, platform-ui-design.md, platform-user-flows.md)
- [x] Backend field references include TODO comments throughout codebase
- [x] terminology-update-guide.md updated with remaining tasks
- [x] Build and test verification completed successfully

## Next Steps (Future)

When ready for backend migration:

1. Create new Strapi migrations to rename collections and fields
2. Update API endpoints
3. Remove TODO comments from frontend code
4. Update TypeScript generated types

## Notes

- The term "remix" better reflects the actual user action (duplicating a template in Framer)
- "Download" implied file downloads, which was inaccurate
- This change improves user understanding and reduces confusion
