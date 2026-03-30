import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TextScramble } from '../src/components/TextScramble';

type MatchMediaListener = (event: MediaQueryListEvent) => void;

function installMatchMediaMock(initialMatches: boolean) {
  const listeners = new Set<MatchMediaListener>();
  let matches = initialMatches;

  const mediaQueryList = {
    get matches() {
      return matches;
    },
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: (_event: string, listener: MatchMediaListener) => listeners.add(listener),
    removeEventListener: (_event: string, listener: MatchMediaListener) => listeners.delete(listener),
    addListener: (listener: MatchMediaListener) => listeners.add(listener),
    removeListener: (listener: MatchMediaListener) => listeners.delete(listener),
    dispatchEvent: () => true,
  } as MediaQueryList;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => mediaQueryList),
  });

  return {
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      const event = { matches: nextMatches } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

describe('TextScramble', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installMatchMediaMock(false);
    let now = 0;

    vi.spyOn(performance, 'now').mockImplementation(() => now);

    vi.stubGlobal(
      'requestAnimationFrame',
      ((callback: FrameRequestCallback) =>
        window.setTimeout(() => {
          now += 16;
          callback(now);
        }, 16)) as typeof requestAnimationFrame,
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      ((id: number) => window.clearTimeout(id)) as typeof cancelAnimationFrame,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('calls onComplete once when the scramble finishes', () => {
    const onComplete = vi.fn();

    render(
      <TextScramble
        text="Altered"
        delay={0}
        duration={120}
        onComplete={onComplete}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(800);
      vi.runOnlyPendingTimers();
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
