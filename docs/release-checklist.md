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
- Inspect at least one bright video moment and one dark video moment. The subtitle must stay readable in both.
- Confirm the localized readability mask supports the left-aligned lockup without turning into a visible muddy blob or full-frame dark wash.
- Check a narrow mobile viewport and confirm the eyebrow, title, and subtitle keep controlled line breaks without overlap.

### Gallery Intro Pass

- Confirm the gallery eyebrow, heading, and subtitle appear before the artwork grid and read as one lockup.
- Confirm the gallery region is still named from `Selected Works.` and not from the eyebrow or subtitle.
- Check a narrow mobile viewport and confirm the gallery title still fits without ugly overflow or clipped shader text.
- Confirm the old neon underline is gone and the section still feels anchored without it.

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
- Verify Adobe Fonts still load for the rest of the site, or that fallback fonts keep non-hero typography usable.

## Security and Header Review

Expected host support:

- CSP that allows the Adobe Fonts stylesheet
- any required `data:` or `blob:` sources for effect fallbacks
- standard static-site security headers as supported by the host

## Release Stop Conditions

Do not release if any of the following are true:

- skip-link focus is broken
- a named region or major heading lacks a stable accessible name
- the hero subtitle becomes unreadable over video
- reduced-motion mode leaves the hero dependent on decorative motion
- hero-title fallback leaves the first viewport blank or visually broken
- `npm run check` fails
- `npm run test:e2e` fails
- the preview deployment differs materially from local behavior
