# Testing Strategy

## Commands

```bash
npm run test
npm run test:e2e
npm run check
npm run check:ci
npm run perf:mobile
```

## Test Layers

### Unit and Integration: Vitest

Files live in [`tests/`](../tests).

Primary responsibilities:

- hook behavior such as reduced motion and media query updates
- shader heading readiness and semantic wrappers
- `HeroTitleHybrid` semantic, reduced-motion, and fallback behavior
- structured hero copy consumption and hero-title regression coverage
- image/media manifest and srcset contracts
- component-level accessibility expectations

Shared browser primitive mocks live in [`tests/setup.ts`](../tests/setup.ts). Shared match-media mocking lives in [`tests/helpers/matchMedia.ts`](../tests/helpers/matchMedia.ts).

### Browser Regression: Playwright

Files live in [`tests/e2e/`](../tests/e2e).

Primary responsibilities:

- skip-link focus transfer
- named-region and heading verification
- hero lockup verification through the accessible heading plus `data-testid="hero-title-visual"`
- eyebrow and subtitle presence within the first viewport
- gallery eyebrow, heading, and subtitle presence within the artwork section
- modal open/close and focus restoration
- video artwork modal behavior, including autoplay, muted playback, poster-backed loading, and expected source paths
- mobile menu focus trap behavior
- mobile-first viewport checks for header, hero lockup, menu, modal coverage, and horizontal overflow
- axe accessibility scans

Playwright configuration lives in [`playwright.config.ts`](../playwright.config.ts). The suite has separate `desktop-chromium` and `mobile-390` projects. `fullyParallel` intentionally stays `false` because the suite currently shares one dev server on port 3000. Do not enable full parallelism unless each worker gets an isolated server or port.

## Regression Policy

Every fixed user-facing bug should have at least one automated regression case. The current suite protects:

- skip link changing only the hash
- missing gallery landmark name
- gallery intro copy drifting away from the live region heading
- unstable animated heading semantics
- hero title semantics staying separate from decorative rendering
- hero-title visual selector stability for browser checks
- gallery video manifest paths resolving to files in `public/videos/`
- broken modal focus restoration
- featured video artworks accidentally losing autoplay/muted modal behavior or pointing at the wrong MP4
- first mobile viewport regressions such as horizontal overflow, broken header/menu layout, or unreadable hero lockup
- mobile menu focus trapping
- accessibility violations on base page and modal

## Writing New Tests

- Prefer behavior assertions over implementation details.
- For animation-heavy UI, assert stable semantic outcomes, not transient pixel states.
- For hero tests, assert the heading by role and accessible name first. Use `data-testid="hero-title-visual"` only for decorative subtree presence.
- For gallery tests, assert the `h2`, the named region, and the supporting eyebrow/subtitle before reaching for variant-specific attributes.
- Use reduced-motion mode or direct mocking when timing would otherwise cause flakes.
- Scope Playwright locators to the relevant region or dialog to avoid ambiguous matches.
- Markdown docs are intentionally outside the ESLint boundary. If a docs change includes runnable JS/TS examples, add targeted tests or move the example into a linted fixture.

## Local Verification Sequence

Run this order before opening a PR:

1. `npm run check`
2. `npm run test:e2e`

For performance regressions, measure the built preview instead of the dev server:

1. `npm run build`
2. `npx vite preview --host=0.0.0.0 --port=4173`
3. `npm run perf:mobile`

`npm run dev` is intentionally optimized for editing feedback. It serves unbundled Vite development modules, so slow-load results there can exaggerate what real visitors see after the production bundle is built.

If a browser test fails, inspect `test-results/` and the Playwright trace zip.

If the failure touches the hero, follow up with the manual checks in [`docs/release-checklist.md`](./release-checklist.md), especially subtitle readability, reduced-motion behavior, and fallback visibility.
