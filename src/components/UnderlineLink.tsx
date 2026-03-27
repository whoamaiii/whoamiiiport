import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface UnderlineLinkProps {
  children: ReactNode;
  href?: string;
  className?: string;
  underlineColor?: string;
  underlineHeight?: number;
  onClick?: () => void;
}

export function UnderlineLink({
  children,
  href,
  className = '',
  underlineColor = 'bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400',
  underlineHeight = 2,
  onClick,
}: UnderlineLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const linkContent = (
    <span className="relative inline-block">
      <span>{children}</span>
      <motion.span
        className={`absolute bottom-0 left-0 ${underlineColor}`}
        style={{ height: underlineHeight }}
        initial={{ width: '0%' }}
        animate={{ width: isHovered ? '100%' : '0%' }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }
        }
      />
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {linkContent}
      </a>
    );
  }

  return (
    <button
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {linkContent}
    </button>
  );
}
