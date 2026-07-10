# Accessibility Guide

## Core Contract

1. Use native semantics before ARIA.
2. Keep the semantic name independent from decorative rendering.
3. Make focus movement explicit and testable.
4. Provide equivalent information and control with reduced motion enabled.
5. Preserve keyboard and touch operation at the mobile-first layout.

## Page Structure and Deep Links

- The skip link in [`src/App.tsx`](../src/App.tsx) targets `#main-content`, moves
  focus to the programmatically focusable `main`, and updates the hash.
- Each major section has a stable heading ID and derives its accessible name from
  the real semantic heading.
- `#work`, `#gallery`, `#about`, `#contact`, and archive chapter anchors may point
  to lazily mounted content. [`usePortfolioSectionLoading`](../src/hooks/usePortfolioSectionLoading.ts)
  mounts the owning section and realigns it while earlier content changes height.
- A loading fallback uses `role="status"` and an explicit label; it must not
  replace the final section landmark.

## Headings and Artwork

- The hero `h1` owns the accessible name. Its custom wordmark is decorative and
  `aria-hidden`.
- Selected work, archive, about, and contact use plain semantic headings styled
  through the editorial type system.
- Artwork triggers name the work, identify video when applicable, and open a
  labelled dialog. Captions outside the frame do not replace the trigger name.
- Archive chapter buttons expose `aria-expanded` and `aria-controls`; the panel
  exists only while its chapter is open.

## Overlay Behavior

The mobile menu and artwork modal both use
[`src/hooks/useOverlayBehavior.ts`](../src/hooks/useOverlayBehavior.ts). When an
overlay opens, focus moves inside, body scrolling is locked, Tab remains inside,
and Escape closes it. On close, focus returns to the original trigger and scroll
locking is removed.

Do not make the fixed page header keyboard-reachable while the mobile menu is
open. External profile links must retain a readable label, not rely on the arrow
icon.

## Motion and Media

- All decorative JS motion is gated by
  [`useReducedMotion`](../src/hooks/useReducedMotion.ts); the CSS reduced-motion
  query disables non-essential transitions and smooth scrolling.
- The process film does not autoplay for reduced-motion users, pauses offscreen,
  and always exposes a labelled playback control.
- Artwork video uses a poster and native controls in the modal. Motion or video
  must never be the only source of meaning.
- Decorative SVGs, grain, scrims, and line marks remain hidden from assistive
  technology and pointer-inert.

## Validation

Vitest checks component semantics and overlay contracts. Playwright checks
skip-link focus, direct hashes, named sections, menu/modal focus behavior, mobile
overflow, and axe scans on the base page and artwork dialog. See
[`testing.md`](./testing.md) and [`release-checklist.md`](./release-checklist.md).
