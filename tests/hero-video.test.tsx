import { act, fireEvent, render, screen } from '@testing-library/react';
import { motionValue } from 'motion/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import reportError from '../src/lib/reportError';
import { HeroSection, isHeroVideoConnectionConstrained } from '../src/sections/HeroSection';
import { installMatchMediaMock } from './helpers/matchMedia';

vi.mock('../src/lib/reportError', () => ({
  default: vi.fn(),
}));

interface MockConnection {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
}

function setNavigatorConnection(connection: MockConnection | undefined) {
  Object.defineProperty(navigator, 'connection', {
    configurable: true,
    value: connection,
  });
}

function renderHeroSection() {
  return render(
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
}

describe('hero overlay video', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(reportError).mockClear();
    installMatchMediaMock({
      '(min-width: 1024px)': true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    setNavigatorConnection(undefined);
    vi.mocked(reportError).mockClear();
  });

  it('treats save-data and slow effective connections as constrained', () => {
    expect(isHeroVideoConnectionConstrained({ saveData: true })).toBe(true);
    expect(isHeroVideoConnectionConstrained({ effectiveType: '2g' })).toBe(true);
    expect(isHeroVideoConnectionConstrained({ effectiveType: 'slow-2g' })).toBe(true);
    expect(isHeroVideoConnectionConstrained({ effectiveType: '4g' })).toBe(false);
    expect(isHeroVideoConnectionConstrained(null)).toBe(false);
  });

  it('keeps the poster-backed hero image when save-data disables the overlay video', () => {
    setNavigatorConnection({ saveData: true, effectiveType: '4g' });

    renderHeroSection();

    act(() => {
      vi.advanceTimersByTime(1300);
    });

    expect(screen.queryByTestId('hero-overlay-video')).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: /psychedelic/i })).toBeInTheDocument();
    expect(reportError).not.toHaveBeenCalled();
  });

  it('hides the overlay video after a stalled event and reports useful development context once', () => {
    setNavigatorConnection({ saveData: false, effectiveType: '4g' });

    renderHeroSection();

    act(() => {
      vi.advanceTimersByTime(1300);
    });

    const video = screen.getByTestId('hero-overlay-video');
    fireEvent.stalled(video);
    fireEvent.error(video);

    expect(screen.queryByTestId('hero-overlay-video')).not.toBeInTheDocument();
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      'hero-section:overlay-video',
      expect.objectContaining({
        eventType: 'stalled',
        src: '/videos/you-did-good-today.mp4',
      }),
    );
  });
});
