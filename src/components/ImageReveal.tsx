import { useRef, type ReactNode } from 'react';
import { motion, useInView, type Transition } from 'motion/react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ImageRevealBaseProps {
  className?: string;
  imageClassName?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}

type ImageRevealImageProps = ImageRevealBaseProps & {
  src: string;
  alt: string;
  children?: never;
};

type ImageRevealChildrenProps = ImageRevealBaseProps & {
  children: ReactNode;
  src?: never;
  alt?: never;
};

type ImageRevealProps = ImageRevealImageProps | ImageRevealChildrenProps;

export function ImageReveal(props: ImageRevealProps) {
  const {
    className = '',
    imageClassName = '',
    delay = 0,
    direction = 'up',
    duration = 0.8,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const prefersReducedMotion = useReducedMotion();

  const getClipPath = () => {
    switch (direction) {
      case 'up':
        return {
          hidden: 'inset(100% 0 0 0)',
          visible: 'inset(0 0 0 0)',
        };
      case 'down':
        return {
          hidden: 'inset(0 0 100% 0)',
          visible: 'inset(0 0 0 0)',
        };
      case 'left':
        return {
          hidden: 'inset(0 100% 0 0)',
          visible: 'inset(0 0 0 0)',
        };
      case 'right':
        return {
          hidden: 'inset(0 0 0 100%)',
          visible: 'inset(0 0 0 0)',
        };
      default:
        return {
          hidden: 'inset(100% 0 0 0)',
          visible: 'inset(0 0 0 0)',
        };
    }
  };

  const clipPaths = getClipPath();

  const transition: Transition = {
    duration: prefersReducedMotion ? 0 : duration,
    delay: prefersReducedMotion ? 0 : delay,
    ease: [0.25, 0.46, 0.45, 0.94],
  };

  const imageTransition: Transition = {
    duration: prefersReducedMotion ? 0 : duration * 1.2,
    delay: prefersReducedMotion ? 0 : delay,
    ease: [0.25, 0.46, 0.45, 0.94],
  };

  const isHorizontal = direction === 'left' || direction === 'right';
  const overlayInitial = isHorizontal ? { scaleX: 1 } : { scaleY: 1 };
  const overlayAnimate = isHorizontal ? { scaleX: 0 } : { scaleY: 0 };
  const overlayOrigin =
    direction === 'up'
      ? 'top'
      : direction === 'down'
        ? 'bottom'
        : direction === 'left'
          ? 'left'
          : 'right';

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Reveal mask */}
      <motion.div
        className="absolute inset-0 z-10 bg-purple-500 origin-bottom"
        initial={overlayInitial}
        animate={isInView ? overlayAnimate : overlayInitial}
        transition={{
          ...transition,
          delay: (prefersReducedMotion ? 0 : delay) + 0.1,
        }}
        style={{ transformOrigin: overlayOrigin }}
      />

      {/* Image with parallax scale */}
      <motion.div
        className="w-full h-full"
        initial={{ clipPath: clipPaths.hidden, scale: 1.2 }}
        animate={
          isInView
            ? { clipPath: clipPaths.visible, scale: 1 }
            : { clipPath: clipPaths.hidden, scale: 1.2 }
        }
        transition={imageTransition}
      >
        {'children' in props ? (
          props.children
        ) : (
          <img
            src={props.src}
            alt={props.alt}
            className={`w-full h-full object-cover ${imageClassName}`.trim()}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        )}
      </motion.div>
    </div>
  );
}
