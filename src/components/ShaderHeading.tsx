import { useCallback, useEffect, useState, type HTMLAttributes } from 'react';
import RenderErrorBoundary from './fallback/RenderErrorBoundary';
import ShaderTextWord from './shared/ShaderTextWord';
import type { TextShadowConfig } from './shared/shaderTextShared';

type HeadingLevel = 'h1' | 'h2' | 'h3';
type ShaderHeadingVariant = 'default' | 'gallery';

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

interface ShaderHeadingPreset {
  rootClassName: string;
  wordClassName: string;
  measureClassName: string;
  canvasClassName: string;
  fallbackClassName: string;
  staticFallbackClassName: string;
  shaderScale: {
    mobile: number;
    desktop: number;
    reduced: number;
  };
  shaderClamp: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
  };
  finalStroke: {
    color: string;
    scale: number;
    minWidth: number;
  };
  glassSurface: 'section';
  getShadowConfig: (isMobile: boolean, fontSize: number) => TextShadowConfig;
}

const SHADER_HEADING_PRESETS: Record<ShaderHeadingVariant, ShaderHeadingPreset> = {
  default: {
    rootClassName: 'section-shader-title--default',
    wordClassName: 'section-shader-word--default',
    measureClassName: 'section-shader-measure--default',
    canvasClassName: 'section-shader-canvas--default',
    fallbackClassName: 'section-shader-fallback--default',
    staticFallbackClassName: 'section-shader-static-fallback--default',
    shaderScale: { mobile: 0.5, desktop: 0.6, reduced: 0.4 },
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
    shaderScale: { mobile: 0.44, desktop: 0.52, reduced: 0.34 },
    shaderClamp: { minWidth: 80, maxWidth: 760, minHeight: 48, maxHeight: 320 },
    finalStroke: { color: 'rgba(235, 252, 255, 0.28)', scale: 0.0054, minWidth: 0.72 },
    glassSurface: 'section',
    getShadowConfig: getGalleryShadowConfig,
  },
};

function SectionWordFallback({
  lines,
  wordClassName,
  staticFallbackClassName,
}: {
  lines: readonly string[];
  wordClassName: string;
  staticFallbackClassName: string;
}) {
  return (
    <span className="section-shader-lines" aria-hidden="true">
      {lines.map((line) => (
        <span
          key={line}
          className={`section-shader-word ${wordClassName}`.trim()}
          data-text={line}
        >
          <span className={`section-shader-static-fallback ${staticFallbackClassName}`.trim()}>
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}

interface ShaderHeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> {
  children: string;
  className?: string;
  as?: HeadingLevel;
  delay?: number;
  onReady?: () => void;
  ariaLabel?: string;
  variant?: ShaderHeadingVariant;
  visualLines?: readonly string[];
}

export function ShaderHeading({
  children,
  className = '',
  as: Component = 'h2',
  delay = 0,
  onReady,
  ariaLabel,
  variant = 'default',
  visualLines,
  ...headingProps
}: ShaderHeadingProps) {
  const [isReady, setIsReady] = useState(false);
  const preset = SHADER_HEADING_PRESETS[variant];
  const lines = visualLines?.length ? visualLines : [children];

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const timer = window.setTimeout(() => {
      onReady?.();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [delay, isReady, onReady]);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <Component
      className={`section-shader-title ${preset.rootClassName} ${className}`.trim()}
      aria-label={ariaLabel ?? children}
      data-heading-variant={variant}
      data-testid="shader-heading"
      {...headingProps}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        <RenderErrorBoundary
          context="section-shader-heading"
          fallback={
            <SectionWordFallback
              lines={lines}
              wordClassName={preset.wordClassName}
              staticFallbackClassName={preset.staticFallbackClassName}
            />
          }
        >
          <span className="section-shader-lines">
            {lines.map((line, index) => (
              <span key={`${line}-${index}`} className="section-shader-line">
                <ShaderTextWord
                  text={line}
                  wrapperClassName={`section-shader-word ${preset.wordClassName}`.trim()}
                  measureClassName={`section-shader-measure ${preset.measureClassName}`.trim()}
                  canvasClassName={`section-shader-canvas ${preset.canvasClassName}`.trim()}
                  fallbackClassName={`section-shader-fallback ${preset.fallbackClassName}`.trim()}
                  shaderScale={preset.shaderScale}
                  shaderClamp={preset.shaderClamp}
                  getShadowConfig={preset.getShadowConfig}
                  finalStroke={preset.finalStroke}
                  glassSurface={preset.glassSurface}
                  onReady={handleReady}
                />
              </span>
            ))}
          </span>
        </RenderErrorBoundary>
      </span>
    </Component>
  );
}

export default ShaderHeading;
