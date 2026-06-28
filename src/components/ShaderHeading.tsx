import { useCallback, useEffect, useRef, type HTMLAttributes } from 'react';
import RenderErrorBoundary from './fallback/RenderErrorBoundary';
import { SHADER_HEADING_PRESETS, type ShaderHeadingVariant } from './ShaderHeadingPresets';
import { ShaderTextWord } from './shared/ShaderTextWord';

type HeadingLevel = 'h1' | 'h2' | 'h3';

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
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
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
  const readyLinesRef = useRef<Set<number> | null>(null);
  const readyCompleteRef = useRef(false);
  const readyTimerRef = useRef<number | null>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  if (readyLinesRef.current === null) {
    readyLinesRef.current = new Set<number>();
  }
  const preset = SHADER_HEADING_PRESETS[variant];
  const lines = visualLines?.length ? visualLines : [children];
  const linesKey = lines.map((line) => String(line)).join('|');
  const { 'aria-label': htmlAriaLabel, ...semanticHeadingProps } = headingProps;
  const semanticText = ariaLabel ?? htmlAriaLabel ?? children;

  const clearReadyTimer = useCallback(() => {
    if (readyTimerRef.current === null) {
      return;
    }

    window.clearTimeout(readyTimerRef.current);
    readyTimerRef.current = null;
  }, []);

  const scheduleReady = useCallback(() => {
    clearReadyTimer();
    readyTimerRef.current = window.setTimeout(() => {
      readyTimerRef.current = null;
      onReadyRef.current?.();
    }, delay);
  }, [clearReadyTimer, delay]);

  const handleLineReady = useCallback(
    (index: number) => {
      const readyLines = readyLinesRef.current;
      if (!readyLines || readyCompleteRef.current) {
        return;
      }

      readyLines.add(index);
      if (readyLines.size >= lines.length) {
        readyCompleteRef.current = true;
        scheduleReady();
      }
    },
    [lines.length, scheduleReady],
  );

  useEffect(() => {
    clearReadyTimer();
    readyLinesRef.current?.clear();
    readyCompleteRef.current = false;
  }, [clearReadyTimer, linesKey]);

  useEffect(() => clearReadyTimer, [clearReadyTimer]);

  return (
    <Component
      className={`section-shader-title ${preset.rootClassName} ${className}`.trim()}
      data-heading-variant={variant}
      data-testid="shader-heading"
      {...semanticHeadingProps}
    >
      <span className="sr-only">{semanticText}</span>
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
                  onReady={() => handleLineReady(index)}
                />
              </span>
            ))}
          </span>
        </RenderErrorBoundary>
      </span>
    </Component>
  );
}
