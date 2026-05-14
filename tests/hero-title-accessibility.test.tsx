import { act, render, screen, waitFor } from '@testing-library/react';
import { motionValue } from 'motion/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HeroTitleHybrid } from '../src/components/HeroTitleHybrid';
import { HERO_COPY } from '../src/content/siteCopy';
import reportError from '../src/lib/reportError';
import { HeroSection } from '../src/sections/HeroSection';
import { installMatchMediaMock } from './helpers/matchMedia';

vi.mock('../src/lib/reportError', () => ({
  default: vi.fn(),
}));

vi.mock('../src/lib/shaderRenderer', () => ({
  ShaderRenderer: class MockShaderRenderer {
    element = document.createElement('canvas');
    render = vi.fn();
    start = vi.fn((onFrame: (canvas: HTMLCanvasElement, time: number) => void) => {
      onFrame(this.element, 0.25);
    });
    stop = vi.fn();
    dispose = vi.fn();
    resize = vi.fn();
  },
}));

function renderHeroSection({ reducedMotion = true }: { reducedMotion?: boolean } = {}) {
  return render(
    <HeroSection
      headerY={motionValue(0)}
      headerOpacity={motionValue(1)}
      parallaxX={motionValue(0)}
      parallaxY={motionValue(0)}
      reducedMotion={reducedMotion}
      heroReveal={() => ({
        initial: false,
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      })}
    />,
  );
}

function getHeroTitleVisual() {
  const visualTitle = screen.getByTestId('hero-title-visual');
  expect(visualTitle).toBeInTheDocument();
  return visualTitle;
}

describe('Hero title accessibility contract', () => {
  beforeEach(() => {
    vi.mocked(reportError).mockClear();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((type: string) => {
      if (type !== '2d') {
        return null;
      }

      return {
        font: '',
        textAlign: 'center',
        textBaseline: 'alphabetic',
        fillStyle: '#ffffff',
        globalCompositeOperation: 'source-over',
        fontKerning: 'normal',
        letterSpacing: '0px',
        setTransform: vi.fn(),
        clearRect: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        drawImage: vi.fn(),
        fillText: vi.fn(),
        strokeText: vi.fn(),
        fillRect: vi.fn(),
        measureText: vi.fn().mockReturnValue({
          actualBoundingBoxAscent: 72,
          actualBoundingBoxDescent: 18,
        }),
        createLinearGradient: vi.fn().mockReturnValue({
          addColorStop: vi.fn(),
        }),
      } as unknown as CanvasRenderingContext2D;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.mocked(reportError).mockClear();
  });

  it('keeps a single accessible hero heading while the decorative title stays aria-hidden', () => {
    renderHeroSection();

    expect(
      screen.getByRole('heading', { level: 1, name: /altered perceptions\./i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: /altered perceptions\./i })).toHaveLength(1);
    expect(getHeroTitleVisual()).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the hero eyebrow and refined subtitle copy', () => {
    renderHeroSection();

    expect(screen.getByText(/psychedelic art portfolio/i)).toBeInTheDocument();
    expect(
      screen.getByText(/digital paintings and dream-burned color studies from altered states\./i),
    ).toBeInTheDocument();
  });

  it('renders a forced fallback without reporting a wordmark mismatch', () => {
    render(
      <h1>
        <HeroTitleHybrid
          semanticTitle={HERO_COPY.titleSemantic}
          titleLines={HERO_COPY.titleLines}
          reducedMotion={false}
          forceFallback
        />
      </h1>,
    );

    expect(getHeroTitleVisual()).toHaveAttribute('data-mode', 'fallback');
    expect(screen.getByTestId('hero-title-fallback')).toHaveTextContent('Altered');
    expect(screen.getByTestId('hero-title-fallback')).toHaveTextContent('Perceptions');
    expect(reportError).not.toHaveBeenCalled();
  });

  it('starts mobile with the static title before upgrading to the live shader after idle', async () => {
    vi.useFakeTimers();
    installMatchMediaMock({
      '(max-width: 767px)': true,
      '(max-width: 639px)': true,
      '(prefers-reduced-motion: reduce)': false,
    });

    render(
      <h1>
        <HeroTitleHybrid
          semanticTitle={HERO_COPY.titleSemantic}
          titleLines={HERO_COPY.titleLines}
          reducedMotion={false}
        />
      </h1>,
    );

    expect(getHeroTitleVisual()).toHaveAttribute('data-mode', 'fallback');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1800);
    });

    expect(getHeroTitleVisual()).toHaveAttribute('data-mode', 'visual');
  });

  it('reports a visual fallback when the requested title does not match the wordmark asset', async () => {
    const mismatchedTitleLines = ['Altered', 'Refractions'] as const;

    render(
      <h1>
        <HeroTitleHybrid
          semanticTitle="Altered Refractions."
          titleLines={mismatchedTitleLines}
          reducedMotion={false}
        />
      </h1>,
    );

    expect(getHeroTitleVisual()).toHaveAttribute('data-mode', 'fallback');

    await waitFor(() => {
      expect(reportError).toHaveBeenCalledTimes(1);
    });
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      'hero-title-hybrid:visual-fallback',
      expect.objectContaining({
        semanticTitle: 'Altered Refractions.',
        titleLines: mismatchedTitleLines,
      }),
    );
  });
});
