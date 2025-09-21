# UI Look & Feel Guidelines

This document defines the visual language, color system, and layout principles for the Framer-template subscription platform. It builds on the product specification and user flows and should guide designers and developers when implementing or extending the interface.

## 1. Brand Experience Principles

## 1.1 Brand Assets

- **Logo**: Primary wordmark/icon stored at `apps/ui/public/images/FramerDogoLogo.svg`. Duplicate into `docs/assets/` if you maintain editable source files (e.g., AI/SVG with guides).
- **Favicon/App Icon**: Generate from the same mark (export 512px+ PNG) and place derivatives under `apps/ui/public/` (e.g., `/icons`).
- **Illustrations/Backgrounds**: Keep reusable imagery in `apps/ui/public/images/` with descriptive names (e.g., `hero-gradient.png`, `dashboard-preview.jpg`) and mirror source files in the docs folder for versioning.
- **Typography**: Verify licenses for `Neue Montreal`/`Inter Tight`; store font files (if self-hosted) under `apps/ui/public/fonts/` and reference in Tailwind config.

- **Creative Confidence**: Communicate that the catalogue contains premium, production-ready templates. Use high contrast, confident typography, and generous negative space.
- **Dark-First Professionalism**: Default theme is dark to mirror design tooling aesthetics (Framer, Figma). Light mode remains available but should feel like an alternate treatment.
- **Frictionless Productivity**: Surfaces should appear light and well-organized. Prioritize clarity over ornamental visuals, and signal actions strongly (clear CTAs, positive feedback loops).
- **Trust & Transparency**: Billing, quota, and plan information must be instantly legible. Reinforce trust through consistent iconography, informative tooltips, and discreet microcopy.

## 2. Color System

| Token              | Hex       | Usage                                                       |
| ------------------ | --------- | ----------------------------------------------------------- |
| `--bg-primary`     | `#0B0F14` | Page background, hero sections.                             |
| `--bg-elevated`    | `#111720` | Cards, modals, panels.                                      |
| `--bg-subtle`      | `#1A2230` | Secondary surfaces, list rows.                              |
| `--border-neutral` | `#1F2A3A` | Dividers, input borders, card outlines.                     |
| `--text-primary`   | `#F4F7FB` | Body text, large headings.                                  |
| `--text-muted`     | `#A3AEC2` | Secondary text, helper copy.                                |
| `--text-inverse`   | `#0B0F14` | Text on bright accents.                                     |
| `--accent-primary` | `#5B8CFF` | Primary CTAs, active states, template access confirmations. |
| `--accent-success` | `#4CD0A5` | Success, plan active states.                                |
| `--accent-warning` | `#FFC56D` | Quota warnings, billing grace period.                       |
| `--accent-danger`  | `#FF6B6B` | Errors, failed payments.                                    |
| `--accent-support` | `#AA7DFF` | Premium/lifetime badges, promos.                            |

Light mode maps the same palette with neutral backgrounds (`#F7FAFF`, `#FFFFFF`, `#E2E8F5`) and `--text-primary` flipped to `#151A28` while accents stay identical for brand recognition.

### Gradients & Glows

- Hero background: radial gradient `#111720` to `#0B0F14` with a soft overlay of `rgba(91, 140, 255, 0.35)` anchored to the top-left.
- Card hover glow: subtle outer shadow `0 12px 40px rgba(11, 15, 20, 0.65)` with inner border highlight `rgba(91, 140, 255, 0.3)`.
- CTA hover: overlay gradient from `#6D9CFF` to `#4F7EF5` with 2px glowing ring.

## 3. Typography

- **Display/Headline**: `Neue Montreal` (or `Inter Tight` fallback) — weights 600/700, tight tracking (-1.5%) for hero headings.
- **Body**: `Inter` — 400/500/600. Base size 16px (1rem) with 1.6 line-height.
- **Mono**: `IBM Plex Mono`, used for quota counters, plan code names, and feature flag tokens.
- **Hierarchy**:
  - H1: 48–56px (hero) bold.
  - H2: 32px semi-bold.
  - H3: 24px semi-bold.
  - Body Large: 18px medium for descriptive copy.
  - Body: 16px regular for content.
  - Caption: 12–14px for labels, quotas, helper text.

## 4. Layout & Spacing

- Grid: 12-column layout with 72px outer gutters on desktop, 32px on tablet, 20px on mobile.
- Section rhythm: 96px vertical spacing between major sections; 48px between minor blocks.
- Cards: 16px inner padding, 20px gap for grid; maintain consistent height ratios for template thumbnails.
- Sticky surfaces: Account sidebar and plan summary should remain fixed (max height 80% viewport) with subtle background blur.

## 5. Imagery & Preview Content

- Template thumbnails: 16:10 aspect ratio with rounded corners (18px). Use subtle border (`rgba(255,255,255,0.08)`) and apply hero/featured badge if relevant.
- Carousel/preview: Horz scroll with snap points; apply gradient overlays to fade edges.
- Use placeholder skeletons with shimmer while assets load (`rgba(26, 34, 48, 0.7)` to `rgba(17, 23, 32, 0.9)`).

## 6. Components Overview

- **Navigation Bar**: Transparent base blending with hero gradient; on scroll, apply blur (`backdrop-filter: blur(16px)`) and darkened background.
- **Hero CTA Block**: Large headline, supporting copy, primary CTA (`accent-primary`), secondary CTA (ghost style with `border-neutral`). Include inline quota preview for logged-in users.
- **Template Cards**: Layout includes thumbnail, title, maker, plan badge, remix CTA. On hover, reveal quick actions (favorite, preview, remix) with micro animation (scale 1.02).
- **Pricing Tiles**: Use `bg-elevated`, double border (outer `#1F2A3A`, inner `rgba(91, 140, 255, 0.3)` for featured plan). Show daily quota, requests, and support info with icon bullets.
- **Template Access Modal**: Elevated panel, progress timeline (request → signed link). Provide copy button with tooltip and open button. Include quota meter below.
- **Quota Meter**: Horizontal pill with gradient background and segmented ticks (journey from 0% to 100% of daily limit). For warning states, shift to `accent-warning` gradient.
- **Request Form**: Two-column on desktop; left column with instructions, right column with form fields. Use accent outlines on focus. Display quota badge top-right.
- **Dashboard**: Two-column layout — left summary card (plan, quota, next reset, manage billing), right tabbed content (remix history, template requests, favorites). Tabs use pill toggle with accent highlight.
- **Alerts/Banners**: Top-of-page banner for payment issues uses `accent-warning` background with darker text; includes CTA to manage billing.

## 7. Interaction & Motion

- Transition duration: 150ms ease-out for simple hovers; 250ms ease-in-out for modals/cards.
- Micro-interactions: CTA ripple on click (`scale 0.98` → `1`), favorite toggle uses spring animation with accent glow.
- Page transitions: fade+slide on route change (`opacity` 0→1, `translateY` 12px→0).
- Loading states: skeleton shimmer 1400ms loop; button loading uses inline spinner (`accent-primary`).

## 8. Dark ↔ Light Mode Behaviour

- Keep accent colors identical between modes.
- Light mode backgrounds: `#F7FAFF` primary, `#FFFFFF` elevated, `#E8EEF7` subtle.
- Border color shifts to `#CBD6EB`; text colors invert (`#151A28` primary, `#5A6785` muted).
- Maintain adequate contrast (WCAG AA) for all states; ensure accent text on light backgrounds remains legible (`#1E2A47`).

## 9. Accessibility & Inclusivity

- Minimum color contrast: 4.5:1 for text, 3:1 for large text and UI components.
- Focus states: 2px outline using `rgba(91, 140, 255, 0.75)` plus offset shadow for keyboard navigation.
- Provide text alternatives for all imagery and template previews.
- Support reduced motion by respecting `prefers-reduced-motion` and disabling non-essential animations.
- Use gender-neutral copy and inclusive imagery in hero and marketing content.

## 10. Responsive Behaviour

- Mobile nav: condensed menu sheet from top with blurred background.
- Cards stack vertically with horizontal scroll for quick access; CTAs become full-width.
- Dashboard collapses to single column; tabs convert to segmented control.
- Pricing tiles use vertical layout with plan details in accordions.
- Ensure remix modal adapts to 100% width on mobile with sticky action bar.

## 11. Support Visuals & Icons

- Icon set: Lucide (outline) styled with 1.5px stroke, `#A3AEC2`; active state uses `accent-primary` fill.
- Illustrations: abstract gradients and geometric shapes aligning with hero palette. Use sparingly to avoid distracting from template previews.
- Badges: Pill shape with `accent-support` background for premium statuses; use uppercase captions (12px).

## 12. Content Voice & Tone

- Tone: expert, encouraging, concise. Avoid jargon; highlight practical benefits (speed, quality, conversion lift).
- Microcopy: friendly but direct (e.g., “3 downloads left today”, “Reset in 6 hours”).
- Error messaging: explain cause + resolution (“Payment failed. Retry in Stripe billing portal or update card.”).
- Confirmation copy: celebrate success (“Link ready. Paste directly into Framer and start customizing.”).

## 13. Design Hand-off Expectations

- Provide Figma components mirroring Shadcn primitives with tokens aligned to CSS variables.
- Document variant states (default, hover, focus, disabled, loading) for each component.
- Include motion specs in Figma prototyping for key interactions (download modal, plan tile hover).
- Annotate spacing and grid specs in design files for developer reference.

## 14. Future Exploration

- Explore generative accent backgrounds that respond to selected plan tier.
- Investigate 3D preview frames for hero templates using WebGL or Lottie.
- Consider contextual help popovers with animated walkthroughs for first-time downloaders.

Align engineering implementation with these guidelines and revisit quarterly to reflect product updates and user feedback.

## 11. Iconography (Updated)

- Adopt the free [HugeIcons Outline](https://hugeicons.com/) set (personal license) for a modern, geometric outline style that complements FramerDojo’s minimal aesthetic. Review their terms periodically in case licensing changes; avoid premium icons unless a commercial upgrade is purchased.
- Integration options:
  - **SVG Sprite / Download**: Download the free outline pack and store frequently used glyphs in `apps/ui/public/icons/hugeicons/`. Inline `<svg>` snippets offer full control over stroke color and size.
  - **Iconify (Open Source)**: Use `@iconify/react` with names like `hugeicons:download-01-outline` to load icons from the free set without bundling the entire library. Ideal for Next.js + Tree shaking.
  - **Manual Curate**: For critical actions, hand-pick icons and import only the SVGs you need to minimize payload.
- Tailwind utilities: Extend theme with classes for icon sizing (e.g., `.icon-sm` 16px, `.icon-md` 20px, `.icon-lg` 24px, `.icon-xl` 32px). Set a default stroke width of `1.5px` in CSS.
- Color states: default `--text-muted` (`#A3AEC2`), hover `--text-primary`, active `--accent-primary`, error `--accent-danger`. Adjust opacity/alpha for disabled states.
- Usage conventions: Maintain 8px spacing between icon and label, pair icons with text for critical actions, mark decorative icons `aria-hidden`, and provide tooltip helper text for unfamiliar glyphs.
