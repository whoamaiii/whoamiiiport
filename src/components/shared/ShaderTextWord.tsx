import { useCallback, useEffect, useRef, useState } from 'react';
import { useDocumentVisibility } from '../../hooks/useDocumentVisibility';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  ShaderRenderer,
  ShaderUnavailableError,
  type HeroLiquidRendererOptions,
  type ShaderRendererVariant,
} from '../../lib/shaderRenderer';
import reportError from '../../lib/reportError';
import {
  applyInnerHighlight,
  applyLiquidGlassSurface,
  applyMultiLayerShadow,
  buildFontDeclaration,
  clamp,
  type TextShadowConfig,
  type TypographyContext,
  waitForFonts,
} from './shaderTextShared';

interface ShaderScaleConfig {
  mobile: number;
  desktop: number;
  reduced: number;
}

interface ShaderClampConfig {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

interface FinalStrokeConfig {
  color: string;
  scale: number;
  minWidth: number;
}

type LiquidGlassSurfaceMode = 'none' | 'section' | 'hero';

type HeroLiquidTextConfig = Omit<
  HeroLiquidRendererOptions,
  | 'backgroundImage'
  | 'canvasViewportMin'
  | 'canvasViewportSize'
  | 'reducedMotion'
  | 'textMask'
  | 'viewportSize'
> & {
  backgroundImageUrl?: string;
};

interface ShaderTextWordProps {
  text: string;
  wrapperClassName: string;
  measureClassName: string;
  canvasClassName: string;
  fallbackClassName: string;
  shaderScale: ShaderScaleConfig;
  shaderClamp: ShaderClampConfig;
  getShadowConfig: (isMobile: boolean, fontSize: number) => TextShadowConfig;
  finalStroke: FinalStrokeConfig;
  glassSurface?: LiquidGlassSurfaceMode;
  heroLiquid?: HeroLiquidTextConfig;
  shaderVariant?: ShaderRendererVariant;
  onReady?: () => void;
}

let shaderRendererUnavailable = false;

function createTextMaskCanvas({
  baselineY,
  centerX,
  computedStyle,
  displayHeight,
  displayWidth,
  shaderHeight,
  shaderWidth,
  text,
}: {
  baselineY: number;
  centerX: number;
  computedStyle: CSSStyleDeclaration;
  displayHeight: number;
  displayWidth: number;
  shaderHeight: number;
  shaderWidth: number;
  text: string;
}) {
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = Math.max(1, shaderWidth);
  maskCanvas.height = Math.max(1, shaderHeight);

  const maskContext = maskCanvas.getContext('2d') as TypographyContext | null;
  if (!maskContext) {
    return null;
  }

  maskContext.setTransform(1, 0, 0, 1, 0, 0);
  maskContext.clearRect(0, 0, shaderWidth, shaderHeight);
  maskContext.setTransform(shaderWidth / displayWidth, 0, 0, shaderHeight / displayHeight, 0, 0);
  maskContext.font = buildFontDeclaration(computedStyle);
  maskContext.textAlign = 'center';
  maskContext.textBaseline = 'alphabetic';
  maskContext.fontKerning = 'normal';
  maskContext.fillStyle = '#ffffff';

  if ('letterSpacing' in maskContext) {
    maskContext.letterSpacing = computedStyle.letterSpacing;
  }

  maskContext.fillText(text, centerX, baselineY);
  return maskCanvas;
}

function getCanvasViewportOptions(canvas: HTMLCanvasElement, displayWidth: number, displayHeight: number) {
  const viewportWidth =
    typeof window !== 'undefined' && window.innerWidth > 0 ? window.innerWidth : displayWidth;
  const viewportHeight =
    typeof window !== 'undefined' && window.innerHeight > 0 ? window.innerHeight : displayHeight;
  const rect = canvas.getBoundingClientRect();

  return {
    canvasViewportMin: [rect.left || 0, rect.top || 0] as const,
    canvasViewportSize: [rect.width || displayWidth, rect.height || displayHeight] as const,
    viewportSize: [viewportWidth, viewportHeight] as const,
  };
}

function loadImage(source: string, onLoad: (image: HTMLImageElement) => void, onError: () => void) {
  const image = new Image();
  let settled = false;

  const resolve = () => {
    if (settled || !image.naturalWidth) {
      return;
    }

    settled = true;
    onLoad(image);
  };

  image.decoding = 'async';
  image.onload = resolve;
  image.onerror = () => {
    if (!settled) {
      settled = true;
      onError();
    }
  };
  image.src = source;

  image.decode?.().then(resolve).catch(() => {
    if (image.complete && image.naturalWidth) {
      resolve();
      return;
    }

    if (!settled) {
      settled = true;
      onError();
    }
  });

  return image;
}

export function ShaderTextWord({
  text,
  wrapperClassName,
  measureClassName,
  canvasClassName,
  fallbackClassName,
  shaderScale,
  shaderClamp,
  getShadowConfig,
  finalStroke,
  glassSurface,
  heroLiquid,
  shaderVariant = 'section',
  onReady,
}: ShaderTextWordProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyNotifiedRef = useRef(false);
  const canvasReadyRef = useRef(false);
  const rendererRef = useRef<ShaderRenderer | null>(null);
  const drawFrameRef = useRef<((time?: number) => void) | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isInView, setIsInView] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(
    () => typeof IntersectionObserver === 'undefined',
  );
  const [rendererVersion, setRendererVersion] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isDocumentVisible = useDocumentVisibility();
  const heroBackgroundImageUrl = shaderVariant === 'heroLiquid' ? heroLiquid?.backgroundImageUrl : undefined;
  const heroBackgroundDarken = heroLiquid?.backgroundDarken;
  const heroBackgroundMix = heroLiquid?.backgroundMix;
  const heroBackgroundOffset = heroLiquid?.backgroundOffset;
  const heroBackgroundScale = heroLiquid?.backgroundScale;
  const heroCausticStrength = heroLiquid?.causticStrength;
  const heroCoreBrightness = heroLiquid?.coreBrightness;
  const heroCoreContrast = heroLiquid?.coreContrast;
  const heroCoreSaturation = heroLiquid?.coreSaturation;
  const heroDispersionStrength = heroLiquid?.dispersionStrength;
  const heroGlowStrength = heroLiquid?.glowStrength;
  const heroInnerShadowStrength = heroLiquid?.innerShadowStrength;
  const heroLiquidOpacity = heroLiquid?.liquidOpacity;
  const heroLiquidSpeed = heroLiquid?.liquidSpeed;
  const heroLiquidWarp = heroLiquid?.liquidWarp;
  const heroRefractPixels = heroLiquid?.refractPixels;
  const heroRimWidth = heroLiquid?.rimWidth;
  const heroRimStrength = heroLiquid?.rimStrength;
  const heroTitleUvOffset = heroLiquid?.titleUvOffset;
  const heroTitleUvScale = heroLiquid?.titleUvScale;

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
      if (mounted) {
        setFontsReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!heroBackgroundImageUrl) {
      setBackgroundImage(null);
      return;
    }

    let mounted = true;
    setBackgroundImage(null);

    loadImage(
      heroBackgroundImageUrl,
      (image) => {
        if (mounted) {
          setBackgroundImage(image);
        }
      },
      () => {
        if (mounted) {
          setBackgroundImage(null);
        }
      },
    );

    return () => {
      mounted = false;
    };
  }, [heroBackgroundImageUrl]);

  useEffect(() => {
    readyNotifiedRef.current = false;
    canvasReadyRef.current = false;
    setCanvasReady(false);
    setUseFallback(false);
  }, [text]);

  useEffect(() => {
    if (!wrapperRef.current || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry?.isIntersecting ?? true;
        setIsInView(inView);
        if (inView) {
          setHasEnteredView(true);
        }
      },
      { rootMargin: '180px 0px', threshold: 0.05 },
    );

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

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
    if (!hasEnteredView) {
      return;
    }

    if (!fontsReady || !size.width || !size.height || !canvasRef.current || !measureRef.current) {
      return;
    }

    if (shaderRendererUnavailable) {
      setUseFallback(true);
      notifyReady();
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
    const displayDpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const displayWidth = size.width;
    const displayHeight = size.height;

    canvas.width = Math.max(1, Math.round(displayWidth * displayDpr));
    canvas.height = Math.max(1, Math.round(displayHeight * displayDpr));
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const baseScale = isMobile ? shaderScale.mobile : shaderScale.desktop;
    const motionScale = prefersReducedMotion ? shaderScale.reduced : baseScale;
    const shaderWidth = clamp(
      Math.round(displayWidth * displayDpr * motionScale),
      shaderClamp.minWidth,
      shaderClamp.maxWidth,
    );
    const shaderHeight = clamp(
      Math.round(displayHeight * displayDpr * motionScale),
      shaderClamp.minHeight,
      shaderClamp.maxHeight,
    );

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
    const textMask =
      shaderVariant === 'heroLiquid'
        ? createTextMaskCanvas({
            baselineY,
            centerX,
            computedStyle,
            displayHeight,
            displayWidth,
            shaderHeight,
            shaderWidth,
            text,
          })
        : null;

    if (shaderVariant === 'heroLiquid' && !textMask) {
      setUseFallback(true);
      notifyReady();
      return;
    }

    const staticTime = 1.35;
    const baseHeroOptions: HeroLiquidRendererOptions | undefined =
      shaderVariant === 'heroLiquid'
        ? {
            backgroundDarken: heroBackgroundDarken ?? 0.62,
            backgroundImage,
            backgroundMix: heroBackgroundMix ?? 0.24,
            backgroundOffset: heroBackgroundOffset ?? (isMobile ? [0.08, 0.08] : [0.10, 0.06]),
            backgroundScale: heroBackgroundScale ?? (isMobile ? [0.46, 0.72] : [0.82, 0.80]),
            causticStrength: heroCausticStrength ?? 0.18,
            coreBrightness: heroCoreBrightness ?? 1,
            coreContrast: heroCoreContrast ?? 1.08,
            coreSaturation: heroCoreSaturation ?? 1.18,
            dispersionStrength: heroDispersionStrength ?? 0.005,
            glowStrength: heroGlowStrength ?? 0.12,
            innerShadowStrength: heroInnerShadowStrength ?? 0.38,
            liquidOpacity: heroLiquidOpacity ?? 0.62,
            liquidSpeed: prefersReducedMotion ? 0.01 : heroLiquidSpeed ?? 0.045,
            liquidWarp: prefersReducedMotion ? 0.02 : heroLiquidWarp ?? 0.07,
            reducedMotion: prefersReducedMotion,
            refractPixels: heroRefractPixels ?? (isMobile ? 8 : 11),
            rimWidth: heroRimWidth ?? 0.72,
            rimStrength: heroRimStrength ?? 0.82,
            textMask,
            titleUvOffset: heroTitleUvOffset ?? [0, 0],
            titleUvScale: heroTitleUvScale ?? [1, 1],
            ...getCanvasViewportOptions(canvas, displayWidth, displayHeight),
          }
        : undefined;

    let renderer: ShaderRenderer;

    try {
      renderer = new ShaderRenderer(shaderWidth, shaderHeight, shaderVariant, {
        heroLiquid: baseHeroOptions,
      });
      setUseFallback(false);
    } catch (error) {
      setUseFallback(true);
      if (error instanceof ShaderUnavailableError) {
        shaderRendererUnavailable = true;
      } else {
        reportError(error, 'shader-text-word:init', {
          text,
          shaderVariant,
          shaderWidth,
          shaderHeight,
        });
      }
      notifyReady();
      return;
    }

    const drawMaskedFrame = (time = staticTime) => {
      if (baseHeroOptions) {
        renderer.setHeroLiquidOptions({
          ...baseHeroOptions,
          ...getCanvasViewportOptions(canvas, displayWidth, displayHeight),
        });
      }

      typedContext.setTransform(1, 0, 0, 1, 0, 0);
      typedContext.clearRect(0, 0, canvas.width, canvas.height);
      typedContext.setTransform(displayDpr, 0, 0, displayDpr, 0, 0);

      const shadowConfig = getShadowConfig(isMobile, fontSize);
      applyMultiLayerShadow(
        typedContext,
        text,
        centerX,
        baselineY,
        shadowConfig,
        fontSize,
      );

      applyInnerHighlight(
        typedContext,
        text,
        centerX,
        baselineY,
        fontSize,
        isMobile,
      );

      typedContext.save();
      typedContext.globalAlpha = 1;
      typedContext.filter =
        shaderVariant === 'heroLiquid'
          ? 'saturate(1.04) contrast(1.07) brightness(0.98)'
          : 'saturate(1.04) contrast(1.03) brightness(1.06)';
      typedContext.drawImage(renderer.element, 0, 0, displayWidth, displayHeight);
      typedContext.restore();
      typedContext.filter = 'none';

      typedContext.globalCompositeOperation = 'destination-in';
      typedContext.fillStyle = '#ffffff';
      typedContext.fillText(text, centerX, baselineY);
      typedContext.globalCompositeOperation = 'source-over';

      const toneWash = typedContext.createLinearGradient(0, 0, displayWidth, displayHeight);
      toneWash.addColorStop(
        0,
        shaderVariant === 'heroLiquid' ? 'rgba(247, 214, 171, 0.014)' : 'rgba(247, 214, 171, 0.07)',
      );
      toneWash.addColorStop(
        0.42,
        shaderVariant === 'heroLiquid' ? 'rgba(198, 98, 144, 0.012)' : 'rgba(198, 98, 144, 0.06)',
      );
      toneWash.addColorStop(
        0.74,
        shaderVariant === 'heroLiquid' ? 'rgba(82, 108, 194, 0.01)' : 'rgba(82, 108, 194, 0.05)',
      );
      toneWash.addColorStop(
        1,
        shaderVariant === 'heroLiquid' ? 'rgba(112, 174, 184, 0.008)' : 'rgba(112, 174, 184, 0.04)',
      );

      typedContext.globalCompositeOperation = 'source-atop';
      typedContext.fillStyle = toneWash;
      typedContext.fillRect(0, 0, displayWidth, displayHeight);

      const valueGrade = typedContext.createLinearGradient(0, 0, 0, displayHeight);
      valueGrade.addColorStop(
        0,
        shaderVariant === 'heroLiquid' ? 'rgba(255, 245, 228, 0.012)' : 'rgba(255, 245, 228, 0.05)',
      );
      valueGrade.addColorStop(0.52, 'rgba(0, 0, 0, 0)');
      valueGrade.addColorStop(
        1,
        shaderVariant === 'heroLiquid' ? 'rgba(24, 16, 22, 0.014)' : 'rgba(24, 16, 22, 0.05)',
      );
      typedContext.fillStyle = valueGrade;
      typedContext.fillRect(0, 0, displayWidth, displayHeight);
      typedContext.globalCompositeOperation = 'source-over';

      const glassSurfaceMode = glassSurface ?? (shaderVariant === 'heroLiquid' ? 'hero' : 'none');

      if (glassSurfaceMode !== 'none') {
        applyLiquidGlassSurface(
          typedContext,
          text,
          centerX,
          baselineY,
          {
            displayWidth,
            displayHeight,
            fontSize,
            intensity: glassSurfaceMode === 'hero' ? 0.34 : 0.68,
            isMobile,
            mode: glassSurfaceMode === 'hero' ? 'hero' : 'section',
            time,
          },
        );
      }

      typedContext.lineJoin = 'round';
      typedContext.lineCap = 'round';
      typedContext.strokeStyle = finalStroke.color;
      typedContext.lineWidth = Math.max(fontSize * finalStroke.scale, finalStroke.minWidth);
      typedContext.strokeText(text, centerX, baselineY);

      if (!canvasReadyRef.current) {
        canvasReadyRef.current = true;
        setCanvasReady(true);
      }

      notifyReady();
    };

    renderer.render(staticTime);
    drawMaskedFrame(staticTime);

    rendererRef.current = renderer;
    drawFrameRef.current = drawMaskedFrame;
    setRendererVersion((version) => version + 1);

    return () => {
      renderer.stop();
      renderer.dispose();
      if (rendererRef.current === renderer) {
        rendererRef.current = null;
      }
      if (drawFrameRef.current === drawMaskedFrame) {
        drawFrameRef.current = null;
      }
    };
  }, [
    backgroundImage,
    finalStroke.color,
    finalStroke.minWidth,
    finalStroke.scale,
    fontsReady,
    getShadowConfig,
    glassSurface,
    hasEnteredView,
    heroBackgroundDarken,
    heroBackgroundMix,
    heroBackgroundOffset,
    heroBackgroundScale,
    heroCausticStrength,
    heroCoreBrightness,
    heroCoreContrast,
    heroCoreSaturation,
    heroDispersionStrength,
    heroGlowStrength,
    heroInnerShadowStrength,
    heroLiquidOpacity,
    heroLiquidSpeed,
    heroLiquidWarp,
    heroRefractPixels,
    heroRimWidth,
    heroRimStrength,
    heroTitleUvOffset,
    heroTitleUvScale,
    isMobile,
    notifyReady,
    prefersReducedMotion,
    shaderClamp.maxHeight,
    shaderClamp.maxWidth,
    shaderClamp.minHeight,
    shaderClamp.minWidth,
    shaderScale.desktop,
    shaderScale.mobile,
    shaderScale.reduced,
    shaderVariant,
    size.height,
    size.width,
    text,
  ]);

  useEffect(() => {
    const renderer = rendererRef.current;
    const drawFrame = drawFrameRef.current;
    if (!renderer || !drawFrame) {
      return;
    }

    const shouldAnimate = !prefersReducedMotion && isDocumentVisible && isInView;
    if (shouldAnimate) {
      renderer.start((_, seconds) => {
        drawFrame(seconds);
      });
      return () => {
        renderer.stop();
      };
    }

    renderer.stop();
    renderer.render(1.35);
    drawFrame(1.35);
  }, [isDocumentVisible, isInView, prefersReducedMotion, rendererVersion]);

  return (
    <span ref={wrapperRef} className={wrapperClassName} data-text={text}>
      <span ref={measureRef} className={measureClassName}>
        {text}
      </span>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`${canvasClassName} ${canvasReady && !useFallback ? 'is-ready' : ''}`.trim()}
      />
      <span
        aria-hidden="true"
        className={`${fallbackClassName} ${useFallback ? 'is-visible' : ''} ${
          canvasReady && !useFallback ? 'is-hidden' : ''
        }`.trim()}
      >
        {text}
      </span>
    </span>
  );
}

export default ShaderTextWord;
