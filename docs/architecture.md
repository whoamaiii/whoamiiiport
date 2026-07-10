# Architecture

## Scope

Whoamiii is a static React 19 + Vite + TypeScript frontend. Content and media are
local; there is no backend, CMS, authentication, database, or global state
library. Vite writes the production site to `dist/` for static hosting.

## Composition

- [`src/main.tsx`](../src/main.tsx) loads bundled fonts and mounts React.
- [`src/App.tsx`](../src/App.tsx) owns the skip link, global motion inputs, lazy
  boundaries, loading fallbacks, and section order.
- [`src/sections/SiteHeader.tsx`](../src/sections/SiteHeader.tsx) owns desktop
  navigation and the full-screen mobile index.
- [`src/sections/HeroSection.tsx`](../src/sections/HeroSection.tsx) owns the
  responsive hero image, semantic `h1`, decorative wordmark, subtitle, and entry
  action.
- [`src/sections/GallerySection.tsx`](../src/sections/GallerySection.tsx) owns the
  four selected works, archive entry action, and process film.
- [`src/sections/LibrarySection.tsx`](../src/sections/LibrarySection.tsx) owns the
  six controlled archive chapters and progressive chapter panels.
- About, contact, and footer are independent deferred sections.

## Shared Browser Behavior

- [`useMediaQuery`](../src/hooks/useMediaQuery.ts) centralizes media-query
  subscriptions; [`useReducedMotion`](../src/hooks/useReducedMotion.ts) is the
  motion preference source.
- [`useHeroMotion`](../src/hooks/useHeroMotion.ts) owns hero scroll and optional
  fine-pointer motion without turning `App` into an animation component.
- [`useOverlayBehavior`](../src/hooks/useOverlayBehavior.ts) provides focus trap,
  scroll lock, Escape handling, and trigger focus restoration for both overlays.
- [`usePortfolioSectionLoading`](../src/hooks/usePortfolioSectionLoading.ts)
  progressively mounts lower sections. It resolves direct hashes, retries until
  their target exists, then observes layout changes long enough to keep the
  destination aligned.

## Rendering and Performance

- Header and hero are in the initial bundle; gallery, archive, about, contact,
  and footer are lazy imports.
- The first selected-work and about images are preloaded only when their owning
  route/section is requested.
- The archive renders six lightweight chapter summaries while closed and mounts
  artwork cards only for the open chapter.
- The process MP4 loads near the viewport, pauses offscreen, and respects reduced
  motion and manual pause.
- Deferred sections use `content-visibility` and an intrinsic-size estimate.
- The hero visual is protected by an error boundary; lower deferred content has
  a separate boundary and labelled loading states.

## Visual System

Barlow Condensed supplies editorial display type; variable Manrope supplies body
and interface type. Both are bundled dependencies, so presentation does not rely
on a locally installed font or a third-party font endpoint. Most section
headings are plain semantic HTML styled by shared editorial classes. The custom
title renderer is intentionally limited to the hero and always has a readable
static fallback.

See [`../DESIGN.md`](../DESIGN.md) for composition, tokens, and interaction rules.

## Content and Media Contracts

- [`siteCopy.ts`](../src/content/siteCopy.ts): section copy.
- [`featuredArtworks.ts`](../src/content/featuredArtworks.ts): selected four-work
  order.
- [`libraryArtworks.ts`](../src/content/libraryArtworks.ts): complete artwork
  archive.
- [`portfolioGroups.ts`](../src/content/portfolioGroups.ts): six archive chapters.
- [`artworkData.ts`](../src/components/artworkData.ts): artwork notes and media.
- [`images.ts`](../src/utils/images.ts): slugs, alt text, dimensions, and srcsets.
- [`media.ts`](../src/utils/media.ts): same-origin video manifest.

Responsive images are generated under `public/images/`; runtime videos live in
`public/videos/`. Contract tests keep referenced files, ordering, and advertised
widths synchronized.

## Static Shell and Deployment

[`index.html`](../index.html) contains metadata and an image-first static shell so
the initial document remains branded before React mounts. Production builds with
`npm run build` and deploys the contents of `dist/` to the root of `gh-pages`.
See [`deployment.md`](./deployment.md).
