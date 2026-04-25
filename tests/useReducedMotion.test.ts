import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useReducedMotion } from '../src/hooks/useReducedMotion';
import { installMatchMediaMock } from './helpers/matchMedia';

describe('useReducedMotion', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the current media-query value on first render', () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': true,
    });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it('updates when the media query changes', async () => {
    const mock = installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
    });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);

    mock.setMatches('(prefers-reduced-motion: reduce)', true);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
