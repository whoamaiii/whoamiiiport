import { useRef, type HTMLAttributes } from 'react';
import { useInView } from 'motion/react';
import { TextScramble } from './TextScramble';

interface AnimatedHeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> {
  children: string;
  className?: string;
  delay?: number;
}

export function AnimatedHeading({
  children,
  className = '',
  delay = 0,
  ...headingProps
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <h2 ref={ref} className={className} aria-label={children} {...headingProps}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {isInView ? (
          <TextScramble text={children} delay={delay} duration={1200} />
        ) : (
          <span style={{ opacity: 0 }}>{children}</span>
        )}
      </span>
    </h2>
  );
}

export default AnimatedHeading;
