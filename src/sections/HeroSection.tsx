import { m, type MotionValue } from 'motion/react';
import { HeroTitleHybrid, HeroTitleStaticFallback } from '../components/HeroTitleHybrid';
import RenderErrorBoundary from '../components/fallback/RenderErrorBoundary';
import { HERO_COPY } from '../content/siteCopy';
import {
  HERO_FALLBACK_WIDTH,
  getAvifImageUrl,
  getHeroAvifSrcset,
  getHeroSizes,
  getHeroSrcset,
  getImageMetadata,
  getImageUrl,
} from '../utils/images';

const HERO_SLUG = 'liquid-perception-hero' as const;
const heroMetadata = getImageMetadata(HERO_SLUG);

interface HeroRevealConfig {
  initial: false | { opacity: number; y: number };
  animate: { opacity: number; y: number };
  transition: { duration: number; delay?: number };
}

interface HeroSectionProps {
  readonly headerY: MotionValue<number>;
  readonly headerOpacity: MotionValue<number>;
  readonly heroReveal: (delay?: number) => HeroRevealConfig;
  readonly parallaxX: MotionValue<number>;
  readonly parallaxY: MotionValue<number>;
  readonly reducedMotion: boolean;
}

function DiagonalArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

export function HeroSection({
  headerY,
  headerOpacity,
  heroReveal,
  parallaxX,
  parallaxY,
  reducedMotion,
}: HeroSectionProps) {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <m.div
        className="hero-media"
        style={{ y: headerY, opacity: headerOpacity }}
      >
        <picture>
          <source
            type="image/avif"
            media="(max-width: 767px)"
            srcSet={getAvifImageUrl(HERO_SLUG, 720)}
          />
          <source
            type="image/avif"
            media="(min-width: 768px)"
            srcSet={getHeroAvifSrcset(HERO_SLUG)}
            sizes={getHeroSizes()}
          />
          <source
            type="image/webp"
            media="(max-width: 767px)"
            srcSet={getImageUrl(HERO_SLUG, 720)}
          />
          <source
            type="image/webp"
            media="(min-width: 768px)"
            srcSet={getHeroSrcset(HERO_SLUG)}
            sizes={getHeroSizes()}
          />
          <m.img
            src={getImageUrl(HERO_SLUG, HERO_FALLBACK_WIDTH)}
            alt={heroMetadata.alt}
            width={1672}
            height={941}
            fetchPriority="high"
            decoding="async"
            className="hero-background-image"
            style={{ y: parallaxY, x: parallaxX }}
          />
        </picture>
      </m.div>

      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-lockup">
          <m.p {...heroReveal(0.1)} className="hero-eyebrow" lang="en">
            {HERO_COPY.eyebrow}
          </m.p>

          <m.h1 id="hero-heading" {...heroReveal(0.2)} className="hero-heading">
            <span className="sr-only" lang="en">{HERO_COPY.titleSemantic}</span>
            <RenderErrorBoundary
              context="hero-title"
              fallback={<HeroTitleStaticFallback titleLines={HERO_COPY.titleLines} />}
            >
              <HeroTitleHybrid
                semanticTitle={HERO_COPY.titleSemantic}
                titleLines={HERO_COPY.titleLines}
                reducedMotion={reducedMotion}
              />
            </RenderErrorBoundary>
          </m.h1>

          <m.p {...heroReveal(0.34)} className="hero-subtitle">
            {HERO_COPY.subtitle}
          </m.p>
        </div>

        <m.a
          {...heroReveal(0.46)}
          href="#work"
          className="editorial-link hero-entry-link"
        >
          <span className="editorial-link-mark" aria-hidden="true" />
          <span>{HERO_COPY.cta}</span>
          <DiagonalArrow />
        </m.a>
      </div>
    </section>
  );
}
