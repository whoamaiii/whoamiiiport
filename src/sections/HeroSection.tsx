import { motion, type MotionValue } from 'motion/react';
import { HERO_FALLBACK_WIDTH, getHeroSizes, getHeroSrcset, getImageMetadata, getImageUrl } from '../utils/images';
import { HERO_COPY } from '../content/siteCopy';
import { HeroTitleHybrid, HeroTitleStaticFallback } from '../components/HeroTitleHybrid';
import RenderErrorBoundary from '../components/fallback/RenderErrorBoundary';

const HERO_SLUG = 'liquid-perception-hero' as const;
const heroMetadata = getImageMetadata(HERO_SLUG);
const HERO_IMAGE_WIDTH = 1672;
const HERO_IMAGE_HEIGHT = 941;

interface HeroRevealConfig {
  initial: false | { opacity: number; y: number };
  animate: { opacity: number; y: number };
  transition: { duration: number; delay?: number };
}

interface HeroSectionProps {
  headerY: MotionValue<number>;
  headerOpacity: MotionValue<number>;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  reducedMotion: boolean;
  heroReveal: (delay?: number) => HeroRevealConfig;
}

export function HeroSection({
  headerY,
  headerOpacity,
  parallaxX,
  parallaxY,
  reducedMotion,
  heroReveal,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden z-10 bg-zinc-950">
      <motion.div
        className="absolute inset-0 z-0 origin-center"
        style={{ y: headerY, opacity: headerOpacity }}
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-zinc-950 via-zinc-950/54 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950/88 via-zinc-950/18 to-zinc-950/44" />
        <div
          className="absolute inset-y-0 left-0 z-10 w-full md:w-[74%] bg-[radial-gradient(circle_at_18%_42%,rgba(9,10,14,0.76),rgba(9,10,14,0.54)_24%,rgba(9,10,14,0.18)_54%,rgba(9,10,14,0)_78%)]"
          aria-hidden="true"
        />

        <motion.img
          src={getImageUrl(HERO_SLUG, HERO_FALLBACK_WIDTH)}
          srcSet={getHeroSrcset(HERO_SLUG)}
          sizes={getHeroSizes()}
          alt={heroMetadata.alt}
          width={HERO_IMAGE_WIDTH}
          height={HERO_IMAGE_HEIGHT}
          fetchPriority="high"
          decoding="async"
          className="min-w-[120vw] min-h-[120vh] object-cover object-[39%_center] absolute -top-[10vh] -left-[10vw] md:object-center"
          style={{ y: parallaxY, x: parallaxX }}
        />
      </motion.div>

      <div className="relative z-20 min-h-[100dvh] w-full">
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-7xl items-end px-4 pt-[calc(var(--nav-offset)+1.1rem)] pb-[3.25rem] sm:px-6 sm:pt-[calc(var(--nav-offset)+1.45rem)] sm:pb-16 md:items-start md:px-10 md:pt-[calc(var(--nav-offset)+0.85rem)] md:pb-12">
          <div className="relative max-w-[23rem] sm:max-w-[31rem] md:max-w-[42rem]">
            <div
              className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[2.75rem] bg-[radial-gradient(circle_at_28%_38%,rgba(12,12,16,0.78),rgba(12,12,16,0.56)_28%,rgba(12,12,16,0.14)_63%,rgba(12,12,16,0)_82%)] blur-3xl"
              aria-hidden="true"
            />

            <motion.p
              {...heroReveal(0.16)}
              className="liquid-kicker mb-4 text-[0.72rem] uppercase tracking-[0.28em] sm:text-[0.76rem]"
            >
              {HERO_COPY.eyebrow}
            </motion.p>

            <motion.h1
              {...heroReveal(0.28)}
              className="mb-4 sm:mb-5 md:mb-6"
            >
              <span className="sr-only">{HERO_COPY.titleSemantic}</span>
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
            </motion.h1>

            <motion.p
              {...heroReveal(0.46)}
              className="hero-subtitle max-w-[25ch] text-[0.98rem] font-medium leading-[1.45] sm:text-[1.05rem] md:max-w-[27ch] md:text-[1.14rem]"
            >
              {HERO_COPY.subtitle}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
