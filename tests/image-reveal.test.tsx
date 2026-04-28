import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ImageReveal } from '../src/components/ImageReveal';
import { installMatchMediaMock } from './helpers/matchMedia';

describe('ImageReveal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
});
