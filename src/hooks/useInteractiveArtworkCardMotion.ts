import type { MouseEventHandler, RefObject } from 'react';
import {
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { CARD_SPRING_CONFIG } from '../components/InteractiveArtworkCardState';

type InteractiveArtworkCardMotionInput = {
  readonly cardRef: RefObject<HTMLDivElement | null>;
  readonly enableCardMotion: boolean;
  readonly onCardLeave: () => void;
};

export function useInteractiveArtworkCardMotion({
  cardRef,
  enableCardMotion,
  onCardLeave,
}: InteractiveArtworkCardMotionInput) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const glareX = useSpring(mouseX, CARD_SPRING_CONFIG);
  const glareY = useSpring(mouseY, CARD_SPRING_CONFIG);
  const rotateX = useTransform(glareY, [0, 1], [8, -8]);
  const rotateY = useTransform(glareX, [0, 1], [-8, 8]);
  const glowPositionX = useTransform(glareX, [0, 1], ['0%', '100%']);
  const glowPositionY = useTransform(glareY, [0, 1], ['0%', '100%']);
  const glowBackground = useMotionTemplate`radial-gradient(circle at ${glowPositionX} ${glowPositionY}, rgba(94,234,212,0.16), rgba(125,211,252,0.1) 18%, rgba(129,140,248,0.08) 34%, transparent 58%)`;
  const glareBackground = useTransform([glareX, glareY], ([rawX, rawY]) => {
    const angle = Math.atan2(Number(rawY) - 0.5, Number(rawX) - 0.5) * (180 / Math.PI);
    return `linear-gradient(${angle + 90}deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`;
  });

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!enableCardMotion || !cardRef.current) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    onCardLeave();
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return {
    glareBackground,
    glowBackground,
    handleMouseLeave,
    handleMouseMove,
    rotateX,
    rotateY,
  };
}
