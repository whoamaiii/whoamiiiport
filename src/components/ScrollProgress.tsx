import { motion, useScroll, useSpring } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      data-testid="scroll-progress"
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 z-[90]"
      style={{ scaleX }}
    />
  );
}
