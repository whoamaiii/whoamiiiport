import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollProgress } from '../src/components/ScrollProgress';
import { installMatchMediaMock } from './helpers/matchMedia';

describe('ScrollProgress', () => {
  it('renders the progress bar when motion is allowed', () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': false,
    });

    render(<ScrollProgress />);

    expect(screen.getByTestId('scroll-progress')).toBeInTheDocument();
  });

  it('skips scroll animation setup when reduced motion is preferred', () => {
    installMatchMediaMock({
      '(prefers-reduced-motion: reduce)': true,
    });

    render(<ScrollProgress />);

    expect(screen.queryByTestId('scroll-progress')).not.toBeInTheDocument();
  });
});
