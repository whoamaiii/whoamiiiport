import {
  lazy,
  Suspense,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { ScrollProgress } from './components/ScrollProgress';
import RenderErrorBoundary from './components/fallback/RenderErrorBoundary';
import { MotionFeatureProvider } from './components/motion/MotionFeatureProvider';
import { useHeroMotion } from './hooks/useHeroMotion';
import { useMediaQuery } from './hooks/useMediaQuery';
import { usePortfolioSectionLoading } from './hooks/usePortfolioSectionLoading';
import { useReducedMotion } from './hooks/useReducedMotion';
import { HeroSection } from './sections/HeroSection';
import { PsychedelicBackground } from './sections/PsychedelicBackground';
import { SiteHeader } from './sections/SiteHeader';

const GallerySection = lazy(() =>
  import('./sections/GallerySection').then((module) => ({ default: module.GallerySection })),
);
const LibrarySection = lazy(() =>
  import('./sections/LibrarySection').then((module) => ({ default: module.LibrarySection })),
);
const AboutSection = lazy(() => import('./sections/AboutSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));
const SiteFooter = lazy(() => import('./sections/SiteFooter'));

export { FIRST_GALLERY_PRELOAD_IMAGE_URL } from './utils/sectionLoading';

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const prefersFinePointer = useMediaQuery('(pointer: fine)', false);
  const prefersLargeViewport = useMediaQuery('(min-width: 1024px)', false);
  const enableReactivePointerEffects =
    !prefersReducedMotion && prefersFinePointer && prefersLargeViewport;
  const {
    headerY,
    headerOpacity,
    parallaxX,
    parallaxY,
    blobX1,
    blobY1,
    blobX2,
    blobY2,
    blobX3,
    blobY3,
    heroReveal,
  } = useHeroMotion({ prefersReducedMotion, enableReactivePointerEffects });
  const {
    loadGallerySection,
    loadLibrarySection,
    loadDeferredSections,
    handleSectionNavigation,
  } = usePortfolioSectionLoading({ prefersReducedMotion });

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
    <MotionFeatureProvider>
      <div className="relative min-h-screen bg-zinc-950 font-sans selection:bg-cyan-300/25">
        <RenderErrorBoundary context="scroll-progress" fallback={null}>
          <ScrollProgress />
        </RenderErrorBoundary>

        <a
          href="#main-content"
          onClick={handleSkipLinkClick}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg"
        >
          Hopp til innhold
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

        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
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
              <GallerySection
                reducedMotion={prefersReducedMotion}
                onNavigateToSection={handleSectionNavigation}
              />
            </Suspense>
          ) : null}
          {loadLibrarySection ? (
            <Suspense fallback={null}>
              <LibrarySection reducedMotion={prefersReducedMotion} />
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
    </MotionFeatureProvider>
  );
}
