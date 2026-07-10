# Wet Signal Design System

## Direction

Whoamiii should feel like a living archive encountered at night: cinematic,
personal, tactile, and slightly unstable. The art is the spectacle. Interface
elements behave like an editorial index—lines, numbers, captions, generous dark
space, and abrupt changes of scale—rather than a product dashboard.

The design must remain handcrafted. Avoid repeated panels, generic gradients,
decorative technology, and interchangeable portfolio cards.

## Typography

- **Display:** Barlow Condensed, bundled through `@fontsource/barlow-condensed`.
  Use it for large uppercase headings, chapter titles, and the hero wordmark.
- **Body:** Manrope Variable, bundled through `@fontsource-variable/manrope`.
  Use it for navigation, captions, prose, and controls.
- **Fallbacks:** `Arial Narrow` for display and the system sans-serif stack for
  body copy.

Display typography is narrow, uppercase, light-to-regular in weight, and tightly
set. Body copy stays sentence case with generous line height. Kicker labels use
small uppercase text with wide tracking. Do not substitute local platform fonts;
the bundled files make the composition deterministic.

## Color and Material

The active tokens are defined in [`src/index.css`](./src/index.css):

| Role | Value | Use |
| --- | --- | --- |
| `--surface-primary` | `#08090b` | Page and primary section ground |
| `--surface-secondary` | `#0d1116` | Tonal section separation |
| `--surface-elevated` | `#141920` | Functional overlay depth |
| `--text-primary` | `#eee5d8` | Display and primary copy |
| `--text-secondary` | `#d8d2ca` | Body copy |
| `--text-muted` | `#8f949b` | Captions and metadata |
| `--line-primary` | `rgba(238, 229, 216, 0.72)` | Major rules and controls |
| `--line-subtle` | `rgba(238, 229, 216, 0.18)` | Quiet dividers |
| `--accent-primary` | `#79b7c7` | Cool focus and rare emphasis |
| `--accent-warm` | `#c89b79` | Warm secondary emphasis |

Artwork supplies the saturated color. Interface color stays restrained. A fixed,
low-opacity grain layer adds physical texture; it must remain pointer-inert and
must not reduce text or image clarity.

## Composition

- Mobile is the primary design surface, with a minimum supported width of
  `320px` and routine QA at `390x844`.
- Section content uses fluid side gutters and a maximum width of `90rem`.
- Full-bleed artwork alternates with dense editorial labels and open negative
  space.
- Ruled links use a mark, label, and diagonal arrow. They are navigation or
  playback controls, never decorative boxes.
- Image ratios vary deliberately—portrait, square, landscape, and tall—to avoid
  a template grid.
- Desktop may become more asymmetric, but it must preserve the mobile reading
  order and not weaken touch clarity.

## Section Language

### Hero

The hero is a static, responsive photograph with controlled parallax, a localized
scrim, restrained grain, the semantic title, and a hero-only decorative wordmark.
The eyebrow, title, subtitle, and archive entry link must read in the first mobile
viewport.

### Selected Work

Four works form an intentionally staggered editorial sequence. Captions live
outside the media frame. The entire media trigger opens the artwork modal; it
must expose the work title and media type to assistive technology.

### Process Laboratory

One vertical film communicates the transformation from ordinary image to living
surface. It loads near the viewport, pauses offscreen, exposes a visible playback
control, and does not autoplay for reduced-motion users.

### Living Archive

The archive is an index of six numbered chapters. One chapter may be open at a
time. Each closed chapter retains a lead image, title, count, and action; opening
it progressively mounts that chapter's artwork grid and notes.

### About and Contact

The artist portrait and statement use image scale and typography rather than a
profile card. Contact ends the narrative with a large invitation and a direct,
full-width email action.

## Interaction and Motion

- Motion must explain reveal, hierarchy, or spatial continuity.
- Prefer transforms and opacity; avoid layout-thrashing animation.
- Fine-pointer and large-viewport effects stay gated by capability.
- `prefers-reduced-motion` removes non-essential movement and automatic video
  playback without hiding information.
- Artwork modal and mobile menu are true overlays: focus enters, remains trapped,
  closes with Escape, and returns to the trigger.
- Hover has a corresponding focus state; touch targets remain comfortably
  operable on mobile.

## Visual QA

For every material design change:

1. Review the first viewport at `390x844`.
2. Scroll the complete mobile sequence and inspect wrapping, framing, rhythm,
   touch targets, and horizontal overflow.
3. Open the menu, an artwork modal, the process controls, and an archive chapter.
4. Repeat with reduced motion.
5. Perform one desktop regression pass after mobile is coherent.

The release bar is not only “works.” The page should still feel authored when
motion is disabled, images are loading, a chapter is closed, or a deep link opens
before lower sections have mounted.
