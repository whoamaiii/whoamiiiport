# Portfolio Maintenance Map

## Current Ownership

| Area | Source of truth | Main risk |
| --- | --- | --- |
| Visual language | `DESIGN.md`, `src/index.css` | Reintroducing generic panel/card patterns |
| Copy | `src/content/siteCopy.ts` | Copy/layout drift on narrow screens |
| Selected sequence | `src/content/featuredArtworks.ts` | Breaking the four-layout composition |
| Complete archive | `src/content/libraryArtworks.ts`, `portfolioGroups.ts` | Counts, leads, and chapter membership drifting |
| Artwork notes | `src/components/artworkData.ts` | Media and notes becoming inconsistent |
| Image pipeline | `src/utils/images.ts`, `scripts/optimize-images.js` | Missing variants or incorrect width descriptors |
| Video pipeline | `src/utils/media.ts`, `public/videos/` | Oversized files or stale poster/source paths |
| Lazy navigation | `src/hooks/usePortfolioSectionLoading.ts` | Deep links landing incorrectly after layout shifts |
| Overlay behavior | `src/hooks/useOverlayBehavior.ts` | Focus escape, scroll-lock leaks, lost trigger focus |
| Process film | `src/components/WorkflowProcessCard.tsx` | Offscreen playback or motion-preference regressions |

## Ongoing Priorities

1. Keep the mobile `390x844` sequence visually coherent before desktop polish.
2. Preserve the progressive archive; do not mount all 49 artwork cards on first
   load.
3. Measure performance from the built preview and keep large video/image changes
   behind the media contract and a real-browser pass.
4. Keep the hero-only title renderer bounded. Section headings should remain
   simple semantic text.
5. Keep generated output, screenshots, debug scripts, and abandoned assets out
   of the source tree.

## Release Validation

```bash
npm run check:ci
npm run test:e2e:preview
npm audit --audit-level=moderate
```

Then perform the manual mobile, keyboard, reduced-motion, archive, loading, and
production checks in [`release-checklist.md`](./release-checklist.md).
