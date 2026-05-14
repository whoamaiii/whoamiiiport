# Portfolio Load Performance Report

Date: 2026-05-05

Scope: investigation plus implemented remediation for the portfolio load path.

## What Quentin Reported

The portfolio feels slow when visiting the page. Images, cards, and visual pieces take time before they appear.

In plain English: the page is not failing, but it has several layers of intentional and accidental delay stacked together. The biggest split is:

- `npm run dev` feels much slower than the built site because Vite serves many individual development modules.
- The gallery cards are intentionally delayed by lazy loading, viewport reveal logic, and staggered animation.
- Mobile/high-DPR browsers choose large `1200w` gallery images, so slower connections wait on several image downloads at once.

## How I Tested

Environment:

- Repo: `/Users/quentinthiessen/portfolio1`
- Viewport: mobile `390x844`, DPR 3
- Dev URL: `http://localhost:3000/`
- Built preview URL: `http://localhost:4173/`
- Browser automation: Playwright Chromium
- Production preview was rebuilt from source for the remediation pass.

I measured:

- first paint and first contentful paint
- when the hero and gallery image requests start
- how long gallery images take after scrolling to `#work`
- whether cards are hidden by animation even when images are already downloaded
- console warnings/errors

## Key Measurements

### Local Dev Server, Fast Local Network

- First contentful paint: about `224ms`
- Gallery card component request: about `189ms` to `572ms` depending run
- Gallery image requests: about `0.9s` to `1.4s`
- Gallery images ready after scrolling to work: about `0.7s`

This is acceptable locally, but it already shows the delayed chain: gallery code first, then lazy image requests later.

### Local Dev Server, Fast 4G + 4x CPU Slowdown

- First contentful paint: about `17.5s`
- React dev client module: about `1.0MB`, took about `16.1s`
- Lucide dev module: about `1.0MB`, took about `13.6s`
- Motion dev module: about `437KB`, took about `10.0s`
- Hero image did not even start until about `17.5s`
- Gallery images started around `20.6s`
- Gallery images ready after scroll: about `6.6s`

This reproduces the "why is the page taking forever to become real?" feeling in dev mode. The dev server is the main villain here.

### Built Preview, Fast Local Network

- First contentful paint: about `176ms`
- Main JS transfer: about `85KB`, decoded about `275KB`
- Motion vendor transfer: about `48KB`, decoded about `145KB`
- Interactive artwork chunk transfer: about `3.7KB`, decoded about `9KB`
- Gallery images ready after scroll: about `0.7s`

This is much healthier than dev mode.

### Built Preview, Fast 4G + 4x CPU Slowdown

- First contentful paint: about `1.18s`
- Main JS completed around `1.05s`
- Hero image started around `1.12s`, completed around `3.29s`
- Gallery images started around `1.44s`
- Largest gallery image, `liquid-perception-1200.webp`, took about `4.0s`
- Gallery images ready after scroll: about `4.26s`

This is the real production concern: the built site is not broken, but the gallery can still feel delayed on phone-like conditions.

## Pre-Remediation Findings

This section records the original problems found before the implemented fixes
below. Some wording intentionally describes the old behavior that has since been
removed.

### 1. Dev Mode Makes The Page Look Much Slower Than The Real Build

Evidence:

- `index.html` loads `/src/main.tsx` in dev.
- Vite then serves individual modules such as React DOM, Motion, Lucide, sections, hooks, shader files, and component files separately.
- In throttled dev mode, React DOM and Lucide each transferred about `1.0MB` unbundled.

Relevant files:

- `index.html`
- `vite.config.ts`
- `package.json`

Meaning:

If Quentin is judging speed from `npm run dev`, the page is wearing ankle weights. The built preview is much closer to reality.

### 2. The Hero Image Is Not Discoverable Until JavaScript Runs

Evidence:

- `index.html` has no hero image markup or preload.
- The hero image is rendered by React in `src/sections/HeroSection.tsx`.
- On built fast 4G, the hero image request started around `1.12s`, after JS had loaded and rendered.

Relevant files:

- `index.html:19-32`
- `src/sections/HeroSection.tsx:48-59`

Meaning:

The browser cannot start downloading the main hero art immediately from HTML. It must first fetch JS, run React, build the component tree, then discover the image. That makes the hero appear later than it could.

### 3. The Hero Wordmark Starts WebGL Work And Triggers GPU Stall Warnings

Evidence:

- Console repeatedly showed Chromium warnings: `GPU stall due to ReadPixels`.
- The warning appears while `ShaderTextWord` renders WebGL output into a 2D canvas path.
- This affects hero and section shader text, especially on slower devices.

Relevant files:

- `src/components/HeroTitleHybrid.tsx:97-129`
- `src/components/shared/ShaderTextWord.tsx:483-620`
- `src/components/shared/ShaderTextWord.tsx:680-704`

Meaning:

This is not the main network delay, but it is a real render-cost warning. The shiny text is doing expensive visual work. On weaker phones, this can make the first viewport feel like it is fighting the device.

### 4. Gallery Cards Are Lazy Code-Split, Lazy-Image Loaded, And Animated In

Evidence:

- `GallerySection` lazy-loads `InteractiveArtworkCard`.
- Each card image uses `loading="lazy"`.
- `StaggerContainer` starts hidden and only reveals when in view.
- Each `StaggerItem` animates from `opacity: 0` and `y: 30`.

Relevant files:

- `src/sections/GallerySection.tsx:1-8`
- `src/sections/GallerySection.tsx:46-64`
- `src/components/InteractiveArtworkCard.tsx:166-179`
- `src/components/StaggerContainer.tsx:18-40`
- `src/components/StaggerContainer.tsx:78-96`

Meaning:

This is the biggest "cards appear late" mechanism. The site is basically saying: "Do not load cards fully yet. Do not load images yet. Do not show cards until they enter view. Then reveal them one by one." That can look intentional when fast, but on mobile it can feel like lag.

### 5. On Mobile DPR 3, Cards Pull `1200w` Images

Evidence:

- Mobile viewport was `390px` wide with DPR 3.
- Gallery `sizes` says mobile images are `100vw`.
- Browser chose `1200w` variants.
- Four gallery images loaded together:
  - `liquid-perception-1200.webp`: about `346KB`
  - `psychedelic-bathroom-scream-1200.webp`: about `175KB`
  - `ferdigcop-video-poster-1200.webp`: about `118KB`
  - `psychedelic-bathroom-portrait-1200.webp`: about `62KB`

Relevant files:

- `src/utils/images.ts:56-57`
- `src/utils/images.ts:101-103`
- `src/utils/images.ts:129-130`

Meaning:

The image sizes are not insane, but the first gallery card alone is chunky. On phone-like conditions, the largest gallery image took about `4s`.

### 6. Smooth Scroll + Stagger Animation Adds Visible Delay

Evidence:

After scrolling to the gallery in built preview:

- At `0ms`, grid opacity was `0`, item opacity was `0`.
- At `350ms`, first item was about `0.55`, second only about `0.02`.
- At `700ms`, fourth item was still only about `0.27`.
- At `1200ms`, all cards reached opacity `1`.

Relevant files:

- `src/index.css:880-883`
- `src/components/StaggerContainer.tsx:22-40`
- `src/components/StaggerContainer.tsx:78-96`

Meaning:

Some of the perceived slowness is deliberate animation, not network. It looks cinematic when everything is loaded. It looks like the page is sleepy when images are still loading too.

### 7. `content-visibility: auto` Defers Below-Fold Work On Purpose

Evidence:

- Gallery, About, and Contact use `.deferred-section`.
- `.deferred-section` uses `content-visibility: auto`.
- `#work` has a large intrinsic placeholder size.

Relevant files:

- `src/sections/GallerySection.tsx:16-20`
- `src/index.css:889-904`

Meaning:

This is usually a good performance choice. It protects initial load by postponing below-fold rendering. The tradeoff is that lower sections may visibly "wake up" as the user scrolls.

## Root Cause Summary

The page feels slow for two different reasons:

1. In dev mode, Vite is loading a big pile of unbundled development JavaScript. That can make first paint and hero discovery extremely slow under phone-like throttling.
2. In the real built site, the gallery is intentionally deferred: lazy component, lazy images, content visibility, and staggered reveal. On mobile-like network/CPU, those layers stack into a visible delay before cards feel fully present.

The assets are not wildly oversized for a visual art portfolio, and the 9.4MB video is not loaded during normal page load. The slow feeling is mostly the load order and reveal strategy, not a single giant media file being downloaded immediately.

## Recommended Fix Plan

Smallest realistic path:

1. Add hero image preloading in `index.html`.
   - This lets the browser start the hero image before React runs.
   - Include the responsive `imagesrcset` / `imagesizes` shape so mobile still chooses the right file.

2. Make the first one or two gallery cards more eager.
   - Remove `loading="lazy"` from the first visible gallery card, or pass a priority flag for the first card.
   - Keep the lower cards lazy.

3. Soften the gallery reveal delay on mobile.
   - Reduce `staggerDelay` from `0.15` to something like `0.06` on mobile, or skip stagger for first gallery paint.
   - Keep the psychedelic identity, but stop hiding already-loaded cards for over a second.

4. Recheck the shader text path.
   - The GPU stall warning should be investigated separately.
   - A practical fix may be using static fallback on mobile first paint, then upgrading to shader after idle time.

5. Judge speed from built preview, not `npm run dev`.
   - Use `npm run build` and `npx vite preview --host=0.0.0.0 --port=4173` for real speed checks.

## What I Would Not Blame First

- The gallery video. It is `9.4MB`, but it is only used in the modal path, not the initial card grid load.
- Dormant `src/assets` archive weight. It is source/archive bloat, not direct runtime page weight.
- The image optimizer contract. The generated images exist and are reasonably compressed.

## Priority

1. Hero preload: high impact, low risk.
2. First gallery card priority loading: high impact for perceived speed, medium risk because it changes load priority.
3. Mobile stagger reduction: medium impact, low risk.
4. Shader idle/defer strategy: potentially high impact, higher complexity.
5. Dev/prod measurement documentation: low effort, prevents false panic.

## Implemented Remediation

Implemented on 2026-05-04:

- Added responsive hero image preload in `index.html`.
- Removed the render-blocking Typekit stylesheet path and kept the site on the local/system font stack.
- Replaced Lucide barrel imports with direct icon imports.
- Removed the lazy `InteractiveArtworkCard` chunk and Suspense placeholder from the gallery path.
- Added `imageLoading` and `imageFetchPriority` controls to `InteractiveArtworkCard`.
- Made the first gallery card eager and kept later card images lazy/low priority.
- Added a mobile fast-preview path for the first eager gallery card: phones show the small `560w` preview quickly, then switch to the responsive `srcset` so high-DPR devices can upgrade to `1024w`.
- Deferred image `src` / `srcset` assignment for lower-priority gallery cards until each card is near the viewport; `loading="lazy"` alone was not enough because the gallery sits directly below the hero.
- Idle-gated below-fold About, Contact, and Footer imports so their chunks are no longer part of immediate first-render work.
- Added `1024w` gallery variants and regenerated `public/images`.
- Changed gallery mobile `sizes` to `calc(100vw - 4.125rem)`.
- Removed `content-visibility` from the gallery section only; About and Contact still use deferred rendering.
- Added `mobileFastReveal` to `StaggerContainer`, keeping mobile shells visible and shortening mobile stagger timing.
- Changed `ShaderTextWord` so compact phone widths `<640px` use the static CSS fallback while narrow browser/tablet widths can still render the liquid shader.
- Kept reduced-motion and headless/no-real-GPU validation paths on the static fallback without creating WebGL work.
- Split the WebGL shader renderer into a separate production chunk so compact mobile first load does not parse it.
- Split below-fold About, Contact, and Footer sections out of the first mobile JS bundle.
- Added `scripts/measure-load-performance.mjs` and `npm run perf:mobile`.
- Updated README/testing docs to say built preview is the performance truth, not `npm run dev`.
- Added `knip`, dependency-audit, and strict TypeScript hygiene gates so dead exports, unlisted dependencies, and loose React typing are caught by tooling.

Final production build shape from the 2026-05-05 validation run:

- Main app JS: `87.81KB` gzip.
- Motion vendor chunk: `47.94KB` gzip.
- Shader renderer chunk: `6.82KB` gzip.
- Below-fold About, Contact, Footer, and related icon/button chunks: split out of the initial app file.
- Hero `1440w` image: `59.4KB`, down from about `89.6KB`.
- First gallery mobile preview: `61.4KB`.

Final mobile built-preview probe:

- URL: `http://localhost:4173/`
- Viewport: `390x844`, DPR 3
- Network/CPU: Fast 4G + 4x CPU slowdown
- First contentful paint: `628ms`
- Hero image request start: `166ms`
- Lower-priority gallery images requested before scroll: `0`
- First gallery image visible after scrolling to `#work`: `624ms`
- First gallery image upgraded to `1024w` after scrolling to `#work`: `2577ms`
- First gallery final source: `/images/liquid-perception-1024.webp`
- First gallery card opacity: `1`
- Gallery grid opacity: `1`
- Mobile shader canvas count: `2`
- Compact mobile stayed inside the performance thresholds while preserving the visible hero shader treatment.
- Console GPU stall / ReadPixels warnings: none
- Probe failures: none

2026-05-14 follow-up:

- Fixed a regression where the first mobile gallery image could remain on the `560w` fast-preview candidate instead of switching to the responsive `srcset`.
- Tightened `npm run perf:mobile` so it now requires the first gallery image to resolve beyond the preview candidate.
- Latest built-preview probe after the fix: FCP `688ms`, hero request start `183ms`, first gallery ready after scroll `573ms`, first gallery upgrade after scroll `889ms`, final first gallery source `/images/liquid-perception-1024.webp`, lower-priority gallery requests before scroll `0`, console warnings/errors `0`, probe failures `0`.

Previous Lighthouse mobile result from the original remediation pass:

- Performance score: `94`
- Accessibility score: `100`
- Best practices score: `100`
- SEO score: `100`
- FCP: `2.2s`
- LCP: `2.6s`
- Speed Index: `2.2s`
- Total Blocking Time: `0ms`
- CLS: `0`
- TTI: `2.6s`
- Added `public/robots.txt` after Lighthouse flagged the missing file as invalid crawler output from the app shell fallback.
- Note: the first Lighthouse attempt failed because the Lighthouse CLI could not find a system Chrome install. The successful run used Playwright's bundled Chrome-for-testing via `CHROME_PATH`.

## Validation Used

- Real mobile viewport browser checks with Playwright.
- Dev server measurement at `http://localhost:3000/`.
- Built preview measurement at `http://localhost:4173/`.
- Network and CPU throttling to approximate slower mobile conditions.
- Console scan for warnings and errors.
- `npm run optimize-images`
- `npm run check`
- `npm run test:e2e`
- `npm audit --audit-level=moderate`
- `npm run perf:mobile`
- Lighthouse mobile against built preview during the original remediation pass.

## Remaining Unverified

- I did not test on a physical iPhone/Safari device.
- The performance numbers are local lab measurements, not field data from real visitors.
