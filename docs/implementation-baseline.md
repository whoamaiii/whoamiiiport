# Implementation Baseline

This file records the hardened foundation inherited by the “Wet Signal” redesign.
Current design and architecture rules live in [`../DESIGN.md`](../DESIGN.md) and
[`architecture.md`](./architecture.md).

## Environment

- Node.js `24.13.1`
- npm `11.8.0`
- static React 19 + Vite + TypeScript frontend
- Playwright targets: desktop Chromium and mobile `390x844`

## Foundation Guardrails

- The skip link updates the hash, scrolls to `#main-content`, and moves keyboard
  focus there.
- Semantic headings remain named independently from decorative output.
- Mobile menu and artwork modal share tested focus trapping, Escape handling,
  scroll locking, and focus restoration.
- Reduced-motion users retain all content and controls.
- Image/video paths, responsive widths, and content manifests are contract-tested.
- Visual failures degrade to readable content rather than a blank page.
- The first mobile viewport and complete page remain free of horizontal overflow.

## Current Acceptance Gate

```bash
npm run check
npm run test:e2e
npm run test:e2e:preview
```

The release checklist adds manual checks for visual hierarchy, chapter behavior,
deep-link alignment, reduced motion, loading states, and production-domain health.
