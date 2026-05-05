# Architecture

## Scope

This project is intentionally a static frontend. There is no backend, CMS, auth layer, or database in the current architecture. Content is local, images are generated into the repo, and behavior is client-side only.

## Top-Level Composition

- [`src/main.tsx`](../src/main.tsx) mounts the React app.
- [`src/App.tsx`](../src/App.tsx) owns global composition, skip-link behavior, background motion values, and error boundaries for effect-heavy global UI.
- [`src/sections/`](../src/sections) contains section-level ownership boundaries.

## Section Ownership

- [`src/sections/SiteHeader.tsx`](../src/sections/SiteHeader.tsx): top navigation, desktop anchors, mobile menu dialog.
- [`src/sections/HeroSection.tsx`](../src/sections/HeroSection.tsx): hero media, semantic hero heading, `HeroTitleHybrid` lockup, eyebrow, subtitle, and localized readability mask.
- [`src/sections/GallerySection.tsx`](../src/sections/GallerySection.tsx): named artwork region, gallery intro lockup, and prioritized artwork cards.
- [`src/sections/AboutSection.tsx`](../src/sections/AboutSection.tsx): biography copy, social links, about portrait.
- [`src/sections/ContactSection.tsx`](../src/sections/ContactSection.tsx): contact CTA with decorative heading animation.
- [`src/sections/SiteFooter.tsx`](../src/sections/SiteFooter.tsx): footer links and copyright.

## Shared Behavior Layer

### Environment and Motion

- [`src/hooks/useMediaQuery.ts`](../src/hooks/useMediaQuery.ts) is the source of truth for match-media subscriptions.
- [`src/hooks/useReducedMotion.ts`](../src/hooks/useReducedMotion.ts) delegates to `useMediaQuery`.
- [`src/hooks/useDocumentVisibility.ts`](../src/hooks/useDocumentVisibility.ts) lets shader animation pause when the document is hidden.

### Overlays and Focus

- [`src/hooks/useOverlayBehavior.ts`](../src/hooks/useOverlayBehavior.ts) owns focus trapping, scroll locking, Escape handling, and focus restoration for overlay UIs.
- The mobile menu and artwork modal both consume that hook instead of each implementing their own overlay behavior.

## Visual Effect Systems

### Hero Title System

- `HeroTitleHybrid` is the active hero title primitive.
- The semantic heading stays in [`src/sections/HeroSection.tsx`](../src/sections/HeroSection.tsx), while the decorative wordmark subtree stays `aria-hidden="true"`.
- Browser regression coverage should target `data-testid="hero-title-visual"` for the decorative subtree and use the heading role and accessible name for meaning.
- The custom wordmark path is hero-only. It should not be treated as the site-wide heading system.
- See [`docs/hero-title-hybrid.md`](./hero-title-hybrid.md) for the active hero-title contract, fallback rules, and manual QA expectations.

### Shader Text

- [`src/components/shared/ShaderTextWord.tsx`](../src/components/shared/ShaderTextWord.tsx) contains the shared shader-text lifecycle.
- [`src/components/ShaderHeading.tsx`](../src/components/ShaderHeading.tsx) remains the section-level consumer for shader-driven headings.
- The gallery intro uses `ShaderHeading` with `variant="gallery"` so it can borrow calmer typography and fallback tuning without reusing the hero wordmark system.
- The retired WebGL hero-title path is no longer the active hero lockup and should not be recreated for routine hero work.
- [`src/components/shared/shaderTextShared.ts`](../src/components/shared/shaderTextShared.ts) contains shared math and shadow helpers.
- [`src/lib/shaderRenderer.ts`](../src/lib/shaderRenderer.ts) remains the rendering engine contract.

### Retired Animated Text

- The old `TextScramble` / `AnimatedHeading` path was removed from active source.
- Section headings now use [`src/components/ShaderHeading.tsx`](../src/components/ShaderHeading.tsx) or plain semantic text.
- The rule remains: animation must never be the only accessible source of heading or control text.

### Glass Subsystem

- [`src/glass-effect/`](../src/glass-effect) contains the preserved glassmorphism engine.
- This subsystem is not the core page architecture, but it is retained for future use and now shares motion-preference behavior with the rest of the app.

## Content and Asset Contracts

- [`src/content/siteCopy.ts`](../src/content/siteCopy.ts) owns section copy, including the structured hero copy contract and `GALLERY_COPY` for the gallery eyebrow, heading, and subtitle.
- [`src/content/featuredArtworks.ts`](../src/content/featuredArtworks.ts) owns the curated gallery order.
- [`src/components/artworkData.ts`](../src/components/artworkData.ts) remains the detailed artwork-note source.
- [`src/utils/images.ts`](../src/utils/images.ts) is the runtime source of truth for image slugs, alt text, and srcset generation.
- [`src/utils/media.ts`](../src/utils/media.ts) is the runtime source of truth for active gallery video files. Video entries must point at files in [`public/videos/`](../public/videos) and reference poster slugs from the image manifest.

## Resilience and Failure Handling

- [`src/components/fallback/RenderErrorBoundary.tsx`](../src/components/fallback/RenderErrorBoundary.tsx) catches render failures around effect-heavy UI.
- [`src/lib/reportError.ts`](../src/lib/reportError.ts) is the centralized reporting adapter. It intentionally logs only in development right now, so production monitoring requires a deliberate adapter change instead of assuming browser failures are reported.
- The hero title system must degrade to a readable fallback without blanking the semantic heading, eyebrow, or subtitle if decorative rendering fails.

## Static Deployment Model

The build output is the Vite `dist/` directory. A compatible host should support:

- static file hosting
- immutable caching for hashed assets
- preview deployments for review environments
- configurable CSP and security headers

This repo does not define deploy headers. CSP and standard static-site security headers must be configured at the host level. Expected CSP allowances should account for same-origin images/videos, the Adobe Fonts stylesheet and font endpoints, and any `data:` or `blob:` URLs used by visual effects.
