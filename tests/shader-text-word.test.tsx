import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ShaderTextWord } from '../src/components/shared/ShaderTextWord';
import { installMatchMediaMock } from './helpers/matchMedia';

const shaderRendererMock = vi.hoisted(() => vi.fn());
const shadowLayer = {
  shadowBlur: 0,
  shadowColor: 'transparent',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  strokeColor: 'transparent',
  strokeWidth: 0,
};

function renderShaderTextWord({
  allowCompactShader,
  onReady,
  text = 'Altered',
}: {
  allowCompactShader?: boolean;
  onReady?: () => void;
  text?: string;
}) {
  return (
    <ShaderTextWord
      text={text}
      allowCompactShader={allowCompactShader}
      wrapperClassName="section-shader-word"
      measureClassName="section-shader-measure"
      canvasClassName="section-shader-canvas"
      fallbackClassName="section-shader-fallback"
      shaderScale={{ mobile: 0.8, desktop: 1, reduced: 0.5 }}
      shaderClamp={{ minWidth: 1, maxWidth: 1024, minHeight: 1, maxHeight: 512 }}
      getShadowConfig={() => ({
        ambient: shadowLayer,
        halo: shadowLayer,
        primary: shadowLayer,
        innerGlow: shadowLayer,
      })}
      finalStroke={{ color: 'rgba(255,255,255,0.5)', scale: 0.01, minWidth: 1 }}
      onReady={onReady}
    />
  );
}

vi.mock('../src/lib/shaderRenderer', () => ({
  ShaderRenderer: shaderRendererMock,
  ShaderUnavailableError: class ShaderUnavailableError extends Error {},
}));

describe('ShaderTextWord', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    shaderRendererMock.mockClear();
  });

  it('skips canvas and WebGL renderer setup when reduced motion is preferred', async () => {
    installMatchMediaMock({
      '(max-width: 767px)': true,
      '(prefers-reduced-motion: reduce)': true,
    });

    const onReady = vi.fn();
    const { container } = render(renderShaderTextWord({ onReady }));

    expect(container.querySelector('canvas')).toBeNull();
    expect(container.querySelector('.section-shader-fallback')).toHaveClass('is-visible');
    expect(shaderRendererMock).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(onReady).toHaveBeenCalledTimes(1);
    });
  });

  it('renotifies readiness when reduced-motion text changes', async () => {
    installMatchMediaMock({
      '(max-width: 767px)': true,
      '(prefers-reduced-motion: reduce)': true,
    });

    const onReady = vi.fn();
    const { rerender } = render(renderShaderTextWord({ onReady }));

    await waitFor(() => {
      expect(onReady).toHaveBeenCalledTimes(1);
    });

    rerender(renderShaderTextWord({ onReady, text: 'States' }));

    await waitFor(() => {
      expect(onReady).toHaveBeenCalledTimes(2);
    });
  });

  it('uses the static fallback on compact phone widths even when motion is allowed', async () => {
    installMatchMediaMock({
      '(max-width: 767px)': true,
      '(max-width: 639px)': true,
      '(prefers-reduced-motion: reduce)': false,
    });

    const onReady = vi.fn();
    const { container } = render(renderShaderTextWord({ onReady }));

    expect(container.querySelector('canvas')).toBeNull();
    expect(container.querySelector('.section-shader-fallback')).toHaveClass('is-visible');
    expect(shaderRendererMock).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(onReady).toHaveBeenCalledTimes(1);
    });
  });

  it('can keep the hero shader canvas available on compact phone widths when explicitly allowed', () => {
    installMatchMediaMock({
      '(max-width: 767px)': true,
      '(max-width: 639px)': true,
      '(prefers-reduced-motion: reduce)': false,
    });

    const { container } = render(renderShaderTextWord({ allowCompactShader: true }));

    expect(container.querySelector('canvas')).not.toBeNull();
    expect(container.querySelector('.section-shader-fallback')).toHaveClass('is-visible');
  });

  it('allows shader canvas on narrow browser widths above the compact phone cutoff', () => {
    installMatchMediaMock({
      '(max-width: 767px)': true,
      '(max-width: 639px)': false,
      '(prefers-reduced-motion: reduce)': false,
    });
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        readonly root = null;
        readonly rootMargin = '180px 0px';
        readonly thresholds = [0.05];

        constructor(private readonly callback: IntersectionObserverCallback) {}

        disconnect = vi.fn();
        observe = vi.fn(() => {
          this.callback(
            [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
        });
        takeRecords = vi.fn(() => []);
        unobserve = vi.fn();
      },
    );

    const onReady = vi.fn();
    const { container } = render(renderShaderTextWord({ onReady }));

    expect(container.querySelector('canvas')).not.toBeNull();
    expect(container.querySelector('.section-shader-fallback')).toHaveClass('is-visible');
  });
});
