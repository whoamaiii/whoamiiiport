import { render, screen } from '@testing-library/react';
import { motionValue } from 'motion/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HERO_COPY } from '../src/content/siteCopy';

describe('hero title render boundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('keeps the hero readable when the decorative title renderer throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.doMock('../src/lib/reportError', () => ({
      default: vi.fn(),
    }));
    vi.doMock('../src/components/shared/ShaderTextWord', () => ({
      ShaderTextWord: function ThrowingShaderTextWord() {
        throw new Error('shader render failed');
      },
    }));

    const { HeroSection } = await import('../src/sections/HeroSection');

    render(
      <HeroSection
        headerY={motionValue(0)}
        headerOpacity={motionValue(1)}
        parallaxX={motionValue(0)}
        parallaxY={motionValue(0)}
        reducedMotion={false}
        heroReveal={() => ({
          initial: false,
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        })}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: HERO_COPY.titleSemantic }),
    ).toBeInTheDocument();
    expect(screen.getByText(HERO_COPY.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(HERO_COPY.subtitle)).toHaveClass('hero-subtitle');
    expect(screen.getByTestId('hero-title-visual')).toHaveAttribute('data-mode', 'fallback');
    expect(screen.getByTestId('hero-title-fallback')).toHaveTextContent('Altered');
    expect(screen.getByTestId('hero-title-fallback')).toHaveTextContent('Perception');
  });
});
