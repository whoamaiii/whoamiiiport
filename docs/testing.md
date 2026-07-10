# Testing Strategy

## Commands

```bash
npm run test
npm run test:e2e
npm run check
npm run check:ci
npm run test:e2e:preview
npm run perf:mobile
```

## Vitest

Tests under [`tests/`](../tests) cover:

- reduced-motion, media-query, and section-loading helpers
- hero semantic/decorative separation and fallback behavior
- selected-work and six-chapter archive semantics
- progressive chapter rendering and expansion state
- artwork trigger, dialog, notes, image, and video contracts
- process-film metadata, loading, playback, and reduced-motion behavior
- generated image/srcset paths and same-origin video paths
- metadata and the no-JavaScript static shell

Shared DOM/browser mocks live in [`tests/setup.ts`](../tests/setup.ts).

## Playwright

Tests under [`tests/e2e/`](../tests/e2e) run in `desktop-chromium` and a touch
`mobile-390` project at `390x844`. They cover:

- first-viewport hero hierarchy and horizontal overflow
- skip-link focus and named section landmarks
- progressive archive entry and chapter expansion
- fresh direct hashes for lazy sections and chapter anchors
- mobile index focus trap, Escape, and focus restoration
- image/video artwork modal behavior and focus restoration
- about/contact geometry and complete mobile scrolling
- axe scans for the base page and modal

`fullyParallel` stays false because both projects share one web server. The normal
suite reuses `http://127.0.0.1:3000`; the preview config builds and tests
`http://127.0.0.1:4173`.

## Test Policy

- Assert behavior and semantics before classes or animation frames.
- Keep locators scoped to the relevant section/dialog.
- Use reduced motion where timing would create flakes.
- Add a regression test for every user-facing bug.
- When section IDs or loading order changes, test both in-page navigation and a
  fresh direct hash.
- When media changes, update source, manifest, generated asset, and contract test
  in the same change.

## Performance

Development Vite modules are not representative of the shipped site. Measure a
fresh production build:

```bash
npm run build
npx vite preview --host=0.0.0.0 --port=4173
npm run perf:mobile
```

If Playwright fails, inspect the retained trace and artifacts under
`test-results/`, then repeat the relevant manual pass from
[`release-checklist.md`](./release-checklist.md).
