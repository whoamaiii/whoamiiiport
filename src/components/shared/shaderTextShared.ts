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
