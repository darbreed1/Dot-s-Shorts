import React from 'react';
import {clamp01, easeInCubic, easeInOutCubic, easeOutBack, lerp} from '../anim';
import {WorldSvg} from './WorldSvg';

// Puffs of gas / smoke / steam: a cluster of circles with ONE merged outline (all ink circles first, then all fill
// circles). Each puff travels from `from` to `to` along a gentle arc, grows in with an overshoot, wobbles, then
// SHRINKS away at the end (outlined puffs never fade). Optional grumpy face for "irritating" gas.

export type Puff = {
  at: number;
  dur: number;
  from: {x: number; y: number};
  to: {x: number; y: number};
  size: number; // radius of the cluster
  arc?: number; // sideways bow of the path (world px, + = right of travel)
  seed?: number;
};

const CIRCLES = [
  [0, 0, 0.62],
  [-0.48, 0.12, 0.42],
  [0.5, 0.1, 0.45],
  [-0.2, -0.42, 0.42],
  [0.28, -0.38, 0.38],
];

export const GasPuffs: React.FC<{
  t: number;
  puffs: readonly Puff[];
  fill?: string;
  shade?: string;
  ink?: number;
  grumpy?: boolean;
}> = ({t, puffs, fill = '#DDE87A', shade = '#C6D35E', ink = 6, grumpy = false}) => {
  const items: React.ReactNode[] = [];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  puffs.forEach((p, i) => {
    const u = (t - p.at) / p.dur;
    if (u < 0 || u > 1) return;
    const e = easeInOutCubic(u);
    const nx = -(p.to.y - p.from.y);
    const ny = p.to.x - p.from.x;
    const nl = Math.hypot(nx, ny) || 1;
    const bow = (p.arc ?? 0) * Math.sin(Math.PI * e);
    const x = lerp(p.from.x, p.to.x, e) + (nx / nl) * bow;
    const y = lerp(p.from.y, p.to.y, e) + (ny / nl) * bow;
    const grow = easeOutBack(clamp01(u / 0.2), 2) * (1 - easeInCubic(clamp01((u - 0.78) / 0.22)));
    const s = p.size * grow * (1 + 0.06 * Math.sin(2 * Math.PI * 2.1 * (t - p.at) + (p.seed ?? i)));
    if (s < 0.5) return;
    const rot = 10 * Math.sin(2 * Math.PI * 0.8 * (t - p.at) + i);
    x0 = Math.min(x0, x - s * 1.4); y0 = Math.min(y0, y - s * 1.4); x1 = Math.max(x1, x + s * 1.4); y1 = Math.max(y1, y + s * 1.4);
    items.push(
      <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        {CIRCLES.map(([cx, cy, r], j) => (
          <circle key={`i${j}`} cx={cx} cy={cy} r={r + ink / s} fill="#15151C" />
        ))}
        {CIRCLES.map(([cx, cy, r], j) => (
          <circle key={`f${j}`} cx={cx} cy={cy} r={r} fill={fill} />
        ))}
        <circle cx={0.18} cy={0.22} r={0.32} fill={shade} />
        {grumpy ? (
          <g transform={`rotate(${-rot})`}>
            <circle cx={-0.2} cy={-0.02} r={0.075} fill="#15151C" />
            <circle cx={0.2} cy={-0.02} r={0.075} fill="#15151C" />
            <line x1={-0.34} y1={-0.24} x2={-0.1} y2={-0.13} stroke="#15151C" strokeWidth={0.07} strokeLinecap="round" />
            <line x1={0.34} y1={-0.24} x2={0.1} y2={-0.13} stroke="#15151C" strokeWidth={0.07} strokeLinecap="round" />
            <path d="M-0.14,0.24 Q0,0.14 0.14,0.24" fill="none" stroke="#15151C" strokeWidth={0.06} strokeLinecap="round" />
          </g>
        ) : null}
      </g>,
    );
  });
  if (!items.length) return null;
  return <WorldSvg box={[x0, y0, x1, y1]}>{items}</WorldSvg>;
};
