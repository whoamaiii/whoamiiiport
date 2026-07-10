# UI/UX Acceptance Contract

## Locked Experience

- The hero is static, responsive, image-first, and readable in the first mobile
  viewport.
- The selected sequence contains four curated works with intentionally different
  ratios and captions outside the media.
- The process presentation is one short vertical film with three labelled stages.
- The living archive contains 49 works in six numbered chapters, keeps one
  chapter open, and mounts only the open chapter's artwork cards.
- About and contact complete one continuous editorial narrative rather than a
  collection of interchangeable panels.
- Barlow Condensed and variable Manrope are the bundled typography sources.
- Mobile `390x844` clarity has priority over desktop spectacle.

## Interaction

- The skip link targets and focuses `#main-content`.
- `#work`, `#gallery`, `#about`, `#contact`, and archive chapter hashes mount and
  align their lazy destination.
- Menu and modal trap focus, close with Escape, restore focus, and clean up body
  scroll locking.
- Chapter triggers expose expansion state and controlled-panel relationships.
- Reduced motion disables non-essential movement and automatic process playback
  without removing content.

## Media and Performance

- All artwork images resolve through generated local responsive variants.
- All video paths are explicit same-origin files under `public/videos/`.
- Hero media is eager; lower media is prioritized or deferred according to its
  place in the sequence.
- Lower page sections are lazy, closed archive chapters remain lightweight, and
  the process film pauses offscreen.

## Acceptance

The change is complete only when `npm run check:ci` and
`npm run test:e2e:preview` pass, the manual mobile/reduced-motion/keyboard passes
are clean, metadata matches the current site, and the production domain serves
the same built experience.
