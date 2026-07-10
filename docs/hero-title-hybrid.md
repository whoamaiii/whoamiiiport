# Hero Title Contract

`HeroTitleHybrid` is the active, hero-only decorative wordmark. It does not own
the heading semantics and is not the default heading primitive for other
sections.

## Ownership

- [`HeroSection.tsx`](../src/sections/HeroSection.tsx) owns the real `h1`, hero
  media, eyebrow, subtitle, entry action, scrim, and grain.
- [`siteCopy.ts`](../src/content/siteCopy.ts) owns `eyebrow`, `titleSemantic`,
  `titleLines`, `subtitle`, and `cta`.
- [`HeroTitleHybrid.tsx`](../src/components/HeroTitleHybrid.tsx) owns only the
  visual wordmark and its reduced-motion/static presentation.

## Required Behavior

1. The `h1` supplies the stable accessible name.
2. The decorative subtree remains `aria-hidden="true"`.
3. `data-testid="hero-title-visual"` remains stable unless its browser tests are
   updated in the same change.
4. Render failure falls back to `HeroTitleStaticFallback` without removing the
   eyebrow, semantic heading, subtitle, or CTA.
5. Reduced motion removes non-essential movement without changing content or
   hierarchy.

## Mobile QA

At approximately `390x844`, confirm the header, eyebrow, both visual title lines,
subtitle, and entry action fit the first viewport without horizontal overflow.
Check bright and dark regions of the static hero image, reduced motion, slow
image loading, and the plain fallback. Perform a desktop regression after the
mobile lockup is correct.

Do not spread the hero renderer to section headings. Those use semantic text and
the editorial Barlow Condensed system.
