# Hero Title Hybrid

## Overview

`HeroTitleHybrid` is the active hero title system for the landing view. It replaces the retired WebGL hero-title path with a calmer, more deterministic split between semantic meaning and decorative rendering:

- semantic meaning stays in the hero `h1`
- the decorative title is a hero-only custom wordmark visual layer
- the decorative subtree stays `aria-hidden="true"`
- browser regression coverage targets `data-testid="hero-title-visual"`

This system is intentionally hero-scoped. It should not become the default heading primitive for the rest of the site.

## Ownership Boundaries

- [`src/sections/HeroSection.tsx`](../src/sections/HeroSection.tsx) owns hero composition, media layering, eyebrow placement, subtitle placement, and the localized readability mask.
- [`src/content/siteCopy.ts`](../src/content/siteCopy.ts) owns the structured hero copy contract:
  - `eyebrow`
  - `titleSemantic`
  - `titleLines`
  - `subtitle`
- `HeroTitleHybrid` owns the decorative wordmark rendering, reduced-motion behavior, and readable fallback behavior.

## Rendering Contract

The hero title uses two layers that must remain separate:

1. **Semantic layer**
   - The `h1` owns the accessible name.
   - Screen-reader output must remain stable even if the decorative title is unavailable.

2. **Decorative layer**
   - The custom wordmark should render as a single visual composition.
   - The subtree stays `aria-hidden="true"`.
   - Tests may target `data-testid="hero-title-visual"` only to confirm decorative presence, not to infer semantic meaning.

## Fallback and Motion Rules

- Reduced motion must disable decorative motion, not legibility.
- If decorative initialization fails, the hero still needs a plain readable title presentation.
- Decorative failure must never remove the semantic heading, eyebrow, or subtitle.
- If any time-based decorative behavior is retained, it should pause when the document is hidden.

## Manual QA Expectations

Every hero-title change should be checked against these real-world conditions:

- the hero heading is readable in the first viewport with the fixed header present
- the eyebrow, wordmark, and subtitle remain readable over both bright and dark video moments
- the subtitle line length stays controlled on narrow mobile widths
- reduced-motion mode keeps the lockup readable and visually intentional
- fallback mode still shows a readable hero title without relying on the decorative layer

## Non-Goals

- Do not turn the custom wordmark into a site-wide typography system.
- Do not reintroduce multi-word WebGL hero rendering as the default hero path.
- Do not widen the hero title system into a CMS, localization framework, or global copy abstraction.
