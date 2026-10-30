import React from 'react';
import {clamp01, easeInCubic, easeOutBack} from '../anim';
import {WorldSvg} from './WorldSvg';

// Sleepy "Z"s that pop on, float up with a sway, grow, then shrink away (outlined shapes never fade).
// Drawn in whatever layer it sits in (world units).

export const Zzz: React.FC<{
  t: number;
  x: number;
  y: number;
  t0: number;
  t1: number; // no new Z is born after t1 (the last ones finish their float)
  size?: number;
  period?: number;
  life?: number;
  dir?: number; // sideways drift per unit of rise (+ = right)
  ink?: number;
  color?: string;
}> = ({t, x, y, t0, t1, size = 60, period = 0.85, life = 2.4, dir = 0.35, ink = 7, color = '#DDEBFF'}) => {
  const zs: React.ReactNode[] = [];
  for (let i = 0; ; i++) {
    const born = t0 + i * period;
    if (born > t1 || born > t) break;
    const p = (t - born) / life;
    if (p > 1) continue;
    const grow = easeOutBack(clamp01(p / 0.15), 2) * (0.55 + 0.45 * p);
    const shrink = 1 - easeInCubic(clamp01((p - 0.8) / 0.2));
    const s = size * grow * shrink;
    if (s <= 0.5) continue;
    const rise = p * size * 3.4;
    const zx = x + rise * dir + Math.sin(p * Math.PI * 2 + i) * size * 0.25;
    const zy = y - rise;
    const rot = -12 + Math.sin(p * 5 + i) * 8;
    const d = `M${-s / 2},${-s / 2} H${s / 2} L${-s / 2},${s / 2} H${s / 2}`;
    zs.push(
      <g key={i} transform={`translate(${zx} ${zy}) rotate(${rot})`}>
        <path d={d} fill="none" stroke="#15151C" strokeWidth={s * 0.22 + ink * 2} strokeLinejoin="round" strokeLinecap="round" />
        <path d={d} fill="none" stroke={color} strokeWidth={s * 0.22} strokeLinejoin="round" strokeLinecap="round" />
      </g>,
    );
  }
  return <WorldSvg box={[x - size * 6, y - size * 5, x + size * 6, y + size * 2]}>{zs}</WorldSvg>;
};
