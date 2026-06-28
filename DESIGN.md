# Whoamiii Portfolio Design System

## 1. Atmosphere & Identity

This portfolio should feel like stepping into a living altered-state archive: intimate, dark, liquid, and image-led. The signature is refracted glass over psychedelic portraiture, with cyan-white caustics and restrained warm spectral notes carrying the identity. Mobile clarity outranks desktop spectacle until the mobile version is explicitly finished.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | --surface-primary | #09090b | #09090b | Page background and dark sections |
| Surface/secondary | --surface-secondary | #111216 | #111216 | Glass interiors and section cards |
| Surface/elevated | --surface-elevated | #18181b | #18181b | Modal and overlay depth |
| Surface/glass | --surface-glass | rgba(255,255,255,0.10) | rgba(255,255,255,0.10) | Refracted panels, buttons, artwork frames |
| Text/primary | --text-primary | #f6f2ee | #f6f2ee | Headlines and primary copy |
| Text/secondary | --text-secondary | #e8e5e2 | #e8e5e2 | Kicker text and body copy |
| Text/muted | --text-muted | #a1a1aa | #a1a1aa | Captions, footer text, secondary labels |
| Border/glass | --border-glass | rgba(255,255,255,0.18) | rgba(255,255,255,0.18) | Glass edge refraction |
| Border/subtle | --border-subtle | rgba(255,255,255,0.10) | rgba(255,255,255,0.10) | Dividers and low-emphasis frames |
| Accent/primary | --accent-primary | #67e8f9 | #67e8f9 | Focus rings, active controls, primary CTA |
| Accent/secondary | --accent-secondary | #a8d6d4 | #a8d6d4 | Gallery headings and soft spectral highlights |
| Accent/warm | --accent-warm | #f5dec0 | #f5dec0 | Warm caustic highlights |
| Accent/rose | --accent-rose | #d68a78 | #d68a78 | Human warmth in shader gradients |
| Spectral/deep | --spectral-deep | #944468 | #944468 | Rare low-opacity undertone, never a primary CTA |
| Spectral/blue | --spectral-blue | #7ea9b6 | #7ea9b6 | Cool secondary shader endpoint |

### Rules

- The primary accent is cyan. Purple and fuchsia may appear only as low-opacity spectral undertones tied to artwork or shader texture.
- CTAs and focus states use cyan, glass, or warm caustic tones rather than purple-pink gradients.
- Page-level surfaces stay dark zinc/off-black. Avoid pure black except inside image overlays where existing artwork contrast requires it.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display/mobile | clamp(3.02rem, 16.2vw, 4.72rem) | 900 italic | 0.78 | -0.055em | Hero wordmark |
| Display/desktop | clamp(3.1rem, 8vw, 7.4rem) | 900 italic | 0.88 | -0.055em | Hero fallback |
| Section/mobile | 2.2rem to 3rem | 700 | 0.9 to 1.05 | -0.055em | Section shader headings |
| Section/desktop | 4.9rem to 6rem | 700 | 0.9 to 1.0 | -0.055em | Section headings |
| Body/lead | 1.02rem to 1.125rem | 400 to 500 | 1.55 to 1.7 | -0.01em | About and gallery support copy |
| Body | 1rem | 400 | 1.6 | 0 | Standard copy |
| Caption | 0.62rem to 0.76rem | 600 to 700 | 1.3 | 0.18em to 0.32em | Kicker labels and step labels |

### Font Stack

- Primary: Avenir Next, Helvetica Neue, ui-sans-serif, system-ui, sans-serif.
- Display: Avenir Next Condensed, Avenir Next, Helvetica Neue, sans-serif.
- Mono: system monospace only when numeric alignment is needed.

### Rules

- Hero and section headings can be expressive, but mobile headings must stay readable in the first pass without requiring scroll.
- Body text should stay sentence case unless a short label needs uppercase tracking.
- Long mobile paragraphs should use line heights near 1.6 and max widths near 24 to 32 characters.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a base of 4px.

| Token | Value | Usage |
|-------|-------|-------|
| --space-1 | 4px | Hairline gaps and optical adjustments |
| --space-2 | 8px | Icon-label gaps |
| --space-3 | 12px | Compact internal padding |
| --space-4 | 16px | Mobile page gutters and card padding |
| --space-5 | 20px | Comfortable mobile panel padding |
| --space-6 | 24px | Standard component separation |
| --space-8 | 32px | Section lockup gaps |
| --space-12 | 48px | Mobile section rhythm |
| --space-16 | 64px | Large mobile section rhythm |
| --space-20 | 80px | Desktop section rhythm |

### Grid

- Max content width: 80rem for navigation, 72rem to 80rem for main content, 64rem for artwork-heavy grids.
- Mobile: single column, 16px to 24px side gutters, no horizontal overflow.
- Desktop: asymmetric grids are allowed after `md`, but mobile must collapse to a stable single column.

### Rules

- Full-height hero sections use `min-height: 100dvh`.
- Mobile screenshots around 390px wide are the default validation surface.
- Keep first-viewport text within the viewport and clear of the header.

## 5. Components

### Glass Shell

- **Structure**: dark translucent background, 1px glass border, backdrop blur, inner highlight, tinted shadow.
- **Variants**: default glass, dark glass, artwork frame.
- **Spacing**: 16px to 24px on mobile, 32px to 64px on desktop.
- **States**: hover may shift border/light by opacity only; active uses a small scale or translate.
- **Accessibility**: content contrast must remain readable against active artwork.
- **Motion**: transform and opacity only.

### Shader Heading

- **Structure**: semantic heading with decorative shader/canvas/fallback layers.
- **Variants**: hero, gallery, default section.
- **Spacing**: heading margin uses 24px to 32px from following content.
- **States**: reduced motion disables non-essential flow.
- **Accessibility**: semantic text remains available through the heading content or aria label.
- **Motion**: caustic animation and shader frame rate respect reduced motion and mobile performance.

### Artwork Card

- **Structure**: button-wrapped image card with glass frame, overlay title, optional video marker, modal portal.
- **Variants**: artwork and video.
- **Spacing**: 8px glass inset, 16px to 24px overlay padding.
- **States**: hover/focus scale on fine pointer, focus ring in cyan, modal restores focus.
- **Accessibility**: button labels name the artwork and media type.
- **Motion**: glare and tilt disabled for reduced motion.

### Social Orb Link

- **Structure**: circular glass icon link, 48px touch target minimum.
- **Variants**: icon-only social, mail.
- **Spacing**: 16px gap between links.
- **States**: hover shifts toward cyan/warm spectral fill, active compresses slightly, focus ring in cyan.
- **Accessibility**: each link has an explicit accessible label.
- **Motion**: magnetic motion only where the existing `MagneticButton` wrapper provides it.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 120-200ms | ease-out | Button hover, active, icon color |
| Standard | 220-320ms | cubic-bezier(0.16, 1, 0.3, 1) | Glass hover, menu transitions |
| Emphasis | 480-700ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) | Section reveal |
| Hero shader shell | immediate first render | n/a | Mobile hero wordmark visual shell |
| Section shader canvas | idle after first paint | n/a | Heavier canvas enhancement after the shell is visible |

### Rules

- Animate transform, opacity, and filter only.
- Respect `prefers-reduced-motion` for shader, reveal, and scroll behavior.
- Mobile animation should preserve first paint clarity; the hero wordmark shell appears immediately and must not show a text fallback during shader preparation.

## 7. Depth & Surface

### Strategy

Depth strategy is mixed, but constrained: glass refraction for intentional surfaces, tonal dark shifts for sections, and tinted shadows only when elevation is functional.

| Level | Value | Usage |
|-------|-------|-------|
| Glass edge | inset 0 1px 0 rgba(255,255,255,0.4) | Header, card, and social refraction |
| Low frame | 1px solid rgba(255,255,255,0.10) | Card and workflow dividers |
| Elevated tint | 0 18px 54px -40px rgba(0,0,0,0.86) | Artwork cards |
| Spectral tint | 0 16px 42px -24px rgba(34,211,238,0.48) | Primary CTA and rare active controls |

### Rules

- Avoid large generic neon glows. When glow exists, it should feel like light leaking from glass or artwork.
- Fixed decorative blobs are acceptable only when subtle and anchored to artwork atmosphere. Do not add loose orb decorations as a default pattern.
- Cards should reveal actual artwork or useful content, not serve as empty decoration.
