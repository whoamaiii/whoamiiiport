import { type CSSProperties, type KeyboardEvent, type PropsWithChildren, forwardRef, useEffect, useId, useState } from "react"
import { RefractionFilter, buildComputedDisplacement } from "./svg-filter"
import { supportsBackdropSvgFilter } from "./browser-detect"
import ShimmerOverlay from "./shimmer-overlay"
import type { DisplacementMode } from "./types"

/* ---------- Frosted glass surface ---------- */
const FrostedSurface = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    className?: string
    style?: CSSProperties
    intensity?: number
    blurStrength?: number
    colorBoost?: number
    aberration?: number
    mouseOffset?: { x: number; y: number }
    onMouseLeave?: () => void
    onMouseEnter?: () => void
    onMouseDown?: () => void
    onMouseUp?: () => void
    pressed?: boolean
    brightOverlay?: boolean
    radius?: number
    innerPadding?: string
    dimensions?: { width: number; height: number }
    onClick?: () => void
    variant?: DisplacementMode
  }>
>(
  (
    {
      children,
      className = "",
      style,
      intensity = 25,
      blurStrength = 12,
      colorBoost = 180,
      aberration = 2,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      pressed = false,
      brightOverlay = false,
      radius = 999,
      innerPadding = "24px 32px",
      dimensions = { width: 270, height: 69 },
      onClick,
      variant = "standard",
      mouseOffset,
    },
    ref,
  ) => {
    const filterTag = useId()
    const [computedUri, setComputedUri] = useState<string>("")
    const isClickable = typeof onClick === "function"

    const canUseSvgBackdrop = supportsBackdropSvgFilter()

    // Build shader-based map on demand
    useEffect(() => {
      if (variant === "shader") {
        const uri = buildComputedDisplacement(dimensions.width, dimensions.height)
        setComputedUri(uri)
      }
    }, [variant, dimensions.width, dimensions.height])

    const backdropCSS = {
      // Apply SVG displacement filter only on Chromium (Safari/Firefox can't do backdrop-filter + SVG)
      filter: canUseSvgBackdrop ? `url(#${filterTag})` : undefined,
      backdropFilter: `blur(${(brightOverlay ? 12 : 0) + blurStrength * 32}px) saturate(${colorBoost}%)`,
      WebkitBackdropFilter: `blur(${(brightOverlay ? 12 : 0) + blurStrength * 32}px) saturate(${colorBoost}%)`,
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isClickable) {
        return
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        onClick()
      }
    }

    return (
      <div
        ref={ref}
        className={`relative ${className} ${pressed ? "active" : ""} ${isClickable ? "cursor-pointer" : ""}`}
        style={style}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
      >
        {/* SVG filter definition — always rendered, used by Chromium */}
        <RefractionFilter
          variant={variant}
          id={filterTag}
          intensity={intensity}
          aberration={aberration}
          width={dimensions.width}
          height={dimensions.height}
          computedUri={computedUri}
        />

        <div
          role="presentation"
          className="frost-layer"
          style={{
            borderRadius: `${radius}px`,
            position: "relative",
            display: "flex",
            width: "100%",
            minWidth: 0,
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            padding: innerPadding,
            overflow: "hidden",
            boxSizing: "border-box",
            transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, backdrop-filter 0.2s ease-in-out, -webkit-backdrop-filter 0.2s ease-in-out",
            boxShadow: brightOverlay ? "0px 16px 70px rgba(0, 0, 0, 0.75)" : "0px 12px 40px rgba(0, 0, 0, 0.25)",
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        >
          {/* Backdrop warp layer */}
          <span
            className="frost-layer__warp"
            style={
              {
                ...backdropCSS,
                position: "absolute",
                inset: "0",
              } as CSSProperties
            }
          />

          {/* CSS shimmer fallback for non-Chromium browsers */}
          {!canUseSvgBackdrop && (
            <ShimmerOverlay
              width={dimensions.width}
              height={dimensions.height}
              mouseOffset={mouseOffset}
              aberration={aberration}
              radius={radius}
            />
          )}

          {/* Crisp content layer */}
          <div
            className="transition-all duration-150 ease-in-out text-white"
            style={{
              position: "relative",
              zIndex: 1,
              textShadow: brightOverlay ? "0px 2px 12px rgba(0, 0, 0, 0)" : "0px 2px 12px rgba(0, 0, 0, 0.4)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    )
  },
)

FrostedSurface.displayName = "FrostedSurface"

export default FrostedSurface
