import { useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
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

  const content = (
    <motion.div
      ref={ref}
      className={`relative inline-block ${className}`.trim()}
      style={prefersReducedMotion ? {} : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
    >
      {children}
      {/* Magnetic field glow */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-full bg-purple-500/20 blur-xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: isHovered ? 0.5 : 0,
            scale: isHovered ? 1.2 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block" onClick={onClick}>
        {content}
      </a>
    );
  }

  return content;
}
