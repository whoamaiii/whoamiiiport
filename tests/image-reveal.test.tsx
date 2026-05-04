import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ImageReveal } from '../src/components/ImageReveal';
import { installMatchMediaMock } from './helpers/matchMedia';

describe('ImageReveal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('does not render the reveal mask or initial clipping when reduced motion is preferred', () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': true,
    });

    render(<ImageReveal src="/images/example.webp" alt="Example artwork" />);

    expect(screen.queryByTestId('image-reveal-mask')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: /example artwork/i })).toBeInTheDocument();
    expect(screen.getByTestId('image-reveal-content').getAttribute('style') ?? '').not.toContain(
      'clip-path',
    );
  });

  it('does not create an intersection observer when reduced motion is preferred', () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': true,
    });

    const observe = vi.fn();
    const intersectionObserver = vi.fn(() => ({
      disconnect: vi.fn(),
      observe,
      takeRecords: vi.fn(() => []),
      unobserve: vi.fn(),
    }));

    vi.stubGlobal('IntersectionObserver', intersectionObserver);

    render(<ImageReveal src="/images/example.webp" alt="Example artwork" />);

    expect(intersectionObserver).not.toHaveBeenCalled();
    expect(observe).not.toHaveBeenCalled();
  });

  it.each([
    ['left', 'right'],
    ['right', 'left'],
  ] as const)('aligns the %s reveal mask with the clipped image edge', (direction, origin) => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
    });

    render(<ImageReveal src="/images/example.webp" alt="Example artwork" direction={direction} />);

    expect(screen.getByTestId('image-reveal-mask')).toHaveStyle({
      transformOrigin: origin,
    });
  });
});
