# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo starter template combining Strapi v5 (headless CMS) and Next.js v15 (frontend) managed with Turborepo. It provides a complete page builder system for enterprise applications.

## Commands

### Development

```bash
# Start all apps (UI on :3000, Strapi on :1337, DB on :5432)
yarn dev

# Start specific apps
yarn dev:ui       # Next.js only
yarn dev:strapi   # Strapi + DB

# Install dependencies (from root)
yarn
```

### Build & Production

```bash
# Build all apps
yarn build

# Build specific apps
yarn build:ui
yarn build:strapi

# Start production builds
yarn start:ui
yarn start:strapi
```

### Code Quality

```bash
# Lint all apps
yarn lint

# Format code
yarn format
yarn format:check

# Type checking (UI app)
cd apps/ui && yarn typecheck

# Commit with conventional commits
yarn commit
```

### Testing

```bash
# UI app - no test script defined yet
# Strapi app
cd apps/strapi && yarn test
```

## Architecture

### Monorepo Structure

- **apps/ui**: Next.js 15 App Router frontend with Shadcn/ui and TailwindCSS v4
- **apps/strapi**: Strapi v5 CMS backend with PostgreSQL
- **packages/design-system**: Shared styles and CkEditor configurations
- **packages/shared-data**: Common constants and values across apps
- **packages/eslint-config**: Shared ESLint configurations
- **packages/prettier-config**: Shared Prettier configuration
- **packages/typescript-config**: Shared TypeScript configurations

### Key Frontend Patterns

#### Data Fetching Architecture

Two Strapi API clients exist:

- **PublicStrapiClient**: For public content (uses STRAPI_REST_READONLY_API_KEY)
- **PrivateStrapiClient**: For authenticated requests (uses JWT tokens)

Both support:

- Direct server-side calls (default)
- Proxied client-side calls (set `useProxy: true`)

#### Page Builder System

- Dynamic catch-all route at `app/[locale]/[[...rest]]/page.tsx` renders Strapi pages
- Component mapping in `src/components/page-builder/index.tsx` links Strapi components to React components
- Pages use `fullPath` attribute for URL matching
- Root page has `fullPath` of `/`

#### Authentication

- NextAuth.js configured in `src/lib/auth.ts`
- Middleware in `src/middleware.ts` protects private routes
- Server: use `getAuth()` helper
- Client: use `useSession()` hook

### Key Backend Patterns

#### Page Hierarchy

- Pages organized with parent/child relations
- Automatic `fullPath` generation from slugs
- Background jobs for path recalculation and redirect creation

#### Document Middleware

- Deep population control via `middlewarePopulate` query parameter
- Configured in `apps/strapi/src/documentMiddlewares/page.ts`
- Avoids URL length issues with complex dynamic zones

#### Types Generation

- Strapi automatically generates TypeScript types in `types/generated/`
- Enables full type safety across frontend API calls
- Types regenerate on content type changes

## Environment Variables

### Critical Variables (Required for Build)

These must be set in `.env.local` and included in `turbo.json`'s `globalEnv`:

- `APP_PUBLIC_URL`: Frontend URL
- `STRAPI_URL`: Backend URL
- `STRAPI_REST_READONLY_API_KEY`: API token for public content

### API Token Setup

1. Go to Strapi Admin > Settings > API Tokens
2. Create Read-only token for public content
3. Create Custom token for mutations (if needed)

## Development Workflow

### Setting Up New Components

1. Add component in Strapi admin
2. Update component mapping in `src/components/page-builder/index.tsx`
3. If deep population needed, update `apps/strapi/src/documentMiddlewares/page.ts`

### Working with Localization

- Messages in `src/locales/` directory
- Server components: use `getTranslations()`
- Client components: use `useTranslations()`
- Navigation must use wrapped functions from `@/lib/navigation`

### Database Operations

```bash
# Strapi data management
cd apps/strapi
yarn strapi import -f strapi-export.tar.gz  # Import data
yarn export:all                              # Export all data
yarn export:content                          # Export content only
yarn config:dump                            # Export config
yarn config:restore                         # Import config
```

## Important Considerations

- **Type Safety**: All Strapi attributes typed as optional - handle nullability
- **Static Rendering**: Set `omitUserAuthorization: true` to enable static pages
- **Preview Mode**: Configure `STRAPI_PREVIEW_SECRET` (same for both apps)
- **Image Optimization**: Use `ImageWithBlur` or `ImageWithFallback` components
- **Error Handling**: Wrap Strapi components with `<ErrorBoundary>`
- **Middleware Population**: Update when adding new dynamic zone components
- **Auth Pages**: Located at `/auth/*` routes
- **Protected Routes**: Configured in `middleware.ts` `authPages` array
