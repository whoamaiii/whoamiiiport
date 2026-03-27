import { useEffect, useState, useRef, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

const chars = '!<>-_\\/[]{}—=+*^?#________';

export function TextScramble({
  text,
  className = '',
  delay = 0,
  duration = 1500,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const frameRef = useRef<number>();
  const queueRef = useRef<{ from: string; to: string; start: number; end: number; char?: string }[]>([]);

  const update = useCallback(() => {
    let output = '';
    let complete = 0;
    const now = performance.now();

    for (let i = 0; i < queueRef.current.length; i++) {
      const item = queueRef.current[i];
      let char = item.char;

      if (now >= item.end) {
        complete++;
        char = item.to;
      } else if (now >= item.start) {
        if (!char || Math.random() < 0.28) {
          char = chars[Math.floor(Math.random() * chars.length)];
          item.char = char;
        }
      } else {
        char = '';
      }

      output += char || '';
    }

    setDisplayText(output);

    if (complete < queueRef.current.length) {
      frameRef.current = requestAnimationFrame(update);
    } else {
      setIsComplete(true);
    }
  }, []);

  const startScramble = useCallback(() => {
    if (prefersReducedMotion) {
      setDisplayText(text);
      setIsComplete(true);
      return;
    }

    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
    const length = text.length;
    const frameTime = duration / length;

    for (let i = 0; i < length; i++) {
      queue.push({
        from: '',
        to: text[i],
        start: performance.now() + i * frameTime * 0.3,
        end: performance.now() + i * frameTime * 0.3 + frameTime * 1.5,
      });
    }

    queueRef.current = queue;
    frameRef.current = requestAnimationFrame(update);
  }, [text, duration, prefersReducedMotion, update]);

  useEffect(() => {
    // Reset state when text changes
    setDisplayText('');
    setIsComplete(false);
    
    const timer = setTimeout(() => {
      startScramble();
    }, delay);

    return () => {
      clearTimeout(timer);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [delay, startScramble, text]);

  // Show original text if reduced motion or animation is complete
  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return <span className={className}>{isComplete ? text : displayText}</span>;
}
