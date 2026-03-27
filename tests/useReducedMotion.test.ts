import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useReducedMotion } from '../src/hooks/useReducedMotion';

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

describe('useReducedMotion', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the current media-query value on first render', () => {
    installMatchMediaMock(true);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it('updates when the media query changes', async () => {
    const mock = installMatchMediaMock(false);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);

    mock.setMatches(true);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
