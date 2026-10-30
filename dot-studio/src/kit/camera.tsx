import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {clamp01, easeInOutCubic, easeOutCubic, lerp} from './anim';

// 2.5D multiplane camera. A layer at depth Z is drawn at scale k = F / (Z - cam.z).
// World units: at cam (W/2, H/2, 0) a layer at Z 1000 shows 1 world px as 1 screen px.
export const F = 1000;
export const REF_Z = 1000;

export type Cam = {x: number; y: number; z: number};
export type Ease = 'inOut' | 'out' | 'linear';
/** One camera move: from `a` at t0 to `b` at t1. t0 === t1 is a hard cut. Between moves the camera holds. */
export type Move = {t0: number; t1: number; a: Cam; b: Cam; ease?: Ease};

const ease = (e: Ease | undefined, u: number) => (e === 'out' ? easeOutCubic(u) : e === 'linear' ? u : easeInOutCubic(u));

export function camAt(moves: readonly Move[], t: number): Cam {
  let m = moves[0];
  for (const mv of moves) if (mv.t0 <= t) m = mv;
  if (t < m.t0) return m.a;
  if (t >= m.t1) return m.b;
  const u = ease(m.ease, clamp01((t - m.t0) / (m.t1 - m.t0)));
  // zoom evenly: interpolate the reference layer's scale in log space
  const ka = F / (REF_Z - m.a.z);
  const kb = F / (REF_Z - m.b.z);
  const k = Math.exp(lerp(Math.log(ka), Math.log(kb), u));
  return {x: lerp(m.a.x, m.b.x, u), y: lerp(m.a.y, m.b.y, u), z: REF_Z - F / k};
}

/** Screen shake as a sum of sines times an amplitude (never random per-frame jumps). */
export const shake = (t: number, amp: number) => ({
  x: amp * (0.6 * Math.sin(2 * Math.PI * 13.3 * t) + 0.4 * Math.sin(2 * Math.PI * 7.1 * t + 1.3)),
  y: amp * (0.6 * Math.sin(2 * Math.PI * 11.7 * t + 0.7) + 0.4 * Math.sin(2 * Math.PI * 5.3 * t + 2.1)),
});

export const Layer: React.FC<{
  cam: Cam;
  z: number;
  blur?: number;
  minDepth?: number;
  children: React.ReactNode;
}> = ({cam, z, blur = 0, minDepth = 300, children}) => {
  const {width, height} = useVideoConfig();
  const d = z - cam.z;
  if (d < minDepth) return null; // layer is (almost) behind the camera
  const k = F / d;
  return (
    <AbsoluteFill style={{filter: blur > 0.05 ? `blur(${blur}px)` : undefined}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transformOrigin: '0 0',
          transform: `translate(${width / 2}px, ${height / 2}px) scale(${k}) translate(${-cam.x}px, ${-cam.y}px)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** World point on a layer at depth z -> screen point (for placing screen-space things next to world things). */
export const toScreen = (cam: Cam, z: number, x: number, y: number, width: number, height: number) => {
  const k = F / (z - cam.z);
  return {x: width / 2 + k * (x - cam.x), y: height / 2 + k * (y - cam.y), k};
};
