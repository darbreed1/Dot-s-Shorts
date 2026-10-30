import React from 'react';
import {rand} from '../anim';
import {WorldSvg} from './WorldSvg';

// A cartoon fingerprint: a loop of `ridges` nested ridge lines (each a slightly wobbly ellipse, a few with a
// little break), fitted inside an rx x ry fingertip. Same ridge count in a smaller tip = tighter-packed ridges.
// `reveal` 0..1 draws the ridges from the core outward (a fresh press); `fill` is the tip under them.

export const Fingerprint: React.FC<{
  x: number;
  y: number;
  rx: number;
  ry: number;
  ridges?: number;
  color?: string;
  fill?: string | null; // the fingertip pad behind the ridges; null = ridges only (a print pressed in clay)
  outline?: number; // tip outline width (0 = none)
  width?: number; // ridge line width
  reveal?: number;
  rot?: number;
  seed?: number;
}> = ({x, y, rx, ry, ridges = 9, color = '#8A4B2A', fill = null, outline = 0, width, reveal = 1, rot = 0, seed = 1}) => {
  const lw = width ?? Math.max(1.2, (Math.min(rx, ry) / ridges) * 0.42);
  const shown = Math.ceil(ridges * Math.max(0, Math.min(1, reveal)));
  const paths = Array.from({length: shown}, (_, i) => {
    const f = (i + 0.8) / (ridges + 0.3);
    const ax = rx * f * 0.92;
    const ay = ry * f * 0.92;
    const N = 40;
    // a gap in some ridges, like real prints
    const gapAt = rand(seed * 31 + i) * N;
    const gap = i > 1 && rand(seed * 17 + i) > 0.55 ? 3 : 0;
    let d = '';
    let pen = false;
    for (let k = 0; k <= N; k++) {
      const a = (k / N) * Math.PI * 2;
      const wob = 1 + 0.04 * Math.sin(a * 3 + i * 1.7 + seed) + 0.025 * Math.sin(a * 5 + seed * 2);
      // the core loop sits a little high, like a fingertip whorl
      const px = Math.cos(a) * ax * wob;
      const py = Math.sin(a) * ay * wob - ry * 0.08 * (1 - f);
      const inGap = gap && k >= gapAt && k < gapAt + gap;
      if (inGap) {
        pen = false;
        continue;
      }
      d += `${pen ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)} `;
      pen = true;
    }
    return d;
  });
  const m = Math.max(rx, ry) * 1.15 + lw * 2;
  return (
    <WorldSvg box={[x - m, y - m, x + m, y + m]}>
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>
        {fill ? <ellipse rx={rx} ry={ry} fill={fill} stroke={outline ? '#15151C' : 'none'} strokeWidth={outline} /> : null}
        {paths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={color} strokeWidth={lw} strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {!fill && outline ? <ellipse rx={rx} ry={ry} fill="none" stroke="#15151C" strokeWidth={outline} /> : null}
      </g>
    </WorldSvg>
  );
};
