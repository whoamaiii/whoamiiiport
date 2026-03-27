import { useRef, useEffect, type ReactNode } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ScrollVelocityProps {
  children: ReactNode;
  className?: string;
  maxSkew?: number;
  maxScale?: number;
}

export function ScrollVelocity({
  children,
  className = '',
  maxSkew = 2,
  maxScale = 0.02,
}: ScrollVelocityProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const velocity = useMotionValue(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const rafId = useRef<number>();

  const { scrollY } = useScroll();

  const smoothVelocity = useSpring(velocity, {
    damping: 30,
    stiffness: 100,
  });

  const skew = useTransform(smoothVelocity, [-1000, 1000], [-maxSkew, maxSkew]);
  const scaleY = useTransform(
    smoothVelocity,
    [-1000, 0, 1000],
    [1 - maxScale, 1, 1 - maxScale]
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const calculateVelocity = () => {
      const currentScrollY = scrollY.get();
      const currentTime = Date.now();
      const deltaY = currentScrollY - lastScrollY.current;
      const deltaTime = currentTime - lastTime.current;

      if (deltaTime > 0) {
        const newVelocity = (deltaY / deltaTime) * 16; // Normalize to ~60fps
        velocity.set(velocity.get() + (newVelocity - velocity.get()) * 0.1);
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
      rafId.current = requestAnimationFrame(calculateVelocity);
    };

    rafId.current = requestAnimationFrame(calculateVelocity);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [scrollY, prefersReducedMotion, velocity]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        skewY: skew,
        scaleY,
      }}
    >
      {children}
    </motion.div>
  );
}
