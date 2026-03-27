# Whoamiii — Psychedelic Art Portfolio

A psychedelic artist portfolio built with React 19, Vite, Tailwind CSS 4, responsive local artwork assets, and a preserved custom glassmorphism subsystem for future use.

## Quick Start

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run clean` | Remove `dist/` directory |
| `npm run lint` | Type-check with TypeScript |
| `npm run test` | Run Vitest unit checks |
| `npm run test:e2e` | Run Playwright smoke tests |

## Project Structure

```
src/
├── main.tsx              # React entry point
├── App.tsx               # Main portfolio layout (hero, gallery, about, contact)
├── index.css             # Tailwind config, glass utilities, animations
├── assets/               # Local artwork images
│   └── first10/          # Curated selection
└── glass-effect/         # Glassmorphism engine (see below)
    ├── index.tsx          # GlassLayer — public component
    ├── types.ts           # TypeScript interfaces
    ├── glass-surface.tsx  # Frosted surface renderer
    ├── shader-engine.ts   # Canvas displacement map generator
    ├── interaction-physics.ts  # Elastic deformation & spring math
    ├── svg-filter.tsx     # SVG feDisplacementMap filter chain
    ├── browser-detect.ts  # Chromium / WebKit / Gecko detection
    ├── shimmer-overlay.tsx # CSS fallback for non-Chromium browsers
    └── displacement-maps.ts # Base64 displacement textures
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animation | Motion (Framer Motion) 12 |
| Icons | Lucide React |
| Language | TypeScript 5.8 |

---

## GlassLayer Component

The `glass-effect/` module provides an interactive glassmorphism component with cursor-driven physics, SVG displacement refraction, and chromatic aberration.

### Basic Usage

```tsx
import GlassLayer from './glass-effect';

<GlassLayer>
  <p>Content rendered on the glass surface</p>
</GlassLayer>
```

### With Custom Settings

```tsx
const containerRef = useRef<HTMLDivElement>(null);

<div ref={containerRef}>
  <GlassLayer
    mouseContainer={containerRef}
    displacementScale={70}
    blurAmount={0.06}
    saturation={125}
    aberrationIntensity={1.5}
    elasticity={0.2}
    cornerRadius={999}
    padding="16px 32px"
    mode="standard"
    style={{ width: '100%', display: 'flex' }}
  >
    <span>Glass nav bar</span>
  </GlassLayer>
</div>
```

### Props (`GlassLayerConfig`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content rendered inside the glass surface |
| `displacementScale` | `number` | `70` | Strength of the SVG displacement refraction effect |
| `blurAmount` | `number` | `0.0625` | Backdrop blur multiplier (actual blur = value * 32px) |
| `saturation` | `number` | `140` | Backdrop saturation percentage |
| `aberrationIntensity` | `number` | `2` | Chromatic aberration strength at glass edges |
| `elasticity` | `number` | `0.15` | How much the surface stretches toward the cursor |
| `cornerRadius` | `number` | `999` | Border radius in pixels (999 = pill shape) |
| `padding` | `string` | `"24px 32px"` | CSS padding for inner content |
| `mode` | `DisplacementMode` | `"standard"` | Displacement texture variant |
| `overLight` | `boolean` | `false` | Enable bright-background mode (adds dimming overlay) |
| `mouseContainer` | `RefObject \| null` | `null` | Element to track mouse movement on (defaults to self) |
| `globalMousePos` | `Point2D` | — | External cursor position (bypasses internal tracking) |
| `mouseOffset` | `Point2D` | — | External normalised offset (bypasses internal tracking) |
| `className` | `string` | `""` | Additional CSS classes |
| `style` | `CSSProperties` | `{}` | Inline styles merged into the surface |
| `onClick` | `() => void` | — | Click handler (also enables hover/press visual states) |

### Displacement Modes

| Mode | Description |
|------|-------------|
| `"standard"` | Default refraction pattern — subtle, balanced distortion |
| `"polar"` | Radial coordinate variant — circular distortion from center |
| `"prominent"` | Stronger, more noticeable displacement |
| `"shader"` | Dynamically computed via canvas SDF (signed distance field) |

### Exported Types

```ts
import type { GlassLayerConfig, Point2D, DisplacementMode } from './glass-effect';

interface Point2D {
  x: number;
  y: number;
}

type DisplacementMode = "standard" | "polar" | "prominent" | "shader";
```

### How It Works

The glass effect is a multi-layer rendering pipeline:

1. **Backdrop blur + saturation** — CSS `backdrop-filter` for the frosted base
2. **SVG displacement filter** — `feDisplacementMap` with per-channel offsets creates chromatic aberration at edges (Chromium only)
3. **CSS shimmer fallback** — Conic/radial gradient overlay for Firefox and Safari
4. **Border shimmer** — Two gradient `<span>`s with mask-composite for the light-catching edge highlight
5. **Interaction physics** — Elastic deformation (scaleX/scaleY) and spring offset (translateX/Y) driven by cursor proximity

### Browser Support

| Browser | Rendering Strategy |
|---------|-------------------|
| Chrome / Edge / Opera | Full SVG filter with feDisplacementMap + chromatic aberration |
| Firefox | Backdrop blur + CSS shimmer overlay (blob URL conversion for feImage) |
| Safari | Backdrop blur + CSS shimmer overlay |

### Performance Notes

- The `displacement-maps.ts` file contains large base64-encoded textures (~35KB). These are bundled into JS to avoid extra network requests but increase initial bundle size.
- The `"shader"` mode renders a canvas-based displacement map on mount — avoid using it on many simultaneous instances.
- `will-change` is not applied to the glass surface to avoid compositor layer explosion; CSS transitions handle smoothing.
- The `mouseContainer` prop is recommended when embedding GlassLayer inside a larger interactive area — it prevents the cursor tracking from being limited to the small surface bounds.

---

## CSS Utilities

Defined in `src/index.css`:

| Class | Description |
|-------|-------------|
| `.glass` | Glassmorphism: `bg-white/10`, 2xl backdrop blur, saturate 200%, white border, shadow |
| `.glass-dark` | Dark variant: `bg-black/40`, 3xl backdrop blur, subtle border |
| `.text-gradient` | Purple-to-orange gradient text via `bg-clip-text` |
| `.animate-blob` | 10s morphing translation + scale animation |
| `.animate-hue-breathe` | 20s subtle hue rotation + saturation shift |
| `.animate-psychedelic-breathe` | 10s scale + drop-shadow + hue-rotate pulse |
| `.animation-delay-2000` | 2s animation delay |
| `.animation-delay-4000` | 4s animation delay |

## Configuration

### Fonts

The live app keeps [Inter](https://fonts.google.com/specimen/Inter) as the body copy font and loads Adobe Fonts `pd-donut` from Typekit in `index.html` for display typography. The display face is exposed through the `font-display` utility in `src/index.css`.

### Path Aliases

`@/` resolves to the project root (configured in both `tsconfig.json` and `vite.config.ts`).

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Glass effect looks flat (no refraction) | Check browser — SVG displacement only works in Chromium. Firefox/Safari use the CSS shimmer fallback. |
| Display font is missing | Verify `index.html` still includes the Adobe Fonts `<link rel="stylesheet" href="https://use.typekit.net/hqx2rsx.css">` tag and you have internet access. |
| Gallery images not loading | The gallery uses generated local assets from `public/images`. Re-run `npm run optimize-images` if the generated files are missing. |
| About image not loading | The About section now uses generated local assets from `public/images`. Re-run `npm run optimize-images` if those generated files are missing. |
| Build fails on displacement maps | The base64 texture file is large. Ensure sufficient memory for the bundler. |
| HMR not working | Check if `DISABLE_HMR=true` is set in your environment (used by AI Studio). |
