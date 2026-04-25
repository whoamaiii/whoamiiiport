import { useCallback, useEffect, useState, type ReactNode } from 'react';
import RenderErrorBoundary from './fallback/RenderErrorBoundary';
import ShaderTextWord from './shared/ShaderTextWord';
import type { TextShadowConfig } from './shared/shaderTextShared';

function getHeroShadowConfig(isMobile: boolean): TextShadowConfig {
  const baseSize = isMobile ? 0.8 : 1.0;

  return {
    ambient: {
      shadowColor: 'rgba(0, 0, 0, 0.22)',
      shadowBlur: isMobile ? 28 : 45 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeColor: 'rgba(0, 0, 0, 0.12)',
      strokeWidth: isMobile ? 0.09 : 0.12 * baseSize,
    },
    halo: {
      shadowColor: 'rgba(0, 0, 0, 0.38)',
      shadowBlur: isMobile ? 16 : 24 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeColor: 'rgba(0, 0, 0, 0.28)',
      strokeWidth: isMobile ? 0.05 : 0.065 * baseSize,
    },
    primary: {
      shadowColor: 'rgba(0, 0, 0, 0.58)',
      shadowBlur: isMobile ? 8 : 14 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: isMobile ? 3 : 5 * baseSize,
      strokeColor: 'rgba(0, 0, 0, 0.48)',
      strokeWidth: isMobile ? 0.032 : 0.042 * baseSize,
    },
    innerGlow: {
      shadowColor: 'rgba(255, 255, 255, 0.28)',
      shadowBlur: isMobile ? 3 : 5 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: isMobile ? -1 : -2 * baseSize,
      strokeColor: 'rgba(255, 255, 255, 0.14)',
      strokeWidth: isMobile ? 0.012 : 0.018 * baseSize,
    },
  };
}

function HeroWordFallback({ text }: { text: string }) {
  return (
    <span className="hero-shader-word" aria-hidden="true">
      <span>{text}</span>
    </span>
  );
}

interface HeroShaderTitleProps {
  firstLine: string;
  secondLine: string;
  trailing?: ReactNode;
  onReady?: () => void;
}

export function HeroShaderTitle({
  firstLine,
  secondLine,
  trailing,
  onReady,
}: HeroShaderTitleProps) {
  const [wordReadyState, setWordReadyState] = useState({ first: false, second: false });

  useEffect(() => {
    if (wordReadyState.first && wordReadyState.second) {
      onReady?.();
    }
  }, [onReady, wordReadyState.first, wordReadyState.second]);

  const markWordReady = useCallback((key: 'first' | 'second') => {
    setWordReadyState((current) => {
      if (current[key]) {
        return current;
      }

      return {
        ...current,
        [key]: true,
      };
    });
  }, []);

  return (
    <span className="hero-shader-title" aria-hidden="true" data-testid="hero-shader-title">
      <span className="hero-shader-title-line">
        <RenderErrorBoundary
          context="hero-shader-title:first-line"
          fallback={<HeroWordFallback text={firstLine} />}
        >
          <ShaderTextWord
            text={firstLine}
            wrapperClassName="hero-shader-word"
            measureClassName="hero-shader-measure"
            canvasClassName="hero-shader-canvas"
            fallbackClassName="hero-shader-fallback"
            shaderScale={{ mobile: 0.48, desktop: 0.6, reduced: 0.38 }}
            shaderClamp={{ minWidth: 96, maxWidth: 900, minHeight: 56, maxHeight: 420 }}
            getShadowConfig={getHeroShadowConfig}
            finalStroke={{ color: 'rgba(255, 248, 235, 0.10)', scale: 0.008, minWidth: 0.8 }}
            onReady={() => markWordReady('first')}
          />
        </RenderErrorBoundary>
      </span>
      <span className="hero-shader-title-line">
        <RenderErrorBoundary
          context="hero-shader-title:second-line"
          fallback={<HeroWordFallback text={secondLine} />}
        >
          <ShaderTextWord
            text={secondLine}
            wrapperClassName="hero-shader-word"
            measureClassName="hero-shader-measure"
            canvasClassName="hero-shader-canvas"
            fallbackClassName="hero-shader-fallback"
            shaderScale={{ mobile: 0.48, desktop: 0.6, reduced: 0.38 }}
            shaderClamp={{ minWidth: 96, maxWidth: 900, minHeight: 56, maxHeight: 420 }}
            getShadowConfig={getHeroShadowConfig}
            finalStroke={{ color: 'rgba(255, 248, 235, 0.10)', scale: 0.008, minWidth: 0.8 }}
            onReady={() => markWordReady('second')}
          />
        </RenderErrorBoundary>
        {trailing}
      </span>
    </span>
  );
}

export default HeroShaderTitle;
