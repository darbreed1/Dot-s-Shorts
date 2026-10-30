import React from 'react';
import {clamp01, easeInCubic, rand} from '../anim';
import {WorldSvg} from './WorldSvg';

// Liquid particles in the flat style: no outline (like the lava), born in bursts with a seeded random angle and
// speed, real gravity, stretched along their velocity, shrinking away at the end of their life.

export type Burst = {
  at: number; // birth time (s)
  x: number;
  y: number;
  count: number;
  speed: readonly [number, number]; // world px / s
  angle: readonly [number, number]; // degrees, 0 = right, -90 = up
  size: readonly [number, number]; // radius
  life?: number;
  seed?: number;
};

export const DropletBursts: React.FC<{
  t: number;
  bursts: readonly Burst[];
  gravity?: number;
  color?: string;
  core?: string; // optional lighter highlight
}> = ({t, bursts, gravity = 1500, color = '#BFE3FF', core = '#EAF6FF'}) => {
  const drops: React.ReactNode[] = [];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  bursts.forEach((b, bi) => {
    const life = b.life ?? 0.9;
    const tau = t - b.at;
    if (tau < 0 || tau > life) return;
    const seed = (b.seed ?? bi * 101) + 7;
    for (let i = 0; i < b.count; i++) {
      const a = ((b.angle[0] + (b.angle[1] - b.angle[0]) * rand(seed + i * 3)) * Math.PI) / 180;
      const v = b.speed[0] + (b.speed[1] - b.speed[0]) * rand(seed + i * 3 + 1);
      const r0 = b.size[0] + (b.size[1] - b.size[0]) * rand(seed + i * 3 + 2);
      const vx = Math.cos(a) * v;
      const vy = Math.sin(a) * v + gravity * tau;
      const px = b.x + Math.cos(a) * v * tau;
      const py = b.y + Math.sin(a) * v * tau + 0.5 * gravity * tau * tau;
      const shrink = 1 - easeInCubic(clamp01((tau - life * 0.6) / (life * 0.4)));
      const r = r0 * shrink;
      if (r < 0.4) continue;
      const sp = Math.hypot(vx, vy);
      const stretch = 1 + Math.min(1.4, sp / 900);
      const rot = (Math.atan2(vy, vx) * 180) / Math.PI;
      x0 = Math.min(x0, px - r * 3); y0 = Math.min(y0, py - r * 3); x1 = Math.max(x1, px + r * 3); y1 = Math.max(y1, py + r * 3);
      drops.push(
        <g key={`${bi}-${i}`} transform={`translate(${px} ${py}) rotate(${rot}) scale(${stretch} ${1 / Math.sqrt(stretch)})`}>
          <circle r={r} fill={color} />
          <circle cx={-r * 0.25} cy={-r * 0.25} r={r * 0.35} fill={core} />
        </g>,
      );
    }
  });
  if (!drops.length) return null;
  return <WorldSvg box={[x0, y0, x1, y1]}>{drops}</WorldSvg>;
};

/** Repeating bursts every `every` seconds between t0 and t1 (tears dripping, a leaking tap...). */
export const repeatBursts = (t0: number, t1: number, every: number, make: (at: number, i: number) => Burst) => {
  const out: Burst[] = [];
  for (let i = 0, at = t0; at <= t1; i++, at = t0 + i * every) out.push(make(at, i));
  return out;
};
