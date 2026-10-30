import React from 'react';
import {clamp01, easeInOutCubic, popScale} from '../anim';
import {dropPath} from './shapes';
import {WorldSvg} from './WorldSvg';

// Small reusable cartoon effects, all drawn in world units of the layer they sit in.

/** Light-blue sweat drop with an outline and a glint: pops on, slides down along `slide`, pops off. */
export const SweatDrop: React.FC<{t: number; t0: number; t1: number; x: number; y: number; r?: number; slide?: number; ink?: number}> = ({
  t, t0, t1, x, y, r = 16, slide = 40, ink = 5,
}) => {
  const s = popScale(t, t0, t1, 0.22, 0.18);
  if (s <= 0) return null;
  const dy = slide * easeInOutCubic(clamp01((t - t0) / (t1 - t0)));
  return (
    <WorldSvg box={[x - r * 3, y - r * 3, x + r * 3, y + slide + r * 3]}>
      <g transform={`translate(${x} ${y + dy}) scale(${s})`}>
        <path d={dropPath(0, 0, r)} fill="#9BD6FF" stroke="#15151C" strokeWidth={ink} strokeLinejoin="round" />
        <ellipse cx={-r * 0.35} cy={-r * 0.25} rx={r * 0.18} ry={r * 0.3} fill="#FFFFFF" />
      </g>
    </WorldSvg>
  );
};

/** Soft radial glow (e.g. the antenna ball on an "aha"), pulsing while on. */
export const Glow: React.FC<{t: number; t0: number; t1: number; x: number; y: number; r: number; color?: string; strength?: number}> = ({
  t, t0, t1, x, y, r, color = '255, 120, 100', strength = 0.55,
}) => {
  const on = popScale(t, t0, t1, 0.2, 0.3);
  if (on <= 0) return null;
  const pulse = 0.8 + 0.2 * Math.sin(2 * Math.PI * 2.2 * (t - t0));
  const rr = r * (0.9 + 0.15 * pulse) * Math.min(on, 1);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - rr,
        top: y - rr,
        width: rr * 2,
        height: rr * 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${color}, ${strength * pulse}) 0%, rgba(${color}, ${strength * 0.35 * pulse}) 40%, rgba(${color}, 0) 70%)`,
      }}
    />
  );
};

/** A four-point glint (shiny blade, idea, clean surface): pops on with a spin, shrinks away. */
export const Glint: React.FC<{t: number; t0: number; x: number; y: number; r: number; dur?: number; ink?: number}> = ({
  t, t0, x, y, r, dur = 0.55, ink = 5,
}) => {
  const s = popScale(t, t0, t0 + dur, 0.14, 0.22);
  if (s <= 0) return null;
  const rot = 40 * (t - t0) / dur;
  const q = 0.2;
  const d = `M0,-1 Q${q},${-q} 1,0 Q${q},${q} 0,1 Q${-q},${q} -1,0 Q${-q},${-q} 0,-1Z`;
  return (
    <WorldSvg box={[x - r * 1.5, y - r * 1.5, x + r * 1.5, y + r * 1.5]}>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r * s})`}>
        <path d={d} fill="#FFFFFF" stroke="#15151C" strokeWidth={ink / (r * s)} strokeLinejoin="round" />
        <path d={d} transform="rotate(45) scale(0.5)" fill="#FFF3B0" stroke="#15151C" strokeWidth={ink / (r * s * 0.5)} strokeLinejoin="round" />
      </g>
    </WorldSvg>
  );
};

/** Jagged "sting" zigzags radiating around a point (eyes stinging, a zap), flashing on each trigger. */
export const StingMarks: React.FC<{t: number; times: readonly number[]; x: number; y: number; r: number; len?: number; ink?: number; angles?: readonly number[]}> = ({
  t, times, x, y, r, len = 46, ink = 6, angles = [-160, -120, -60, -20],
}) => {
  const live = times.map((t0) => popScale(t, t0, t0 + 0.5, 0.08, 0.18)).reduce((a, b) => Math.max(a, b), 0);
  if (live <= 0) return null;
  const m = r + len + ink * 2;
  return (
    <WorldSvg box={[x - m, y - m, x + m, y + m]}>
      {angles.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const ux = Math.cos(a), uy = Math.sin(a);
        const nx = -uy, ny = ux;
        const L = len * live;
        const pts = [0, 0.33, 0.66, 1].map((f, j) => {
          const off = (j % 2 === 0 ? -1 : 1) * len * 0.14 * (j === 0 || j === 3 ? 0 : 1);
          return `${x + ux * (r + f * L) + nx * off},${y + uy * (r + f * L) + ny * off}`;
        });
        return <polyline key={i} points={pts.join(' ')} fill="none" stroke="#15151C" strokeWidth={ink} strokeLinecap="round" strokeLinejoin="round" />;
      })}
    </WorldSvg>
  );
};

/** Short motion ticks around a point that flash on each trigger (twitches, jolts). */
export const MotionTicks: React.FC<{t: number; times: readonly number[]; x: number; y: number; r: number; len?: number; ink?: number; angles?: readonly number[]}> = ({
  t, times, x, y, r, len = 30, ink = 7, angles = [-150, -120, -60, -30],
}) => {
  const live = times.map((t0) => popScale(t, t0, t0 + 0.32, 0.08, 0.14)).reduce((a, b) => Math.max(a, b), 0);
  if (live <= 0) return null;
  const m = r + len + ink;
  return (
    <WorldSvg box={[x - m, y - m, x + m, y + m]}>
      {angles.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const r0 = r;
        const r1 = r + len * live;
        return (
          <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1}
            stroke="#15151C" strokeWidth={ink} strokeLinecap="round" />
        );
      })}
    </WorldSvg>
  );
};
