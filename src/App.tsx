import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { ScrollProgress } from './components/ScrollProgress';
import RenderErrorBoundary from './components/fallback/RenderErrorBoundary';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useReducedMotion } from './hooks/useReducedMotion';
import { HeroSection } from './sections/HeroSection';
import { PsychedelicBackground } from './sections/PsychedelicBackground';
import { SiteHeader } from './sections/SiteHeader';

const GallerySection = lazy(() =>
  import('./sections/GallerySection').then((module) => ({ default: module.GallerySection })),
);
const AboutSection = lazy(() => import('./sections/AboutSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));
const SiteFooter = lazy(() => import('./sections/SiteFooter'));

const FIRST_GALLERY_PRELOAD_ID = 'first-gallery-image-preload';
const GALLERY_IDLE_LOAD_TIMEOUT_MS = 900;

// Hardcoded (instead of derived from FEATURED_ARTWORKS) so the gallery content
// modules stay out of the main bundle. tests/image-contract.test.ts asserts it
// matches the first featured artwork's mobile gallery asset.
export const FIRST_GALLERY_PRELOAD_IMAGE_URL = '/images/mushroom-offering-560.webp';

function getInitialGallerySectionLoad() {
  if (typeof window === 'undefined') {
    return false;
  }

  return /^#(work|about|contact)$/.test(window.location.hash);
}

function getSectionIdFromHash() {
  if (typeof window === 'undefined') {
    return null;
  }

  const match = window.location.hash.match(/^#(work|about|contact)$/);
  return match ? match[1] : null;
}

function isDeferredSection(id: string) {
  return id === 'about' || id === 'contact';
}

function preloadFirstGalleryImage() {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById(FIRST_GALLERY_PRELOAD_ID)) {
    return;
  }

  const link = document.createElement('link');
  link.id = FIRST_GALLERY_PRELOAD_ID;
  link.rel = 'preload';
  link.as = 'image';
  link.href = FIRST_GALLERY_PRELOAD_IMAGE_URL;
  link.media = '(max-width: 767px)';
  link.fetchPriority = 'auto';
  document.head.append(link);
}

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const [loadGallerySection, setLoadGallerySection] = useState(getInitialGallerySectionLoad);
  const [loadDeferredSections, setLoadDeferredSections] = useState(
    () => {
      const sectionId = getSectionIdFromHash();
      return sectionId !== null && isDeferredSection(sectionId);
    },
  );
  const [pendingSectionNavigation, setPendingSectionNavigation] = useState<string | null>(
    () => getSectionIdFromHash(),
  );
  const prefersReducedMotion = useReducedMotion();
  const prefersFinePointer = useMediaQuery('(pointer: fine)', false);
  const prefersLargeViewport = useMediaQuery('(min-width: 1024px)', false);
  const enableReactivePointerEffects =
    !prefersReducedMotion && prefersFinePointer && prefersLargeViewport;
  const { scrollY } = useScroll();

  const headerY = useTransform(scrollY, [0, 1000], prefersReducedMotion ? [0, 0] : [0, 300]);
  const headerOpacity = useTransform(scrollY, [0, 500], prefersReducedMotion ? [1, 1] : [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const parallaxX = useTransform(smoothX, (value) =>
    enableReactivePointerEffects ? (value - window.innerWidth / 2) * -0.03 : 0,
  );
  const parallaxY = useTransform(smoothY, (value) =>
    enableReactivePointerEffects ? (value - window.innerHeight / 2) * -0.03 : 0,
  );

  const blobX1 = useTransform(smoothX, (value) => (enableReactivePointerEffects ? value * 0.05 : 0));
  const blobY1 = useTransform(smoothY, (value) => (enableReactivePointerEffects ? value * 0.05 : 0));
  const blobX2 = useTransform(smoothX, (value) => (enableReactivePointerEffects ? value * -0.05 : 0));
  const blobY2 = useTransform(smoothY, (value) => (enableReactivePointerEffects ? value * -0.05 : 0));
  const blobX3 = useTransform(smoothX, (value) => (enableReactivePointerEffects ? value * 0.03 : 0));
  const blobY3 = useTransform(smoothY, (value) => (enableReactivePointerEffects ? value * -0.03 : 0));

  const heroReveal = (delay = 0) =>
    prefersReducedMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay },
        };

  useEffect(() => {
    if (!enableReactivePointerEffects) {
      return;
    }

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableReactivePointerEffects, mouseX, mouseY]);

  const enableDeferredSections = useCallback(() => {
    setLoadDeferredSections(true);
  }, []);

  const enableGallerySection = useCallback(() => {
    setLoadGallerySection(true);
    preloadFirstGalleryImage();
  }, []);

  const scrollToSection = useCallback(
    (id: string) => {
      if (typeof document === 'undefined') {
        return false;
      }

      const target = document.getElementById(id);
      if (!target) {
        return false;
      }

      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      target.focus({ preventScroll: true });
      window.setTimeout(() => {
        target.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        });
      }, prefersReducedMotion ? 0 : 240);
      return true;
    },
    [prefersReducedMotion],
  );

  const handleSectionNavigation = useCallback(
    (id: string) => {
      if (id === 'work' || isDeferredSection(id)) {
        enableGallerySection();
      }

      if (isDeferredSection(id)) {
        enableDeferredSections();
      }

      if (!scrollToSection(id)) {
        setPendingSectionNavigation(id);
      }
    },
    [enableDeferredSections, enableGallerySection, scrollToSection],
  );

  useEffect(() => {
    if (loadGallerySection) {
      preloadFirstGalleryImage();
      return;
    }

    const enableAfterHeroScroll = () => {
      if (window.scrollY > window.innerHeight * 0.35) {
        enableGallerySection();
      }
    };
    const requestIdle = window.requestIdleCallback?.bind(window);
    let idleCallbackId: number | null = null;
    let timeoutId: number | null = null;

    if (requestIdle) {
      idleCallbackId = requestIdle(enableGallerySection, { timeout: GALLERY_IDLE_LOAD_TIMEOUT_MS });
    } else {
      timeoutId = window.setTimeout(enableGallerySection, GALLERY_IDLE_LOAD_TIMEOUT_MS);
    }

    window.addEventListener('scroll', enableAfterHeroScroll, { passive: true });
    window.addEventListener('hashchange', enableGallerySection, { once: true });
    enableAfterHeroScroll();

    return () => {
      if (idleCallbackId !== null) {
        window.cancelIdleCallback?.(idleCallbackId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      window.removeEventListener('scroll', enableAfterHeroScroll);
      window.removeEventListener('hashchange', enableGallerySection);
    };
  }, [enableGallerySection, loadGallerySection]);

  useEffect(() => {
    if (loadDeferredSections) {
      return;
    }

    const enableAfterHeroScroll = () => {
      if (window.scrollY > window.innerHeight * 0.45) {
        enableDeferredSections();
      }
    };
    const timeoutId = window.setTimeout(enableDeferredSections, 9000);

    window.addEventListener('scroll', enableAfterHeroScroll, { passive: true });
    window.addEventListener('hashchange', enableDeferredSections, { once: true });
    window.addEventListener('pointerdown', enableDeferredSections, { once: true, passive: true });
    window.addEventListener('keydown', enableDeferredSections, { once: true });
    enableAfterHeroScroll();

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', enableAfterHeroScroll);
      window.removeEventListener('hashchange', enableDeferredSections);
      window.removeEventListener('pointerdown', enableDeferredSections);
      window.removeEventListener('keydown', enableDeferredSections);
    };
  }, [enableDeferredSections, loadDeferredSections]);

  useEffect(() => {
    if (!pendingSectionNavigation) {
      return;
    }

    let cancelled = false;
    let timeoutId = 0;
    let attempts = 0;

    const tryNavigate = () => {
      if (cancelled) {
        return;
      }

      if (scrollToSection(pendingSectionNavigation)) {
        setPendingSectionNavigation((current) =>
          current === pendingSectionNavigation ? null : current,
        );
        return;
      }

      attempts += 1;
      if (attempts >= 80) {
        setPendingSectionNavigation((current) =>
          current === pendingSectionNavigation ? null : current,
        );
        return;
      }

      timeoutId = window.setTimeout(() => {
        tryNavigate();
      }, 50);
    };

    tryNavigate();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [pendingSectionNavigation, scrollToSection]);

  const handleSkipLinkClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const main = mainRef.current;
    if (!main) {
      window.history.pushState(null, '', '#main-content');
      return;
    }

    const previousHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
    const previousBodyScrollBehavior = document.body.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    window.history.pushState(null, '', '#main-content');
    main.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
    main.focus({ preventScroll: true });

    window.requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = previousHtmlScrollBehavior;
      document.body.style.scrollBehavior = previousBodyScrollBehavior;
    });
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 font-sans selection:bg-purple-500/30">
      <RenderErrorBoundary context="scroll-progress" fallback={null}>
        <ScrollProgress />
      </RenderErrorBoundary>

      <a
        href="#main-content"
        onClick={handleSkipLinkClick}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg"
      >
        Skip to content
      </a>

      <PsychedelicBackground
        blobX1={blobX1}
        blobY1={blobY1}
        blobX2={blobX2}
        blobY2={blobY2}
        blobX3={blobX3}
        blobY3={blobY3}
        interactive={enableReactivePointerEffects}
      />

      <SiteHeader
        reducedMotion={prefersReducedMotion}
        onNavigateToSection={handleSectionNavigation}
      />

      <main id="main-content" ref={mainRef} tabIndex={-1} className="focus:outline-none">
        <HeroSection
          headerY={headerY}
          headerOpacity={headerOpacity}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
          reducedMotion={prefersReducedMotion}
          heroReveal={heroReveal}
        />
        {loadGallerySection ? (
          <Suspense fallback={null}>
            <GallerySection reducedMotion={prefersReducedMotion} />
          </Suspense>
        ) : null}
        {loadDeferredSections ? (
          <Suspense fallback={null}>
            <AboutSection />
            <ContactSection reducedMotion={prefersReducedMotion} />
          </Suspense>
        ) : null}
      </main>

      {loadDeferredSections ? (
        <Suspense fallback={null}>
          <SiteFooter />
        </Suspense>
      ) : null}
    </div>
  );
}
