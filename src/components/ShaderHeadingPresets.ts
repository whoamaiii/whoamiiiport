import type { TextShadowConfig } from './shared/shaderTextShared';

export type ShaderHeadingVariant = 'default' | 'gallery';

interface ShaderHeadingPreset {
  readonly rootClassName: string;
  readonly wordClassName: string;
  readonly measureClassName: string;
  readonly canvasClassName: string;
  readonly fallbackClassName: string;
  readonly staticFallbackClassName: string;
  readonly shaderScale: {
    readonly mobile: number;
    readonly desktop: number;
  };
  readonly shaderClamp: {
    readonly minWidth: number;
    readonly maxWidth: number;
    readonly minHeight: number;
    readonly maxHeight: number;
  };
  readonly finalStroke: {
    readonly color: string;
    readonly scale: number;
    readonly minWidth: number;
  };
  readonly glassSurface: 'section';
  readonly getShadowConfig: (isMobile: boolean, fontSize: number) => TextShadowConfig;
}

function getSectionShadowConfig(isMobile: boolean, fontSize: number): TextShadowConfig {
  const sizeScale = Math.min(fontSize / 48, 1.0);
  const mobileScale = isMobile ? 0.75 : 1.0;
  const baseSize = sizeScale * mobileScale;

  return {
    ambient: {
      shadowColor: 'rgba(0, 0, 0, 0.20)',
      shadowBlur: 32 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeColor: 'rgba(0, 0, 0, 0.10)',
      strokeWidth: 0.10 * baseSize,
    },
    halo: {
      shadowColor: 'rgba(0, 0, 0, 0.32)',
      shadowBlur: 18 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeColor: 'rgba(0, 0, 0, 0.22)',
      strokeWidth: 0.05 * baseSize,
    },
    primary: {
      shadowColor: 'rgba(0, 0, 0, 0.50)',
      shadowBlur: 6 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 3 * baseSize,
      strokeColor: 'rgba(0, 0, 0, 0.40)',
      strokeWidth: 0.035 * baseSize,
    },
    innerGlow: {
      shadowColor: 'rgba(255, 255, 255, 0.22)',
      shadowBlur: 4 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: -1 * baseSize,
      strokeColor: 'rgba(255, 255, 255, 0.10)',
      strokeWidth: 0.010 * baseSize,
    },
  };
}

function getGalleryShadowConfig(isMobile: boolean, fontSize: number): TextShadowConfig {
  const sizeScale = Math.min(fontSize / 58, 1.0);
  const mobileScale = isMobile ? 0.8 : 1.0;
  const baseSize = sizeScale * mobileScale;

  return {
    ambient: {
      shadowColor: 'rgba(0, 0, 0, 0.16)',
      shadowBlur: 22 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeColor: 'rgba(14, 10, 18, 0.08)',
      strokeWidth: 0.06 * baseSize,
    },
    halo: {
      shadowColor: 'rgba(0, 0, 0, 0.22)',
      shadowBlur: 12 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeColor: 'rgba(255, 239, 226, 0.12)',
      strokeWidth: 0.018 * baseSize,
    },
    primary: {
      shadowColor: 'rgba(0, 0, 0, 0.28)',
      shadowBlur: 4.5 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 2 * baseSize,
      strokeColor: 'rgba(28, 18, 24, 0.2)',
      strokeWidth: 0.02 * baseSize,
    },
    innerGlow: {
      shadowColor: 'rgba(255, 244, 232, 0.18)',
      shadowBlur: 3.5 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: -0.8 * baseSize,
      strokeColor: 'rgba(255, 247, 239, 0.12)',
      strokeWidth: 0.008 * baseSize,
    },
  };
}

export const SHADER_HEADING_PRESETS: Record<ShaderHeadingVariant, ShaderHeadingPreset> = {
  default: {
    rootClassName: 'section-shader-title--default',
    wordClassName: 'section-shader-word--default',
    measureClassName: 'section-shader-measure--default',
    canvasClassName: 'section-shader-canvas--default',
    fallbackClassName: 'section-shader-fallback--default',
    staticFallbackClassName: 'section-shader-static-fallback--default',
    shaderScale: { mobile: 0.5, desktop: 0.6 },
    shaderClamp: { minWidth: 80, maxWidth: 700, minHeight: 48, maxHeight: 350 },
    finalStroke: { color: 'rgba(228, 250, 255, 0.24)', scale: 0.0065, minWidth: 0.72 },
    glassSurface: 'section',
    getShadowConfig: getSectionShadowConfig,
  },
  gallery: {
    rootClassName: 'section-shader-title--gallery',
    wordClassName: 'section-shader-word--gallery',
    measureClassName: 'section-shader-measure--gallery',
    canvasClassName: 'section-shader-canvas--gallery',
    fallbackClassName: 'section-shader-fallback--gallery',
    staticFallbackClassName: 'section-shader-static-fallback--gallery',
    shaderScale: { mobile: 0.44, desktop: 0.52 },
    shaderClamp: { minWidth: 80, maxWidth: 760, minHeight: 48, maxHeight: 320 },
    finalStroke: { color: 'rgba(235, 252, 255, 0.28)', scale: 0.0054, minWidth: 0.72 },
    glassSurface: 'section',
    getShadowConfig: getGalleryShadowConfig,
  },
};
