# Whoamiii — Wet Signal

An image-led, mobile-first portfolio for [whoamiii.art](https://whoamiii.art). The
site presents psychedelic digital work as an editorial sequence: a cinematic
hero, four selected works, one process film, a progressive six-chapter archive,
an artist statement, and a direct contact invitation.

The project is a static React 19 + TypeScript application built with Vite. It has
no backend, CMS, authentication, database, or global state library.

## Local Development

The pinned runtime is Node `24.13.1` with npm `11.8.0`; see [`.nvmrc`](./.nvmrc).

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite on port `3000`. |
| `npm run build` | Build the production site into `dist/`. |
| `npm run preview` | Serve the built site locally. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run lint` | Run ESLint. |
| `npm run test` | Run the Vitest suite. |
| `npm run test:e2e` | Run Playwright against the development server. |
| `npm run test:e2e:preview` | Build and run Playwright against the production preview. |
| `npm run check` | Run typecheck, lint, Vitest, and the production build. |
| `npm run check:ci` | Run the full CI gate, including Playwright and hygiene checks. |
| `npm run optimize-images` | Regenerate responsive WebP and AVIF artwork assets. |
| `npm run perf:mobile` | Measure a built preview at `http://localhost:4173/`. |

## Experience Architecture

- [`src/App.tsx`](./src/App.tsx) composes the page, skip link, lazy section
  boundaries, fallbacks, and global motion inputs.
- [`src/sections/`](./src/sections) owns the header, hero, selected work, archive,
  about, contact, and footer compositions.
- [`src/hooks/usePortfolioSectionLoading.ts`](./src/hooks/usePortfolioSectionLoading.ts)
  progressively mounts lower sections and realigns hash targets while lazy
  content changes the document height.
- [`src/hooks/useOverlayBehavior.ts`](./src/hooks/useOverlayBehavior.ts) provides
  focus trapping, Escape handling, scroll locking, and focus restoration for
  both the mobile menu and artwork modal.
- [`src/components/HeroTitleHybrid.tsx`](./src/components/HeroTitleHybrid.tsx)
  renders the hero-only decorative wordmark; the semantic `h1` remains in the
  hero section.
- [`src/components/WorkflowProcessCard.tsx`](./src/components/WorkflowProcessCard.tsx)
  owns the single short process film and pauses it when offscreen or when reduced
  motion is requested.
- [`src/sections/LibrarySection.tsx`](./src/sections/LibrarySection.tsx) exposes 49
  works through six controlled chapters and mounts artwork cards only for the
  open chapter.

Content is local and typed. Site copy lives in
[`src/content/siteCopy.ts`](./src/content/siteCopy.ts), featured order in
[`src/content/featuredArtworks.ts`](./src/content/featuredArtworks.ts), chapter
data in [`src/content/portfolioGroups.ts`](./src/content/portfolioGroups.ts), and
image/video contracts in [`src/utils/images.ts`](./src/utils/images.ts) and
[`src/utils/media.ts`](./src/utils/media.ts).

## Visual System

The active design is documented in [`DESIGN.md`](./DESIGN.md). It uses bundled
Barlow Condensed for editorial display type and variable Manrope for body text.
The composition relies on artwork scale, ruled typography, asymmetry, restrained
grain, and warm off-black surfaces instead of panel-heavy UI.

Mobile is the primary review surface. Validate the first viewport and the full
sequence at approximately `390x844` before treating desktop polish as complete.

## Quality Gate

For a normal change:

```bash
npm run check
npm run test:e2e
```

For release confidence against shipped output:

```bash
npm run check:ci
npm run test:e2e:preview
```

The browser suite protects skip-link focus, named regions, direct hash
navigation, menu and modal focus behavior, mobile overflow, and axe accessibility
scans. Performance work must be measured from the production preview, not the
unbundled development server.

## Assets and Deployment

Artwork sources live in [`src/assets/`](./src/assets); generated runtime images
live in [`public/images/`](./public/images). Videos are same-origin files under
[`public/videos/`](./public/videos). Keep manifests, generated widths, alt text,
and contract tests synchronized when media changes.

The Vite build copies the static domain files from [`public/`](./public) into
`dist/`. Production is published from the root of the `gh-pages` branch with the
custom domain `whoamiii.art`. The exact release and verification procedure is in
[`docs/deployment.md`](./docs/deployment.md).

See [`docs/README.md`](./docs/README.md) for the focused engineering guides.
