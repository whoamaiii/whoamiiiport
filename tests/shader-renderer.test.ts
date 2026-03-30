import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ShaderRenderer } from '../src/lib/shaderRenderer';

function createMockWebGlContext() {
  return {
    VERTEX_SHADER: 1,
    FRAGMENT_SHADER: 2,
    COMPILE_STATUS: 3,
    LINK_STATUS: 4,
    ARRAY_BUFFER: 5,
    STATIC_DRAW: 6,
    TRIANGLES: 7,
    FLOAT: 8,
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    getShaderInfoLog: vi.fn(() => ''),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => ({})),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    getProgramInfoLog: vi.fn(() => ''),
    deleteProgram: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    getUniformLocation: vi.fn(() => ({})),
    useProgram: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    viewport: vi.fn(),
    uniform2f: vi.fn(),
    uniform1f: vi.fn(),
    drawArrays: vi.fn(),
    deleteBuffer: vi.fn(),
    getExtension: vi.fn(() => null),
  } as unknown as WebGLRenderingContext;
}

describe('ShaderRenderer', () => {
  let renderer: ShaderRenderer | null = null;
  let mockGl: WebGLRenderingContext;

  beforeEach(() => {
    vi.useFakeTimers();
    mockGl = createMockWebGlContext();

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((type: string) => {
      if (type === 'webgl' || type === 'experimental-webgl') {
        return mockGl;
      }

      return null;
    });

    let now = 0;
    vi.stubGlobal(
      'requestAnimationFrame',
      ((callback: FrameRequestCallback) =>
        window.setTimeout(() => {
          now += 16;
          callback(now);
        }, 16)) as typeof requestAnimationFrame,
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      ((id: number) => window.clearTimeout(id)) as typeof cancelAnimationFrame,
    );
  });

  afterEach(() => {
    renderer?.dispose();
    renderer = null;
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('initializes and sizes the internal canvas', () => {
    renderer = new ShaderRenderer(320, 180);

    expect(renderer.element).toBeInstanceOf(HTMLCanvasElement);
    expect(renderer.element.width).toBe(320);
    expect(renderer.element.height).toBe(180);
  });

  it('resizes the internal canvas', () => {
    renderer = new ShaderRenderer(320, 180);
    renderer.resize(512, 256);

    expect(renderer.element.width).toBe(512);
    expect(renderer.element.height).toBe(256);
  });

  it('starts and stops the animation loop', () => {
    renderer = new ShaderRenderer(320, 180);
    const onFrame = vi.fn();

    renderer.start(onFrame);
    vi.advanceTimersByTime(48);

    expect(onFrame).toHaveBeenCalled();

    renderer.stop();
    const callCount = onFrame.mock.calls.length;
    vi.advanceTimersByTime(48);

    expect(onFrame).toHaveBeenCalledTimes(callCount);
  });

  it('disposes without throwing', () => {
    renderer = new ShaderRenderer(320, 180);

    expect(() => renderer?.dispose()).not.toThrow();
  });
});
