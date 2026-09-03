import { useEffect, useRef, useState } from "react"
import backgroundPattern from "../assets/splash/background/rmx-background-pattern.svg"

/** Intrinsic size of the source asset — the pattern is authored at this fixed size. */
const PATTERN_WIDTH = 1900
const PATTERN_HEIGHT = 829

/**
 * Faint decorative swirl + dot-grid pattern used behind content on RMX splash/landing cards.
 * Horizontally centered and top-anchored, clipped by the parent's overflow-hidden. Holds its
 * authored size while the container fits within it, but scales up (never down) so it always
 * fully covers containers larger than the source asset.
 */
export function RMXBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const coverScale = Math.max(width / PATTERN_WIDTH, height / PATTERN_HEIGHT)
      setScale(Math.max(1, coverScale))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm" aria-hidden="true">
      <img
        src={backgroundPattern}
        alt=""
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{ width: PATTERN_WIDTH * scale, height: PATTERN_HEIGHT * scale, maxWidth: "none" }}
      />
    </div>
  )
}
