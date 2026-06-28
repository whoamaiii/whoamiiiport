import { LazyMotion, domAnimation } from 'motion/react';
import type { ReactNode } from 'react';

interface MotionFeatureProviderProps {
  readonly children: ReactNode;
}

export function MotionFeatureProvider({ children }: MotionFeatureProviderProps) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
