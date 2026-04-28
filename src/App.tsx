import { useEffect, useRef, type MouseEvent } from 'react';
import { useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { ScrollProgress } from './components/ScrollProgress';
import RenderErrorBoundary from './components/fallback/RenderErrorBoundary';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useReducedMotion } from './hooks/useReducedMotion';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';
import GallerySection from './sections/GallerySection';
import HeroSection from './sections/HeroSection';
import PsychedelicBackground from './sections/PsychedelicBackground';
import SiteFooter from './sections/SiteFooter';
import SiteHeader from './sections/SiteHeader';

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
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

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableReactivePointerEffects, mouseX, mouseY]);

  const handleSkipLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
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

      <SiteHeader reducedMotion={prefersReducedMotion} />

      <main id="main-content" ref={mainRef} tabIndex={-1} className="focus:outline-none">
        <HeroSection
          headerY={headerY}
          headerOpacity={headerOpacity}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
          reducedMotion={prefersReducedMotion}
          heroReveal={heroReveal}
        />
        <GallerySection reducedMotion={prefersReducedMotion} />
        <AboutSection />
        <ContactSection reducedMotion={prefersReducedMotion} />
      </main>

      <SiteFooter />
    </div>
  );
}
