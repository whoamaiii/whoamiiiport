# Liquid Glass Text

## Overview

`LiquidGlassText` renders headline text as an animated shader fill wrapped with SVG-based glass edge treatments. The shader remains the moving element, while the stroke stack and filters give the letters a tube-like, refractive feel.

## Usage

```tsx
import { LiquidGlassText } from '../src/components/LiquidGlassText';

export function Example() {
  return (
    <h1 className="text-6xl md:text-8xl font-display">
      <span className="sr-only">Altered Perceptions.</span>
      <span aria-hidden="true" className="hero-glass-title-stack">
        <LiquidGlassText text="Altered" />
        <LiquidGlassText text="Perceptions" />
      </span>
    </h1>
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | required | Word or line to render. |
| `className` | `string` | `''` | Extra class names for the wrapper. |
| `glassThickness` | `number` | `4` | Minimum stroke thickness for the glass edge treatment. |
| `onReady` | `() => void` | optional | Fires once when the component has either drawn the shader layer or switched to fallback. |

## How It Works

1. The component waits for `document.fonts.ready` before measuring the text.
2. A hidden measuring span plus `ResizeObserver` keeps the canvas and SVG layers aligned with responsive typography.
3. `ShaderRenderer` paints the animated WebGL shader into an offscreen canvas.
4. The visible 2D canvas masks that shader to the headline text shape.
5. SVG filter and stroke layers add the glass rim, glow, and sheen on top.

## Performance Notes

- Each instance creates its own WebGL renderer, so keep usage focused to hero-scale typography instead of repeating it throughout the page.
- Internal shader resolution is reduced on mobile and when the component is outside the viewport.
- `prefers-reduced-motion` switches the title to a static shader frame instead of continuous animation.

## Fallback Behavior

- If 2D canvas or WebGL setup fails, the component falls back to a static gradient-filled text layer.
- Accessibility should come from surrounding semantic heading text, typically via an `sr-only` label.
