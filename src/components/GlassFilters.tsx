import { useId } from 'react';

interface GlassFiltersProps {
  idPrefix?: string;
}

export function useGlassFilterIds(idPrefix?: string) {
  const generatedId = useId().replace(/:/g, '');
  const prefix = idPrefix ?? `glass-${generatedId}`;

  return {
    liquidGlass: `${prefix}-liquid-glass`,
    glassEdge: `${prefix}-glass-edge`,
    glassGlow: `${prefix}-glass-glow`,
  };
}

export function GlassFilters({ idPrefix }: GlassFiltersProps) {
  const generatedId = useId().replace(/:/g, '');
  const prefix = idPrefix ?? `glass-${generatedId}`;

  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <filter
          id={`${prefix}-liquid-glass`}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="2"
            seed="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="warped"
          />
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="blurred-alpha" />
          <feSpecularLighting
            in="blurred-alpha"
            surfaceScale="3"
            specularConstant="1"
            specularExponent="18"
            lightingColor="#ffffff"
            result="specular"
          >
            <fePointLight x="-120" y="-120" z="180" />
          </feSpecularLighting>
          <feComposite
            in="specular"
            in2="SourceAlpha"
            operator="in"
            result="specular-masked"
          />
          <feMerge>
            <feMergeNode in="warped" />
            <feMergeNode in="specular-masked" />
          </feMerge>
        </filter>

        <filter
          id={`${prefix}-glass-edge`}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="spread" />
          <feGaussianBlur in="spread" stdDeviation="1.5" result="spread-blur" />
          <feComposite in="spread-blur" in2="SourceAlpha" operator="out" result="rim" />
          <feColorMatrix
            in="rim"
            type="matrix"
            values="1 0 0 0 0.72
                    0 1 0 0 0.82
                    0 0 1 0 0.95
                    0 0 0 0.8 0"
            result="colored-rim"
          />
          <feMerge>
            <feMergeNode in="colored-rim" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter
          id={`${prefix}-glass-glow`}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="soft-blur" />
          <feColorMatrix
            in="soft-blur"
            type="matrix"
            values="0 0 0 0 0.84
                    0 0 0 0 0.9
                    0 0 0 0 1
                    0 0 0 0.32 0"
            result="soft-glow"
          />
          <feMerge>
            <feMergeNode in="soft-glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
