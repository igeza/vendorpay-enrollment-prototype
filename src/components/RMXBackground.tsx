import backgroundPattern from "../assets/splash/background/rmx-background-pattern.svg"

/** Intrinsic size of the source asset — the pattern is authored at this fixed size. */
const PATTERN_WIDTH = 1900
const PATTERN_HEIGHT = 829

/**
 * Faint decorative swirl + dot-grid pattern used behind content on RMX splash/landing cards.
 * Rendered at its fixed intrinsic size, horizontally centered and top-anchored, clipped by the
 * parent's overflow-hidden — so it never rescales or shifts on resize, it's simply revealed or
 * clipped as the viewport changes.
 */
export function RMXBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm" aria-hidden="true">
      <img
        src={backgroundPattern}
        alt=""
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{ width: PATTERN_WIDTH, height: PATTERN_HEIGHT, maxWidth: "none" }}
      />
    </div>
  )
}
