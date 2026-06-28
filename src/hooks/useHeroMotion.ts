import { useEffect, useRef } from 'react';
import { useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';

interface HeroRevealConfig {
  readonly initial: false | { readonly opacity: number; readonly y: number };
  readonly animate: { readonly opacity: number; readonly y: number };
  readonly transition: { readonly duration: number; readonly delay?: number };
}

interface HeroMotionOptions {
  readonly prefersReducedMotion: boolean;
  readonly enableReactivePointerEffects: boolean;
}

interface HeroMotionState {
  readonly headerY: MotionValue<number>;
  readonly headerOpacity: MotionValue<number>;
  readonly parallaxX: MotionValue<number>;
  readonly parallaxY: MotionValue<number>;
  readonly blobX1: MotionValue<number>;
  readonly blobY1: MotionValue<number>;
  readonly blobX2: MotionValue<number>;
  readonly blobY2: MotionValue<number>;
  readonly blobX3: MotionValue<number>;
  readonly blobY3: MotionValue<number>;
  readonly heroReveal: (delay?: number) => HeroRevealConfig;
}

const HERO_REVEAL_REDUCED_CONFIG: HeroRevealConfig = {
  initial: false,
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0 },
};

export function useHeroMotion({
  prefersReducedMotion,
  enableReactivePointerEffects,
}: HeroMotionOptions): HeroMotionState {
  const { scrollY } = useScroll();
  const prefersReducedMotionRef = useRef(prefersReducedMotion);
  prefersReducedMotionRef.current = prefersReducedMotion;
  const enableReactivePointerEffectsRef = useRef(enableReactivePointerEffects);
  enableReactivePointerEffectsRef.current = enableReactivePointerEffects;

  const headerY = useTransform(scrollY, (value) => {
    if (prefersReducedMotionRef.current) {
      return 0;
    }
    const progress = Math.min(Math.max(value / 1000, 0), 1);
    return progress * 300;
  });
  const headerOpacity = useTransform(scrollY, (value) => {
    if (prefersReducedMotionRef.current) {
      return 1;
    }
    const progress = Math.min(Math.max(value / 500, 0), 1);
    return 1 - progress;
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const parallaxX = useTransform(smoothX, (value) =>
    enableReactivePointerEffectsRef.current
      ? (value - window.innerWidth / 2) * -0.03
      : 0,
  );
  const parallaxY = useTransform(smoothY, (value) =>
    enableReactivePointerEffectsRef.current
      ? (value - window.innerHeight / 2) * -0.03
      : 0,
  );

  const blobX1 = useTransform(smoothX, (value) =>
    enableReactivePointerEffectsRef.current ? value * 0.05 : 0,
  );
  const blobY1 = useTransform(smoothY, (value) =>
    enableReactivePointerEffectsRef.current ? value * 0.05 : 0,
  );
  const blobX2 = useTransform(smoothX, (value) =>
    enableReactivePointerEffectsRef.current ? value * -0.05 : 0,
  );
  const blobY2 = useTransform(smoothY, (value) =>
    enableReactivePointerEffectsRef.current ? value * -0.05 : 0,
  );
  const blobX3 = useTransform(smoothX, (value) =>
    enableReactivePointerEffectsRef.current ? value * 0.03 : 0,
  );
  const blobY3 = useTransform(smoothY, (value) =>
    enableReactivePointerEffectsRef.current ? value * -0.03 : 0,
  );

  const heroReveal = (delay = 0): HeroRevealConfig =>
    prefersReducedMotion
      ? HERO_REVEAL_REDUCED_CONFIG
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

  return {
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
  };
}
