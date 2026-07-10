# CLAUDE.md

Repository guidance for coding agents working on the Whoamiii portfolio.

## Project Shape

This is a static React 19 + Vite + TypeScript portfolio. It deliberately has no
backend, CMS, authentication, database, or global state library. Content,
responsive image metadata, and media files are versioned with the app. An
architecture expansion requires explicit scope, not a quiet dependency.

Node `24.13.1` and npm `11.8.0` are pinned through [`.nvmrc`](./.nvmrc).

## Commands

```bash
npm ci                  # reproducible install
npm run dev             # Vite on port 3000
npm run typecheck       # tsc --noEmit
npm run lint            # ESLint
npm run test            # Vitest
npm run test:e2e        # Playwright against the dev server
npm run build           # production output in dist/
npm run test:e2e:preview # build + Playwright against port 4173
npm run check           # typecheck + lint + Vitest + build
npm run check:ci        # check + Playwright + hygiene
npm run optimize-images # regenerate responsive WebP and AVIF files
```

CI runs `npm ci`, installs Chromium, and runs `npm run check:ci`.

## Working Boundaries

- [`src/App.tsx`](./src/App.tsx) composes sections, owns skip-link focus, and
  defines lazy boundaries. Keep it close to page orchestration.
- Every [`src/sections/*Section.tsx`](./src/sections) owns its own semantics,
  layout, and copy placement. Shared browser behavior belongs in hooks.
- [`src/hooks/useMediaQuery.ts`](./src/hooks/useMediaQuery.ts) is the shared
  match-media subscription. Decorative motion must use
  [`src/hooks/useReducedMotion.ts`](./src/hooks/useReducedMotion.ts).
- [`src/hooks/useOverlayBehavior.ts`](./src/hooks/useOverlayBehavior.ts) owns
  focus trapping, scroll locking, Escape, and focus restoration for the mobile
  menu and artwork modal. Do not add a global modal store.

## Active Experience Contracts

### Typography and layout

The “Wet Signal” system uses bundled Barlow Condensed for editorial display type
and variable Manrope for body copy. Current tokens and layout rules live in
[`DESIGN.md`](./DESIGN.md) and [`src/index.css`](./src/index.css). Preserve the
open, image-led composition and varied media ratios; do not turn sections into a
repeated card grid.

### Hero

[`src/components/HeroTitleHybrid.tsx`](./src/components/HeroTitleHybrid.tsx) is a
hero-only decorative wordmark. The real `h1` stays in
[`src/sections/HeroSection.tsx`](./src/sections/HeroSection.tsx), and the visual
subtree remains `aria-hidden`. Preserve `data-testid="hero-title-visual"` or
update its tests in the same change. A decorative failure must never blank the
eyebrow, semantic title, subtitle, or entry link.

### Selected work and archive

[`src/content/featuredArtworks.ts`](./src/content/featuredArtworks.ts) defines the
four-work editorial sequence. The complete archive remains local in
[`src/content/libraryArtworks.ts`](./src/content/libraryArtworks.ts) and is
grouped through [`src/content/portfolioGroups.ts`](./src/content/portfolioGroups.ts).
[`src/sections/LibrarySection.tsx`](./src/sections/LibrarySection.tsx) keeps only
one of six chapters open and mounts artwork cards only for that chapter. Preserve
chapter counts, ordering, accessible expansion state, and the progressive render
model together.

### Process film

[`src/components/WorkflowProcessCard.tsx`](./src/components/WorkflowProcessCard.tsx)
owns the single short process study. Its poster and MP4 are explicit same-origin
assets. Keep near-viewport loading, offscreen pause, manual playback, and
reduced-motion behavior intact. There is no multi-step image sequence.

### Lazy sections and deep links

[`src/hooks/usePortfolioSectionLoading.ts`](./src/hooks/usePortfolioSectionLoading.ts)
progressively mounts the gallery, archive, about, contact, and footer. Direct
hashes such as `#gallery`, `#about`, `#contact`, and chapter anchors must mount
their owning section and remain aligned while earlier lazy content changes page
height. Do not replace this with a one-shot scroll.

### Content and media

- [`src/content/siteCopy.ts`](./src/content/siteCopy.ts): section copy.
- [`src/components/artworkData.ts`](./src/components/artworkData.ts): artwork
  notes and per-work media.
- [`src/utils/images.ts`](./src/utils/images.ts): image slugs, alt text, sizes,
  and generated srcsets.
- [`src/utils/media.ts`](./src/utils/media.ts): active same-origin video paths.

Artwork sources belong in `src/assets/`; generated images belong in
`public/images/`; web-sized videos belong in `public/videos/`. Never reference a
file from Downloads or another machine-local path.

## Testing and Release Rules

Vitest protects content, hooks, media contracts, component semantics, and
fallbacks. Playwright protects skip-link focus, deep links, named regions, the
first mobile viewport, chapter expansion, menu/modal focus behavior, horizontal
overflow, and axe scans. Assert stable behavior, not animation timing.

Mobile is the primary validation target at `390x844`. Do not ship when
`npm run check`, `npm run test:e2e`, or the production-preview pass fails; when
the first viewport clips; when direct hashes drift; or when menu/modal focus
behavior regresses.

Production is a static `dist/` publish to the root of `gh-pages` for
`whoamiii.art`. Do not commit, push, or deploy without explicit authorization.
The exact procedure is in [`docs/deployment.md`](./docs/deployment.md).

Use [`docs/README.md`](./docs/README.md) as the documentation index.
