import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TextScramble } from '../src/components/TextScramble';
import { installMatchMediaMock } from './helpers/matchMedia';

describe('TextScramble', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
    });
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
