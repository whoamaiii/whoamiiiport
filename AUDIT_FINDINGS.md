# Portfolio Audit Remediation Status

Branch: `codex/portfolio-release-ready`

This file replaces the original read-only audit snapshot. The old snapshot was useful for triage, but it became stale after the remediation work because it described deleted components, retired image assets, and outdated test behavior as if they still existed.

## Current Outcome

- Retired active source paths were removed from `src/components/`.
- Retired `LiquidGlassText` coverage was removed from the active test suite.
- Runtime image and video contracts now live in typed manifests and are covered by tests.
- Unfeatured generated image outputs were pruned from `public/images/`; raw creative source files in `src/assets/` were preserved.
- Contact heading visual text now comes from `CONTACT_COPY`.
- Hero title fallback reporting now distinguishes intentional fallback from a wordmark mismatch.
- Reduced-motion image reveals no longer start from hidden clipped content.
- Hero video playback is gated for constrained connections and disables itself on stall/error.
- Mobile menu labels, skip-link focus behavior, and e2e test names/assertions were made coherent.
- Root-level portfolio QA screenshots were removed from the current tree and future variants are ignored.
- File modes for key text/config files were normalized to `644`.
- Docs now describe the current static React/Vite architecture, preserved glass subsystem, media contracts, host-level CSP expectations, and intentional tooling tradeoffs.

## Finding Status

| # | Original finding | Status |
|---|---|---|
| 1 | Dead exported components and retired hero paths | Fixed: deleted retired active components and dead hero CSS; `src/glass-effect/` remains documented as intentionally preserved. |
| 2 | Dead artwork data and stale generated assets | Fixed: unfeatured active-pipeline artwork constants/slugs and stale generated outputs were pruned; raw source assets remain. |
| 3 | `joetrip2` modal asset claim | Fixed: hero slug is no longer part of the modal image contract. |
| 4 | Hero video path outside contract | Fixed: hero/gallery videos are represented by `src/utils/media.ts` and tested for file existence. |
| 5 | Contact heading visual/semantic drift | Fixed: visual split text comes from structured `CONTACT_COPY.headingParts`. |
| 6 | Tests protect retired code paths | Fixed: retired `LiquidGlassText` test was deleted. |
| 7 | Forced hero fallback logs mismatch | Fixed: forced fallback is quiet; true wordmark mismatch still reports in dev. |
| 8 | Loose `useRef<number>()` typing | Fixed in active code with explicit nullable initial state. |
| 9 | Duplicate dead `LiquidGlassText` state pattern | Fixed by deleting the retired component. |
| 10 | Duplicate dynamic `statSync` import | Fixed in `scripts/optimize-images.js`. |
| 11 | Mobile menu open label/expanded state mismatch | Fixed: trigger label and state are coherent. |
| 12 | Header scroll test name contradicted behavior | Fixed: e2e test name now describes the absolute header scrolling away. |
| 13 | Mobile menu navigation focus side effect | Documented/tested as intentional section-focus behavior. |
| 14 | Hero video ignored save-data/constrained connection | Fixed with feature-detected connection gating. |
| 15 | Reduced-motion `ImageReveal` could hide content | Fixed with reduced-motion mask/clip bypass. |
| 16 | Production `reportError` is no-op | Documented as current policy and future telemetry chokepoint. |
| 17 | Docs/filesystem stale `loongdrive` mismatch | Fixed by pruning generated outputs and aligning docs. |
| 18 | Typekit/CSP surface | Documented as host-level CSP responsibility; no fake in-repo CSP/SRI added. |
| 19 | Tracked root portfolio screenshots | Fixed in current tree; history rewrite remains intentionally out of scope. |
| 20 | ESLint ignores `docs/**` | Documented as intentional markdown/docs boundary. |
| 21 | Misleading e2e test assertions/names | Fixed in smoke spec. |
| 22 | Text/config mode bits | Fixed by normalizing requested files to `644`. |
| 23 | Featured-artwork test coupling | Documented as deliberate release contract. |
| 24 | Hero `aria-label` plus sr-only redundancy | Left as accepted low-risk redundancy because both values share one source of truth. |
| 25 | Section focus and heading ID timing | Left as accepted pattern; headings remain present in DOM. |
| 26 | Hero video stall/error silence | Fixed with one-shot disable/report handling. |
| 27 | Skip-link smooth-scroll/focus race | Fixed with controlled focus path. |
| 28 | Muted decorative hero video caution | Left as accepted low-risk browser behavior; video remains muted and `aria-hidden`. |
| 29 | Dependency policy commentary | Documented; no broad dependency update was introduced. |
| 30 | Playwright `fullyParallel: false` | Documented as intentional until per-worker server isolation exists. |

## Remaining Intentional Non-Changes

- No backend, auth, CMS, database, API layer, or global client-state library was added.
- No design redesign was performed.
- Git history was not rewritten to remove historical screenshots from old commits.
- Production telemetry was not added; `reportError` remains lightweight until a monitoring provider is explicitly chosen.
- Raw creative source assets with spaces or non-ASCII names were preserved unless they were generated runtime files.
