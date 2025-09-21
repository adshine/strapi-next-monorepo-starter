# Schema Migration Plan: Download → Remix Terminology

## Overview
This document outlines the plan to migrate from "download" terminology to "remix" terminology throughout the Framer Template Platform.

## Phase 1: Documentation & UI Copy (COMPLETED)
- ✅ Created CLAUDE.md with terminology guidelines
- ✅ Updated project schema description
- ⏳ Update UI components and user-facing strings
- ⏳ Update API documentation

## Phase 2: Database Schema Migration (PLANNED)

### Fields to Rename

#### Project Collection
- `downloadUrl` → `remixUrl` or `accessUrl`
- `downloadCount` → `remixCount` or `useCount`

#### Download Log Collection
- Collection name: `download-log` → `template-access-log` or `remix-log`
- Field: `downloadId` → `accessId` or `remixId`
- Field: `downloadDuration` → `accessDuration`
- Field: `downloadedAt` → `accessedAt`

#### User Profile Collection
- `monthlyDownloadsUsed` → `monthlyTemplateAccesses`
- `monthlyDownloadsLimit` → `monthlyTemplateLimit`

#### Plan Collection
- `monthlyDownloadLimit` → `monthlyTemplateLimit`
- `downloadQuota` → `templateQuota`

### API Endpoints to Update
- `/api/download-logs` → `/api/template-access` or `/api/remix-logs`
- `/api/projects/:id/download` → `/api/projects/:id/remix` or `/api/projects/:id/access`

## Phase 3: Code Updates (PLANNED)

### Backend Updates
1. Create new field aliases in Strapi models
2. Update all service methods to use new terminology
3. Update webhook handlers and background jobs
4. Add deprecation warnings for old field names
5. Create migration script for existing data

### Frontend Updates
1. Update all API client methods
2. Update component props and state variables
3. Update analytics tracking events
4. Update error messages and notifications

## Migration Strategy

### Step 1: Add New Fields (Non-Breaking)
```javascript
// Add new fields alongside old ones
{
  downloadUrl: "...", // Deprecated
  remixUrl: "...",    // New field, same value

  downloadCount: 0,   // Deprecated
  remixCount: 0       // New field, same value
}
```

### Step 2: Dual Write Period
- Write to both old and new fields
- Read from old fields by default
- Allow opt-in to new fields via feature flag

### Step 3: Switch Primary Fields
- Switch reads to new fields
- Continue writing to both
- Monitor for issues

### Step 4: Deprecate Old Fields
- Stop writing to old fields
- Add deprecation warnings
- Provide migration timeline

### Step 5: Remove Old Fields
- Run final data migration
- Remove old field definitions
- Clean up compatibility code

## Timeline
- **Q1 2024**: Documentation and UI copy updates (IN PROGRESS)
- **Q2 2024**: Add new fields, begin dual-write
- **Q3 2024**: Switch to new fields as primary
- **Q4 2024**: Deprecate and remove old fields

## Backwards Compatibility
- Maintain old field names for 6 months minimum
- Provide clear migration guides for API consumers
- Support both field names during transition period

## Testing Plan
1. Unit tests for field aliasing
2. Integration tests for dual-write logic
3. E2E tests for user flows with new terminology
4. Load testing for migration scripts
5. Rollback procedures for each phase

## Notes
- Current schema uses "download" fields but platform provides Framer remix links
- No actual files are downloaded - users duplicate templates in Framer
- This migration aligns database schema with actual functionality

---

*Last Updated: 2024-01-20*
*Status: Phase 1 In Progress*