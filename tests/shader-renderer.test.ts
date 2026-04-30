import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ShaderRenderer, ShaderUnavailableError } from '../src/lib/shaderRenderer';

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
    COLOR_BUFFER_BIT: 9,
    TEXTURE_2D: 10,
    TEXTURE0: 11,
    TEXTURE1: 12,
    RGBA: 13,
    UNSIGNED_BYTE: 14,
    CLAMP_TO_EDGE: 15,
    LINEAR: 16,
    TEXTURE_WRAP_S: 17,
    TEXTURE_WRAP_T: 18,
    TEXTURE_MIN_FILTER: 19,
    TEXTURE_MAG_FILTER: 20,
    UNPACK_FLIP_Y_WEBGL: 21,
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
    uniform1i: vi.fn(),
    clearColor: vi.fn(),
    clear: vi.fn(),
    createTexture: vi.fn(() => ({})),
    activeTexture: vi.fn(),
    bindTexture: vi.fn(),
    pixelStorei: vi.fn(),
    texParameteri: vi.fn(),
    texImage2D: vi.fn(),
    deleteTexture: vi.fn(),
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

  it('uses a typed fallback error when WebGL is unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    expect(() => new ShaderRenderer(320, 180)).toThrow(ShaderUnavailableError);
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

  it('reuses stable hero liquid texture sources instead of uploading them every frame', () => {
    const textMask = document.createElement('canvas');
    const backgroundImage = document.createElement('img');

    renderer = new ShaderRenderer(320, 180, 'heroLiquid', {
      heroLiquid: {
        backgroundImage,
        textMask,
      },
    });

    expect(mockGl.texImage2D).toHaveBeenCalledTimes(2);

    renderer.setHeroLiquidOptions({
      backgroundImage,
      canvasViewportMin: [10, 20],
      canvasViewportSize: [120, 80],
      textMask,
      viewportSize: [390, 844],
    });
    renderer.render(0.25);
    renderer.setHeroLiquidOptions({
      backgroundImage,
      canvasViewportMin: [12, 22],
      canvasViewportSize: [120, 80],
      textMask,
      viewportSize: [390, 844],
    });
    renderer.render(0.5);

    expect(mockGl.texImage2D).toHaveBeenCalledTimes(2);
  });

  it('releases hero liquid textures when sources are cleared', () => {
    const textMask = document.createElement('canvas');
    const backgroundImage = document.createElement('img');

    renderer = new ShaderRenderer(320, 180, 'heroLiquid', {
      heroLiquid: {
        backgroundImage,
        textMask,
      },
    });

    renderer.setHeroLiquidOptions({
      backgroundImage: null,
      textMask: null,
    });

    expect(mockGl.deleteTexture).toHaveBeenCalledTimes(2);
  });

  it('disposes without throwing', () => {
    renderer = new ShaderRenderer(320, 180);

    expect(() => renderer?.dispose()).not.toThrow();
  });

  it('keeps disposal idempotent so repeated cleanup does not double-free WebGL resources', () => {
    renderer = new ShaderRenderer(320, 180);

    renderer.dispose();
    renderer.dispose();

    expect(mockGl.deleteBuffer).toHaveBeenCalledTimes(1);
    expect(mockGl.deleteProgram).toHaveBeenCalledTimes(1);
    expect(mockGl.deleteShader).toHaveBeenCalledTimes(2);
  });
});
