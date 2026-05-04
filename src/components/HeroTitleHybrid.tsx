import { useEffect, useRef } from 'react';
import {
  HERO_WORDMARK_SUPPORTED_LINES,
  matchesHeroWordmark,
  type HeroTitleLines,
} from './heroWordmarkData';
import ShaderTextWord from './shared/ShaderTextWord';
import type { TextShadowConfig } from './shared/shaderTextShared';
import reportError from '../lib/reportError';
import { getImageUrl } from '../utils/images';

interface HeroTitleHybridProps {
  semanticTitle: string;
  titleLines: HeroTitleLines;
  reducedMotion: boolean;
  forceFallback?: boolean;
}

const HERO_LIQUID_BACKGROUND = getImageUrl('liquid-perception-hero', 960);
const HERO_WORDMARK_VISUAL_SECOND_LINE = `${HERO_WORDMARK_SUPPORTED_LINES[1]}.`;

const HERO_LIQUID_SHARED_UV = {
  first: {
    titleUvOffset: [0.10, 0.00] as const,
    titleUvScale: [0.78, 0.48] as const,
  },
  second: {
    titleUvOffset: [0.00, 0.42] as const,
    titleUvScale: [1.00, 0.58] as const,
  },
};

function getHeroShadowConfig(isMobile: boolean, fontSize: number): TextShadowConfig {
  const sizeScale = Math.min(fontSize / 84, 1);
  const mobileScale = isMobile ? 0.92 : 1;
  const baseSize = sizeScale * mobileScale;

  return {
    ambient: {
      shadowColor: 'rgba(0, 0, 0, 0.12)',
      shadowBlur: 9 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeColor: 'rgba(3, 7, 14, 0.045)',
      strokeWidth: 0.014 * baseSize,
    },
    halo: {
      shadowColor: 'rgba(91, 218, 239, 0.14)',
      shadowBlur: 8 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: -0.4 * baseSize,
      strokeColor: 'rgba(219, 249, 255, 0.13)',
      strokeWidth: 0.012 * baseSize,
    },
    primary: {
      shadowColor: 'rgba(0, 0, 0, 0.24)',
      shadowBlur: 2.4 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 1.2 * baseSize,
      strokeColor: 'rgba(0, 0, 0, 0.08)',
      strokeWidth: 0.007 * baseSize,
    },
    innerGlow: {
      shadowColor: 'rgba(255, 252, 238, 0.22)',
      shadowBlur: 3.2 * baseSize,
      shadowOffsetX: -0.4 * baseSize,
      shadowOffsetY: -0.9 * baseSize,
      strokeColor: 'rgba(255, 252, 240, 0.12)',
      strokeWidth: 0.006 * baseSize,
    },
  };
}

function HeroTitleFallback({ titleLines }: { titleLines: HeroTitleLines }) {
  return (
    <span className="hero-title-fallback" data-testid="hero-title-fallback">
      <span>{titleLines[0]}</span>
      <span>{titleLines[1]}.</span>
    </span>
  );
}

export function HeroTitleStaticFallback({ titleLines }: { titleLines: HeroTitleLines }) {
  return (
    <span
      aria-hidden="true"
      className="hero-title-hybrid"
      data-testid="hero-title-visual"
      data-mode="fallback"
      data-animated="false"
    >
      <HeroTitleFallback titleLines={titleLines} />
    </span>
  );
}

function HeroShaderLine({ text, line }: { text: string; line: 'first' | 'second' }) {
  return (
    <ShaderTextWord
      text={text}
      wrapperClassName={`hero-title-shader-word hero-title-shader-word--${line}`.trim()}
      measureClassName={`hero-title-shader-measure hero-title-shader-measure--${line}`.trim()}
      canvasClassName={`hero-title-shader-canvas hero-title-shader-canvas--${line}`.trim()}
      fallbackClassName={`hero-title-shader-fallback hero-title-shader-fallback--${line}`.trim()}
      shaderScale={{ mobile: 0.5, desktop: 0.58, reduced: 0.34 }}
      shaderClamp={{ minWidth: 120, maxWidth: 880, minHeight: 56, maxHeight: 260 }}
      getShadowConfig={getHeroShadowConfig}
      finalStroke={{ color: 'rgba(235, 252, 255, 0.12)', scale: 0.0032, minWidth: 0.42 }}
      heroLiquid={{
        backgroundImageUrl: HERO_LIQUID_BACKGROUND,
        backgroundDarken: 0.4,
        backgroundMix: 0.115,
        causticStrength: 0.06,
        coreBrightness: 0.96,
        coreContrast: 1.1,
        coreSaturation: 1.02,
        dispersionStrength: 0.003,
        glowStrength: 0.045,
        innerShadowStrength: 0.64,
        liquidOpacity: 0.64,
        liquidSpeed: 0.026,
        liquidWarp: 0.04,
        refractPixels: 4.2,
        rimStrength: 0.78,
        rimWidth: 0.5,
        ...HERO_LIQUID_SHARED_UV[line],
      }}
      shaderVariant="heroLiquid"
    />
  );
}

export function HeroTitleHybrid({
  semanticTitle,
  titleLines,
  reducedMotion,
  forceFallback = false,
}: HeroTitleHybridProps) {
  const reportedRef = useRef(false);
  const titleMatchesWordmark = matchesHeroWordmark(titleLines);
  const visualSupported = !forceFallback && titleMatchesWordmark;

  useEffect(() => {
    if (titleMatchesWordmark || reportedRef.current) {
      return;
    }

    reportedRef.current = true;
    reportError(new Error('Hero wordmark asset does not match the requested title lines.'), 'hero-title-hybrid:visual-fallback', {
      semanticTitle,
      titleLines,
    });
  }, [semanticTitle, titleLines, titleMatchesWordmark]);

  if (!visualSupported) {
    return <HeroTitleStaticFallback titleLines={titleLines} />;
  }

  return (
    <span
      aria-hidden="true"
      className="hero-title-hybrid"
      data-testid="hero-title-visual"
      data-mode="visual"
      data-animated={!reducedMotion ? 'true' : 'false'}
    >
      <span className="hero-title-live-shader">
        <HeroShaderLine text={HERO_WORDMARK_SUPPORTED_LINES[0]} line="first" />
        <HeroShaderLine text={HERO_WORDMARK_VISUAL_SECOND_LINE} line="second" />
      </span>
    </span>
  );
}

export default HeroTitleHybrid;
