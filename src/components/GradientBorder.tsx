import { useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  borderRadius?: string;
  glowIntensity?: number;
}

export function GradientBorder({
  children,
  className = '',
  borderWidth = 1,
  borderRadius = '1.5rem',
  glowIntensity = 0.5,
}: GradientBorderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const gradientBackground = useTransform([mouseX, mouseY], ([x, y]) =>
    `conic-gradient(
      from 0deg at ${(x as number) * 100}% ${(y as number) * 100}%,
      #a855f7,
      #ec4899,
      #f97316,
      #a855f7
    )`,
  );

  const handleMouseMove = (e: MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);

    rotateX.set(-percentY * 5);
    rotateY.set(percentX * 5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        borderRadius,
        transformStyle: 'preserve-3d',
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated gradient border */}
      <motion.div
        className="absolute -inset-[1px] rounded-[inherit] z-0"
        style={{
          background: prefersReducedMotion
            ? 'linear-gradient(135deg, #a855f7, #ec4899, #f97316)'
            : gradientBackground,
          borderRadius: `calc(${borderRadius} + 1px)`,
        }}
      />

      {/* Inner content mask */}
      <div
        className="relative z-10 bg-zinc-950"
        style={{
          borderRadius,
          margin: borderWidth,
        }}
      >
        {children}
      </div>

      {/* Glow effect */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute -inset-4 rounded-[inherit] -z-10 blur-2xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3), rgba(249, 115, 22, 0.3))',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? glowIntensity : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
