# Whoamiii Portfolio

A static React 19 + Vite portfolio for a psychedelic art brand, hardened around accessibility, motion control, rendering fallbacks, and local image contracts.

## Runtime

- Recommended Node.js: `24.13.1`
- Recommended npm: `11.8.0`
- Version pin: [`.nvmrc`](./.nvmrc)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port `3000`. |
| `npm run build` | Build the production bundle into `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run clean` | Remove `dist/`. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run lint` | Run ESLint across app, tests, and config files. |
| `npm run test` | Run the Vitest unit and integration suite. |
| `npm run test:e2e` | Run the Playwright browser regression suite. |
| `npm run check` | Run typecheck, lint, unit/integration tests, and build. |
| `npm run check:ci` | Run the full local CI gate, including Playwright. |
| `npm run optimize-images` | Regenerate the responsive local image assets in `public/images`. |
| `npm run perf:mobile` | Measure the built preview at `http://localhost:4173/` with mobile throttling. |

## Architecture Overview

- App shell: [`src/App.tsx`](./src/App.tsx) coordinates skip-link focus, background motion, and section composition.
- Sections: [`src/sections/`](./src/sections) owns page structure and local copy placement.
- Shared behavior: [`src/hooks/`](./src/hooks) centralizes reduced motion, media queries, document visibility, and overlay focus handling.
- Visual effects: hero wordmark and shader text live in [`src/components/`](./src/components) and [`src/components/shared/`](./src/components/shared); [`src/glass-effect/`](./src/glass-effect) is intentionally preserved as future/reference infrastructure.
- Content contracts: section copy lives in [`src/content/siteCopy.ts`](./src/content/siteCopy.ts), featured artwork wiring lives in [`src/content/featuredArtworks.ts`](./src/content/featuredArtworks.ts), and image metadata lives in [`src/utils/images.ts`](./src/utils/images.ts).
- Fallback and resilience: [`src/components/fallback/RenderErrorBoundary.tsx`](./src/components/fallback/RenderErrorBoundary.tsx) and [`src/lib/reportError.ts`](./src/lib/reportError.ts) keep effect failures from blanking content.

## Quality Gates

The repo is considered healthy when all of the following pass:

```bash
npm run check
npm run test:e2e
```

For load-speed work, use the production build path as the truth:

```bash
npm run build
npx vite preview --host=0.0.0.0 --port=4173
npm run perf:mobile
```

`npm run dev` is useful while editing, but it serves many unbundled development modules and is not representative of shipped portfolio performance.

The browser suite specifically protects:

- skip-link focus transfer to `main`
- stable heading and landmark naming
- modal focus restoration
- mobile menu focus trapping
- first mobile viewport/header/hero/modal regressions at `390x844`
- base-page and modal accessibility scans

## Documentation

The current implementation docs live in [`docs/README.md`](./docs/README.md).

- Baseline and acceptance contract: [`docs/implementation-baseline.md`](./docs/implementation-baseline.md)
- Architecture: [`docs/architecture.md`](./docs/architecture.md)
- Accessibility rules: [`docs/accessibility.md`](./docs/accessibility.md)
- Testing strategy: [`docs/testing.md`](./docs/testing.md)
- Deployment and domain: [`docs/deployment.md`](./docs/deployment.md)
- Release workflow: [`docs/release-checklist.md`](./docs/release-checklist.md)
- Load performance report: [`docs/load-performance-report.md`](./docs/load-performance-report.md)
- Maintenance and asset updates: [`docs/maintenance.md`](./docs/maintenance.md)
- Portfolio cleanup map: [`docs/portfolio-maintenance-map.md`](./docs/portfolio-maintenance-map.md)
- Architecture decision log: [`docs/adr-001-static-portfolio-architecture.md`](./docs/adr-001-static-portfolio-architecture.md)

## Asset Pipeline

- Source inputs live under [`src/assets/`](./src/assets).
- Generated runtime images live under [`public/images/`](./public/images).
- The runtime source of truth is the image manifest in [`src/utils/images.ts`](./src/utils/images.ts) plus the video media manifest in [`src/utils/media.ts`](./src/utils/media.ts).
- When adding or replacing artwork, regenerate responsive images with `npm run optimize-images` and then run `npm run test`.

## CI

GitHub Actions runs the same validation gate in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml):

1. `npm ci`
2. Playwright browser install
3. `npm run check:ci`

## Static Deployment Notes

This project is intentionally frontend-only. The expected host should support:

- serving the Vite `dist/` output as a static site
- immutable caching for hashed assets
- preview deployments for pull requests if available
- host-level configurable security headers and CSP, especially for same-origin image/video media plus any `data:` or `blob:` URLs needed by visual effects

Current production deployment details for `whoamiii.art`, including the
Cloudflare DNS records, GitHub Pages source branch, and HTTPS verification
steps, live in [`docs/deployment.md`](./docs/deployment.md).

## Troubleshooting

- Missing generated images: run `npm run optimize-images` and then `npm run test`.
- Browser regression failure: run `npm run test:e2e` locally and inspect the Playwright trace under `test-results/`.
- Lint or typecheck drift: run `npm run check` before opening a PR.
- Visual effect fallback issues: inspect [`src/components/HeroTitleHybrid.tsx`](./src/components/HeroTitleHybrid.tsx), [`src/components/shared/ShaderTextWord.tsx`](./src/components/shared/ShaderTextWord.tsx), and [`src/components/ShaderHeading.tsx`](./src/components/ShaderHeading.tsx).
