# UI/UX Acceptance Contract

This note is the lightweight contract for the remaining Whoamiii UI/UX completion work.

## Locked Rules

- The gallery shows four local artworks only.
- Gallery video paths must be declared in `src/utils/media.ts` and resolve to same-origin files in `public/videos/`.
- The hero is static image-first for this release; no hero overlay video is shipped.
- The skip link must target `#main-content`.
- The page must expose one real `main` landmark.
- Modal artwork images must resolve to generated local assets.
- Reduced motion must disable both CSS motion and JS-driven motion.
- The preserved `src/glass-effect/` subsystem may only return to live nav use after a dedicated stability gate passes.
- CSP is a host-level responsibility for this static app, and production error telemetry is not active until `src/lib/reportError.ts` grows a real reporting adapter.

## Implementation Notes

- The image pipeline uses slug-based helpers in `src/utils/images.ts`.
- The video pipeline uses the explicit media manifest in `src/utils/media.ts`.
- The gallery, About imagery, and video posters use generated local variants rather than direct source assets.
- The preserved `src/glass-effect/` subsystem is allowed to stay in the codebase even if it is not live yet.

## Current Release Status

- The gallery is limited to the four local artworks in the slug-based image pipeline.
- The About section now also resolves through the same generated local image pipeline.
- Each featured artwork now resolves through an explicit generated modal fallback in `/public/images`.
- The active video set is the Ferdigcop gallery video declared in `src/utils/media.ts`.
- `src/glass-effect/` is preserved as a future/reference subsystem, but it is not live in the navigation for this release.

## Validation Expectations

- Unit tests should confirm generated asset paths exist.
- Unit tests should confirm media manifest video paths exist.
- Smoke tests should confirm the page loads and the gallery shell renders.
- Mobile Playwright checks should confirm the first viewport, header/menu, and artwork modal remain coherent at `390x844`.
- Accessibility checks should confirm skip-link, menu, and modal behavior once the UI tasks are complete.
