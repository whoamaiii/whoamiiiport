import { render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LiquidGlassText } from '../src/components/LiquidGlassText';

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

describe('LiquidGlassText', () => {
  beforeEach(() => {
    installMatchMediaMock(false);

    class ResizeObserverMock {
      observe() {}
      disconnect() {}
      unobserve() {}
    }

    class IntersectionObserverMock {
      private readonly callback: IntersectionObserverCallback;

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }

      observe(target: Element) {
        this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }

      disconnect() {}
      unobserve() {}
      takeRecords() {
        return [];
      }
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

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
        setTransform: vi.fn(),
        clearRect: vi.fn(),
        drawImage: vi.fn(),
        fillText: vi.fn(),
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
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the glass title wrapper, svg, and canvas layers', () => {
    const { container, getByTestId } = render(<LiquidGlassText text="Altered" />);

    expect(getByTestId('liquid-glass-title')).toBeInTheDocument();
    expect(container.querySelector('canvas')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('calls onReady when the shader layer is ready', async () => {
    const onReady = vi.fn();

    render(<LiquidGlassText text="Perceptions" onReady={onReady} />);

    await waitFor(() => {
      expect(onReady).toHaveBeenCalledTimes(1);
    });
  });
});
