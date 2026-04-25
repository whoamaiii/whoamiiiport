import { useEffect, useId, useRef } from 'react';
import { useDocumentVisibility } from '../hooks/useDocumentVisibility';
import reportError from '../lib/reportError';
import {
  HERO_WORDMARK_LINES,
  HERO_WORDMARK_VIEWBOX,
  matchesHeroWordmark,
  type HeroTitleLines,
} from './heroWordmarkData';

interface HeroTitleHybridProps {
  semanticTitle: string;
  titleLines: HeroTitleLines;
  reducedMotion: boolean;
  forceFallback?: boolean;
}

function HeroTitleFallback({ titleLines }: { titleLines: HeroTitleLines }) {
  return (
    <span className="hero-title-fallback" data-testid="hero-title-fallback">
      <span>{titleLines[0]}</span>
      <span>{titleLines[1]}</span>
    </span>
  );
}

export function HeroTitleHybrid({
  semanticTitle,
  titleLines,
  reducedMotion,
  forceFallback = false,
}: HeroTitleHybridProps) {
  const isDocumentVisible = useDocumentVisibility();
  const ids = useId().replace(/:/g, '');
  const reportedRef = useRef(false);
  const visualSupported = !forceFallback && matchesHeroWordmark(titleLines);
  const shouldAnimate = visualSupported && !reducedMotion && isDocumentVisible;
  const baseGradientId = `${ids}-hero-title-base`;
  const edgeGradientId = `${ids}-hero-title-edge`;
  const glowGradientId = `${ids}-hero-title-glow`;
  const sheenGradientId = `${ids}-hero-title-sheen`;
  const blurFilterId = `${ids}-hero-title-blur`;
  const clipPathId = `${ids}-hero-title-clip`;
  const firstLineTransform = `translate(${HERO_WORDMARK_LINES.first.x} ${HERO_WORDMARK_LINES.first.y + HERO_WORDMARK_LINES.first.height}) scale(1 -1)`;
  const secondLineTransform = `translate(${HERO_WORDMARK_LINES.second.x} ${HERO_WORDMARK_LINES.second.y + HERO_WORDMARK_LINES.second.height}) scale(1 -1)`;

  useEffect(() => {
    if (visualSupported || reportedRef.current) {
      return;
    }

    reportedRef.current = true;
    reportError(new Error('Hero wordmark asset does not match the requested title lines.'), 'hero-title-hybrid:visual-fallback', {
      semanticTitle,
      titleLines,
    });
  }, [semanticTitle, titleLines, visualSupported]);

  return (
    <>
      <span className="sr-only">{semanticTitle}</span>
      <span
        aria-hidden="true"
        className="hero-title-hybrid"
        data-testid="hero-title-visual"
        data-mode={visualSupported ? 'visual' : 'fallback'}
        data-animated={shouldAnimate ? 'true' : 'false'}
      >
        {visualSupported ? (
          <svg
            className="hero-title-svg"
            viewBox={`0 0 ${HERO_WORDMARK_VIEWBOX.width} ${HERO_WORDMARK_VIEWBOX.height}`}
            role="presentation"
            focusable="false"
            preserveAspectRatio="xMinYMin meet"
          >
            <defs>
              <linearGradient id={baseGradientId} x1="3%" y1="8%" x2="94%" y2="92%">
                <stop offset="0%" stopColor="#f6dcc6" />
                <stop offset="28%" stopColor="#ebb4a3" />
                <stop offset="54%" stopColor="#c77f87" />
                <stop offset="79%" stopColor="#66738f" />
                <stop offset="100%" stopColor="#9ecfc4" />
              </linearGradient>
              <linearGradient id={edgeGradientId} x1="10%" y1="0%" x2="90%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 247, 238, 0.94)" />
                <stop offset="48%" stopColor="rgba(255, 240, 231, 0.48)" />
                <stop offset="100%" stopColor="rgba(186, 225, 214, 0.6)" />
              </linearGradient>
              <radialGradient id={glowGradientId} cx="28%" cy="16%" r="88%">
                <stop offset="0%" stopColor="rgba(255, 244, 232, 0.42)" />
                <stop offset="55%" stopColor="rgba(242, 196, 194, 0.18)" />
                <stop offset="100%" stopColor="rgba(99, 109, 141, 0)" />
              </radialGradient>
              <linearGradient id={sheenGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                <stop offset="42%" stopColor="rgba(255, 255, 255, 0)" />
                <stop offset="51%" stopColor="rgba(255, 250, 245, 0.82)" />
                <stop offset="60%" stopColor="rgba(255, 255, 255, 0)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </linearGradient>
              <filter id={blurFilterId} x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
              <clipPath id={clipPathId}>
                <path
                  d={HERO_WORDMARK_LINES.first.d}
                  transform={firstLineTransform}
                />
                <path
                  d={HERO_WORDMARK_LINES.second.d}
                  transform={secondLineTransform}
                />
              </clipPath>
            </defs>

            <g className="hero-title-shadow-layer" opacity="0.28" filter={`url(#${blurFilterId})`}>
              <path
                d={HERO_WORDMARK_LINES.first.d}
                transform={firstLineTransform}
                fill={`url(#${glowGradientId})`}
              />
              <path
                d={HERO_WORDMARK_LINES.second.d}
                transform={secondLineTransform}
                fill={`url(#${glowGradientId})`}
              />
            </g>

            <g className="hero-title-wordmark-layer">
              <path
                className="hero-title-wordmark-fill"
                d={HERO_WORDMARK_LINES.first.d}
                transform={firstLineTransform}
                fill={`url(#${baseGradientId})`}
              />
              <path
                className="hero-title-wordmark-fill"
                d={HERO_WORDMARK_LINES.second.d}
                transform={secondLineTransform}
                fill={`url(#${baseGradientId})`}
              />
              <path
                className="hero-title-wordmark-rim"
                d={HERO_WORDMARK_LINES.first.d}
                transform={firstLineTransform}
                fill="none"
                stroke={`url(#${edgeGradientId})`}
              />
              <path
                className="hero-title-wordmark-rim"
                d={HERO_WORDMARK_LINES.second.d}
                transform={secondLineTransform}
                fill="none"
                stroke={`url(#${edgeGradientId})`}
              />
              <path
                className="hero-title-wordmark-inner"
                d={HERO_WORDMARK_LINES.first.d}
                transform={firstLineTransform}
                fill="none"
              />
              <path
                className="hero-title-wordmark-inner"
                d={HERO_WORDMARK_LINES.second.d}
                transform={secondLineTransform}
                fill="none"
              />
            </g>

            <g clipPath={`url(#${clipPathId})`}>
              <g className="hero-title-sheen-track">
                <rect
                  className="hero-title-sheen"
                  x="-340"
                  y="-80"
                  width="320"
                  height="610"
                  fill={`url(#${sheenGradientId})`}
                />
              </g>
            </g>
          </svg>
        ) : (
          <HeroTitleFallback titleLines={titleLines} />
        )}
      </span>
    </>
  );
}

export default HeroTitleHybrid;
