import { useCallback, useEffect, useRef, useState } from 'react';
import { useDocumentVisibility } from '../../hooks/useDocumentVisibility';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ShaderRenderer, ShaderUnavailableError } from '../../lib/shaderRenderer';
import reportError from '../../lib/reportError';
import {
  applyInnerHighlight,
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
  onReady?: () => void;
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
  onReady,
}: ShaderTextWordProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyNotifiedRef = useRef(false);
  const canvasReadyRef = useRef(false);
  const rendererRef = useRef<ShaderRenderer | null>(null);
  const drawFrameRef = useRef<(() => void) | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isInView, setIsInView] = useState(true);
  const [rendererVersion, setRendererVersion] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isDocumentVisible = useDocumentVisibility();

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
    readyNotifiedRef.current = false;
    canvasReadyRef.current = false;
    setCanvasReady(false);
    setUseFallback(false);
  }, [text]);

  useEffect(() => {
    if (!wrapperRef.current || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry?.isIntersecting ?? true),
      { threshold: 0.05 },
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

    let renderer: ShaderRenderer;

    try {
      renderer = new ShaderRenderer(shaderWidth, shaderHeight);
      setUseFallback(false);
    } catch (error) {
      setUseFallback(true);
      if (!(error instanceof ShaderUnavailableError)) {
        reportError(error, 'shader-text-word:init', {
          text,
          shaderWidth,
          shaderHeight,
        });
      }
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

    const staticTime = 1.35;
    renderer.render(staticTime);
    drawMaskedFrame();

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
    finalStroke.color,
    finalStroke.minWidth,
    finalStroke.scale,
    fontsReady,
    getShadowConfig,
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
      renderer.start(() => {
        drawFrame();
      });
      return () => {
        renderer.stop();
      };
    }

    renderer.stop();
    renderer.render(1.35);
    drawFrame();
  }, [isDocumentVisible, isInView, prefersReducedMotion, rendererVersion]);

  return (
    <span ref={wrapperRef} className={wrapperClassName}>
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
        className={`${fallbackClassName} ${useFallback ? 'is-visible' : ''}`.trim()}
      >
        {text}
      </span>
    </span>
  );
}

export default ShaderTextWord;
