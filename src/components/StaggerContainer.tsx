import { useRef, type Key, type ReactNode } from 'react';
import { m, useInView, type Variants } from 'motion/react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  mobileFastReveal?: boolean;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  delay = 0,
  mobileFastReveal = false,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)', false);
  const useFastReveal = mobileFastReveal && isMobile && !prefersReducedMotion;
  const effectiveStaggerDelay = useFastReveal ? 0.06 : staggerDelay;
  const effectiveDelay = useFastReveal ? 0 : delay;

  const containerVariants = {
    hidden: { opacity: useFastReveal ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : effectiveStaggerDelay,
        delayChildren: prefersReducedMotion ? 0 : effectiveDelay,
      },
    },
  };

  return (
    <m.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </m.div>
  );
}

interface StaggerItemProps {
  key?: Key;
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  mobileDistance?: number;
}

export function StaggerItem({
  children,
  className = '',
  direction = 'up',
  distance = 30,
  mobileDistance,
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 767px)', false);
  const effectiveDistance = isMobile && mobileDistance !== undefined ? mobileDistance : distance;

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: effectiveDistance, x: 0 };
      case 'down':
        return { y: -effectiveDistance, x: 0 };
      case 'left':
        return { x: effectiveDistance, y: 0 };
      case 'right':
        return { x: -effectiveDistance, y: 0 };
      default:
        return { y: effectiveDistance, x: 0 };
    }
  };

  const initial = getInitialPosition();

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      ...initial,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <m.div className={className} variants={itemVariants}>
      {children}
    </m.div>
  );
}
