import { useCallback, useEffect, useRef, useState } from 'react';
import {
  HERO_WORDMARK_SUPPORTED_LINES,
  matchesHeroWordmark,
  type HeroTitleLines,
} from './heroWordmarkData';
import { ShaderTextWord } from './shared/ShaderTextWord';
import type { TextShadowConfig } from './shared/shaderTextShared';
import reportError from '../lib/reportError';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { getImageUrl } from '../utils/images';

interface HeroTitleHybridProps {
  semanticTitle: string;
  titleLines: HeroTitleLines;
  reducedMotion: boolean;
  forceFallback?: boolean;
}

const HERO_LIQUID_BACKGROUND = getImageUrl('liquid-perception-hero', 720);
const HERO_WORDMARK_VISUAL_SECOND_LINE = `${HERO_WORDMARK_SUPPORTED_LINES[1]}.`;
const MOBILE_SHADER_BOOT_DELAY_MS = 4500;
const MOBILE_SHADER_IDLE_TIMEOUT_MS = 1500;

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
      shadowColor: 'rgba(0, 0, 0, 0.18)',
      shadowBlur: 11 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeColor: 'rgba(3, 7, 14, 0.075)',
      strokeWidth: 0.018 * baseSize,
    },
    halo: {
      shadowColor: 'rgba(154, 232, 248, 0.22)',
      shadowBlur: 8 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: -0.4 * baseSize,
      strokeColor: 'rgba(227, 252, 255, 0.19)',
      strokeWidth: 0.015 * baseSize,
    },
    primary: {
      shadowColor: 'rgba(0, 0, 0, 0.34)',
      shadowBlur: 3.2 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 1.35 * baseSize,
      strokeColor: 'rgba(0, 0, 0, 0.14)',
      strokeWidth: 0.009 * baseSize,
    },
    innerGlow: {
      shadowColor: 'rgba(255, 252, 238, 0.34)',
      shadowBlur: 3.8 * baseSize,
      shadowOffsetX: -0.45 * baseSize,
      shadowOffsetY: -1.1 * baseSize,
      strokeColor: 'rgba(255, 252, 240, 0.18)',
      strokeWidth: 0.008 * baseSize,
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

function HeroShaderLine({
  line,
  onReady,
  revealWhenReady,
  text,
}: {
  line: 'first' | 'second';
  onReady: () => void;
  revealWhenReady: boolean;
  text: string;
}) {
  return (
    <ShaderTextWord
      text={text}
      allowCompactShader
      revealWhenReady={revealWhenReady}
      wrapperClassName={`hero-title-shader-word hero-title-shader-word--${line}`.trim()}
      measureClassName={`hero-title-shader-measure hero-title-shader-measure--${line}`.trim()}
      canvasClassName={`hero-title-shader-canvas hero-title-shader-canvas--${line}`.trim()}
      fallbackClassName={`hero-title-shader-fallback hero-title-shader-fallback--${line}`.trim()}
      onReady={onReady}
      shaderScale={{ mobile: 0.54, desktop: 0.58 }}
      shaderClamp={{ minWidth: 120, maxWidth: 820, minHeight: 56, maxHeight: 240 }}
      shaderFrameRate={{ mobile: 12, desktop: 24 }}
      shaderSetupDelayMs={line === 'first' ? 120 : 360}
      getShadowConfig={getHeroShadowConfig}
      finalStroke={{ color: 'rgba(240, 253, 255, 0.28)', scale: 0.0052, minWidth: 0.58 }}
      heroLiquid={{
        backgroundImageUrl: HERO_LIQUID_BACKGROUND,
        backgroundDarken: 0.68,
        backgroundMix: 0.2,
        causticStrength: 0.15,
        coreBrightness: 1.02,
        coreContrast: 1.26,
        coreSaturation: 1.04,
        dispersionStrength: 0.0046,
        glowStrength: 0.14,
        innerShadowStrength: 0.82,
        liquidOpacity: 0.3,
        liquidSpeed: 0.02,
        liquidWarp: 0.04,
        refractPixels: 7.6,
        rimStrength: 1.72,
        rimWidth: 0.68,
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
  const [readyLines, setReadyLines] = useState({ first: false, second: false });
  const [mobileShaderAllowed, setMobileShaderAllowed] = useState(false);
  const isMobileLayout = useMediaQuery('(max-width: 767px)', false);
  const titleMatchesWordmark = matchesHeroWordmark(titleLines);
  const visualSupported = !forceFallback && titleMatchesWordmark;
  const deferMobileShader = visualSupported && !reducedMotion && isMobileLayout && !mobileShaderAllowed;
  const revealShader = readyLines.first && readyLines.second;

  const markFirstReady = useCallback(() => {
    setReadyLines((current) => (current.first ? current : { ...current, first: true }));
  }, []);

  const markSecondReady = useCallback(() => {
    setReadyLines((current) => (current.second ? current : { ...current, second: true }));
  }, []);

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

  useEffect(() => {
    setReadyLines({ first: false, second: false });
  }, [semanticTitle, titleLines, visualSupported]);

  useEffect(() => {
    setMobileShaderAllowed(false);

    if (!visualSupported || reducedMotion || !isMobileLayout) {
      return;
    }

    let idleCallbackId: number | null = null;
    let bootDelayId: number | null = null;

    const allowShader = () => {
      setMobileShaderAllowed(true);
    };

    bootDelayId = window.setTimeout(() => {
      const requestIdle = window.requestIdleCallback?.bind(window);

      if (requestIdle) {
        idleCallbackId = requestIdle(allowShader, { timeout: MOBILE_SHADER_IDLE_TIMEOUT_MS });
        return;
      }

      allowShader();
    }, MOBILE_SHADER_BOOT_DELAY_MS);

    return () => {
      if (idleCallbackId !== null) {
        window.cancelIdleCallback?.(idleCallbackId);
      }

      if (bootDelayId !== null) {
        window.clearTimeout(bootDelayId);
      }
    };
  }, [isMobileLayout, reducedMotion, visualSupported]);

  if (!visualSupported) {
    return <HeroTitleStaticFallback titleLines={titleLines} />;
  }

  if (deferMobileShader) {
    return <HeroTitleStaticFallback titleLines={titleLines} />;
  }

  return (
    <span
      aria-hidden="true"
      className="hero-title-hybrid"
      data-testid="hero-title-visual"
      data-mode="visual"
      data-animated={!reducedMotion ? 'true' : 'false'}
      data-shader-ready={revealShader ? 'true' : 'false'}
    >
      <span className="hero-title-live-shader">
        <HeroShaderLine
          text={HERO_WORDMARK_SUPPORTED_LINES[0]}
          line="first"
          onReady={markFirstReady}
          revealWhenReady={revealShader}
        />
        <HeroShaderLine
          text={HERO_WORDMARK_VISUAL_SECOND_LINE}
          line="second"
          onReady={markSecondReady}
          revealWhenReady={revealShader}
        />
      </span>
    </span>
  );
}
