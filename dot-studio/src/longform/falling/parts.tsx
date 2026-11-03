import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeOutBack, lerp, rand} from '../../kit/anim';
import {Dot, DotSprite, Swap} from '../../kit/Dot';
import {Label} from '../../kit/Label';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {useBleedBox} from '../../kit/Stage';
import {SECTIONS, WORDS} from './timeline';
import {S} from './sprites';

// Building blocks for "What actually happens when you fall". Every scene is drawn on the kit Stage (a 1080x1080 safe
// square; backgrounds bleed far past it so 16:9 and 9:16 framings are both filled). Keep the focal action above
// y ~860 so the 16:9 captions (84 % of the height) never cover it.
export const INK = '#15151C';
export const GOLD = '#F2C14E';
export const RED = '#E8483F';
export const BLUE = '#5AA9E6';

// ------------------------------------------------------------------------------------------------ cues
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, '');
const TOK = WORDS.map((w) => ({...w, k: norm(w.w)}));
/** Start time of the nth occurrence of `phrase` inside section n (1-based). Throws if the voice never says it. */
export const cue = (n: number, phrase: string, nth = 1) => {
  const sec = SECTIONS[n - 1];
  const want = phrase.split(/\s+/).map(norm).filter(Boolean);
  let seen = 0;
  for (let i = 0; i < TOK.length; i++) {
    if (TOK[i].s < sec.at - 0.05 || TOK[i].s > sec.at + sec.dur + 0.05) continue;
    if (want.every((x, j) => TOK[i + j] && TOK[i + j].k === x) && ++seen === nth) return TOK[i].s;
  }
  throw new Error(`cue not found in section ${n}: "${phrase}"`);
};
export const secStart = (n: number) => SECTIONS[n - 1].at;
export const secEnd = (n: number) => SECTIONS[n - 1].at + SECTIONS[n - 1].dur;

// ------------------------------------------------------------------------------------------------ sprites
type CSprite = {src: string; w: number; h: number; centre: readonly number[]};
/** A cut-out centred at (x, y), `w` wide; rot in degrees; pop scales about the centre. */
export const Cutout: React.FC<{sp: CSprite; x: number; y: number; w: number; rot?: number; flip?: boolean; pop?: number; opacity?: number}> = ({
  sp, x, y, w, rot = 0, flip = false, pop = 1, opacity = 1,
}) => {
  if (pop <= 0.01 || opacity <= 0.01) return null;
  const s = w / sp.w;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity, transformOrigin: '0 0', transform: `rotate(${rot}deg) scale(${(flip ? -1 : 1) * pop}, ${pop})`}}>
      <Img src={staticFile(sp.src)} style={{position: 'absolute', left: -sp.centre[0] * s, top: -sp.centre[1] * s, width: sp.w * s, height: sp.h * s}} />
    </div>
  );
};

const dots = S as unknown as Record<string, DotSprite>;
/** Dot standing (kit rig: pose swaps, breathing), feet at (x, y) in stage px. */
export const DotRig: React.FC<{t: number; swaps: readonly Swap[]; x: number; y: number; headR?: number; bounces?: number[]; shadow?: boolean}> = ({
  t, swaps, x, y, headR = 66, bounces = [], shadow = true,
}) => <Dot t={t} sprites={dots} swaps={swaps} feet={{x, y}} headR={headR} bounces={bounces} shadow={shadow} />;

/** A chunky outlined label (kit Label) with the usual size. */
export const Tag: React.FC<{t: number; t0: number; t1?: number; x: number; y: number; size?: number; color?: string; children: React.ReactNode}> = ({
  t, t0, t1, x, y, size = 56, color = '#FFFFFF', children,
}) => (
  <Label t={t} t0={t0} t1={t1} x={x} y={y} size={size} color={color}>
    {children}
  </Label>
);

export const pop = (t: number, t0: number, k = 2.2) => easeOutBack(clamp01((t - t0) / 0.3), k);

// ------------------------------------------------------------------------------------------------ backdrops
// Backdrops cover exactly the visible part of stage space (useBleedBox), never a fixed huge bleed: a 1,500 px bleed
// made each layer rasterise at ~8,000 px square in 4K vertical renders and starved the renderer.

/** Daytime sky with drifting clouds; `rise` (px/s) scrolls the clouds upward to show falling. */
export const Sky: React.FC<{t: number; rise?: number; space?: number; ground?: number | null; dusk?: boolean}> = ({t, rise = 0, space = 0, ground = null, dusk = false}) => {
  const B = useBleedBox();
  return (
  <WorldSvg box={B}>
    <defs>
      <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={dusk ? '#2B3354' : '#5DB4EC'} />
        <stop offset="100%" stopColor={dusk ? '#7A6A86' : '#CDEBFA'} />
      </linearGradient>
    </defs>
    <rect x={B[0]} y={B[1]} width={B[2] - B[0]} height={B[3] - B[1]} fill="url(#skyG)" />
    <defs>
      <linearGradient id="spaceG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#101A3A" stopOpacity={1} />
        <stop offset={`${(-B[1] + 200) / (-B[1] + 700)}`} stopColor="#101A3A" stopOpacity={1} />
        <stop offset="100%" stopColor="#101A3A" stopOpacity={0} />
      </linearGradient>
    </defs>
    {space > 0 ? <rect x={B[0]} y={B[1]} width={B[2] - B[0]} height={-B[1] + 700} fill="url(#spaceG)" opacity={space} /> : null}
    {Array.from({length: 14}, (_, i) => {
      const span = 1080 + 2 * 700;
      const x = -700 + ((rand(i + 2) * span + t * (8 + 10 * rand(i))) % span);
      const y = -700 + ((((rand(i + 5) * 2480 - t * rise * (0.7 + 0.6 * rand(i + 9))) % 2480) + 2480) % 2480);
      const s = 0.6 + 0.9 * rand(i + 11);
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity={dusk ? 0.35 : 1}>
          {[[-50, 8, 34], [-14, -12, 44], [30, -2, 38], [62, 12, 26]].map(([cx, cy, r], k) => (
            <circle key={`i${k}`} cx={cx} cy={cy} r={r + 5} fill={INK} />
          ))}
          {[[-50, 8, 34], [-14, -12, 44], [30, -2, 38], [62, 12, 26]].map(([cx, cy, r], k) => (
            <circle key={`f${k}`} cx={cx} cy={cy} r={r} fill="#FFFFFF" />
          ))}
          <rect x={-84} y={8} width={172} height={36} fill="#FFFFFF" />
          <line x1={-84} y1={44} x2={88} y2={44} stroke={INK} strokeWidth={5} />
        </g>
      );
    })}
    {ground !== null ? (
      <>
        <rect x={B[0]} y={ground} width={B[2] - B[0]} height={B[3] - ground} fill={dusk ? '#3E4A3A' : '#7FBF6A'} />
        <line x1={B[0]} y1={ground} x2={B[2]} y2={ground} stroke={INK} strokeWidth={8} />
      </>
    ) : null}
  </WorldSvg>
  );
};

/** Deep space with twinkling stars. */
export const Space: React.FC<{t: number}> = ({t}) => {
  const B = useBleedBox();
  return (
  <WorldSvg box={B}>
    <rect x={B[0]} y={B[1]} width={B[2] - B[0]} height={B[3] - B[1]} fill="#101A3A" />
    {Array.from({length: 140}, (_, i) => (
      <circle key={i} cx={B[0] + rand(i + 1) * (B[2] - B[0])} cy={B[1] + rand(i + 7) * (B[3] - B[1])} r={1.5 + 2.5 * rand(i + 3)} fill="#F4F1E4"
        opacity={0.45 + 0.4 * Math.sin(2 * Math.PI * (0.2 + 0.3 * rand(i)) * t + i)} />
    ))}
  </WorldSvg>
  );
};

/** Plain warm backdrop for diagram shots. */
export const Paper: React.FC<{color?: string}> = ({color = '#F6EBD6'}) => {
  const B = useBleedBox();
  return (
    <WorldSvg box={B}>
      <rect x={B[0]} y={B[1]} width={B[2] - B[0]} height={B[3] - B[1]} fill={color} />
    </WorldSvg>
  );
};

/** A huge Earth whose top arc shows at the bottom of the frame, drawn only over the visible box. */
export const BigEarth: React.FC<{cx: number; cy: number; r: number}> = ({cx, cy, r}) => {
  const B = useBleedBox();
  return (
    <WorldSvg box={B}>
      <circle cx={cx} cy={cy} r={r} fill="#4FA3E8" stroke={INK} strokeWidth={14} />
      <ellipse cx={cx - r * 0.3} cy={cy - r * 0.86} rx={r * 0.28} ry={r * 0.1} fill="#6CC56A" />
      <ellipse cx={cx + r * 0.42} cy={cy - r * 0.8} rx={r * 0.2} ry={r * 0.09} fill="#6CC56A" />
    </WorldSvg>
  );
};

/** Rounded card (panel) in stage px. */
export const Card: React.FC<{x: number; y: number; w: number; h: number; s?: number; fill?: string; children?: React.ReactNode}> = ({x, y, w, h, s = 1, fill = '#FFFDF6', children}) => {
  if (s <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x + w / 2, top: y + h / 2, transform: `scale(${s})`}}>
      <div style={{position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, borderRadius: 28, background: fill, border: `8px solid ${INK}`, boxShadow: '10px 12px 0 rgba(21,21,28,0.18)', overflow: 'hidden'}}>
        {children}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------ drawn pieces
/** Speed gauge (0..maxKmh) with a needle; draws in its own svg at (x, y), radius r. */
export const Gauge: React.FC<{x: number; y: number; r: number; kmh: number; maxKmh?: number; band?: readonly [number, number]}> = ({x, y, r, kmh, maxKmh = 600, band}) => {
  const ang = (v: number) => Math.PI * (1 - clamp01(v / maxKmh)); // 180deg (left) .. 0deg (right)
  const pt = (v: number, rr: number) => `${x + rr * Math.cos(ang(v))},${y - rr * Math.sin(ang(v))}`;
  const arc = (v0: number, v1: number, rr: number) => `M${pt(v0, rr)} A${rr},${rr} 0 0,1 ${pt(v1, rr)}`;
  return (
    <WorldSvg box={[x - r - 20, y - r - 20, x + r + 20, y + 40]}>
      <path d={`M${x - r},${y} A${r},${r} 0 0,1 ${x + r},${y} Z`} fill="#FFFDF6" stroke={INK} strokeWidth={8} />
      {band ? <path d={arc(band[0], band[1], r * 0.82)} fill="none" stroke={GOLD} strokeWidth={r * 0.16} /> : null}
      {Array.from({length: 7}, (_, i) => {
        const v = (i / 6) * maxKmh;
        return <line key={i} x1={x + r * 0.92 * Math.cos(ang(v))} y1={y - r * 0.92 * Math.sin(ang(v))} x2={x + r * 0.74 * Math.cos(ang(v))} y2={y - r * 0.74 * Math.sin(ang(v))} stroke={INK} strokeWidth={6} />;
      })}
      <line x1={x} y1={y} x2={x + r * 0.78 * Math.cos(ang(kmh))} y2={y - r * 0.78 * Math.sin(ang(kmh))} stroke={RED} strokeWidth={10} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r * 0.09} fill={INK} />
    </WorldSvg>
  );
};

/**
 * A ram-air canopy seen from the front, centred at (x, y), w wide. `fill` 0..1 inflates it from a crumpled strip;
 * `cells` draws the cell walls. Lines run from its bottom edge to (lx, ly) if given.
 */
export const Canopy: React.FC<{x: number; y: number; w: number; fill?: number; color?: string; tilt?: number; lines?: {x: number; y: number}; twist?: boolean}> = ({
  x, y, w, fill = 1, color = '#E8483F', tilt = 0, lines, twist = false,
}) => {
  const f = clamp01(fill);
  const h = w * lerp(0.08, 0.3, f);
  const ww = w * lerp(0.35, 1, f);
  const n = 7;
  const top = `M${-ww / 2},0 Q0,${-h * 1.15} ${ww / 2},0`;
  const body = `${top} L${ww / 2},${h * 0.35} Q0,${-h * 0.55} ${-ww / 2},${h * 0.35} Z`;
  return (
    <WorldSvg box={[Math.min(x - w, lines ? lines.x - 40 : x), y - w, Math.max(x + w, lines ? lines.x + 40 : x), Math.max(y + w * 0.4, lines ? lines.y + 20 : y)]}>
      {lines
        ? Array.from({length: 6}, (_, i) => {
            const sx = x + (i - 2.5) * (ww / 6.2);
            const mid = twist ? `Q${lines.x + (i % 2 ? 40 : -40)},${(y + lines.y) / 2} ` : `Q${(sx + lines.x) / 2},${(y + lines.y) / 2} `;
            return <path key={i} d={`M${sx},${y + h * 0.3} ${mid}${lines.x + (i < 3 ? -14 : 14)},${lines.y}`} fill="none" stroke="#4A4F58" strokeWidth={3} />;
          })
        : null}
      {twist && lines ? <path d={`M${lines.x - 18},${(y + lines.y) / 2 + 30} l36,-14 m-36,30 l36,-14 m-36,30 l36,-14`} stroke={INK} strokeWidth={5} /> : null}
      <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
        <path d={body} fill={color} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        {f > 0.5
          ? Array.from({length: n - 1}, (_, i) => {
              const cx = -ww / 2 + ((i + 1) / n) * ww;
              const yTop = -h * 1.15 * (1 - Math.pow((2 * cx) / ww, 2)) * 0.5;
              return <line key={i} x1={cx} y1={yTop + 6} x2={cx} y2={h * 0.2} stroke={INK} strokeWidth={4} opacity={0.6} />;
            })
          : null}
      </g>
    </WorldSvg>
  );
};

/** Straight outlined arrow from (x0, y0) to (x1, y1). */
export const Arrow: React.FC<{x0: number; y0: number; x1: number; y1: number; color: string; w?: number}> = ({x0, y0, x1, y1, color, w = 16}) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  if (len < 4) return null;
  const ux = (x1 - x0) / len;
  const uy = (y1 - y0) / len;
  const hx = x1 - ux * w * 2.2;
  const hy = y1 - uy * w * 2.2;
  const px = -uy * w * 1.6;
  const py = ux * w * 1.6;
  const d = `M${x0},${y0} L${hx},${hy}`;
  const head = `M${x1},${y1} L${hx + px},${hy + py} L${hx - px},${hy - py} Z`;
  const pad = w * 3;
  return (
    <WorldSvg box={[Math.min(x0, x1) - pad, Math.min(y0, y1) - pad, Math.max(x0, x1) + pad, Math.max(y0, y1) + pad]}>
      <path d={d} stroke={INK} strokeWidth={w + 8} strokeLinecap="round" />
      <path d={head} fill={INK} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d={d} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={head} fill={color} />
    </WorldSvg>
  );
};

/** Wind streaks flowing up past a falling body (screen-space lines that loop). */
export const Streaks: React.FC<{t: number; x: number; w: number; speed?: number; n?: number}> = ({t, x, w, speed = 900, n = 14}) => {
  const B = useBleedBox();
  return (
  <WorldSvg box={[x - w, B[1], x + w, B[3]]}>
    {Array.from({length: n}, (_, i) => {
      const sx = x + (rand(i + 1) - 0.5) * w * 1.6;
      const len = 60 + 80 * rand(i + 4);
      const y = 1300 - ((t * speed * (0.6 + 0.6 * rand(i + 7)) + rand(i) * 1800) % 1800);
      return <line key={i} x1={sx} y1={y} x2={sx} y2={y + len} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />;
    })}
  </WorldSvg>
);
};
