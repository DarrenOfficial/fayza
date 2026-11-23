/**
 * White cloud-wave frame (the Laufey pin) as a 9-slice border-image tile.
 * 120×120 tile: corners are 30×30 quarter turns; each edge carries one sine period,
 * so with `border-image-repeat: round` the bumps stay evenly spaced at any size.
 */
function wavePath(inset: number, amp: number) {
  const N = 24, lo = 30, hi = 90;
  const s = (t: number) => amp * Math.sin(t * Math.PI * 2);
  const run = (f: (t: number) => [number, number]) =>
    Array.from({ length: N + 1 }, (_, i) => f(i / N).map((v) => v.toFixed(2)).join(' ')).join(' L');
  const far = 120 - inset;
  return (
    `M${run((t) => [lo + t * 60, inset + s(t)])} Q ${far} ${inset} ${far} ${lo}` +
    ` L${run((t) => [far - s(t), lo + t * 60])} Q ${far} ${far} ${hi} ${far}` +
    ` L${run((t) => [hi - t * 60, far - s(t)])} Q ${inset} ${far} ${inset} ${hi}` +
    ` L${run((t) => [inset + s(t), hi - t * 60])} Q ${inset} ${inset} ${lo} ${inset} Z`
  );
}

const svg =
  `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>` +
  `<path d='${wavePath(13, 4.5)}' fill='none' stroke='#fffdf6' stroke-width='1.6'/>` +
  `<path d='${wavePath(21, 3)}' fill='none' stroke='#fffdf6' stroke-opacity='.6' stroke-width='.8'/>` +
  `</svg>`;

/** CSS `url(...)` value for `border-image-source`. */
export const WAVE_TILE = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
