import { useEffect, useState } from 'react';
import type { LiquidGlassSettings } from '@ogtirth/liquid-glass-oss';
import { getImageUrl } from '../utils/images';

export const MOBILE_MENU_GLASS_BACKGROUND = getImageUrl('liquid-perception-hero', 720);

export const MOBILE_MENU_GLASS_SETTINGS = {
  blur: 0.34,
  refraction: 0.34,
  chromaticAberration: 0.032,
  distortion: 0.014,
  edgeHighlight: 0.14,
  specular: 0.16,
  fresnel: 1.02,
  depth: 38,
  brightness: -0.08,
  saturation: -0.04,
  darkTint: 0.48,
  tintStrength: 0.12,
  opacity: 1,
  liquidMotion: 0.08,
  liquidSpring: 0.048,
  liquidDamping: 0.88,
} satisfies Partial<LiquidGlassSettings>;

function supportsWebGlRendering(): boolean {
  const canvas = document.createElement('canvas');

  return Boolean(
    canvas.getContext('webgl')
    || canvas.getContext('experimental-webgl'),
  );
}

export function useWebGlSupport(): boolean | null {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setIsSupported(supportsWebGlRendering());
  }, []);

  return isSupported;
}
