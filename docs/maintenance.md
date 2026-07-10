# Maintenance Guide

## Adding or Replacing Artwork

1. Add the canonical source under [`src/assets/`](../src/assets) with a stable
   lowercase slug. Never reference Downloads or another machine-local path.
2. Run `npm run optimize-images` to regenerate WebP and AVIF outputs.
3. Update [`src/utils/images.ts`](../src/utils/images.ts): slug, alt text,
   intrinsic dimensions, gallery/modal widths, and crop positions.
4. Update [`src/components/artworkData.ts`](../src/components/artworkData.ts) and
   [`src/content/libraryArtworks.ts`](../src/content/libraryArtworks.ts).
5. If featured, update [`src/content/featuredArtworks.ts`](../src/content/featuredArtworks.ts)
   while preserving the intentional four-work sequence and layout mapping.
6. Update the image contract and run:

```bash
npm run test -- tests/image-contract.test.ts
npm run check
```

## Archive Chapters

The archive groups 49 works into six entries from
[`portfolioGroups.ts`](../src/content/portfolioGroups.ts). Each artwork ID must
resolve through [`libraryArtworks.ts`](../src/content/libraryArtworks.ts), and each
chapter needs a valid lead artwork in
[`LibrarySection.tsx`](../src/sections/LibrarySection.tsx).

Keep one chapter open at a time and continue mounting cards only for the open
panel. When moving an artwork, verify chapter counts, lead images, direct chapter
hashes, and the progressive-render test together.

## Video Artwork

- Store web-sized runtime MP4 files in [`public/videos/`](../public/videos).
- Generate the poster through the normal image pipeline.
- Declare video paths in [`src/utils/media.ts`](../src/utils/media.ts), then
  reference them from the artwork entry.
- Prefer H.264/AAC MP4 with `+faststart` and dimensions no larger than the modal
  needs.
- Update image/media contract tests and the Playwright modal flow.

## Process Film

The active process presentation is a single vertical film in
[`WorkflowProcessCard.tsx`](../src/components/WorkflowProcessCard.tsx), with a
same-origin poster and MP4. If it changes, update the exported media metadata and
tests together. Preserve near-viewport loading, offscreen pause, visible playback
controls, looping only when motion is allowed, and reduced-motion behavior.

## Hero

- The hero image uses the `liquid-perception-hero` manifest entry.
- Keep the hero static and image-first unless a deliberate redesign adds a video
  loading, readability, fallback, and reduced-motion policy.
- Keep the semantic title in `HeroSection`; the decorative wordmark remains
  hero-only and `aria-hidden`.
- Update the image contract, hero tests, and first-viewport browser checks when
  media, copy, crop, or title geometry changes.

## Lazy Sections and Navigation

Lower sections are intentionally mounted in stages. Any change to section order,
IDs, or loading timing must preserve `#work`, `#gallery`, `#about`, `#contact`,
and archive chapter links. The navigation hook must keep observing layout shifts
long enough for the selected destination to remain at the viewport top.

## Overlays and Motion

- Reuse [`useOverlayBehavior`](../src/hooks/useOverlayBehavior.ts); keep overlay
  state local to its owner.
- Reuse [`useMediaQuery`](../src/hooks/useMediaQuery.ts) and
  [`useReducedMotion`](../src/hooks/useReducedMotion.ts).
- Prefer transform and opacity animation. Pause hidden or offscreen work.
- Keep stable semantic output separate from decorative visuals.

## Tooling

- Keep `fullyParallel: false` unless every Playwright worker receives an isolated
  server/port.
- Use `npm run test:e2e:preview` for shipped behavior, not only the dev server.
- Keep temporary screenshots and experiments out of tracked source.
- After dependency or media changes, run `npm run check:ci` and the preview pass.
