// Hand-traced FFA lettermark, rendered inline so `currentColor` picks
// up the parent's text color. Replaces the previous /images/logo.svg
// (which was a base64 PNG wrapped in an SVG tag — fuzzy at any size
// larger than its native 1175×1291 raster).
//
// Coordinates derived from a programmatic analysis of the source PNG:
// stem centers at x=248 / 478 / 1028 with width 166, arc heights
// aligned with the discrete y-bands measured in the bitmap.
//
// All paths are stroked, not filled, so changing `stroke-width` (or
// the `currentColor`) applies uniformly across the mark.
export function FfaLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1175 1291"
      fill="none"
      stroke="currentColor"
      strokeWidth="166"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* Left "f": stem from bottom up + top hook curving up-and-right
          into the long horizontal that runs across the top. */}
      <path d="M 248 1207 V 326 Q 248 82 415 82 H 1092" />

      {/* Middle "f": stem from bottom up + smaller hook curving into
          the second horizontal sweep below the outer one. */}
      <path d="M 478 1207 V 383 Q 478 298 583 298 H 1092" />

      {/* Right vertical (right side of the "a") — short stem starting
          below the inner-arc and crossbar, descending to the baseline. */}
      <path d="M 1028 1207 V 676" />

      {/* Cross bar — horizontal that crosses both f-stems and forms
          the top of the "a" bowl on the right. */}
      <path d="M 201 570 H 1056" />

      {/* "a" middle horizontal — closes the bowl between the middle
          stem and right vertical. */}
      <path d="M 478 879 H 1028" />
    </svg>
  );
}
