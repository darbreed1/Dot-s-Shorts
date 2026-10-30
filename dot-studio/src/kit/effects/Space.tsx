import React from 'react';
import {clamp01, easeOutBack, rand} from '../anim';
import {sparklePath} from './shapes';
import {WorldSvg} from './WorldSvg';

// Code-drawn space pieces in the flat outlined style: a Sun with rays, a little Earth, and a Milky Way band whose
// crowd of stars can pop in. All in the units of the layer / DesignSpace they sit in.

const INK = '#15151C';

/** Cartoon Sun: flat yellow disc, orange shade, slowly turning triangle rays (put an ObjectFace on top for a face). */
export const Sun: React.FC<{t: number; x: number; y: number; r: number; pulse?: number; ink?: number}> = ({t, x, y, r, pulse = 1, ink}) => {
  const k = ink ?? Math.max(2, r * 0.05);
  const n = 12;
  const rot = 8 * t;
  const rays = Array.from({length: n}, (_, i) => {
    const a = ((i / n) * 360 + rot) * (Math.PI / 180);
    const w = (Math.PI / n) * 0.55;
    const r0 = r * 1.08;
    const r1 = r * (i % 2 ? 1.38 : 1.52);
    const p = (ang: number, rr: number) => `${x + rr * Math.cos(ang)},${y + rr * Math.sin(ang)}`;
    return `M${p(a - w, r0)} L${p(a, r1)} L${p(a + w, r0)} Z`;
  });
  const R = r * 1.6;
  return (
    <WorldSvg box={[x - R, y - R, x + R, y + R]}>
      <g transform={`translate(${x} ${y}) scale(${pulse}) translate(${-x} ${-y})`}>
        {rays.map((d, i) => (
          <path key={i} d={d} fill="#FFB43B" stroke={INK} strokeWidth={k} strokeLinejoin="round" />
        ))}
        <circle cx={x} cy={y} r={r} fill="#FFD54A" stroke={INK} strokeWidth={k} />
        <path d={`M${x + r * 0.15},${y + r * 0.97} A${r},${r} 0 0,0 ${x + r * 0.97},${y + r * 0.2} A${r * 1.05},${r * 1.05} 0 0,1 ${x + r * 0.15},${y + r * 0.97}Z`} fill="#FFC23A" />
      </g>
    </WorldSvg>
  );
};

/** Little Earth: blue disc with two green continents and an outline. */
export const Earth: React.FC<{x: number; y: number; r: number; pulse?: number; ink?: number}> = ({x, y, r, pulse = 1, ink}) => {
  const k = ink ?? Math.max(1.5, r * 0.09);
  const R = r * 1.3;
  return (
    <WorldSvg box={[x - R, y - R, x + R, y + R]}>
      <g transform={`translate(${x} ${y}) scale(${pulse})`}>
        <clipPath id={`earth${Math.round(x)}${Math.round(y)}`}>
          <circle r={r} />
        </clipPath>
        <circle r={r} fill="#4FA3E8" />
        <g clipPath={`url(#earth${Math.round(x)}${Math.round(y)})`}>
          <path d={`M${-r * 0.7},${-r * 0.5} q${r * 0.4},${-r * 0.35} ${r * 0.75},${-r * 0.05} q${r * 0.1},${r * 0.45} ${-r * 0.25},${r * 0.55} q${-r * 0.45},${r * 0.1} ${-r * 0.5},${-r * 0.5}Z`} fill="#6CC56A" />
          <path d={`M${r * 0.15},${r * 0.2} q${r * 0.5},${-r * 0.2} ${r * 0.8},${r * 0.2} q${-r * 0.1},${r * 0.55} ${-r * 0.55},${r * 0.55} q${-r * 0.35},${-r * 0.25} ${-r * 0.25},${-r * 0.75}Z`} fill="#6CC56A" />
          <path d={`M${r * 0.2},${r * 0.98} A${r},${r} 0 0,0 ${r * 0.98},${r * 0.2} A${r * 1.1},${r * 1.1} 0 0,1 ${r * 0.2},${r * 0.98}Z`} fill="rgba(20, 40, 90, 0.25)" />
        </g>
        <circle r={r} fill="none" stroke={INK} strokeWidth={k} />
      </g>
    </WorldSvg>
  );
};

export type Band = {x0: number; y0: number; x1: number; y1: number; w: number}; // centre line + half width

/** Star positions crowded into a band (gaussian across it) plus a few outside; seeded, stable. */
export const bandStars = (b: Band, n: number, seed = 1) =>
  Array.from({length: n}, (_, i) => {
    const u = rand(seed * 1000 + i * 3);
    // sum of uniforms ~ gaussian across the band
    const g = (rand(seed * 1000 + i * 3 + 1) + rand(seed * 1000 + i * 3 + 2) + rand(seed * 1000 + i * 5 + 7) - 1.5) / 1.5;
    const dx = b.x1 - b.x0;
    const dy = b.y1 - b.y0;
    const L = Math.hypot(dx, dy);
    const nx = -dy / L;
    const ny = dx / L;
    return {
      x: b.x0 + dx * u + nx * g * b.w * 1.4,
      y: b.y0 + dy * u + ny * g * b.w * 1.4,
      size: 2.2 + rand(seed * 77 + i) * 5,
      phase: rand(seed * 91 + i) * 6.28,
      order: rand(seed * 53 + i), // pop-in order along the reveal
    };
  });

/** Milky Way: three soft flat bands (no outline) that widen in, then a crowd of stars popping in one by one. */
export const MilkyWay: React.FC<{
  t: number;
  band: Band;
  bandIn: readonly [number, number]; // band widens in over this window
  starsIn: readonly [number, number]; // crowd pops in over this window
  count?: number;
  box: readonly [number, number, number, number];
}> = ({t, band, bandIn, starsIn, count = 420, box}) => {
  const bw = easeOutBack(clamp01((t - bandIn[0]) / (bandIn[1] - bandIn[0])), 1.2);
  const stars = React.useMemo(() => bandStars(band, count, 3), [band, count]);
  if (bw <= 0) return null;
  const {x0, y0, x1, y1, w} = band;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const L = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const wavy = (half: number, seed: number) => {
    // a band with gently wavy edges, built along the x axis then rotated into place
    const pts: string[] = [];
    const N = 24;
    for (let i = 0; i <= N; i++) pts.push(`${(i / N) * L},${-half * (1 + 0.18 * Math.sin(i * 1.3 + seed))}`);
    for (let i = N; i >= 0; i--) pts.push(`${(i / N) * L},${half * (1 + 0.18 * Math.sin(i * 1.7 + seed * 2))}`);
    return `M${pts.join('L')}Z`;
  };
  return (
    <WorldSvg box={box}>
      <g transform={`translate(${x0} ${y0}) rotate(${ang}) scale(1 ${bw})`}>
        <path d={wavy(w * 1.15, 1)} fill="#4A4B97" opacity={0.55} />
        <path d={wavy(w * 0.75, 2)} fill="#6A68B5" opacity={0.55} />
        <path d={wavy(w * 0.35, 3)} fill="#9C97D6" opacity={0.45} />
      </g>
      {stars.map((s, i) => {
        const at = starsIn[0] + s.order * (starsIn[1] - starsIn[0]);
        const p = easeOutBack(clamp01((t - at) / 0.18), 2.5);
        if (p <= 0) return null;
        const tw = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.7 * t + s.phase);
        return s.size > 6.2 ? (
          <path key={i} d={sparklePath(s.x, s.y, s.size * 1.5 * p)} fill="#FFF6D8" opacity={tw} />
        ) : (
          <circle key={i} cx={s.x} cy={s.y} r={(s.size / 2.4) * p} fill="#FFF6D8" opacity={tw} />
        );
      })}
    </WorldSvg>
  );
};
