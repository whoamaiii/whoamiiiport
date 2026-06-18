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

const heroLiquidFragmentShaderSource = `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform vec2 u_resolution;
  uniform vec2 u_title_uv_offset;
  uniform vec2 u_title_uv_scale;
  uniform vec2 u_canvas_viewport_min;
  uniform vec2 u_canvas_viewport_size;
  uniform vec2 u_viewport_size;
  uniform vec2 u_background_scale;
  uniform vec2 u_background_offset;
  uniform float u_has_mask;
  uniform float u_has_background;
  uniform float u_time;
  uniform float u_liquid_speed;
  uniform float u_liquid_warp;
  uniform float u_liquid_opacity;
  uniform float u_refract_pixels;
  uniform float u_background_mix;
  uniform float u_background_darken;
  uniform float u_rim_strength;
  uniform float u_inner_shadow_strength;
  uniform float u_dispersion_strength;
  uniform float u_caustic_strength;
  uniform float u_glow_strength;
  uniform float u_core_saturation;
  uniform float u_core_contrast;
  uniform float u_core_brightness;
  uniform float u_rim_width;
  uniform float u_reduced_motion;
  uniform sampler2D u_text_mask;
  uniform sampler2D u_background;
  const float TAU = 6.28318530718;

  float random(in vec2 st) {
    return fract(sin(dot(st.xy, vec2(17.219, 91.737))) * 47458.5453123);
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

  const mat2 rot = mat2(0.80902, 0.58778, -0.58778, 0.80902);
  #define NUM_OCTAVES 4

  float fbm(in vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(37.0, 91.0);

    for (int i = 0; i < NUM_OCTAVES; ++i) {
      value += amplitude * noise(st);
      st = rot * st * 2.04 + shift;
      amplitude *= 0.52;
    }

    return value;
  }

  float ridge(float value) {
    return 1.0 - abs(value * 2.0 - 1.0);
  }

  vec3 heroSpectrum(float phase, float heat) {
    // Apple Liquid Glass: luminous, bright, mostly pearl/white with a faint
    // cool tint. Warmth appears only as a tiny iridescent accent at the
    // thinnest refracting edge — like a soap bubble catching warm light.
    vec3 pearl = vec3(0.97, 0.99, 1.0);
    vec3 brightWhite = vec3(1.0);
    vec3 paleCyan = vec3(0.84, 0.94, 0.98);
    vec3 ice = vec3(0.74, 0.88, 0.95);
    vec3 softBlue = vec3(0.70, 0.82, 0.92);
    vec3 thinAmber = vec3(0.98, 0.88, 0.66);
    vec3 thinRose = vec3(0.96, 0.84, 0.86);

    vec3 color = mix(pearl, brightWhite, smoothstep(0.0, 0.18, phase));
    color = mix(color, paleCyan, smoothstep(0.16, 0.34, phase));
    color = mix(color, brightWhite, smoothstep(0.32, 0.50, phase));
    color = mix(color, ice, smoothstep(0.48, 0.66, phase));
    color = mix(color, softBlue, smoothstep(0.64, 0.82, phase));
    color = mix(color, pearl, smoothstep(0.80, 1.0, phase));

    // Iridescent accent only at the thinnest glass edge (high heat): a whisper
    // of amber and rose, like a real soap bubble's edge. Very subtle.
    float thinEdge = smoothstep(0.16, 0.30, phase) * (1.0 - smoothstep(0.32, 0.46, phase));
    color = mix(color, thinAmber, thinEdge * heat * 0.08);
    color = mix(color, thinRose, thinEdge * heat * 0.05);
    // Keep it luminous — bias toward white throughout.
    return mix(color, brightWhite, 0.12);
  }

  vec3 sourceRadiance(vec2 p, float t) {
    vec2 q = vec2(
      fbm(p * 1.42 + vec2(t * 0.24, -t * 0.11)),
      fbm(p * 1.64 + vec2(-t * 0.14, t * 0.25))
    );
    vec2 living = p + (q - 0.5) * u_liquid_warp;
    living.x += sin((p.y * 1.4 + q.x * 0.9 - t * 0.22) * TAU) * 0.035;
    living.y += cos((p.x * 1.1 - q.y * 0.7 + t * 0.16) * TAU) * 0.026;

    float nebula = fbm(living * 2.05 + vec2(t * 0.11, -t * 0.16));
    float detail = fbm(living * 4.45 + q * 1.26 - vec2(t * 0.34, t * 0.20));
    float contour = ridge(fract(nebula * 1.08 + detail * 0.30 + p.x * 0.18 - t * 0.12));
    float phase = fract(nebula * 0.72 + detail * 0.26 + p.x * 0.22 - p.y * 0.08 - t * 0.10);
    float heat = smoothstep(0.36, 1.08, p.x + detail * 0.28);

    vec3 color = heroSpectrum(phase, heat);
    float radiance = 0.76 + nebula * 0.24 + pow(contour, 3.0) * 0.075;
    float fineEmission = pow(abs(sin((living.x * 1.42 + living.y * 1.12 + detail * 0.62 - t * 0.32) * TAU)), 12.0);
    float liquidThread = pow(abs(sin((living.x * 2.08 - living.y * 1.48 + detail * 0.50 + t * 0.24) * TAU)), 20.0);
    color += fineEmission * vec3(0.07, 0.18, 0.22);
    color += liquidThread * vec3(0.035, 0.08, 0.11);

    return color * radiance;
  }

  float glassHeight(vec2 p, float t) {
    vec2 q = vec2(
      fbm(p * 1.25 + vec2(t * 0.22, t * 0.08)),
      fbm(p * 1.42 - vec2(t * 0.12, t * 0.26))
    );
    float broad = fbm(p * 1.34 + q * 0.7 + vec2(-t * 0.08, t * 0.10));
    float micro = fbm(p * 4.4 + q * 1.85 - vec2(t * 0.34, -t * 0.17));
    float meniscus = sin((p.x * 1.52 - p.y * 0.94 + broad * 0.9 + t * 0.18) * TAU) * 0.5 + 0.5;

    return broad * 0.55 + micro * 0.27 + meniscus * 0.18;
  }

  float maskAt(vec2 uv) {
    if (u_has_mask < 0.5) {
      return 1.0;
    }

    return texture2D(u_text_mask, clamp(uv, vec2(0.0), vec2(1.0))).r;
  }

  vec3 fallbackEnvironment(vec2 uv, float height) {
    vec3 deep = mix(vec3(0.025, 0.055, 0.12), vec3(0.09, 0.045, 0.055), smoothstep(0.2, 1.0, uv.x + uv.y * 0.15));
    vec3 wetBlue = vec3(0.08, 0.26, 0.34) * smoothstep(0.0, 0.82, 1.0 - uv.y + height * 0.18);
    vec3 ember = vec3(0.22, 0.10, 0.06) * smoothstep(0.38, 1.0, uv.x + height * 0.25);
    return deep + wetBlue + ember;
  }

  vec3 sampleBackground(vec2 topUv) {
    if (u_has_background < 0.5) {
      return fallbackEnvironment(topUv, 0.35);
    }

    vec2 mappedTopUv = topUv * u_background_scale + u_background_offset;
    vec2 sampleUv = vec2(mappedTopUv.x, 1.0 - mappedTopUv.y);
    vec2 blur = vec2(0.0022, 0.0032);
    vec3 center = texture2D(u_background, clamp(sampleUv, vec2(0.0), vec2(1.0))).rgb;
    vec3 soft = center;
    soft += texture2D(u_background, clamp(sampleUv + blur, vec2(0.0), vec2(1.0))).rgb;
    soft += texture2D(u_background, clamp(sampleUv - blur, vec2(0.0), vec2(1.0))).rgb;
    soft += texture2D(u_background, clamp(sampleUv + vec2(-blur.x, blur.y), vec2(0.0), vec2(1.0))).rgb;
    soft += texture2D(u_background, clamp(sampleUv + vec2(blur.x, -blur.y), vec2(0.0), vec2(1.0))).rgb;
    soft /= 5.0;

    float luma = dot(soft, vec3(0.299, 0.587, 0.114));
    soft = mix(soft, vec3(luma), 0.08);
    soft = pow(soft, vec3(0.92)) * u_background_darken * 0.82;
    // Luminosity lift: Apple liquid glass brightens what's behind it slightly.
    soft += vec3(0.04, 0.05, 0.06);
    return soft;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 topUv = vec2(uv.x, 1.0 - uv.y);
    vec2 px = 1.0 / u_resolution;
    float alpha = maskAt(uv);

    if (alpha <= 0.003) {
      gl_FragColor = vec4(0.0);
      return;
    }

    float aL = maskAt(uv - vec2(px.x * 1.6, 0.0));
    float aR = maskAt(uv + vec2(px.x * 1.6, 0.0));
    float aU = maskAt(uv + vec2(0.0, px.y * 1.6));
    float aD = maskAt(uv - vec2(0.0, px.y * 1.6));
    float aFarL = maskAt(uv - vec2(px.x * 4.2, 0.0));
    float aFarR = maskAt(uv + vec2(px.x * 4.2, 0.0));
    float aFarU = maskAt(uv + vec2(0.0, px.y * 4.2));
    float aFarD = maskAt(uv - vec2(0.0, px.y * 4.2));

    float nearEdge = abs(alpha - aL) + abs(alpha - aR) + abs(alpha - aU) + abs(alpha - aD);
    float farEdge = abs(alpha - aFarL) + abs(alpha - aFarR) + abs(alpha - aFarU) + abs(alpha - aFarD);
    float edgeSignal = nearEdge + farEdge * 0.58;
    float rimWidth = clamp(u_rim_width, 0.45, 1.25);
    float edge = smoothstep(0.026 / rimWidth, 0.30 / rimWidth, edgeSignal);
    float innerRim = edge * smoothstep(0.12, 0.84, alpha);
    float wetRim = smoothstep(0.08, 0.42, edge) * smoothstep(0.05, 0.92, alpha);
    float core = smoothstep(0.28, 0.94, alpha) * (1.0 - wetRim * 0.28);
    float shellMask = clamp(wetRim * 1.18 + innerRim * 0.9, 0.0, 1.0);
    float coreMask = core * (1.0 - shellMask * 0.8);
    vec2 maskNormal = normalize(vec2(aR - aL, aU - aD) + vec2(0.0001));

    float effectiveTime = mix(u_time, 1.35, u_reduced_motion);
    float t = effectiveTime * u_liquid_speed;
    vec2 sharedUv = topUv * u_title_uv_scale + u_title_uv_offset;
    vec2 p = sharedUv;
    p.x *= (u_resolution.x / u_resolution.y) * 0.82;

    float eps = 0.0065;
    float centerHeight = glassHeight(p, t);
    float hx = glassHeight(p + vec2(eps, 0.0), t) - glassHeight(p - vec2(eps, 0.0), t);
    float hy = glassHeight(p + vec2(0.0, eps), t) - glassHeight(p - vec2(0.0, eps), t);
    vec2 slope = vec2(hx, hy) / (eps * 2.0);
    vec2 opticalNormal = normalize(maskNormal * (0.82 + wetRim * 1.08) + slope * 0.34);
    vec3 normal = normalize(vec3(-slope * 1.05 - maskNormal * wetRim * 0.76, 1.0));

    float thickness = 0.72 + centerHeight * 0.28 + innerRim * 0.34 + core * 0.08;
    vec2 viewportTopUv = (u_canvas_viewport_min + topUv * u_canvas_viewport_size) / max(u_viewport_size, vec2(1.0));
    float refractionZone = clamp(wetRim * 1.02 + innerRim * 0.82 + edge * 0.44 + core * 0.10, 0.0, 1.0);
    vec2 refractionOffset = opticalNormal * px * u_refract_pixels * (0.18 + refractionZone * 1.12 + thickness * 0.08);
    vec2 refractedTopUv = viewportTopUv + vec2(refractionOffset.x, -refractionOffset.y);
    vec3 refractedBg = sampleBackground(refractedTopUv);

    float dispersion = u_dispersion_strength * (wetRim * 1.18 + innerRim * 0.32);
    vec3 dispersedBg;
    dispersedBg.r = sampleBackground(refractedTopUv + opticalNormal * dispersion).r;
    dispersedBg.g = refractedBg.g;
    dispersedBg.b = sampleBackground(refractedTopUv - opticalNormal * dispersion).b;
    refractedBg = mix(refractedBg, dispersedBg, clamp(wetRim * 0.56 + innerRim * 0.18, 0.0, 0.72));

    vec2 liquidCoord = p - slope * 0.062 + maskNormal * innerRim * 0.031;
    vec3 liquid = sourceRadiance(liquidCoord, t);
    vec3 pearl = vec3(0.78, 0.92, 0.96);
    liquid = mix(liquid, pearl, 0.026 + wetRim * 0.035);
    float liquidLuma = dot(liquid, vec3(0.299, 0.587, 0.114));
    liquid = mix(vec3(liquidLuma), liquid, u_core_saturation);
    liquid = (liquid - 0.5) * u_core_contrast + 0.5;
    liquid *= u_core_brightness;

    float emissionMix = clamp(u_liquid_opacity * (0.72 + coreMask * 0.36), 0.0, 1.0);
    vec3 glassBase = mix(refractedBg, liquid, emissionMix);
    vec3 color = mix(glassBase, liquid, coreMask * 0.12);
    color = mix(color, refractedBg, clamp(u_background_mix, 0.0, 0.35) * shellMask * 0.82);

    float hxx = glassHeight(p + vec2(eps * 1.7, 0.0), t) + glassHeight(p - vec2(eps * 1.7, 0.0), t) - centerHeight * 2.0;
    float hyy = glassHeight(p + vec2(0.0, eps * 1.7), t) + glassHeight(p - vec2(0.0, eps * 1.7), t) - centerHeight * 2.0;
    float curvature = abs(hxx + hyy) * 24.0;
    float causticNoise = fbm(sharedUv * 8.5 + vec2(t * 0.32, -t * 0.22));
    float causticLine = pow(abs(sin((sharedUv.x * 2.2 + sharedUv.y * 1.55 + centerHeight * 1.62 - t * 0.36) * TAU)), 15.0);
    float caustic = smoothstep(0.74, 0.94, causticNoise + causticLine * 0.2 + curvature * 0.035);
    caustic *= (innerRim * 0.74 + core * 0.22) * u_caustic_strength * 0.98 * (1.0 - u_reduced_motion * 0.72);

    float viewDot = clamp(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
    float fresnel = pow(1.0 - viewDot + wetRim * 0.28, 2.8);
    float topLeftLight = smoothstep(-0.52, 0.84, -maskNormal.x + maskNormal.y * 0.54);
    float lowerShadow = smoothstep(0.18, 1.0, maskNormal.x - maskNormal.y * 0.38);
    vec3 rimLight = mix(vec3(0.56, 0.90, 0.98), vec3(1.0, 0.98, 0.86), topLeftLight);
    float selectiveGlint =
      wetRim *
      smoothstep(0.46, 0.98, topLeftLight) *
      pow(abs(sin((sharedUv.x * 4.35 - sharedUv.y * 1.72 + centerHeight * 0.95 - t * 0.22) * TAU)), 24.0);

    float innerSheen = smoothstep(0.12, 0.82, alpha) * (1.0 - wetRim * 0.22);
    float upperLens = smoothstep(0.96, 0.12, topUv.y) * innerSheen;
    color -= vec3(0.018, 0.036, 0.082) * innerRim * u_inner_shadow_strength * (0.98 + lowerShadow * 0.48);
    color += rimLight * wetRim * u_rim_strength * (0.30 + fresnel * 0.58 + topLeftLight * 0.24);
    color += vec3(0.88, 0.98, 1.0) * selectiveGlint * u_rim_strength * 0.52;
    color += vec3(0.70, 0.96, 1.0) * caustic;
    color += vec3(0.72, 0.93, 1.0) * upperLens * u_glow_strength * 0.26;

    float specular = pow(max(dot(reflect(normalize(vec3(-0.42, -0.36, -0.82)), normal), vec3(0.0, 0.0, 1.0)), 0.0), 22.0);
    color += vec3(0.95, 0.98, 1.0) * specular * wetRim * 0.30;
    color += vec3(0.30, 0.78, 0.90) * wetRim * u_glow_strength * 1.18;

    vec2 center = topUv - vec2(0.5);
    color *= 1.0 - dot(center, center) * 0.18;
    color = mix(color, vec3(0.10, 0.12, 0.16), 0.03 + (1.0 - core) * 0.02);
    color = color / (color + vec3(0.38));
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luma), color, 1.12);
    color = pow(clamp(color, vec3(0.0), vec3(0.99)), vec3(0.90));

    float outAlpha = smoothstep(0.012, 0.42, alpha);
    outAlpha = max(outAlpha, wetRim * 0.74);
    gl_FragColor = vec4(color, clamp(outAlpha, 0.0, 1.0));
  }
`;

export type ShaderRendererVariant = 'section' | 'heroLiquid';

export interface HeroLiquidRendererOptions {
  backgroundDarken?: number;
  backgroundImage?: TexImageSource | null;
  backgroundMix?: number;
  backgroundOffset?: readonly [number, number];
  backgroundScale?: readonly [number, number];
  causticStrength?: number;
  canvasViewportMin?: readonly [number, number];
  canvasViewportSize?: readonly [number, number];
  coreBrightness?: number;
  coreContrast?: number;
  coreSaturation?: number;
  dispersionStrength?: number;
  glowStrength?: number;
  innerShadowStrength?: number;
  liquidOpacity?: number;
  liquidSpeed?: number;
  liquidWarp?: number;
  reducedMotion?: boolean;
  refractPixels?: number;
  rimWidth?: number;
  rimStrength?: number;
  textMask?: HTMLCanvasElement | OffscreenCanvas | null;
  titleUvOffset?: readonly [number, number];
  titleUvScale?: readonly [number, number];
  viewportSize?: readonly [number, number];
}

export interface ShaderRendererOptions {
  heroLiquid?: HeroLiquidRendererOptions;
  onContextLost?: () => void;
}

interface ShaderRendererStartOptions {
  maxFps?: number;
}

const fragmentShaderSources: Record<ShaderRendererVariant, string> = {
  section: fragmentShaderSource,
  heroLiquid: heroLiquidFragmentShaderSource,
};

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

export class ShaderUnavailableError extends Error {
  constructor(message = 'WebGL is not supported.') {
    super(message);
    this.name = 'ShaderUnavailableError';
  }
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
  private variant: ShaderRendererVariant;
  private maskTexture: WebGLTexture | null = null;
  private maskTextureSource: TexImageSource | null = null;
  private backgroundTexture: WebGLTexture | null = null;
  private backgroundTextureSource: TexImageSource | null = null;
  private heroLiquidOptions: Required<Omit<HeroLiquidRendererOptions, 'backgroundImage' | 'textMask'>>;
  private uniformLocationCache = new Map<string, WebGLUniformLocation | null>();
  private animationFrameId: number | null = null;
  private running = false;
  private disposed = false;
  private onContextLost?: () => void;

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.stop();
    this.onContextLost?.();
  };

  constructor(
    width: number,
    height: number,
    variant: ShaderRendererVariant = 'section',
    options: ShaderRendererOptions = {},
  ) {
    this.canvas = document.createElement('canvas');
    this.variant = variant;
    this.onContextLost = options.onContextLost;
    this.canvas.addEventListener('webglcontextlost', this.handleContextLost);
    this.heroLiquidOptions = {
      backgroundDarken: 0.62,
      backgroundMix: 0.24,
      backgroundOffset: [0.08, 0.08],
      backgroundScale: [0.46, 0.72],
      causticStrength: 0.18,
      canvasViewportMin: [0, 0],
      canvasViewportSize: [width, height],
      coreBrightness: 1,
      coreContrast: 1.08,
      coreSaturation: 1.18,
      dispersionStrength: 0.005,
      glowStrength: 0.12,
      innerShadowStrength: 0.38,
      liquidOpacity: 0.62,
      liquidSpeed: 0.045,
      liquidWarp: 0.07,
      reducedMotion: false,
      refractPixels: 10,
      rimWidth: 0.72,
      rimStrength: 0.82,
      titleUvOffset: [0, 0],
      titleUvScale: [1, 1],
      viewportSize: [width, height],
    };

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
      throw new ShaderUnavailableError();
    }

    this.gl = gl;
    this.vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    this.fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSources[variant]);

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
    this.setHeroLiquidOptions(options.heroLiquid ?? {});
  }

  private getUniformLocation(name: string) {
    if (!this.uniformLocationCache.has(name)) {
      this.uniformLocationCache.set(name, this.gl.getUniformLocation(this.program, name));
    }

    return this.uniformLocationCache.get(name) ?? null;
  }

  private setTexture(source: TexImageSource, currentTexture: WebGLTexture | null) {
    const { gl } = this;
    const texture = currentTexture ?? gl.createTexture();

    if (!texture) {
      return null;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
  }

  private updateTextureSource(
    source: TexImageSource | null | undefined,
    currentTexture: WebGLTexture | null,
    currentSource: TexImageSource | null,
  ) {
    if (source === undefined) {
      return {
        source: currentSource,
        texture: currentTexture,
      };
    }

    if (source === null) {
      if (currentTexture) {
        this.gl.deleteTexture(currentTexture);
      }

      return {
        source: null,
        texture: null,
      };
    }

    if (currentTexture && source === currentSource) {
      return {
        source: currentSource,
        texture: currentTexture,
      };
    }

    const nextTexture = this.setTexture(source, currentTexture);

    return {
      source: nextTexture ? source : null,
      texture: nextTexture,
    };
  }

  setHeroLiquidOptions(options: HeroLiquidRendererOptions) {
    if (this.disposed) {
      return;
    }

    this.heroLiquidOptions = {
      ...this.heroLiquidOptions,
      ...options,
      backgroundOffset: options.backgroundOffset ?? this.heroLiquidOptions.backgroundOffset,
      backgroundScale: options.backgroundScale ?? this.heroLiquidOptions.backgroundScale,
      canvasViewportMin: options.canvasViewportMin ?? this.heroLiquidOptions.canvasViewportMin,
      canvasViewportSize: options.canvasViewportSize ?? this.heroLiquidOptions.canvasViewportSize,
      titleUvOffset: options.titleUvOffset ?? this.heroLiquidOptions.titleUvOffset,
      titleUvScale: options.titleUvScale ?? this.heroLiquidOptions.titleUvScale,
      viewportSize: options.viewportSize ?? this.heroLiquidOptions.viewportSize,
    };

    const maskTextureUpdate = this.updateTextureSource(
      options.textMask,
      this.maskTexture,
      this.maskTextureSource,
    );
    this.maskTexture = maskTextureUpdate.texture;
    this.maskTextureSource = maskTextureUpdate.source;

    const backgroundTextureUpdate = this.updateTextureSource(
      options.backgroundImage,
      this.backgroundTexture,
      this.backgroundTextureSource,
    );
    this.backgroundTexture = backgroundTextureUpdate.texture;
    this.backgroundTextureSource = backgroundTextureUpdate.source;
  }

  resize(width: number, height: number) {
    if (this.disposed) {
      return;
    }

    this.canvas.width = Math.max(1, width);
    this.canvas.height = Math.max(1, height);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  render(time: number) {
    if (this.disposed) {
      return;
    }

    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.timeLocation, time);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    if (this.variant === 'heroLiquid') {
      this.applyHeroLiquidUniforms();
    }

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  private applyHeroLiquidUniforms() {
    const { gl } = this;
    const options = this.heroLiquidOptions;
    const maskLocation = this.getUniformLocation('u_text_mask');
    const backgroundLocation = this.getUniformLocation('u_background');

    if (this.maskTexture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.maskTexture);
      gl.uniform1i(maskLocation, 0);
    }

    if (this.backgroundTexture) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
      gl.uniform1i(backgroundLocation, 1);
    }

    gl.uniform1f(this.getUniformLocation('u_has_mask'), this.maskTexture ? 1 : 0);
    gl.uniform1f(this.getUniformLocation('u_has_background'), this.backgroundTexture ? 1 : 0);
    gl.uniform2f(
      this.getUniformLocation('u_title_uv_offset'),
      options.titleUvOffset[0],
      options.titleUvOffset[1],
    );
    gl.uniform2f(
      this.getUniformLocation('u_title_uv_scale'),
      options.titleUvScale[0],
      options.titleUvScale[1],
    );
    gl.uniform2f(
      this.getUniformLocation('u_canvas_viewport_min'),
      options.canvasViewportMin[0],
      options.canvasViewportMin[1],
    );
    gl.uniform2f(
      this.getUniformLocation('u_canvas_viewport_size'),
      options.canvasViewportSize[0],
      options.canvasViewportSize[1],
    );
    gl.uniform2f(
      this.getUniformLocation('u_viewport_size'),
      options.viewportSize[0],
      options.viewportSize[1],
    );
    gl.uniform2f(
      this.getUniformLocation('u_background_scale'),
      options.backgroundScale[0],
      options.backgroundScale[1],
    );
    gl.uniform2f(
      this.getUniformLocation('u_background_offset'),
      options.backgroundOffset[0],
      options.backgroundOffset[1],
    );
    gl.uniform1f(this.getUniformLocation('u_liquid_speed'), options.liquidSpeed);
    gl.uniform1f(this.getUniformLocation('u_liquid_warp'), options.liquidWarp);
    gl.uniform1f(this.getUniformLocation('u_liquid_opacity'), options.liquidOpacity);
    gl.uniform1f(this.getUniformLocation('u_refract_pixels'), options.refractPixels);
    gl.uniform1f(this.getUniformLocation('u_background_mix'), options.backgroundMix);
    gl.uniform1f(this.getUniformLocation('u_background_darken'), options.backgroundDarken);
    gl.uniform1f(this.getUniformLocation('u_rim_strength'), options.rimStrength);
    gl.uniform1f(this.getUniformLocation('u_inner_shadow_strength'), options.innerShadowStrength);
    gl.uniform1f(this.getUniformLocation('u_dispersion_strength'), options.dispersionStrength);
    gl.uniform1f(this.getUniformLocation('u_caustic_strength'), options.causticStrength);
    gl.uniform1f(this.getUniformLocation('u_glow_strength'), options.glowStrength);
    gl.uniform1f(this.getUniformLocation('u_core_saturation'), options.coreSaturation);
    gl.uniform1f(this.getUniformLocation('u_core_contrast'), options.coreContrast);
    gl.uniform1f(this.getUniformLocation('u_core_brightness'), options.coreBrightness);
    gl.uniform1f(this.getUniformLocation('u_rim_width'), options.rimWidth);
    gl.uniform1f(this.getUniformLocation('u_reduced_motion'), options.reducedMotion ? 1 : 0);
  }

  start(onFrame: (canvas: HTMLCanvasElement, time: number) => void, options: ShaderRendererStartOptions = {}) {
    if (this.disposed) {
      return;
    }

    if (this.running) {
      return;
    }

    this.running = true;
    const minimumFrameInterval =
      options.maxFps && options.maxFps > 0 ? 1000 / options.maxFps : 0;
    let lastRenderedFrameTime = Number.NEGATIVE_INFINITY;

    const tick = (frameTime: number) => {
      if (!this.running) {
        return;
      }

      if (
        minimumFrameInterval === 0 ||
        frameTime < lastRenderedFrameTime ||
        frameTime - lastRenderedFrameTime >= minimumFrameInterval
      ) {
        lastRenderedFrameTime = frameTime;
        const seconds = frameTime * 0.001;
        this.render(seconds);
        onFrame(this.canvas, seconds);
      }

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
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.stop();
    this.canvas.removeEventListener('webglcontextlost', this.handleContextLost);
    this.gl.deleteBuffer(this.positionBuffer);
    if (this.maskTexture) {
      this.gl.deleteTexture(this.maskTexture);
      this.maskTexture = null;
      this.maskTextureSource = null;
    }
    if (this.backgroundTexture) {
      this.gl.deleteTexture(this.backgroundTexture);
      this.backgroundTexture = null;
      this.backgroundTextureSource = null;
    }
    this.gl.deleteProgram(this.program);
    this.gl.deleteShader(this.vertexShader);
    this.gl.deleteShader(this.fragmentShader);
    this.uniformLocationCache.clear();
    this.gl.getExtension('WEBGL_lose_context')?.loseContext?.();
  }

  get element() {
    return this.canvas;
  }
}
