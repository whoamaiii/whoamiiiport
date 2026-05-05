# Accessibility Guide

## Core Rules

1. Use native HTML semantics first.
2. Add ARIA only when native semantics cannot express the required behavior.
3. Decorative animation must never be the only accessible source of meaning.
4. Focus movement must be explicit and testable.

## Skip Link

- The skip link lives in [`src/App.tsx`](../src/App.tsx).
- It targets `#main-content`.
- The main element is programmatically focusable with `tabIndex={-1}`.
- Clicking or activating the skip link must both update the hash and move focus to `main`.

## Heading and Landmark Naming

- Named sections use `aria-labelledby` only when the referenced heading ID exists.
- [`src/sections/GallerySection.tsx`](../src/sections/GallerySection.tsx) uses [`src/components/ShaderHeading.tsx`](../src/components/ShaderHeading.tsx) with a pass-through `id` and the gallery visual variant.
- The gallery eyebrow and subtitle are supporting text only. The named artwork region must keep deriving its accessible name from the live `h2`.
- [`src/sections/AboutSection.tsx`](../src/sections/AboutSection.tsx) uses [`src/components/ShaderHeading.tsx`](../src/components/ShaderHeading.tsx) with a stable semantic label.
- [`src/sections/ContactSection.tsx`](../src/sections/ContactSection.tsx) uses [`src/components/ShaderHeading.tsx`](../src/components/ShaderHeading.tsx), keeping decorative visual lines separate from the accessible heading name.

## Overlay Rules

- Mobile menu and artwork modal use [`src/hooks/useOverlayBehavior.ts`](../src/hooks/useOverlayBehavior.ts).
- When an overlay opens:
  - focus moves into it
  - body scrolling is locked
  - Escape closes it
  - Tab stays inside it
- When an overlay closes:
  - focus returns to the trigger when available
  - scroll locking is cleaned up

## Motion Policy

- Reduced-motion preference comes from [`src/hooks/useReducedMotion.ts`](../src/hooks/useReducedMotion.ts).
- Decorative cursor and parallax behavior must not be required for comprehension.
- Offscreen or hidden shader effects should pause when possible.

## Decorative Text Pattern

Use this pattern for any decorative text effect:

1. The semantic heading or control owns the real accessible name.
2. A screen-reader-only text node repeats that stable label if needed.
3. The animated visual subtree is marked `aria-hidden="true"`.

Do not make canvas, shader, or animation output the only heading label.

## Browser Validation

Accessibility regressions are validated in:

- [`tests/e2e/smoke.spec.ts`](../tests/e2e/smoke.spec.ts)
- [`tests/e2e/accessibility.spec.ts`](../tests/e2e/accessibility.spec.ts)

Those tests cover focus transfer, region naming, modal behavior, mobile menu trapping, and axe scans for the homepage and artwork modal.
