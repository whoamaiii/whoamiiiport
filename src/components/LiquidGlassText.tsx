'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ShaderRenderer } from '../lib/shaderRenderer';
import { GlassFilters, useGlassFilterIds } from './GlassFilters';

type TypographyContext = CanvasRenderingContext2D & {
  fontKerning?: CanvasFontKerning;
  letterSpacing?: string;
};

interface LayoutMetrics {
  width: number;
  height: number;
  centerX: number;
  baselineY: number;
  font: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  fontWeight: string;
  letterSpacing: string;
}

interface LiquidGlassTextProps {
  text: string;
  className?: string;
  glassThickness?: number;
  onReady?: () => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildFontDeclaration(style: CSSStyleDeclaration) {
  return `${style.fontStyle || 'normal'} ${style.fontWeight || '900'} ${style.fontSize || '16px'} ${style.fontFamily || 'sans-serif'}`;
}

function waitForFonts() {
  if (typeof document === 'undefined' || !('fonts' in document) || !document.fonts.ready) {
    return Promise.resolve();
  }

  return document.fonts.ready.then(() => undefined).catch(() => undefined);
}

function createFallbackLayout(text: string, style: CSSStyleDeclaration, glassThickness: number) {
  const fontSize = Number.parseFloat(style.fontSize) || 16;
  const widthEstimate = Math.max(fontSize, fontSize * Math.max(text.length * 0.66, 1));
  const heightEstimate = Math.max(fontSize * 1.05, fontSize);
  const paddingX = Math.max(glassThickness * 4, fontSize * 0.12);
  const paddingY = Math.max(glassThickness * 3.4, fontSize * 0.16);

  return {
    width: Math.ceil(widthEstimate + paddingX * 2),
    height: Math.ceil(heightEstimate + paddingY * 2),
    centerX: paddingX + widthEstimate / 2,
    baselineY: paddingY + heightEstimate * 0.76,
    font: buildFontDeclaration(style),
    fontFamily: style.fontFamily || 'sans-serif',
    fontSize,
    fontStyle: style.fontStyle || 'normal',
    fontWeight: style.fontWeight || '900',
    letterSpacing: style.letterSpacing || '0px',
  } satisfies LayoutMetrics;
}

export function LiquidGlassText({
  text,
  className = '',
  glassThickness = 4,
  onReady,
}: LiquidGlassTextProps) {
  const filterPrefix = useId().replace(/:/g, '');
  const filterIds = useGlassFilterIds(filterPrefix);
  const measureRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [layout, setLayout] = useState<LayoutMetrics | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const readyNotifiedRef = useRef(false);

  const gradientIds = useMemo(
    () => ({
      rim: `${filterPrefix}-rim-gradient`,
      sheen: `${filterPrefix}-sheen-gradient`,
    }),
    [filterPrefix],
  );

  const notifyReady = useCallback(() => {
    if (readyNotifiedRef.current) {
      return;
    }

    readyNotifiedRef.current = true;
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    readyNotifiedRef.current = false;
    setCanvasReady(false);
    setUseFallback(false);
  }, [text]);

  useEffect(() => {
    let mounted = true;

    waitForFonts().then(() => {
      if (!mounted) {
        return;
      }

      setFontsReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.08 },
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!fontsReady || !measureRef.current) {
      return;
    }

    const scratchCanvas = document.createElement('canvas');
    const scratchContext = scratchCanvas.getContext('2d') as TypographyContext | null;

    const updateLayout = () => {
      if (!measureRef.current) {
        return;
      }

      const style = window.getComputedStyle(measureRef.current);
      const fallbackLayout = createFallbackLayout(text, style, glassThickness);
      const rect = measureRef.current.getBoundingClientRect();

      if (!scratchContext) {
        setLayout((current) => {
          if (
            current &&
            current.width === fallbackLayout.width &&
            current.height === fallbackLayout.height &&
            current.font === fallbackLayout.font &&
            current.letterSpacing === fallbackLayout.letterSpacing
          ) {
            return current;
          }

          return fallbackLayout;
        });
        return;
      }

      scratchContext.font = fallbackLayout.font;
      scratchContext.textAlign = 'center';
      scratchContext.textBaseline = 'alphabetic';
      scratchContext.fontKerning = 'normal';
      if ('letterSpacing' in scratchContext) {
        scratchContext.letterSpacing = fallbackLayout.letterSpacing;
      }

      const metrics = scratchContext.measureText(text);
      const paddingX = Math.max(glassThickness * 4, fallbackLayout.fontSize * 0.12);
      const paddingY = Math.max(glassThickness * 3.4, fallbackLayout.fontSize * 0.16);
      const width = rect.width > 0 ? rect.width : Math.max(fallbackLayout.fontSize, fallbackLayout.width - paddingX * 2);
      const height = rect.height > 0 ? rect.height : Math.max(fallbackLayout.fontSize, fallbackLayout.height - paddingY * 2);
      const ascent = metrics.actualBoundingBoxAscent || fallbackLayout.fontSize * 0.74;
      const descent = metrics.actualBoundingBoxDescent || fallbackLayout.fontSize * 0.18;
      const boxHeight = Math.max(height, ascent + descent);

      const nextLayout: LayoutMetrics = {
        width: Math.ceil(width + paddingX * 2),
        height: Math.ceil(boxHeight + paddingY * 2),
        centerX: paddingX + width / 2,
        baselineY: paddingY + (boxHeight - (ascent + descent)) / 2 + ascent,
        font: fallbackLayout.font,
        fontFamily: fallbackLayout.fontFamily,
        fontSize: fallbackLayout.fontSize,
        fontStyle: fallbackLayout.fontStyle,
        fontWeight: fallbackLayout.fontWeight,
        letterSpacing: fallbackLayout.letterSpacing,
      };

      setLayout((current) => {
        if (
          current &&
          current.width === nextLayout.width &&
          current.height === nextLayout.height &&
          current.font === nextLayout.font &&
          current.letterSpacing === nextLayout.letterSpacing &&
          current.baselineY === nextLayout.baselineY
        ) {
          return current;
        }

        return nextLayout;
      });
    };

    updateLayout();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateLayout())
        : null;

    resizeObserver?.observe(measureRef.current);
    window.addEventListener('resize', updateLayout);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateLayout);
    };
  }, [fontsReady, glassThickness, text]);

  useEffect(() => {
    if (!layout || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d') as TypographyContext | null;

    if (!context) {
      setUseFallback(true);
      notifyReady();
      return;
    }

    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    canvas.width = Math.max(1, Math.round(layout.width * dpr));
    canvas.height = Math.max(1, Math.round(layout.height * dpr));
    canvas.style.width = `${layout.width}px`;
    canvas.style.height = `${layout.height}px`;

    context.font = layout.font;
    context.textAlign = 'center';
    context.textBaseline = 'alphabetic';
    context.fontKerning = 'normal';
    if ('letterSpacing' in context) {
      context.letterSpacing = layout.letterSpacing;
    }

    const baseScale = window.innerWidth < 768 ? 0.42 : 0.56;
    const motionScale = prefersReducedMotion || !isInView ? Math.min(baseScale, 0.38) : baseScale;
    const shaderWidth = clamp(Math.round(layout.width * dpr * motionScale), 96, 1100);
    const shaderHeight = clamp(Math.round(layout.height * dpr * motionScale), 64, 420);

    let renderer: ShaderRenderer;

    try {
      renderer = new ShaderRenderer(shaderWidth, shaderHeight);
      setUseFallback(false);
    } catch {
      setUseFallback(true);
      notifyReady();
      return;
    }

    const drawGlassFill = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      context.drawImage(renderer.element, 0, 0, layout.width, layout.height);

      context.globalCompositeOperation = 'destination-in';
      context.fillStyle = '#ffffff';
      context.fillText(text, layout.centerX, layout.baselineY);

      context.globalCompositeOperation = 'source-atop';
      const surfaceGradient = context.createLinearGradient(0, 0, layout.width, layout.height);
      surfaceGradient.addColorStop(0, 'rgba(255,255,255,0.3)');
      surfaceGradient.addColorStop(0.24, 'rgba(255,255,255,0.06)');
      surfaceGradient.addColorStop(0.72, 'rgba(255,255,255,0)');
      surfaceGradient.addColorStop(1, 'rgba(255,255,255,0.2)');
      context.fillStyle = surfaceGradient;
      context.fillText(text, layout.centerX, layout.baselineY);

      context.globalCompositeOperation = 'source-over';

      if (!canvasReady) {
        setCanvasReady(true);
      }

      notifyReady();
    };

    const staticTime = 1.35;

    if (prefersReducedMotion || !isInView) {
      renderer.render(staticTime);
      drawGlassFill();
      return () => {
        renderer.dispose();
      };
    }

    renderer.render(0.001);
    drawGlassFill();
    renderer.start(() => {
      drawGlassFill();
    });

    return () => {
      renderer.dispose();
    };
  }, [isInView, layout, notifyReady, prefersReducedMotion, text]);

  const strokeBase = layout ? Math.max(glassThickness, layout.fontSize * 0.055) : glassThickness;

  return (
    <span
      ref={containerRef}
      className={`liquid-glass-container ${className}`.trim()}
      aria-hidden="true"
      data-testid="liquid-glass-title"
    >
      <GlassFilters idPrefix={filterPrefix} />
      <span ref={measureRef} className="liquid-glass-measure">
        {text}
      </span>
      <canvas
        ref={canvasRef}
        className={`liquid-glass-canvas ${canvasReady && !useFallback ? 'is-ready' : ''}`}
        aria-hidden="true"
      />
      <span
        className={`liquid-glass-fallback ${useFallback ? 'is-visible' : ''}`}
        aria-hidden="true"
      >
        {text}
      </span>
      {layout ? (
        <svg
          className="liquid-glass-svg"
          width={layout.width}
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientIds.rim} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
              <stop offset="35%" stopColor="#fdf2f8" stopOpacity="0.55" />
              <stop offset="72%" stopColor="#cfe8ff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.68" />
            </linearGradient>
            <linearGradient id={gradientIds.sheen} x1="5%" y1="0%" x2="95%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <text
            x={layout.centerX}
            y={layout.baselineY}
            textAnchor="middle"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeBase * 0.6}
            filter={`url(#${filterIds.liquidGlass})`}
            paintOrder="stroke fill"
            style={{
              fontFamily: layout.fontFamily,
              fontSize: `${layout.fontSize}px`,
              fontStyle: layout.fontStyle,
              fontWeight: layout.fontWeight,
              letterSpacing: layout.letterSpacing,
            }}
          >
            {text}
          </text>
          <text
            x={layout.centerX}
            y={layout.baselineY}
            textAnchor="middle"
            fill="none"
            stroke={`url(#${gradientIds.rim})`}
            strokeWidth={strokeBase * 2.15}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter={`url(#${filterIds.glassEdge})`}
            opacity="0.96"
            style={{
              fontFamily: layout.fontFamily,
              fontSize: `${layout.fontSize}px`,
              fontStyle: layout.fontStyle,
              fontWeight: layout.fontWeight,
              letterSpacing: layout.letterSpacing,
            }}
          >
            {text}
          </text>
          <text
            x={layout.centerX}
            y={layout.baselineY}
            textAnchor="middle"
            fill="none"
            stroke="rgba(255,255,255,0.34)"
            strokeWidth={strokeBase * 0.9}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter={`url(#${filterIds.glassGlow})`}
            opacity="0.85"
            style={{
              fontFamily: layout.fontFamily,
              fontSize: `${layout.fontSize}px`,
              fontStyle: layout.fontStyle,
              fontWeight: layout.fontWeight,
              letterSpacing: layout.letterSpacing,
            }}
          >
            {text}
          </text>
          <text
            x={layout.centerX}
            y={layout.baselineY}
            textAnchor="middle"
            fill="none"
            stroke={`url(#${gradientIds.sheen})`}
            strokeWidth={strokeBase * 0.42}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.9"
            style={{
              fontFamily: layout.fontFamily,
              fontSize: `${layout.fontSize}px`,
              fontStyle: layout.fontStyle,
              fontWeight: layout.fontWeight,
              letterSpacing: layout.letterSpacing,
            }}
          >
            {text}
          </text>
        </svg>
      ) : null}
    </span>
  );
}
