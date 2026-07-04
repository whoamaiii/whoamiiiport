# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project shape

Static React 19 + Vite + TypeScript portfolio. No backend, CMS, auth, database, or global state library — and the architecture deliberately stays that way (see `docs/adr-001-static-portfolio-architecture.md`). Content modules, the image manifest, and generated responsive assets all live in the repo. Adding any of the excluded categories requires an explicit scope change, not a quiet introduction.

Node `24.13.1` / npm `11.8.0` (`.nvmrc`). Path alias `@/*` resolves to the repo root.

## Commands

```bash
npm run dev            # Vite on port 3000
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint over app, tests, configs
npm run test           # Vitest (jsdom) — tests/**/*.{test,spec}.{ts,tsx}, excludes tests/e2e
npm run test:watch
npm run test:e2e       # Playwright (Chromium); webServer auto-runs `npm run dev`
npm run check          # typecheck + lint + vitest + build
npm run check:ci       # check + Playwright (the CI gate)
npm run optimize-images  # regenerate public/images from src/assets via scripts/optimize-images.js
```

Run a single Vitest file: `npm run test -- tests/image-contract.test.ts`. Run a single Playwright spec: `npx playwright test tests/e2e/smoke.spec.ts`. Playwright's `webServer.reuseExistingServer` is true, so a dev server already on `:3000` is reused.

CI (`.github/workflows/ci.yml`) runs `npm ci` → Playwright install → `npm run check:ci`. Match it locally before opening a PR.

## Architecture you can't see by reading one file

### Section ownership boundary
`src/App.tsx` composes the page, owns the skip link (which moves focus to `#main-content`, not just the hash), hero motion values, and wraps effect-heavy globals in `RenderErrorBoundary`. Each `src/sections/*Section.tsx` is the single owner of its semantics, layout, and copy placement. Don't reach across sections; route shared behavior through `src/hooks/` instead.

### Shared behavior layer (use these, don't reinvent)
- `src/hooks/useMediaQuery.ts` — the only place new `matchMedia` subscriptions should originate.
- `src/hooks/useReducedMotion.ts` — wraps `useMediaQuery`. All decorative motion gates through it.
- `src/hooks/useDocumentVisibility.ts` — pause shader/animation work when tab is hidden.
- `src/hooks/useOverlayBehavior.ts` — focus trap, scroll lock, Escape, focus restore. The mobile menu and artwork modal both consume it. Don't introduce a global modal store.

### Hero title is its own thing
`HeroTitleHybrid` (in `src/components/HeroTitleHybrid.tsx`) is the **active** hero lockup. The earlier `HeroShaderTitle.tsx` path is retired — do not route new hero work through it. Rules that the test suite and release checklist enforce:
- The semantic `<h1>` lives in `HeroSection.tsx`. The decorative wordmark subtree is `aria-hidden="true"`.
- Browser tests target the heading by role/accessible name *and* the decorative subtree via `data-testid="hero-title-visual"`. Don't remove or rename that testid without updating tests in the same change.
- Decorative failure must not blank the hero. Eyebrow, semantic title, and subtitle must stay readable in fallback and reduced-motion modes.
- The hero wordmark system is **hero-only**. Do not promote it into a global heading abstraction.

### Shader text system
- `src/components/shared/ShaderTextWord.tsx` owns the shader-text lifecycle — modify it for lifecycle changes, don't fork.
- `src/components/ShaderHeading.tsx` is the section-level consumer. The gallery intro uses `variant="gallery"`; that variant is gallery-scoped tuning, not a new global heading language.
- `src/lib/shaderRenderer.ts` is the rendering-engine contract. `src/components/shared/shaderTextShared.ts` holds shared math/shadow helpers.
- Preserve readable text fallback. Do not reintroduce per-frame React state churn.

### Decorative text contract
Decorative animation must never be the only accessible source of meaning. The old `AnimatedHeading` / `TextScramble` path has been removed; current heading effects route through `ShaderHeading` and `ShaderTextWord`. The pattern remains: semantic heading owns the real accessible name → helper `sr-only` text repeats it if needed → decorative visual output is `aria-hidden="true"`.

### Content and asset contracts
- `src/content/siteCopy.ts` — section copy. Hero contract is structured: `eyebrow`, `titleSemantic`, `titleLines`, `subtitle`. `GALLERY_COPY` covers the gallery eyebrow/heading/subtitle.
- `src/content/featuredArtworks.ts` — curated gallery order.
- `src/components/artworkData.ts` — per-artwork detail copy and `videoSrc` for video cards.
- `src/utils/images.ts` — runtime source of truth for slugs, alt text, widths, and srcset. `tests/image-contract.test.ts` enforces alignment with what's actually generated under `public/images/`.
- `src/content/workflowSteps.ts` — workflow carousel copy and image URL/srcset helpers. The WebP files under `public/images/workflow/` are manually managed runtime assets, verified by `tests/image-contract.test.ts`, and are not regenerated by `npm run optimize-images` unless matching originals are later added under `src/assets/workflow/` with optimizer support in the same change. Keep `srcset` descriptors aligned to real file widths, even when a legacy filename contains `1200`.

### Adding/replacing artwork
Source under `src/assets/` (lowercase slug) → `npm run optimize-images` → update `src/utils/images.ts` (slug, alt, gallery/modal widths) → update `artworkData.ts` and `featuredArtworks.ts` if featured → update `tests/image-contract.test.ts` to match featured slugs/modal widths. Never reference files in `~/Downloads` or other local-only paths from app code. Video files go in `public/videos/` (web-sized, `+faststart` H.264/AAC); poster images flow through the normal image manifest.

Workflow carousel images are the current exception. Treat `public/images/workflow/` as the canonical runtime asset folder until original workflow sources are recovered; do not claim `npm run optimize-images` regenerates those files without adding the missing source pipeline in the same change. If a workflow image's real pixel width changes, update the descriptor metadata in `src/content/workflowSteps.ts` and the image contract together.

### Resilience
Effect-heavy regions are wrapped in `src/components/fallback/RenderErrorBoundary.tsx`. Errors flow through `src/lib/reportError.ts` (intentionally lightweight — keep it that way until a monitoring story is decided).

### Glass subsystem
`src/glass-effect/` is a preserved glassmorphism engine. It is *not* part of the core page architecture; it shares motion-preference behavior with the rest of the app and is retained for future use.

## Test layering

- **Vitest (`tests/`)** — hook behavior, semantic wrappers, hero-title accessibility/fallback, image manifest, structured copy consumption. Setup: `tests/setup.ts`. Match-media mocking: `tests/helpers/matchMedia.ts`.
- **Playwright (`tests/e2e/`)** — skip-link focus transfer, region/heading naming, hero lockup (heading + `data-testid="hero-title-visual"`), eyebrow/subtitle in first viewport, artwork modal (including video autoplay/muted/poster/source path), mobile menu focus trap, axe scans on base page and modal.

Regression policy: every fixed user-facing bug gets at least one automated case. For animation-heavy UI, assert stable semantic outcomes, not transient pixel states. Scope locators to a region or dialog to avoid ambiguous matches.

## Release stop conditions

Do not ship if `npm run check` or `npm run test:e2e` fails, if skip-link focus is broken, if a named region or major heading lacks a stable accessible name, if the hero subtitle becomes unreadable over the static hero image, if reduced-motion mode leaves the hero dependent on decorative motion, or if hero-title fallback leaves the first viewport blank. Full manual passes (hero readability, gallery intro, keyboard, reduced-motion, fallback) live in `docs/release-checklist.md`.

## Documentation map

`docs/README.md` is the index. The canonical sources are `docs/architecture.md`, `docs/accessibility.md`, `docs/testing.md`, `docs/maintenance.md`, `docs/release-checklist.md`, `docs/hero-title-hybrid.md`, `docs/portfolio-maintenance-map.md`, and `docs/adr-001-static-portfolio-architecture.md`. Older root-level design summary/quick-start artifacts and captured `portfolio-*.png` screenshots were removed; prefer the `docs/` tree for current truth.
