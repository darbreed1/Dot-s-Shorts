import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {rand} from '../anim';
import {sparklePath} from './shapes';

// Screen-space night sky: gradient, twinkling stars and a moon on one "wheel" that can spin to show time passing.
// The sky is infinitely far, so it does not move with the camera.

export const NightSky: React.FC<{
  t: number;
  wheelDeg?: number; // rotation of stars + moon around the wheel centre
  moon?: {x: number; y: number; r: number}; // screen position at wheelDeg 0 (in a 1080x1920 frame)
  top?: string;
  bottom?: string;
  count?: number;
}> = ({t, wheelDeg = 0, moon = {x: 200, y: 270, r: 62}, top = '#141B45', bottom = '#3B3F86', count = 80}) => {
  const {width, height} = useVideoConfig();
  const sx = width / 1080;
  const sy = height / 1920;
  const cx = width / 2;
  const cy = height * 0.55;
  const R = Math.hypot(width, height);
  const stars = Array.from({length: count}, (_, i) => {
    const a = rand(i * 3 + 1) * Math.PI * 2;
    const r = Math.sqrt(rand(i * 3 + 2)) * R;
    const size = 3 + rand(i * 3 + 3) * 8;
    const tw = 0.55 + 0.45 * Math.sin(2 * Math.PI * (0.3 + rand(i + 77) * 0.5) * t + i);
    return {x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), size, tw, sparkle: size > 8.5};
  });
  const mx = moon.x * sx;
  const my = moon.y * sy;
  const mr = moon.r * Math.min(sx, sy);
  return (
    <AbsoluteFill style={{background: `linear-gradient(${top}, ${bottom})`}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="moonGlow">
            <stop offset="0%" stopColor="#FFF4C8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#FFF4C8" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g transform={`rotate(${wheelDeg} ${cx} ${cy})`}>
          {stars.map((s, i) =>
            s.sparkle ? (
              <path key={i} d={sparklePath(s.x, s.y, s.size * 1.4)} fill="#FFF6D8" opacity={s.tw} />
            ) : (
              <circle key={i} cx={s.x} cy={s.y} r={s.size / 2.6} fill="#FFF6D8" opacity={s.tw} />
            ),
          )}
          <circle cx={mx} cy={my} r={mr * 2.6} fill="url(#moonGlow)" />
          <circle cx={mx} cy={my} r={mr} fill="#FFF1C2" stroke="#15151C" strokeWidth={5} />
          <circle cx={mx - mr * 0.3} cy={my - mr * 0.2} r={mr * 0.2} fill="#F0DC9E" />
          <circle cx={mx + mr * 0.32} cy={my + mr * 0.28} r={mr * 0.13} fill="#F0DC9E" />
          <circle cx={mx + mr * 0.15} cy={my - mr * 0.45} r={mr * 0.09} fill="#F0DC9E" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
