# CLAUDE.md - Project Guidelines for Claude Code

## Framer Template Platform - Terminology Guide

### Important: Template Access Terminology

This platform provides **Framer templates** that users can **remix** directly in their Framer account. We DO NOT use "download" terminology for templates.

**Correct terminology:**

- ✅ "Remix template" / "Remix in Framer"
- ✅ "Access template" / "Get template"
- ✅ "Use template" / "Start with template"
- ✅ "Duplicate to your Framer account"
- ✅ "Template remix link"

**Incorrect terminology:**

- ❌ "Download template"
- ❌ "Download files"
- ❌ "Template download"

### Schema Migration Note

**TODO: Future Schema Updates**
The current Strapi schema uses legacy "download" field names that need to be renamed:

- `downloadUrl` → `remixUrl` or `accessUrl`
- `downloadCount` → `remixCount` or `useCount`
- `download-log` → `template-access-log` or `remix-log`

These field names remain unchanged in the database for now to avoid breaking changes. When referencing them in code, add comments noting the planned rename.

## Project Overview

This is a monorepo starter template combining:

- **Strapi v5**: Headless CMS backend with PostgreSQL
- **Next.js v15**: Frontend with App Router, Shadcn/ui, and TailwindCSS v4
- **Turborepo**: Monorepo management

The platform provides a marketplace for Framer templates where users can browse, preview, and remix templates based on their subscription tier.

## Key Concepts

### Template Access Flow

1. User browses template catalogue
2. User clicks "Remix Template" button
3. System checks user's subscription tier
4. If authorized, user receives a Framer remix link
5. User clicks link to duplicate template in their Framer account
6. System logs the template access (currently in `download-log` table)

### Subscription Tiers

- **Free**: Limited template access per month
- **Starter**: More templates, basic support
- **Professional**: Unlimited standard templates
- **Enterprise**: All templates plus premium support

### Template Types

Templates are Framer projects that users can:

- Preview via live demo links
- Remix using Framer's duplication system
- Customize completely in their Framer account
- Publish to their own domain

## Development Commands

```bash
# Development
yarn dev           # Start all services
yarn dev:ui       # Frontend only
yarn dev:strapi   # Backend only

# Build & Production
yarn build        # Build all apps
yarn start:ui     # Start production frontend
yarn start:strapi # Start production backend

# Code Quality
yarn lint         # Lint all code
yarn format       # Format with Prettier
yarn typecheck    # Type checking
```

## Architecture Notes

### Frontend (apps/ui)

- Uses server components by default
- Authentication via NextAuth.js
- Two API clients: PublicStrapiClient and PrivateStrapiClient
- Dynamic routing with locale support

### Backend (apps/strapi)

- Content types: projects, plans, user-profiles, template-access-logs
- Stripe webhook integration for subscriptions
- R2 storage for template assets (when needed)
- Row-level security for template access

### Important Files

- `apps/strapi/src/api/project/` - Template/project management
- `apps/strapi/src/api/download-log/` - Template access tracking (needs rename)
- `apps/ui/src/app/[locale]/templates/` - Template browsing UI
- `apps/ui/src/lib/strapi/` - API client implementation

## UI Copy Guidelines

When working on UI components:

1. Use "Remix" or "Get Template" for CTAs
2. Show "Remix in Framer" as the action description
3. Display "Templates accessed" instead of "Downloads" in user dashboards
4. Use "Template library" or "Template collection" instead of "Download center"

## Testing Template Access

```bash
# Create test user and subscription
curl -X POST http://localhost:1337/api/auth/local/register

# Access template (currently uses download-log endpoint)
curl -X POST http://localhost:1337/api/download-logs
# Note: This endpoint name will change to /api/template-access

# Check user's template access history
curl http://localhost:1337/api/users/me?populate=download_logs
```

## Future Improvements

1. **Schema updates**: Rename all "download" references to "remix" or "access"
2. **Analytics**: Track template remix success rates
3. **Versioning**: Support multiple versions of templates
4. **Categories**: Better template organization and filtering
5. **Preview enhancement**: Embedded Framer previews in modal

## Contributing

When adding new features:

- Always use "remix" terminology for Framer templates
- Comment any code using legacy "download" field names
- Update this document with new patterns or decisions
- Test template access flow end-to-end

---

_Last updated: 2024-01-20_
_Platform: Framer Template Marketplace_
