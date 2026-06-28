import { useRef, type ReactNode } from 'react';
import { m, useInView, type Transition } from 'motion/react';
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

function ImageRevealContent({
  props,
  imageClassName,
}: {
  props: ImageRevealProps;
  imageClassName: string;
}) {
  return 'children' in props ? (
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
  );
}

function StaticImageReveal(props: ImageRevealProps) {
  const { className = '', imageClassName = '' } = props;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="w-full h-full" data-testid="image-reveal-content">
        <ImageRevealContent props={props} imageClassName={imageClassName} />
      </div>
    </div>
  );
}

function AnimatedImageReveal(props: ImageRevealProps) {
  const {
    className = '',
    imageClassName = '',
    delay = 0,
    direction = 'up',
    duration = 0.8,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
    duration,
    delay,
    ease: [0.25, 0.46, 0.45, 0.94],
  };

  const imageTransition: Transition = {
    duration: duration * 1.2,
    delay,
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
          ? 'right'
          : 'left';
  const imageMotionProps = {
    initial: { clipPath: clipPaths.hidden, scale: 1.2 },
    animate: isInView
      ? { clipPath: clipPaths.visible, scale: 1 }
      : { clipPath: clipPaths.hidden, scale: 1.2 },
    transition: imageTransition,
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <m.div
        className="absolute inset-0 z-10 bg-zinc-950"
        data-testid="image-reveal-mask"
        initial={overlayInitial}
        animate={isInView ? overlayAnimate : overlayInitial}
        transition={{
          ...transition,
          delay: delay + 0.1,
        }}
        style={{
          transformOrigin: overlayOrigin,
          backgroundImage:
            'linear-gradient(135deg, rgba(5,5,5,0.96), rgba(76,29,149,0.72) 48%, rgba(6,182,212,0.28))',
        }}
      />

      <m.div
        className="w-full h-full"
        data-testid="image-reveal-content"
        {...imageMotionProps}
      >
        <ImageRevealContent props={props} imageClassName={imageClassName} />
      </m.div>
    </div>
  );
}

export function ImageReveal(props: ImageRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <StaticImageReveal {...props} />;
  }

  return <AnimatedImageReveal {...props} />;
}
