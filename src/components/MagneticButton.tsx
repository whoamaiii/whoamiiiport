import {
  useRef,
  useState,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
  type HTMLAttributeAnchorTarget,
} from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  href,
  target,
  rel,
  ariaLabel,
}: MagneticButtonProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const target = href ? anchorRef.current : buttonRef.current;

    if (prefersReducedMotion || !target) return;

    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const glow = !prefersReducedMotion && (
    <motion.span
      className="absolute inset-0 -z-10 rounded-full bg-cyan-300/18 blur-xl"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: isHovered ? 0.5 : 0,
        scale: isHovered ? 1.2 : 0.5,
      }}
      transition={{ duration: 0.3 }}
    />
  );

  if (href) {
    return (
      <motion.a
        ref={anchorRef}
        href={href}
        className={`relative ${className}`.trim()}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={prefersReducedMotion ? {} : { x: springX, y: springY }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      >
        {children}
        {glow}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className={`relative inline-block ${className}`.trim()}
      aria-label={ariaLabel}
      style={prefersReducedMotion ? {} : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
    >
      {children}
      {glow}
    </motion.button>
  );
}
