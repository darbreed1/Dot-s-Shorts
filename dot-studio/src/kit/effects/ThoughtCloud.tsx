import React from 'react';
import {popScale} from '../anim';
import {WorldSvg} from './WorldSvg';

// Thought / dream cloud: bumpy circles with ONE merged outline (all ink circles first, then all fill circles),
// a trail of small bubbles toward the thinker, pop-in with overshoot, shrink-out. Content goes in `children`
// as SVG drawn around (0, 0) = the cloud centre.

export const ThoughtCloud: React.FC<{
  t: number;
  t0: number;
  t1: number;
  x: number;
  y: number;
  w: number;
  h: number;
  from: {x: number; y: number}; // where the trail starts (the thinker's head)
  ink?: number;
  fill?: string;
  wobble?: number;
  children?: React.ReactNode;
}> = ({t, t0, t1, x, y, w, h, from, ink = 7, fill = '#F6F3FF', wobble = 0.02, children}) => {
  const n = 9;
  const bumps = Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return {x: Math.cos(a) * w * 0.36, y: Math.sin(a) * h * 0.3, r: h * (0.3 + 0.05 * Math.sin(i * 2.3))};
  });
  const core = {rx: w * 0.4, ry: h * 0.36};
  // trail: three bubbles popping in one after another, before the cloud
  const trail = [0.22, 0.42, 0.62].map((f, i) => ({
    x: from.x + (x - from.x) * f,
    y: from.y + (y - from.y) * f,
    r: h * (0.05 + 0.03 * i),
    s: popScale(t, t0 + i * 0.07, t1 - (2 - i) * 0.05, 0.2, 0.18),
  }));
  const s = popScale(t, t0 + 0.2, t1);
  const wob = 1 + wobble * Math.sin(2 * Math.PI * 1.1 * t);
  if (s <= 0 && trail.every((b) => b.s <= 0)) return null;
  const box = [
    Math.min(x - w, from.x - 60),
    Math.min(y - h, from.y - 60),
    Math.max(x + w, from.x + 60),
    Math.max(y + h, from.y + 60),
  ] as const;
  return (
    <WorldSvg box={box}>
      {trail.map((b, i) =>
        b.s > 0 ? (
          <circle key={i} cx={b.x} cy={b.y} r={b.r * b.s} fill={fill} stroke="#15151C" strokeWidth={ink} />
        ) : null,
      )}
      {s > 0 ? (
        <g transform={`translate(${x} ${y}) scale(${s * wob} ${s / wob})`}>
          {bumps.map((b, i) => (
            <circle key={`i${i}`} cx={b.x} cy={b.y} r={b.r + ink} fill="#15151C" />
          ))}
          <ellipse rx={core.rx + ink} ry={core.ry + ink} fill="#15151C" />
          {bumps.map((b, i) => (
            <circle key={`f${i}`} cx={b.x} cy={b.y} r={b.r} fill={fill} />
          ))}
          <ellipse rx={core.rx} ry={core.ry} fill={fill} />
          {children}
        </g>
      ) : null}
    </WorldSvg>
  );
};
