const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec2 u_resolution;
  uniform float u_time;

  float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
      (c - a) * u.y * (1.0 - u.x) +
      (d - b) * u.x * u.y;
  }

  vec3 palette(in float t) {
    // Enhanced luminosity for better text readability
    vec3 amber = vec3(0.96, 0.68, 0.38);    // Was: 0.92, 0.56, 0.24
    vec3 magenta = vec3(0.86, 0.42, 0.64);  // Was: 0.78, 0.27, 0.50
    vec3 cobalt = vec3(0.36, 0.46, 0.78);   // Was: 0.24, 0.34, 0.72
    vec3 cyan = vec3(0.36, 0.66, 0.72);     // Was: 0.24, 0.58, 0.64
    vec3 plum = vec3(0.52, 0.28, 0.48);     // Was: 0.44, 0.18, 0.36

    float phase = fract(t);
    vec3 color = mix(amber, magenta, smoothstep(0.00, 0.26, phase));
    color = mix(color, plum, smoothstep(0.26, 0.44, phase));
    color = mix(color, cobalt, smoothstep(0.44, 0.70, phase));
    color = mix(color, cyan, smoothstep(0.70, 0.88, phase));
    color = mix(color, amber, smoothstep(0.88, 1.00, phase));

    return color;
  }

  const mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
  #define NUM_OCTAVES 3

  float fbm(in vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);

    for (int i = 0; i < NUM_OCTAVES; ++i) {
      value += amplitude * noise(st);
      st = rot * st * 2.0 + shift;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    st *= 1.8;

    float t = u_time * 0.15;

    vec2 q = vec2(0.0);
    q.x = fbm(st + vec2(0.0, 0.0) + t);
    q.y = fbm(st + vec2(1.0, 1.0) - t);

    float f = fbm(st + 2.5 * q);

    float eps = 0.03;
    float fx = fbm(st + vec2(eps, 0.0) + 2.5 * q);
    float fy = fbm(st + vec2(0.0, eps) + 2.5 * q);

    vec3 normal = normalize(vec3(fx - f, fy - f, eps * 1.5));
    vec3 lightDir = normalize(vec3(1.0, 1.0, 0.8));

    float diffuse = max(dot(normal, lightDir), 0.0);
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 32.0);

    vec3 color = palette(f * 1.12 + t * 0.48 - q.x * 0.16);
    // Boosted lighting for improved readability
    color *= diffuse * 0.72 + 0.52;  // Was: 0.62 + 0.46
    color += specular * 0.20;        // Was: 0.16
    // Reduced desaturation for more vibrant colors
    color = mix(color, vec3(dot(color, vec3(0.299, 0.587, 0.114))), 0.03);  // Was: 0.05
    // Reduced dark tint
    color = mix(color, vec3(0.22, 0.14, 0.16), 0.01);  // Was: 0.02
    // Global brightness boost
    color *= 1.08;

    vec2 center = gl_FragCoord.xy / u_resolution.xy - vec2(0.5);
    // Reduced vignette to prevent edge darkening
    color *= 1.0 - dot(center, center) * 0.45;  // Was: 0.6

    // Gamma correction for perceptual brightness (GLSL is linear)
    color = pow(color, vec3(0.94));
    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('Failed to create shader.');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? 'Unknown shader compilation error.';
    gl.deleteShader(shader);
    throw new Error(info);
  }

  return shader;
}

export class ShaderRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private positionBuffer: WebGLBuffer;
  private resolutionLocation: WebGLUniformLocation | null;
  private timeLocation: WebGLUniformLocation | null;
  private positionLocation: number;
  private animationFrameId: number | null = null;
  private running = false;

  constructor(width: number, height: number) {
    this.canvas = document.createElement('canvas');

    const gl = (
      this.canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        preserveDrawingBuffer: false,
      }) ??
      this.canvas.getContext('experimental-webgl', {
        alpha: true,
        antialias: false,
        preserveDrawingBuffer: false,
      })
    ) as WebGLRenderingContext | null;

    if (!gl) {
      throw new Error('WebGL is not supported.');
    }

    this.gl = gl;
    this.vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    this.fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    if (!program) {
      throw new Error('Failed to create shader program.');
    }

    gl.attachShader(program, this.vertexShader);
    gl.attachShader(program, this.fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program) ?? 'Unknown shader link error.';
      gl.deleteProgram(program);
      throw new Error(info);
    }

    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) {
      throw new Error('Failed to create vertex buffer.');
    }

    this.program = program;
    this.positionBuffer = positionBuffer;
    this.positionLocation = gl.getAttribLocation(program, 'a_position');
    this.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    this.timeLocation = gl.getUniformLocation(program, 'u_time');

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW,
    );

    gl.useProgram(this.program);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

    this.resize(width, height);
  }

  resize(width: number, height: number) {
    this.canvas.width = Math.max(1, width);
    this.canvas.height = Math.max(1, height);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  render(time: number) {
    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.timeLocation, time);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  start(onFrame: (canvas: HTMLCanvasElement, time: number) => void) {
    if (this.running) {
      return;
    }

    this.running = true;

    const tick = (frameTime: number) => {
      if (!this.running) {
        return;
      }

      const seconds = frameTime * 0.001;
      this.render(seconds);
      onFrame(this.canvas, seconds);
      this.animationFrameId = window.requestAnimationFrame(tick);
    };

    this.animationFrameId = window.requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;

    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  dispose() {
    this.stop();
    this.gl.deleteBuffer(this.positionBuffer);
    this.gl.deleteProgram(this.program);
    this.gl.deleteShader(this.vertexShader);
    this.gl.deleteShader(this.fragmentShader);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext?.();
  }

  get element() {
    return this.canvas;
  }
}
