# Current Shader Parameters - Baseline Documentation

**Document Date:** 2026-03-28  
**Component:** HeroShaderTitle / ShaderRenderer  
**Purpose:** Baseline parameters before readability enhancements

---

## Fragment Shader: Color Palette

```glsl
vec3 amber   = vec3(0.92, 0.56, 0.24);  // Warm orange-yellow
vec3 magenta = vec3(0.78, 0.27, 0.50);  // Pink-purple
vec3 cobalt  = vec3(0.24, 0.34, 0.72);  // Deep blue
vec3 cyan    = vec3(0.24, 0.58, 0.64);  // Teal
vec3 plum    = vec3(0.44, 0.18, 0.36);  // Dark purple
```

### Palette Phase Transitions
| Phase Start | Color From | Color To | Smoothstep Range |
|-------------|------------|----------|------------------|
| 0.00 | amber | magenta | 0.00 - 0.26 |
| 0.26 | magenta | plum | 0.26 - 0.44 |
| 0.44 | plum | cobalt | 0.44 - 0.70 |
| 0.70 | cobalt | cyan | 0.70 - 0.88 |
| 0.88 | cyan | amber | 0.88 - 1.00 |

---

## Fragment Shader: Lighting Parameters

| Parameter | Current Value | Description |
|-----------|---------------|-------------|
| `diffuse` | `0.62` | Diffuse lighting multiplier |
| `diffuse + ambient` | `0.46` | Ambient base level |
| `specular` | `0.16` | Specular highlight intensity |
| `grayscale_mix` | `0.05` | Grayscale desaturation amount |
| `dark_tint` | `0.02` | Dark overlay mix amount |
| `brightness_boost` | `1.02` | Final brightness multiplier |
| `vignette` | `0.6` | Edge darkening strength |

---

## Fragment Shader: Noise Parameters

| Parameter | Value |
|-----------|-------|
| `NUM_OCTAVES` | 3 |
| `noise_scale` | 1.8 (st *= 1.8) |
| `time_scale` | 0.15 (t = u_time * 0.15) |
| `fbm_amplitude_start` | 0.5 |
| `fbm_amplitude_decay` | 0.5 per octave |
| `distortion_strength` | 2.5 (st + 2.5 * q) |

---

## Canvas Rendering: Shadow Parameters

| Parameter | Mobile (<768px) | Desktop |
|-----------|-----------------|---------|
| `shadowBlur` | 5px | 8px |
| `shadowColor` | `rgba(4, 3, 8, 0.18)` | `rgba(4, 3, 8, 0.18)` |
| `strokeStyle` | `rgba(8, 6, 12, 0.32)` | `rgba(8, 6, 12, 0.32)` |
| `lineWidth` | max(fontSize * 0.024, 1.1) | max(fontSize * 0.024, 1.1) |
| `motionScale` | 0.48 | 0.6 |

---

## Canvas Rendering: Tone Wash Gradients

### Linear Gradient (Warm Tones)
```
Stop 0:   rgba(247, 214, 171, 0.07)  // Warm amber
Stop 0.42: rgba(198, 98, 144, 0.06)  // Magenta
Stop 0.74: rgba(82, 108, 194, 0.05)  // Blue
Stop 1:    rgba(112, 174, 184, 0.04) // Cyan
```

### Value Grade (Vertical)
```
Stop 0:   rgba(255, 245, 228, 0.05)  // Light top
Stop 0.52: rgba(0, 0, 0, 0)          // Transparent middle
Stop 1:    rgba(24, 16, 22, 0.05)    // Dark bottom
```

---

## CSS: Container Shadows

```css
.hero-shader-title {
  filter:
    drop-shadow(0 2px 7px rgba(0, 0, 0, 0.24))
    drop-shadow(0 10px 18px rgba(0, 0, 0, 0.14));
}

.hero-shader-word {
  filter:
    drop-shadow(0 2px 5px rgba(0, 0, 0, 0.28))
    drop-shadow(0 8px 14px rgba(0, 0, 0, 0.14));
}
```

---

## CSS: Backlight Glow

```
Position: absolute, centered
Size: 120% x 120%
Background: bg-black/40
Blur: blur-[80px]
Border Radius: rounded-full
Z-Index: -z-10
```

---

## Performance Configuration

| Parameter | Value |
|-----------|-------|
| `shaderWidth` | clamp(displayWidth * dpr * motionScale, 96, 900) |
| `shaderHeight` | clamp(displayHeight * dpr * motionScale, 56, 420) |
| `displayDpr` | clamp(window.devicePixelRatio, 1, 2) |
| `mobileScale` | 0.48 (reduced for performance) |
| `desktopScale` | 0.6 |
| `motionScaleReduced` | 0.38 |

---

## Accessibility Configuration

| Feature | Implementation |
|---------|---------------|
| Screen Reader | `span.sr-only` with full text |
| ARIA Label | `aria-label="Altered Perceptions."` |
| Reduced Motion | Static shader at time=1.35 |
| Fallback | CSS gradient text if WebGL fails |

---

## Notes for Enhancement

### Identified Issues
1. Shadow blur (5-8px) insufficient for complex backgrounds
2. Shadow opacity (0.18-0.32) too subtle
3. No inner highlight for edge definition
4. Shader colors could be brighter for better contrast
5. Vignette (0.6) may darken edges too much
6. CSS shadows lack depth layers

### Targets for Improvement
- Shadow blur: Increase to 12-50px range
- Shadow opacity: Increase to 0.20-0.65 range
- Add 4-layer shadow system
- Add inner highlight stroke
- Increase shader brightness by ~15%
- Reduce vignette to 0.45
- Implement 5-layer CSS drop-shadow
