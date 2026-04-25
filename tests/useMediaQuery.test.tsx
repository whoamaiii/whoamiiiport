import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from '../src/hooks/useMediaQuery';
import { installMatchMediaMock } from './helpers/matchMedia';

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the current value for the requested media query on first render', () => {
    installMatchMediaMock({
      '(pointer: fine)': true,
    });

    const { result } = renderHook(() => useMediaQuery('(pointer: fine)'));

    expect(result.current).toBe(true);
  });

  it('updates subscribers when the media query changes', async () => {
    const media = installMatchMediaMock({
      '(pointer: fine)': false,
    });

    const { result } = renderHook(() => useMediaQuery('(pointer: fine)'));

    expect(result.current).toBe(false);

    media.setMatches('(pointer: fine)', true);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('uses the provided default value when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useMediaQuery('(pointer: fine)', true));

    expect(result.current).toBe(true);
  });
});
