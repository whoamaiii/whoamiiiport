import { render, screen, waitFor } from '@testing-library/react';
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

function mockAutomatedBrowser() {
  const descriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'webdriver');

  Object.defineProperty(Navigator.prototype, 'webdriver', {
    configurable: true,
    get: () => true,
  });

  return () => {
    if (descriptor) {
      Object.defineProperty(Navigator.prototype, 'webdriver', descriptor);
      return;
    }

    Reflect.deleteProperty(Navigator.prototype, 'webdriver');
  };
}

describe('Hero title accessibility contract', () => {
  let restoreWebdriver = () => {};

  beforeEach(() => {
    vi.mocked(reportError).mockClear();
    restoreWebdriver = mockAutomatedBrowser();
  });

  afterEach(() => {
    restoreWebdriver();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.mocked(reportError).mockClear();
  });

  it('keeps a single accessible hero heading while the decorative title stays aria-hidden', () => {
    renderHeroSection();

    expect(
      screen.getByRole('heading', { level: 1, name: /altered perception\./i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: /altered perception\./i })).toHaveLength(1);
    expect(getHeroTitleVisual()).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the hero eyebrow and supporting line under the title', () => {
    renderHeroSection();

    expect(screen.getByText(HERO_COPY.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(HERO_COPY.subtitle)).toHaveClass('hero-subtitle');
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
    expect(screen.getByTestId('hero-title-fallback')).toHaveTextContent('Perception');
    expect(reportError).not.toHaveBeenCalled();
  });

  it('renders the mobile visual wordmark shell immediately', () => {
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

    expect(getHeroTitleVisual()).toHaveAttribute('data-mode', 'visual');
    expect(document.querySelectorAll('.hero-title-shader-fallback.is-visible')).toHaveLength(0);
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
