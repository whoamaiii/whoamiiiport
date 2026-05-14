# Release Checklist

## Required Commands

Run all of these from the repository root:

```bash
npm run check
npm run test:e2e
```

## Manual Verification

### Hero Readability Pass

- Confirm the eyebrow, hero title, and subtitle all appear within the first viewport with the fixed header present.
- Confirm the static hero image keeps the subtitle readable across the first mobile viewport.
- Confirm the localized readability mask supports the left-aligned lockup without turning into a visible muddy blob or full-frame dark wash.
- Check a narrow mobile viewport and confirm the eyebrow, title, and subtitle keep controlled line breaks without overlap.

### Gallery Intro Pass

- Confirm the gallery eyebrow, heading, and subtitle appear before the artwork grid and read as one lockup.
- Confirm the gallery region is still named from `Selected Works.` and not from the eyebrow or subtitle.
- Check a narrow mobile viewport and confirm the gallery title still fits without ugly overflow or clipped shader text.
- Confirm the old neon underline is gone and the section still feels anchored without it.
- Confirm the ambient background and gallery card glow do not add a red or magenta cast over the whole artwork grid.

### Keyboard Pass

- Tab to the skip link.
- Activate it and confirm focus lands on main content.
- Open an artwork modal, verify focus enters it, then press Escape and confirm focus returns to the artwork trigger.
- Open the mobile menu on a narrow viewport, verify focus is trapped, then press Escape and confirm focus returns to the menu button.

### Reduced-Motion Pass

- Enable reduced motion in the browser or OS.
- Confirm `HeroTitleHybrid` switches to a static presentation without losing readability or hierarchy.
- Confirm the eyebrow, semantic heading, and subtitle remain readable without depending on parallax, sheen, or motion-only meaning.
- Confirm core text and navigation remain readable without depending on parallax, cursor-follow, or motion-only meaning.
- Confirm the gallery intro remains readable and intentional even if shader animation pauses or never starts.

### Fallback Pass

- Confirm the hero title remains readable if the decorative wordmark layer fails or is disabled.
- Confirm the semantic heading still exposes `Altered Perceptions.` even if the decorative layer is unavailable.
- Confirm the subtitle remains readable during fallback and is not visually dependent on the decorative title effect.
- Confirm shader headings remain readable if the effect falls back.
- Confirm interactive content still works if decorative effect layers fail.

## Preview Verification

- Validate the preview deployment builds from `dist/`.
- Confirm static assets load correctly.
- Confirm hashed build assets are cacheable.
- Verify the hero lockup still renders cleanly in preview, including the decorative title, eyebrow, and subtitle.
- Verify the system font stack keeps non-hero typography usable on the target platform.
- Verify gallery video manifest paths resolve from `public/videos/` on the preview host.

## Production Domain Verification

- Confirm GitHub Pages reports `status: built`, `source.branch: gh-pages`, and `cname: whoamiii.art`.
- Confirm Cloudflare DNS has the four GitHub Pages A records for `whoamiii.art`.
- Confirm Cloudflare DNS has `www` as a DNS-only CNAME to `whoamaiii.github.io`.
- Confirm `http://whoamiii.art/` returns `200 OK`.
- Confirm `http://www.whoamiii.art/` redirects to `http://whoamiii.art/`.
- Confirm `https://whoamiii.art/` returns a valid certificate and `200 OK` before marking HTTPS complete.

## Security and Header Review

Expected host support:

- CSP and security headers configured at the static host level, not in this repo
- CSP that allows same-origin images/videos and any required `data:` or `blob:` sources for effect fallbacks
- standard static-site security headers as supported by the host
- Production error monitoring is not currently wired. [`src/lib/reportError.ts`](../src/lib/reportError.ts) logs only in development, so a release should not claim production telemetry unless that adapter is deliberately expanded.

## Release Stop Conditions

Do not release if any of the following are true:

- skip-link focus is broken
- a named region or major heading lacks a stable accessible name
- the hero subtitle becomes unreadable over the static hero image
- reduced-motion mode leaves the hero dependent on decorative motion
- hero-title fallback leaves the first viewport blank or visually broken
- `npm run check` fails
- `npm run test:e2e` fails
- the preview deployment differs materially from local behavior
