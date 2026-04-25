# Maintenance Guide

## Adding or Replacing Artwork

1. Add or update the source asset in [`src/assets/`](../src/assets).
   - Use a stable lowercase slug for new assets, for example `psychedelic-bathroom-portrait.jpg`.
   - Do not reference files from Downloads or another local-only folder in app code.
2. Regenerate responsive runtime assets with:

```bash
npm run optimize-images
```

3. Update the runtime image contract in [`src/utils/images.ts`](../src/utils/images.ts):
   - slug
   - alt text
   - expected widths
   - modal fallback width if needed
4. Update artwork copy in [`src/components/artworkData.ts`](../src/components/artworkData.ts) and featured ordering in [`src/content/featuredArtworks.ts`](../src/content/featuredArtworks.ts) if the piece should appear in the gallery.
5. Update [`tests/image-contract.test.ts`](../tests/image-contract.test.ts) so the expected featured slugs and modal widths match the new artwork.
6. Run:

```bash
npm run test -- tests/image-contract.test.ts
npm run typecheck
npm run build
```

The image contract test suite will catch missing generated files or mismatched slugs.

## Adding Video Artwork

- Keep gallery cards poster-first: store a poster source in [`src/assets/`](../src/assets), generate responsive poster variants with `npm run optimize-images`, and reference the poster through the normal image manifest.
- Store compressed runtime videos in [`public/videos/`](../public/videos). Do not point app data at a file in Downloads or another local-only folder.
- Add `videoSrc` to the artwork entry in [`src/components/artworkData.ts`](../src/components/artworkData.ts). The shared gallery card will then show `View video` on the card and render the existing autoplaying, muted, controlled `<video>` modal.
- Keep video files web-sized. As a practical target, prefer an optimized MP4 with `-movflags +faststart`, H.264 video, AAC audio, and dimensions no larger than the modal needs.
- Update [`tests/image-contract.test.ts`](../tests/image-contract.test.ts) and the relevant Playwright modal test whenever a featured card changes from image to video.

## Modifying Motion

Before adding new motion:

- check whether it is essential or decorative
- gate decorative motion behind reduced-motion and pointer-capability rules
- avoid introducing new raw `matchMedia` subscriptions when [`src/hooks/useMediaQuery.ts`](../src/hooks/useMediaQuery.ts) already covers the need

## Modifying the Hero Title System

- `HeroTitleHybrid` is the active hero title primitive. Treat it as a hero-only custom wordmark system, not as a new global heading abstraction.
- Keep copy ownership in [`src/content/siteCopy.ts`](../src/content/siteCopy.ts). The hero contract should stay explicit: `eyebrow`, `titleSemantic`, `titleLines`, and `subtitle`.
- Keep semantic heading ownership in [`src/sections/HeroSection.tsx`](../src/sections/HeroSection.tsx). The decorative wordmark subtree must remain `aria-hidden="true"`.
- Preserve the browser-test selector `data-testid="hero-title-visual"` unless the tests are updated in the same change.
- Preserve readable fallback output. A decorative failure must not blank the hero title, eyebrow, or subtitle.
- Reduced-motion mode should keep the lockup readable and intentional without relying on sheen or continuous decorative movement.
- Use [`docs/hero-title-hybrid.md`](./hero-title-hybrid.md) and [`docs/release-checklist.md`](./release-checklist.md) as the maintenance source of truth before shipping hero-title changes.

## Modifying the Gallery Intro Lockup

- Gallery intro copy lives in [`src/content/siteCopy.ts`](../src/content/siteCopy.ts) as `GALLERY_COPY`.
- Keep gallery intro composition in [`src/sections/GallerySection.tsx`](../src/sections/GallerySection.tsx): eyebrow, live `h2`, and subtitle stay section-owned.
- `ShaderHeading` may use `variant="gallery"` for the gallery intro, but that variant is gallery-scoped. It is not a new global heading language.
- Preserve `id="selected-works-heading"` on the live heading so the artwork region keeps its accessible name.
- Do not route gallery work through `HeroTitleHybrid` just because the hero and gallery now share visual taste.

## Modifying Overlays

- Reuse [`src/hooks/useOverlayBehavior.ts`](../src/hooks/useOverlayBehavior.ts).
- Keep overlay state local to the owning component.
- Do not introduce a global modal store for this app.

## Modifying Shader Text

- Keep section shader headings separate from the hero title system.
- Reuse [`src/components/shared/ShaderTextWord.tsx`](../src/components/shared/ShaderTextWord.tsx) for lifecycle changes.
- Preserve readable fallback output and do not reintroduce per-frame React state churn.
- Keep any gallery-specific shader tuning behind `variant="gallery"` instead of mutating the default section heading behavior.
- Do not route new hero work back through the retired `HeroShaderTitle` path unless the hero architecture is deliberately being redesigned again.

## Out of Scope

The current architecture deliberately excludes:

- backend APIs
- CMS integration
- authentication
- database-backed content
- global client-state libraries

If any of those become necessary, document the scope change explicitly before implementation.
