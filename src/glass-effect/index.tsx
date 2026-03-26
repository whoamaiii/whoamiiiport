import { useCallback, useEffect, useRef, useState } from "react"
import FrostedSurface from "./glass-surface"
import {
  computeElasticDeformation,
  computeSpringOffset,
  getProximityIntensity,
} from "./interaction-physics"
import type { GlassLayerConfig, Point2D, DisplacementMode } from "./types"

export type { GlassLayerConfig, Point2D, DisplacementMode }

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setPrefersReducedMotion(mediaQuery.matches)

    update()

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update)
      return () => mediaQuery.removeEventListener("change", update)
    }

    mediaQuery.addListener(update)
    return () => mediaQuery.removeListener(update)
  }, [])

  return prefersReducedMotion
}

export default function GlassLayer({
  children,
  displacementScale = 70,
  blurAmount = 0.0625,
  saturation = 140,
  aberrationIntensity = 2,
  elasticity = 0.15,
  cornerRadius = 999,
  globalMousePos: externalCursor,
  mouseOffset: externalOffset,
  mouseContainer = null,
  className = "",
  padding = "24px 32px",
  overLight = false,
  style = {},
  mode = "standard",
  onClick,
}: GlassLayerConfig) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 270, height: 69 })
  const [localCursor, setLocalCursor] = useState<Point2D>({ x: 0, y: 0 })
  const [localOffset, setLocalOffset] = useState<Point2D>({ x: 0, y: 0 })
  const prefersReducedMotion = usePrefersReducedMotion()

  // Decide source of cursor data
  const cursor = prefersReducedMotion ? { x: 0, y: 0 } : externalCursor || localCursor
  const offset = prefersReducedMotion ? { x: 0, y: 0 } : externalOffset || localOffset

  // Internal pointer tracking
  const onPointerMove = useCallback(
    (e: MouseEvent) => {
      if (prefersReducedMotion) return

      const target = mouseContainer?.current || surfaceRef.current
      if (!target) return

      const rect = target.getBoundingClientRect()
      const mx = rect.left + rect.width / 2
      const my = rect.top + rect.height / 2

      setLocalOffset({
        x: ((e.clientX - mx) / rect.width) * 100,
        y: ((e.clientY - my) / rect.height) * 100,
      })

      setLocalCursor({ x: e.clientX, y: e.clientY })
    },
    [mouseContainer, prefersReducedMotion],
  )

  // Wire up internal tracking when no external source is provided
  useEffect(() => {
    if (prefersReducedMotion || (externalCursor && externalOffset)) return

    const target = mouseContainer?.current || surfaceRef.current
    if (!target) return

    target.addEventListener("mousemove", onPointerMove)
    return () => target.removeEventListener("mousemove", onPointerMove)
  }, [onPointerMove, mouseContainer, externalCursor, externalOffset, prefersReducedMotion])

  // Keep dimensions in sync
  useEffect(() => {
    const measure = () => {
      if (surfaceRef.current) {
        const r = surfaceRef.current.getBoundingClientRect()
        setDimensions((current) => {
          if (current.width === r.width && current.height === r.height) return current
          return { width: r.width, height: r.height }
        })
      }
    }

    measure()

    if (typeof window === "undefined") {
      return
    }

    if (typeof ResizeObserver !== "undefined" && surfaceRef.current) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry) return

        const { width, height } = entry.contentRect
        setDimensions((current) => {
          if (current.width === width && current.height === height) return current
          return { width, height }
        })
      })

      observer.observe(surfaceRef.current)
      return () => observer.disconnect()
    }

    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // Physics calculations
  const intensity = prefersReducedMotion ? 0 : getProximityIntensity(cursor, surfaceRef, dimensions)
  const spring = prefersReducedMotion ? { x: 0, y: 0 } : computeSpringOffset(cursor, surfaceRef, elasticity, intensity)
  const deformation = prefersReducedMotion
    ? "scale(1)"
    : pressed && Boolean(onClick)
      ? "scale(0.96)"
      : computeElasticDeformation(cursor, surfaceRef, dimensions, elasticity)

  // Physics-based transform - no translate(-50%, -50%) needed
  // We use a wrapper div for centering instead
  const transformCSS = prefersReducedMotion
    ? "translate(0px, 0px) scale(1)"
    : `translate(${spring.x}px, ${spring.y}px) ${deformation}`

  const baseStyle = {
    ...style,
    transform: transformCSS,
    transition: prefersReducedMotion ? "none" : "transform ease-out 0.2s",
  }

  // All overlays share the same positioning style
  const overlayStyle = {
    position: "absolute" as const,
    inset: "0",
    borderRadius: `${cornerRadius}px`,
  }

  return (
    <div className="relative flex w-full h-full items-center justify-center">
      {/* Dimming overlay for bright mode */}
      <div
        className={`absolute inset-0 bg-black transition-all duration-150 ease-in-out pointer-events-none ${overLight ? "opacity-20" : "opacity-0"}`}
        style={overlayStyle}
      />
      <div
        className={`absolute inset-0 bg-black transition-all duration-150 ease-in-out pointer-events-none mix-blend-overlay ${overLight ? "opacity-100" : "opacity-0"}`}
        style={overlayStyle}
      />

      {/* Main glass surface */}
      <FrostedSurface
        ref={surfaceRef}
        className={className}
        style={baseStyle}
        radius={cornerRadius}
        intensity={overLight ? displacementScale * 0.5 : displacementScale}
        blurStrength={blurAmount}
        colorBoost={saturation}
        aberration={aberrationIntensity}
        dimensions={dimensions}
        innerPadding={padding}
        mouseOffset={offset}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        pressed={pressed}
        brightOverlay={overLight}
        onClick={onClick}
        variant={mode}
      >
        {children}
      </FrostedSurface>

      {/* Border shimmer layer 1 — screen blend */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          ...overlayStyle,
          mixBlendMode: "screen",
          opacity: 0.2,
          padding: "1.5px",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          boxShadow: "0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
          background: `linear-gradient(
          ${135 + offset.x * 1.2}deg,
          rgba(255, 255, 255, 0.0) 0%,
          rgba(255, 255, 255, ${0.12 + Math.abs(offset.x) * 0.008}) ${Math.max(10, 33 + offset.y * 0.3)}%,
          rgba(255, 255, 255, ${0.4 + Math.abs(offset.x) * 0.012}) ${Math.min(90, 66 + offset.y * 0.4)}%,
          rgba(255, 255, 255, 0.0) 100%
        )`,
        }}
      />

      {/* Border shimmer layer 2 — overlay blend */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          ...overlayStyle,
          mixBlendMode: "overlay",
          padding: "1.5px",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          boxShadow: "0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
          background: `linear-gradient(
          ${135 + offset.x * 1.2}deg,
          rgba(255, 255, 255, 0.0) 0%,
          rgba(255, 255, 255, ${0.32 + Math.abs(offset.x) * 0.008}) ${Math.max(10, 33 + offset.y * 0.3)}%,
          rgba(255, 255, 255, ${0.6 + Math.abs(offset.x) * 0.012}) ${Math.min(90, 66 + offset.y * 0.4)}%,
          rgba(255, 255, 255, 0.0) 100%
        )`,
        }}
      />

      {/* Interactive hover / active highlights */}
      {Boolean(onClick) && (
        <>
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-200 ease-out"
            style={{
              ...overlayStyle,
              opacity: hovered || pressed ? 0.5 : 0,
              backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 50%)",
              mixBlendMode: "overlay",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-200 ease-out"
            style={{
              ...overlayStyle,
              opacity: pressed ? 0.5 : 0,
              backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 80%)",
              mixBlendMode: "overlay",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-200 ease-out"
            style={{
              ...overlayStyle,
              opacity: hovered ? 0.4 : pressed ? 0.8 : 0,
              backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)",
              mixBlendMode: "overlay",
            }}
          />
        </>
      )}
    </div>
  )
}
