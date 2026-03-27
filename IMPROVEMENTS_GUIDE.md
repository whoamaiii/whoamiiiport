# Implementation Guide

This file now reflects the shipped changes plus the safest remaining follow-ups. The earlier version overreached and included a few snippets that were not ready to paste directly into production.

---

## Implemented In This Repo

### 1. Hero Hierarchy

- The competing `WHOAMIII` hero badge is removed.
- The animated emphasis now sits on the period after `Perceptions`.
- The heading keeps a stable accessible name via `aria-label`.

Files:
- `src/App.tsx`

### 2. Scroll Progress

- A dedicated `ScrollProgress` component now renders a thin fixed gradient line.
- It respects reduced motion by not mounting when `prefers-reduced-motion` is enabled.

Files:
- `src/components/ScrollProgress.tsx`
- `src/App.tsx`

### 3. Gallery Card Polish

- The card keeps the existing tilt/glare behavior.
- The cursor-following glow uses Motion values and `useMotionTemplate`, which avoids React re-renders on every mouse move.
- The overlay now shows only the title and a single CTA.
- Keyboard focus now triggers the overlay via the button-level `group` class.

Files:
- `src/components/InteractiveArtworkCard.tsx`

### 4. Reduced Motion First Paint

- `useReducedMotion` now reads the current media query during state initialization, so reduced-motion users do not get an avoidable animated first render.

Files:
- `src/hooks/useReducedMotion.ts`

---

## Safer Remaining Follow-ups

These are still optional. They should be treated as design directions, not as done work.

### Ambient Particles

If we add this later, keep it scoped to the contact section only.

- Render inside the section, not as a full-page fixed canvas.
- Gate it behind `prefers-reduced-motion`.
- Cap the frame budget aggressively.
- Do visual QA on mobile before shipping.

### Section Transitions

If we add transition treatments later:

- Prefer subtle gradient shifts over heavy masking.
- Test readability at section boundaries first.
- Keep the section backgrounds distinct enough that the page still scans cleanly.

### Button Ripple

If we add ripple later:

- Do not wrap a `<button>` inside an `<a>` or vice versa.
- Apply the effect to the interactive element that already exists.
- Keep the ripple decorative and `pointer-events-none`.

### Cursor Trail

If we add this later:

- Treat it as a last-pass polish item, not a core interaction.
- Ship it only on fine pointers.
- Keep the count extremely low so it does not compete with the cursor, noise, blobs, and card glow already on the page.

---

## Verification Checklist

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

Expected outcomes:

- The hero is cleaner and the headline reads first.
- The top progress bar tracks scrolling.
- Gallery cards feel lighter and less text-heavy.
- Reduced-motion users do not get the avoidable first-paint motion mismatch.
