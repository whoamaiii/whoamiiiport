export type TypographyContext = CanvasRenderingContext2D & {
  fontKerning?: CanvasFontKerning;
  letterSpacing?: string;
};

export interface ShadowLayerConfig {
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  strokeColor: string;
  strokeWidth: number;
}

export interface TextShadowConfig {
  ambient: ShadowLayerConfig;
  halo: ShadowLayerConfig;
  primary: ShadowLayerConfig;
  innerGlow: ShadowLayerConfig;
}

type LiquidGlassSurfaceMode = 'hero' | 'section';

interface LiquidGlassSurfaceOptions {
  displayWidth: number;
  displayHeight: number;
  fontSize: number;
  intensity?: number;
  isMobile: boolean;
  mode?: LiquidGlassSurfaceMode;
  time: number;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function buildFontDeclaration(style: CSSStyleDeclaration) {
  return `${style.fontStyle || 'normal'} ${style.fontWeight || '900'} ${style.fontSize || '16px'} ${style.fontFamily || 'sans-serif'}`;
}

export function waitForFonts() {
  if (typeof document === 'undefined' || !('fonts' in document) || !document.fonts.ready) {
    return Promise.resolve();
  }

  return document.fonts.ready.then(() => undefined).catch(() => undefined);
}

export function applyMultiLayerShadow(
  context: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  baselineY: number,
  config: TextShadowConfig,
  fontSize: number,
) {
  const orderedLayers = [config.ambient, config.halo, config.primary, config.innerGlow];

  for (const layer of orderedLayers) {
    context.save();
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.shadowColor = layer.shadowColor;
    context.shadowBlur = layer.shadowBlur;
    context.shadowOffsetX = layer.shadowOffsetX;
    context.shadowOffsetY = layer.shadowOffsetY;
    context.strokeStyle = layer.strokeColor;
    context.lineWidth = Math.max(layer.strokeWidth * fontSize, 0.8);
    context.strokeText(text, centerX, baselineY);
    context.restore();
  }
}

export function applyInnerHighlight(
  context: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  baselineY: number,
  fontSize: number,
  isMobile: boolean,
) {
  context.save();
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.shadowColor = 'rgba(255, 255, 255, 0.32)';
  context.shadowBlur = isMobile ? 4 : 6;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = isMobile ? -1 : -2;
  context.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  context.lineWidth = Math.max(fontSize * 0.014, 0.8);
  context.strokeText(text, centerX, baselineY);

  context.shadowColor = 'rgba(255, 255, 245, 0.14)';
  context.shadowBlur = isMobile ? 2 : 3;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.strokeStyle = 'rgba(255, 255, 245, 0.09)';
  context.lineWidth = Math.max(fontSize * 0.007, 0.5);
  context.strokeText(text, centerX, baselineY);
  context.restore();
}

export function applyLiquidGlassSurface(
  context: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  baselineY: number,
  {
    displayWidth,
    displayHeight,
    fontSize,
    intensity = 1,
    isMobile,
    mode = 'section',
    time,
  }: LiquidGlassSurfaceOptions,
) {
  const mobileScale = isMobile ? 0.9 : 1;
  const strength = clamp(intensity, 0.18, 1.15);
  const isHeroSurface = mode === 'hero';
  const sweep = (Math.sin(time * 0.72) + 1) / 2;
  const counterSweep = (Math.cos(time * 0.54) + 1) / 2;

  context.save();
  context.lineJoin = 'round';
  context.lineCap = 'round';

  context.globalCompositeOperation = 'source-atop';
  context.globalAlpha = (isHeroSurface ? 0.08 : 0.78) * strength;
  const verticalRefraction = context.createLinearGradient(0, 0, 0, displayHeight);
  verticalRefraction.addColorStop(0, isHeroSurface ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.2)');
  verticalRefraction.addColorStop(0.22, isHeroSurface ? 'rgba(154, 231, 242, 0.07)' : 'rgba(154, 231, 242, 0.15)');
  verticalRefraction.addColorStop(0.48, 'rgba(255, 255, 255, 0.02)');
  verticalRefraction.addColorStop(0.72, isHeroSurface ? 'rgba(11, 18, 32, 0.08)' : 'rgba(11, 18, 32, 0.16)');
  verticalRefraction.addColorStop(1, isHeroSurface ? 'rgba(2, 5, 12, 0.14)' : 'rgba(2, 5, 12, 0.28)');
  context.fillStyle = verticalRefraction;
  context.fillText(text, centerX, baselineY);

  if (isHeroSurface) {
    const transmissionLift = context.createLinearGradient(0, 0, displayWidth, displayHeight);
    transmissionLift.addColorStop(0, 'rgba(89, 220, 244, 0.34)');
    transmissionLift.addColorStop(0.34, 'rgba(255, 180, 135, 0.28)');
    transmissionLift.addColorStop(0.68, 'rgba(177, 156, 236, 0.24)');
    transmissionLift.addColorStop(1, 'rgba(74, 180, 225, 0.3)');
    context.globalAlpha = 0.055 * strength;
    context.fillStyle = transmissionLift;
    context.fillText(text, centerX, baselineY);
  }

  const sweepX = (sweep * 1.45 - 0.22) * displayWidth;
  const caustic = context.createLinearGradient(
    sweepX - displayWidth * 0.62,
    0,
    sweepX + displayWidth * 0.62,
    displayHeight,
  );
  caustic.addColorStop(0, 'rgba(255, 255, 255, 0)');
  caustic.addColorStop(0.28, 'rgba(98, 211, 235, 0.18)');
  caustic.addColorStop(0.42, 'rgba(248, 244, 224, 0.46)');
  caustic.addColorStop(0.52, 'rgba(231, 157, 98, 0.2)');
  caustic.addColorStop(0.64, 'rgba(255, 255, 255, 0)');
  caustic.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.globalAlpha = (isHeroSurface ? 0.095 : 0.86) * strength;
  context.shadowColor = 'rgba(130, 224, 244, 0.2)';
  context.shadowBlur = Math.max(fontSize * 0.08 * strength, 3);
  context.strokeStyle = caustic;
  context.lineWidth = Math.max(fontSize * (isHeroSurface ? 0.026 : 0.04) * mobileScale * strength, 0.8);
  context.strokeText(text, centerX, baselineY);

  const lowerBend = context.createLinearGradient(0, displayHeight * 0.35, displayWidth, displayHeight);
  lowerBend.addColorStop(0, 'rgba(7, 14, 28, 0.2)');
  lowerBend.addColorStop(0.46, 'rgba(36, 45, 75, 0.08)');
  lowerBend.addColorStop(1, 'rgba(255, 197, 139, 0.08)');
  context.shadowBlur = 0;
  context.globalAlpha = (isHeroSurface ? 0.08 : 0.48) * strength;
  context.strokeStyle = lowerBend;
  context.lineWidth = Math.max(fontSize * (isHeroSurface ? 0.048 : 0.075) * mobileScale * strength, 1.2);
  context.shadowOffsetY = Math.max(fontSize * 0.018, 1);
  context.strokeText(text, centerX, baselineY);

  context.globalCompositeOperation = 'source-over';
  context.globalAlpha = 1;
  context.shadowOffsetY = 0;
  const rim = context.createLinearGradient(0, 0, displayWidth, displayHeight);
  rim.addColorStop(0, 'rgba(248, 253, 255, 0.58)');
  rim.addColorStop(0.22, 'rgba(129, 225, 242, 0.34)');
  rim.addColorStop(0.46, 'rgba(255, 224, 178, 0.28)');
  rim.addColorStop(0.72, 'rgba(91, 120, 193, 0.26)');
  rim.addColorStop(1, 'rgba(250, 244, 229, 0.5)');
  context.shadowColor = 'rgba(0, 0, 0, 0.42)';
  context.shadowBlur = Math.max(fontSize * (isHeroSurface ? 0.028 : 0.045) * strength, 1.6);
  context.strokeStyle = rim;
  context.lineWidth = Math.max(fontSize * (isHeroSurface ? 0.011 : 0.024) * mobileScale * strength, 0.42);
  context.strokeText(text, centerX, baselineY);

  const glintX = (counterSweep * 1.35 - 0.18) * displayWidth;
  const glint = context.createLinearGradient(
    glintX - displayWidth * 0.42,
    displayHeight,
    glintX + displayWidth * 0.42,
    0,
  );
  glint.addColorStop(0, 'rgba(255, 255, 255, 0)');
  glint.addColorStop(0.48, 'rgba(255, 255, 255, 0.62)');
  glint.addColorStop(0.58, 'rgba(112, 218, 239, 0.32)');
  glint.addColorStop(0.72, 'rgba(255, 255, 255, 0)');
  context.globalCompositeOperation = 'source-atop';
  context.globalAlpha = (isHeroSurface ? 0.085 : 0.58) * strength;
  context.shadowColor = 'rgba(255, 255, 255, 0.18)';
  context.shadowBlur = Math.max(fontSize * 0.032 * strength, 1.4);
  context.strokeStyle = glint;
  context.lineWidth = Math.max(fontSize * (isHeroSurface ? 0.012 : 0.018) * mobileScale * strength, 0.48);
  context.strokeText(text, centerX, baselineY);

  if (isHeroSurface) {
    const chromaShift = Math.max(fontSize * 0.006 * mobileScale, 0.5);

    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 0.075 * strength;
    context.shadowBlur = Math.max(fontSize * 0.018, 1);
    context.shadowColor = 'rgba(96, 225, 246, 0.18)';
    context.strokeStyle = 'rgba(95, 220, 247, 0.36)';
    context.lineWidth = Math.max(fontSize * 0.008 * mobileScale, 0.42);
    context.strokeText(text, centerX - chromaShift, baselineY - chromaShift * 0.42);

    context.shadowColor = 'rgba(255, 126, 78, 0.14)';
    context.strokeStyle = 'rgba(255, 138, 82, 0.26)';
    context.strokeText(text, centerX + chromaShift * 0.82, baselineY + chromaShift * 0.36);

    const trappedEdge = context.createLinearGradient(0, 0, 0, displayHeight);
    trappedEdge.addColorStop(0, 'rgba(244, 255, 255, 0.56)');
    trappedEdge.addColorStop(0.18, 'rgba(92, 218, 241, 0.18)');
    trappedEdge.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    trappedEdge.addColorStop(0.82, 'rgba(255, 164, 102, 0.12)');
    trappedEdge.addColorStop(1, 'rgba(13, 24, 46, 0.48)');
    context.globalCompositeOperation = 'source-atop';
    context.globalAlpha = 0.095 * strength;
    context.shadowColor = 'rgba(224, 250, 255, 0.12)';
    context.shadowBlur = Math.max(fontSize * 0.024, 1.2);
    context.strokeStyle = trappedEdge;
    context.lineWidth = Math.max(fontSize * 0.022 * mobileScale, 0.8);
    context.strokeText(text, centerX, baselineY);

    const compressedCausticX = ((Math.sin(time * 0.9 + 1.4) + 1) * 0.5 * 1.18 - 0.08) * displayWidth;
    const compressedCaustic = context.createLinearGradient(
      compressedCausticX - displayWidth * 0.36,
      displayHeight * 0.12,
      compressedCausticX + displayWidth * 0.44,
      displayHeight * 0.88,
    );
    compressedCaustic.addColorStop(0, 'rgba(255, 255, 255, 0)');
    compressedCaustic.addColorStop(0.42, 'rgba(134, 233, 249, 0.18)');
    compressedCaustic.addColorStop(0.5, 'rgba(255, 247, 217, 0.72)');
    compressedCaustic.addColorStop(0.57, 'rgba(255, 144, 91, 0.16)');
    compressedCaustic.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.globalAlpha = 0.055 * strength;
    context.shadowColor = 'rgba(255, 248, 214, 0.18)';
    context.shadowBlur = Math.max(fontSize * 0.018, 1);
    context.strokeStyle = compressedCaustic;
    context.lineWidth = Math.max(fontSize * 0.008 * mobileScale, 0.42);
    context.strokeText(text, centerX, baselineY);
  }

  context.restore();
}
