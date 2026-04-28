import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { motion, type MotionValue } from 'motion/react';
import { getHeroSizes, getHeroSrcset, getImageMetadata, getImageUrl } from '../utils/images';
import { HERO_COPY } from '../content/siteCopy';
import { HeroTitleHybrid } from '../components/HeroTitleHybrid';
import { useDocumentVisibility } from '../hooks/useDocumentVisibility';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { HERO_VIDEO } from '../utils/media';
import reportError from '../lib/reportError';

const HERO_SLUG = 'joetrip2' as const;
const heroMetadata = getImageMetadata(HERO_SLUG);
const HERO_IMAGE_WIDTH = 1440;
const HERO_IMAGE_HEIGHT = 2160;
const HERO_VIDEO_ENABLE_DELAY_MS = 1200;

interface HeroVideoConnection {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
}

function getHeroVideoConnection(): HeroVideoConnection | null {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const navigatorWithConnection = navigator as Navigator & {
    connection?: HeroVideoConnection;
    mozConnection?: HeroVideoConnection;
    webkitConnection?: HeroVideoConnection;
  };

  return (
    navigatorWithConnection.connection ??
    navigatorWithConnection.mozConnection ??
    navigatorWithConnection.webkitConnection ??
    null
  );
}

export function isHeroVideoConnectionConstrained(
  connection: HeroVideoConnection | null = getHeroVideoConnection(),
): boolean {
  if (!connection) {
    return false;
  }

  if (connection.saveData === true) {
    return true;
  }

  const effectiveType = connection.effectiveType?.toLowerCase();
  return effectiveType === 'slow-2g' || effectiveType === '2g';
}

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
  const isDocumentVisible = useDocumentVisibility();
  const prefersLargeViewport = useMediaQuery('(min-width: 1024px)', false);
  const [shouldPlayHeroVideo, setShouldPlayHeroVideo] = useState(false);
  const [isHeroVideoDisabled, setIsHeroVideoDisabled] = useState(false);
  const [isConnectionConstrained, setIsConnectionConstrained] = useState(() =>
    isHeroVideoConnectionConstrained(),
  );
  const heroVideoFailureReportedRef = useRef(false);
  const allowHeroVideo =
    !isHeroVideoDisabled &&
    !isConnectionConstrained &&
    !reducedMotion &&
    prefersLargeViewport &&
    isDocumentVisible;

  useEffect(() => {
    const connection = getHeroVideoConnection();
    if (!connection) {
      setIsConnectionConstrained(false);
      return;
    }

    const updateConnectionState = () => {
      setIsConnectionConstrained(isHeroVideoConnectionConstrained(connection));
    };

    updateConnectionState();

    if (typeof connection.addEventListener !== 'function') {
      return;
    }

    connection.addEventListener('change', updateConnectionState);
    return () => {
      connection.removeEventListener?.('change', updateConnectionState);
    };
  }, []);

  useEffect(() => {
    if (!allowHeroVideo) {
      setShouldPlayHeroVideo(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShouldPlayHeroVideo(true);
    }, HERO_VIDEO_ENABLE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [allowHeroVideo]);

  const handleHeroVideoFailure = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
    setShouldPlayHeroVideo(false);
    setIsHeroVideoDisabled(true);

    if (heroVideoFailureReportedRef.current) {
      return;
    }

    heroVideoFailureReportedRef.current = true;
    reportError(new Error('Hero overlay video failed to load or stalled.'), 'hero-section:overlay-video', {
      currentSrc: event.currentTarget.currentSrc || undefined,
      eventType: event.type,
      networkState: event.currentTarget.networkState,
      readyState: event.currentTarget.readyState,
      src: HERO_VIDEO.src,
    });
  }, []);

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
          src={getImageUrl(HERO_SLUG, HERO_IMAGE_WIDTH)}
          srcSet={getHeroSrcset(HERO_SLUG)}
          sizes={getHeroSizes()}
          alt={heroMetadata.alt}
          width={HERO_IMAGE_WIDTH}
          height={HERO_IMAGE_HEIGHT}
          fetchPriority="high"
          decoding="async"
          className="min-w-[120vw] min-h-[120vh] object-cover object-center absolute -top-[10vh] -left-[10vw]"
          style={{ y: parallaxY, x: parallaxX }}
        />

        {shouldPlayHeroVideo && (
          <motion.video
            className="min-w-[120vw] min-h-[120vh] object-cover object-center absolute -top-[10vh] -left-[10vw]"
            style={{ y: parallaxY, x: parallaxX }}
            data-testid="hero-overlay-video"
            autoPlay
            muted
            loop
            onError={handleHeroVideoFailure}
            onStalled={handleHeroVideoFailure}
            playsInline
            preload="none"
            poster={getImageUrl(HERO_SLUG, HERO_IMAGE_WIDTH)}
            aria-hidden="true"
          >
            <source src={HERO_VIDEO.src} type={HERO_VIDEO.type} />
          </motion.video>
        )}
      </motion.div>

      <div className="relative z-20 flex min-h-[100dvh] w-full items-start">
        <div className="mx-auto flex w-full max-w-7xl items-start px-4 pt-[calc(var(--nav-offset)+1.1rem)] pb-14 sm:px-6 sm:pt-[calc(var(--nav-offset)+1.45rem)] sm:pb-20 md:px-10 md:pt-[calc(var(--nav-offset)+0.85rem)] md:pb-12">
          <div className="relative max-w-[23rem] sm:max-w-[31rem] md:max-w-[42rem]">
            <div
              className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 rounded-[2.75rem] bg-[radial-gradient(circle_at_28%_38%,rgba(12,12,16,0.78),rgba(12,12,16,0.56)_28%,rgba(12,12,16,0.14)_63%,rgba(12,12,16,0)_82%)] blur-3xl"
              aria-hidden="true"
            />

            <motion.p
              {...heroReveal(0.16)}
              className="mb-4 text-[0.72rem] uppercase tracking-[0.28em] text-stone-200/62 sm:text-[0.76rem]"
            >
              {HERO_COPY.eyebrow}
            </motion.p>

            <motion.h1
              {...heroReveal(0.28)}
              aria-label={HERO_COPY.titleSemantic}
              className="mb-4 sm:mb-5 md:mb-6"
            >
              <HeroTitleHybrid
                semanticTitle={HERO_COPY.titleSemantic}
                titleLines={HERO_COPY.titleLines}
                reducedMotion={reducedMotion}
              />
            </motion.h1>

            <motion.p
              {...heroReveal(0.46)}
              className="hero-subtitle max-w-[25ch] text-[0.98rem] font-medium leading-[1.45] text-stone-100/82 sm:text-[1.05rem] md:max-w-[27ch] md:text-[1.14rem]"
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
