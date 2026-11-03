import React from 'react';

// The radiation trefoil (yellow disc, three black blades round a black hub) and a "fallout cloud": a grey outlined
// puff cluster (one merged outline) with the trefoil on it. SVG groups centred on (x, y); r = trefoil / cloud size.
const INK = '#15151C';

export const Trefoil: React.FC<{x: number; y: number; r: number; scale?: number; rot?: number}> = ({x, y, r, scale = 1, rot = 0}) => {
  if (scale <= 0.01) return null;
  const r0 = r * 0.24;
  const r1 = r * 0.86;
  const blade = (c: number) => {
    const a0 = ((c - 30) * Math.PI) / 180;
    const a1 = ((c + 30) * Math.PI) / 180;
    const p = (rr: number, a: number) => `${rr * Math.cos(a)},${rr * Math.sin(a)}`;
    return `M${p(r0, a0)} L${p(r1, a0)} A${r1},${r1} 0 0,1 ${p(r1, a1)} L${p(r0, a1)} A${r0},${r0} 0 0,0 ${p(r0, a0)} Z`;
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <circle r={r} fill="#F7D64A" stroke={INK} strokeWidth={r * 0.09} />
      {/* blades down, upper left, upper right (SVG angles, y down) */}
      {[90, 210, 330].map((c) => (
        <path key={c} d={blade(c)} fill={INK} />
      ))}
      <circle r={r * 0.15} fill={INK} />
    </g>
  );
};

const PUFFS = [
  [0, 0.05, 0.62],
  [-0.62, 0.22, 0.45],
  [0.64, 0.2, 0.47],
  [-0.32, -0.42, 0.46],
  [0.34, -0.4, 0.44],
  [0, -0.62, 0.36],
];

export const FalloutCloud: React.FC<{x: number; y: number; r: number; scale?: number; fill?: string; ink?: number}> = ({
  x, y, r, scale = 1, fill = '#B9B6AE', ink = 8,
}) => {
  if (scale <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {PUFFS.map(([cx, cy, k], i) => (
        <circle key={`i${i}`} cx={cx * r} cy={cy * r} r={k * r + ink} fill={INK} />
      ))}
      {PUFFS.map(([cx, cy, k], i) => (
        <circle key={`f${i}`} cx={cx * r} cy={cy * r} r={k * r} fill={fill} />
      ))}
      <circle cx={r * 0.25} cy={r * 0.32} r={r * 0.36} fill="#A29F97" />
      <Trefoil x={0} y={-r * 0.05} r={r * 0.4} />
    </g>
  );
};
