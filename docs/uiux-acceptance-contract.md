# UI/UX Acceptance Contract

This note is the lightweight contract for the remaining Whoamiii UI/UX completion work.

## Locked Rules

- The gallery shows four local artworks only.
- The skip link must target `#main-content`.
- The page must expose one real `main` landmark.
- Modal artwork images must resolve to generated local assets.
- Reduced motion must disable both CSS motion and JS-driven motion.
- `GlassLayer` may only return to live nav use after a dedicated stability gate passes.

## Implementation Notes

- The image pipeline uses slug-based helpers in `src/utils/images.ts`.
- The gallery and About imagery use generated local variants rather than direct source assets.
- The preserved glass subsystem is allowed to stay in the codebase even if it is not live yet.

## Current Release Status

- The gallery is limited to the four local artworks in the slug-based image pipeline.
- The About section now also resolves through the same generated local image pipeline.
- `loongdrive` now has an explicit generated modal fallback asset at `/images/loongdrive-modal-1200.webp`.
- `GlassLayer` is preserved and stabilized at the component level, but it is not live in the navigation for this release.

## Validation Expectations

- Unit tests should confirm generated asset paths exist.
- Smoke tests should confirm the page loads and the gallery shell renders.
- Accessibility checks should confirm skip-link, menu, and modal behavior once the UI tasks are complete.
