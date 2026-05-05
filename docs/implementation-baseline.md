# Implementation Baseline

## Environment

- Node.js: `24.13.1`
- npm: `11.8.0`
- App type: static Vite + React + TypeScript frontend
- Primary browser regression targets: Playwright desktop Chromium and `mobile-390`

## Commands Used to Validate the Project

```bash
npm install
npm run lint
npm run test
npm run build
npm run test:e2e
```

## Original Audit Findings

The implementation work started from a verified audit of these issues:

1. The skip link updated the URL hash without moving keyboard focus into `main`.
2. Decorative animated headings could be unnamed during the first render window.
3. The gallery section referenced a missing `aria-labelledby` target.
4. The custom cursor could hide the native cursor before a replacement cursor was visible.
5. Browser smoke coverage was too weak to catch the skip-link regression.
6. Shader heading implementations duplicated lifecycle logic and performed avoidable readiness work.

## Acceptance Contract

The project is considered acceptable only when these are true:

- `npm run check` passes.
- `npm run test:e2e` passes.
- The skip link moves focus to `#main-content` in [`src/App.tsx`](../src/App.tsx).
- Major headings and named regions remain discoverable from first render.
- Modal and menu overlays trap focus and restore it correctly.
- Reduced-motion users do not depend on decorative motion for readability or navigation.
- Visual-effect failures degrade to readable static content instead of blank UI.
- Image URLs, video URLs, `srcset` values, and manifest metadata remain aligned.
- The first mobile viewport remains free of horizontal overflow and keeps the header, hero lockup, menu, and modal usable.

## Current Guardrails

These acceptance rules are now enforced by:

- ESLint and TypeScript checks in [`package.json`](../package.json)
- Vitest coverage in [`tests/`](../tests)
- browser-level regression and accessibility scans in [`tests/e2e/`](../tests/e2e)
- CI automation in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)
