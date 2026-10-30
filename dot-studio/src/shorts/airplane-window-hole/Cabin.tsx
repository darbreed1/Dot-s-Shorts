import React from 'react';
import {clamp01, easeInOutCubic, popScale, progress, rand} from '../../kit/anim';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {T} from './beats';

// The cabin wall with the window (all code): overhead bin, wall panel, the window bezel with the shade pulled up,
// sky and drifting clouds behind the glass, the tiny hole near the bottom, and the fog that clears through it.
const INK = '#15151C';
export const WIN = {x: 770, y: 1090, w: 300, h: 430}; // the glass (world, wall layer)
export const HOLE = {x: WIN.x, y: WIN.y + WIN.h / 2 - 48, r: 7};

const glassPath = (cx: number, cy: number, w: number, h: number) => {
  const r = w / 2;
  return `M${cx - r},${cy - h / 2 + r} A${r},${r} 0 0,1 ${cx + r},${cy - h / 2 + r} L${cx + r},${cy + h / 2 - r} A${r},${r} 0 0,1 ${cx - r},${cy + h / 2 - r} Z`;
};

const Cloud: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[[-50, 8, 34], [-14, -12, 44], [30, -2, 38], [62, 12, 26]].map(([cx, cy, r], i) => (
      <circle key={`i${i}`} cx={cx} cy={cy} r={r + 5} fill={INK} />
    ))}
    {[[-50, 8, 34], [-14, -12, 44], [30, -2, 38], [62, 12, 26]].map(([cx, cy, r], i) => (
      <circle key={`f${i}`} cx={cx} cy={cy} r={r} fill="#FFFFFF" />
    ))}
    <rect x={-84} y={8} width={172} height={36} fill="#FFFFFF" />
    <line x1={-84} y1={44} x2={88} y2={44} stroke={INK} strokeWidth={5} />
  </g>
);

export const CabinWall: React.FC<{t: number}> = ({t}) => {
  const g = glassPath(WIN.x, WIN.y, WIN.w, WIN.h);
  const bezel = glassPath(WIN.x, WIN.y, WIN.w + 90, WIN.h + 90);
  // clouds drift backwards (the plane flies right)
  const drift = (i: number) => ((((t * 60 + i * 230) % 690) + 690) % 690) - 345;
  // fog: blooms on "moisture", then shrinks away toward the hole as it vents out
  const fogIn = easeInOutCubic(progress(t, T.moisture - 0.25, T.moisture + 0.35));
  const fogOut = easeInOutCubic(progress(t, T.out + 0.2, T.fog + 0.45));
  const fog = fogIn * (1 - fogOut);
  const holeGlow = popScale(t, T.hole - 0.05, 4.5, 0.3, 0.3);
  return (
    <WorldSvg box={[-900, 0, 2100, 2000]}>
      <defs>
        <clipPath id="glass">
          <path d={g} />
        </clipPath>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3E7FD6" />
          <stop offset="100%" stopColor="#A8D8F7" />
        </linearGradient>
      </defs>
      {/* wall, dado, floor */}
      <rect x={-900} y={0} width={3000} height={2000} fill="#EFE8DA" />
      <rect x={-900} y={1500} width={3000} height={300} fill="#DCD3C2" stroke={INK} strokeWidth={6} />
      <rect x={-900} y={1785} width={3000} height={215} fill="#4E5E8C" stroke={INK} strokeWidth={8} />
      {/* overhead bin */}
      <path d="M-900,0 L2100,0 L2100,380 Q600,470 -900,380 Z" fill="#F8F5EE" stroke={INK} strokeWidth={10} />
      <path d="M-900,330 Q600,420 2100,330" fill="none" stroke="#D9D2C4" strokeWidth={8} />
      {/* window bezel, the shade pulled up, the glass */}
      <path d={bezel} fill="#E4DED2" stroke={INK} strokeWidth={10} />
      <path d={glassPath(WIN.x, WIN.y, WIN.w + 40, WIN.h + 40)} fill="#CFC8BA" />
      <g clipPath="url(#glass)">
        <rect x={WIN.x - WIN.w} y={WIN.y - WIN.h} width={WIN.w * 2} height={WIN.h * 2} fill="url(#sky)" />
        {[0, 1, 2].map((i) => (
          <Cloud key={i} x={WIN.x - drift(i)} y={WIN.y - 60 + i * 110 + 20 * rand(i)} s={0.75 + 0.2 * i} />
        ))}
        <rect x={WIN.x - WIN.w} y={WIN.y - WIN.h / 2 - 10} width={WIN.w * 2} height={70} fill="#F2EEE6" stroke={INK} strokeWidth={6} />
        {/* glare */}
        <path d={`M${WIN.x - 90},${WIN.y + 160} L${WIN.x + 40},${WIN.y - 150} L${WIN.x + 80},${WIN.y - 150} L${WIN.x - 50},${WIN.y + 160} Z`} fill="#FFFFFF" opacity={0.22} />
        {/* fog on the glass, venting toward the hole */}
        {fog > 0.01
          ? Array.from({length: 14}, (_, i) => {
              const a = rand(i * 3 + 1) * Math.PI * 2;
              const d = Math.sqrt(rand(i * 3 + 2)) * 150;
              const px = WIN.x + Math.cos(a) * d * 0.9;
              const py = WIN.y + 20 + Math.sin(a) * d * 1.3;
              const toHole = fogOut;
              const x = px + (HOLE.x - px) * toHole;
              const y = py + (HOLE.y - py) * toHole;
              return <circle key={i} cx={x} cy={y} r={(55 + 30 * rand(i * 7)) * fogIn * (1 - toHole * 0.9)} fill="#FFFFFF" opacity={0.55 * fog + 0.1 * fogIn * (1 - toHole)} />;
            })
          : null}
        {/* a few droplets streaking out through the hole */}
        {t > T.out && t < T.fog + 0.5
          ? Array.from({length: 7}, (_, i) => {
              const u = clamp01((t - (T.out + i * 0.17)) / 0.6);
              if (u <= 0 || u >= 1) return null;
              const sx = WIN.x + (rand(i + 40) - 0.5) * 200;
              const sy = WIN.y + (rand(i + 50) - 0.5) * 200;
              return <circle key={`d${i}`} cx={sx + (HOLE.x - sx) * u} cy={sy + (HOLE.y - sy) * u} r={7 * (1 - u * 0.7)} fill="#BFE6FF" stroke={INK} strokeWidth={2.5} />;
            })
          : null}
      </g>
      <path d={g} fill="none" stroke={INK} strokeWidth={8} />
      {/* the tiny hole */}
      {holeGlow > 0 ? <circle cx={HOLE.x} cy={HOLE.y} r={HOLE.r * (2.6 + 0.6 * Math.sin(2 * Math.PI * 2 * t))} fill="#FFE27A" opacity={0.55 * Math.min(1, holeGlow)} /> : null}
      <circle cx={HOLE.x} cy={HOLE.y} r={HOLE.r} fill="#3A3A44" stroke="#FFFFFF" strokeWidth={2.5} />
    </WorldSvg>
  );
};
