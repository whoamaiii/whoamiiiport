import { useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface GlareEffectProps {
  children: ReactNode;
  className?: string;
  glareSize?: number;
  glareOpacity?: number;
}

export function GlareEffect({
  children,
  className = '',
  glareSize = 200,
  glareOpacity = 0.15,
}: GlareEffectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const glareX = useSpring(mouseX, springConfig);
  const glareY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(glareY, [0, 1], [5, -5]);
  const rotateY = useTransform(glareX, [0, 1], [-5, 5]);

  const handleMouseMove = (e: MouseEvent) => {
    if (prefersReducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const glarePositionX = useTransform(glareX, [0, 1], ['0%', '100%']);
  const glarePositionY = useTransform(glareY, [0, 1], ['0%', '100%']);
  const highlightBackground = useTransform(glareX, (value) => {
    const angle = 225 + (45 - 225) * value;

    return `linear-gradient(
      ${angle}deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.05) 45%,
      rgba(255,255,255,0.1) 50%,
      rgba(255,255,255,0.05) 55%,
      rgba(255,255,255,0) 100%
    )`;
  });

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Glare overlay */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute"
            style={{
              width: glareSize,
              height: glareSize,
              background: `radial-gradient(circle, rgba(255,255,255,${glareOpacity}) 0%, transparent 70%)`,
              left: glarePositionX,
              top: glarePositionY,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      )}

      {/* Specular highlight edge */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{
            background: highlightBackground,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
