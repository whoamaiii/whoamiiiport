import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ShaderRenderer } from '../lib/shaderRenderer';

type TypographyContext = CanvasRenderingContext2D & {
  fontKerning?: CanvasFontKerning;
  letterSpacing?: string;
};

/**
 * Configuration for a single shadow layer
 */
interface ShadowLayerConfig {
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  strokeColor: string;
  strokeWidth: number;
  applyStroke: boolean;
}

/**
 * Complete shadow configuration with all layers
 */
interface TextShadowConfig {
  ambient: ShadowLayerConfig;
  halo: ShadowLayerConfig;
  primary: ShadowLayerConfig;
  innerGlow: ShadowLayerConfig;
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

/**
 * Get shadow configuration for section headings
 * Smaller text sizes need adjusted shadow parameters
 */
function getSectionShadowConfig(isMobile: boolean, fontSize: number): TextShadowConfig {
  // Scale shadows based on font size (section headings are smaller than hero)
  const sizeScale = Math.min(fontSize / 48, 1.0); // 48px is base section heading size
  const mobileScale = isMobile ? 0.75 : 1.0;
  const baseSize = sizeScale * mobileScale;

  return {
    // Wide ambient shadow for background separation
    ambient: {
      shadowColor: 'rgba(0, 0, 0, 0.20)',
      shadowBlur: 32 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeColor: 'rgba(0, 0, 0, 0.10)',
      strokeWidth: 0.10 * baseSize,
      applyStroke: true,
    },
    // Mid-range halo for edge definition
    halo: {
      shadowColor: 'rgba(0, 0, 0, 0.32)',
      shadowBlur: 18 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      strokeColor: 'rgba(0, 0, 0, 0.22)',
      strokeWidth: 0.05 * baseSize,
      applyStroke: true,
    },
    // Primary sharp shadow for crisp edges
    primary: {
      shadowColor: 'rgba(0, 0, 0, 0.50)',
      shadowBlur: 6 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: 3 * baseSize,
      strokeColor: 'rgba(0, 0, 0, 0.40)',
      strokeWidth: 0.035 * baseSize,
      applyStroke: true,
    },
    // Inner glow for glass edge effect
    innerGlow: {
      shadowColor: 'rgba(255, 255, 255, 0.22)',
      shadowBlur: 4 * baseSize,
      shadowOffsetX: 0,
      shadowOffsetY: -1 * baseSize,
      strokeColor: 'rgba(255, 255, 255, 0.10)',
      strokeWidth: 0.010 * baseSize,
      applyStroke: true,
    },
  };
}

/**
 * Apply multi-layer shadow system to canvas context
 */
function applyMultiLayerShadow(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  baselineY: number,
  config: TextShadowConfig,
  fontSize: number
): void {
  const { ambient, halo, primary, innerGlow } = config;

  // Layer 1: Wide ambient shadow
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = ambient.shadowColor;
  ctx.shadowBlur = ambient.shadowBlur;
  ctx.shadowOffsetX = ambient.shadowOffsetX;
  ctx.shadowOffsetY = ambient.shadowOffsetY;
  ctx.strokeStyle = ambient.strokeColor;
  ctx.lineWidth = Math.max(ambient.strokeWidth * fontSize, 1.5);
  ctx.strokeText(text, centerX, baselineY);
  ctx.restore();

  // Layer 2: Mid-range halo
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = halo.shadowColor;
  ctx.shadowBlur = halo.shadowBlur;
  ctx.shadowOffsetX = halo.shadowOffsetX;
  ctx.shadowOffsetY = halo.shadowOffsetY;
  ctx.strokeStyle = halo.strokeColor;
  ctx.lineWidth = Math.max(halo.strokeWidth * fontSize, 1.2);
  ctx.strokeText(text, centerX, baselineY);
  ctx.restore();

  // Layer 3: Primary sharp shadow
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = primary.shadowColor;
  ctx.shadowBlur = primary.shadowBlur;
  ctx.shadowOffsetX = primary.shadowOffsetX;
  ctx.shadowOffsetY = primary.shadowOffsetY;
  ctx.strokeStyle = primary.strokeColor;
  ctx.lineWidth = Math.max(primary.strokeWidth * fontSize, 1.0);
  ctx.strokeText(text, centerX, baselineY);
  ctx.restore();

  // Layer 4: Inner glow
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = innerGlow.shadowColor;
  ctx.shadowBlur = innerGlow.shadowBlur;
  ctx.shadowOffsetX = innerGlow.shadowOffsetX;
  ctx.shadowOffsetY = innerGlow.shadowOffsetY;
  ctx.strokeStyle = innerGlow.strokeColor;
  ctx.lineWidth = Math.max(innerGlow.strokeWidth * fontSize, 0.6);
  ctx.strokeText(text, centerX, baselineY);
  ctx.restore();
}

/**
 * Apply inner highlight for glass-like edge definition
 */
function applyInnerHighlight(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  baselineY: number,
  fontSize: number,
  isMobile: boolean
): void {
  ctx.save();

  // Top-edge highlight
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.28)';
  ctx.shadowBlur = isMobile ? 3 : 5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = isMobile ? -1 : -2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = Math.max(fontSize * 0.012, 0.6);
  ctx.strokeText(text, centerX, baselineY);

  // Subtle inner rim light
  ctx.shadowColor = 'rgba(255, 255, 245, 0.12)';
  ctx.shadowBlur = isMobile ? 1.5 : 2.5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = 'rgba(255, 255, 245, 0.07)';
  ctx.lineWidth = Math.max(fontSize * 0.006, 0.4);
  ctx.strokeText(text, centerX, baselineY);

  ctx.restore();
}

interface ShaderMaskedWordProps {
  text: string;
  onReady?: () => void;
}

function ShaderMaskedWord({ text, onReady }: ShaderMaskedWordProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const readyNotifiedRef = useRef(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const prefersReducedMotion = useReducedMotion();

  const notifyReady = useCallback(() => {
    if (readyNotifiedRef.current) {
      return;
    }

    readyNotifiedRef.current = true;
    onReady?.();
  }, [onReady]);

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
    readyNotifiedRef.current = false;
    setCanvasReady(false);
    setUseFallback(false);
  }, [text]);

  useEffect(() => {
    if (!fontsReady || !measureRef.current) {
      return;
    }

    const updateSize = () => {
      const rect = measureRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      setSize((current) => {
        const nextWidth = Math.ceil(rect.width);
        const nextHeight = Math.ceil(rect.height);

        if (current.width === nextWidth && current.height === nextHeight) {
          return current;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    };

    updateSize();

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateSize())
        : null;

    observer?.observe(measureRef.current);
    window.addEventListener('resize', updateSize);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [fontsReady]);

  useEffect(() => {
    if (!fontsReady || !size.width || !size.height || !canvasRef.current || !measureRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d') as TypographyContext | null;

    if (!context) {
      setUseFallback(true);
      notifyReady();
      return;
    }

    const computedStyle = window.getComputedStyle(measureRef.current);
    const displayWidth = size.width;
    const displayHeight = size.height;
    const displayDpr = clamp(window.devicePixelRatio || 1, 1, 2);

    canvas.width = Math.max(1, Math.round(displayWidth * displayDpr));
    canvas.height = Math.max(1, Math.round(displayHeight * displayDpr));
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Section headings use smaller shader resolution than hero
    const mobileScale = window.innerWidth < 768 ? 0.5 : 0.6;
    const motionScale = prefersReducedMotion ? 0.4 : mobileScale;
    const shaderWidth = clamp(Math.round(displayWidth * displayDpr * motionScale), 80, 700);
    const shaderHeight = clamp(Math.round(displayHeight * displayDpr * motionScale), 48, 350);

    let renderer: ShaderRenderer;

    try {
      renderer = new ShaderRenderer(shaderWidth, shaderHeight);
      setUseFallback(false);
    } catch {
      setUseFallback(true);
      notifyReady();
      return;
    }

    const typedContext = context as TypographyContext;
    const fontSize = Number.parseFloat(computedStyle.fontSize) || 16;

    typedContext.font = buildFontDeclaration(computedStyle);
    typedContext.textAlign = 'center';
    typedContext.textBaseline = 'alphabetic';
    typedContext.fontKerning = 'normal';

    if ('letterSpacing' in typedContext) {
      typedContext.letterSpacing = computedStyle.letterSpacing;
    }

    const metrics = typedContext.measureText(text);
    const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.78;
    const descent = metrics.actualBoundingBoxDescent || fontSize * 0.18;
    const baselineY = (displayHeight - (ascent + descent)) / 2 + ascent;
    const centerX = displayWidth / 2;

    const drawMaskedFrame = () => {
      typedContext.setTransform(1, 0, 0, 1, 0, 0);
      typedContext.clearRect(0, 0, canvas.width, canvas.height);
      typedContext.setTransform(displayDpr, 0, 0, displayDpr, 0, 0);

      // Multi-layer shadow system
      const isMobile = window.innerWidth < 768;
      const shadowConfig = getSectionShadowConfig(isMobile, fontSize);
      applyMultiLayerShadow(
        typedContext,
        text,
        centerX,
        baselineY,
        shadowConfig,
        fontSize
      );

      // Inner highlight
      applyInnerHighlight(
        typedContext,
        text,
        centerX,
        baselineY,
        fontSize,
        isMobile
      );

      typedContext.save();
      typedContext.globalAlpha = 1;
      typedContext.filter = 'saturate(1.04) contrast(1.03) brightness(1.06)';
      typedContext.drawImage(renderer.element, 0, 0, displayWidth, displayHeight);
      typedContext.restore();
      typedContext.filter = 'none';

      typedContext.globalCompositeOperation = 'destination-in';
      typedContext.fillStyle = '#ffffff';
      typedContext.fillText(text, centerX, baselineY);
      typedContext.globalCompositeOperation = 'source-over';

      const toneWash = typedContext.createLinearGradient(0, 0, displayWidth, displayHeight);
      toneWash.addColorStop(0, 'rgba(247, 214, 171, 0.07)');
      toneWash.addColorStop(0.42, 'rgba(198, 98, 144, 0.06)');
      toneWash.addColorStop(0.74, 'rgba(82, 108, 194, 0.05)');
      toneWash.addColorStop(1, 'rgba(112, 174, 184, 0.04)');

      typedContext.globalCompositeOperation = 'source-atop';
      typedContext.fillStyle = toneWash;
      typedContext.fillRect(0, 0, displayWidth, displayHeight);

      const valueGrade = typedContext.createLinearGradient(0, 0, 0, displayHeight);
      valueGrade.addColorStop(0, 'rgba(255, 245, 228, 0.05)');
      valueGrade.addColorStop(0.52, 'rgba(0, 0, 0, 0)');
      valueGrade.addColorStop(1, 'rgba(24, 16, 22, 0.05)');
      typedContext.fillStyle = valueGrade;
      typedContext.fillRect(0, 0, displayWidth, displayHeight);
      typedContext.globalCompositeOperation = 'source-over';

      // Final subtle highlight stroke
      typedContext.lineJoin = 'round';
      typedContext.lineCap = 'round';
      typedContext.strokeStyle = 'rgba(255, 248, 235, 0.09)';
      typedContext.lineWidth = Math.max(fontSize * 0.006, 0.6);
      typedContext.strokeText(text, centerX, baselineY);

      setCanvasReady((current) => current || true);
      notifyReady();
    };

    const staticTime = 1.35;

    if (prefersReducedMotion) {
      renderer.render(staticTime);
      drawMaskedFrame();
    } else {
      renderer.render(0.001);
      drawMaskedFrame();

      const renderLoop = (frameTime: number) => {
        renderer.render(frameTime * 0.001);
        drawMaskedFrame();
        animationFrameRef.current = window.requestAnimationFrame(renderLoop);
      };

      animationFrameRef.current = window.requestAnimationFrame(renderLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      renderer.dispose();
    };
  }, [fontsReady, notifyReady, prefersReducedMotion, size.height, size.width, text]);

  return (
    <span className="section-shader-word">
      <span ref={measureRef} className="section-shader-measure">
        {text}
      </span>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`section-shader-canvas ${canvasReady && !useFallback ? 'is-ready' : ''}`}
      />
      <span
        aria-hidden="true"
        className={`section-shader-fallback ${useFallback ? 'is-visible' : ''}`}
      >
        {text}
      </span>
    </span>
  );
}

interface ShaderHeadingProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  delay?: number;
  onReady?: () => void;
}

export function ShaderHeading({
  children,
  className = '',
  as: Component = 'h2',
  delay = 0,
  onReady,
}: ShaderHeadingProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        onReady?.();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isReady, delay, onReady]);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  return (
    <Component
      className={`section-shader-title ${className}`}
      aria-label={children}
      data-testid="shader-heading"
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        <ShaderMaskedWord text={children} onReady={handleReady} />
      </span>
    </Component>
  );
}
