import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeOutBack, rand} from '../../kit/anim';
import {Dot, DotSprite, Swap} from '../../kit/Dot';
import {Label} from '../../kit/Label';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {useBleedBox} from '../../kit/Stage';
import {SECTIONS, WORDS} from './timeline';
import {S} from './sprites';

// Building blocks for "How a computer actually works". Every scene is drawn on the kit Stage (a 1080x1080 safe
// square that fits 16:9 centred and 9:16 near the top); backgrounds cover exactly the visible box (useBleedBox).
// Keep focal action above stage y ~860 so the 16:9 captions never cover it.
export const INK = '#15151C';
export const GOLD = '#F2C14E';
export const RED = '#E8483F';
export const BLUE = '#5AA9E6';
export const ON = '#FFD84A';

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

export const pop = (t: number, t0: number, k = 2.2) => (t < t0 ? 0 : easeOutBack(clamp01((t - t0) / 0.3), k));

// ------------------------------------------------------------------------------------------------ sprites
type CSprite = {src: string; w: number; h: number; centre: readonly number[]};
/** A cut-out centred at (x, y), `w` wide; rot in degrees; pop scales about the centre. */
export const Cutout: React.FC<{sp: CSprite; x: number; y: number; w: number; rot?: number; flip?: boolean; pop?: number; opacity?: number}> = ({
  sp, x, y, w, rot = 0, flip = false, pop: p = 1, opacity = 1,
}) => {
  if (p <= 0.01 || opacity <= 0.01) return null;
  const s = w / sp.w;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity, transformOrigin: '0 0', transform: `rotate(${rot}deg) scale(${(flip ? -1 : 1) * p}, ${p})`}}>
      <Img src={staticFile(sp.src)} style={{position: 'absolute', left: -sp.centre[0] * s, top: -sp.centre[1] * s, width: sp.w * s, height: sp.h * s}} />
    </div>
  );
};

const dots = S as unknown as Record<string, DotSprite>;
/** Dot standing (kit rig: pose swaps, breathing), feet at (x, y) in stage px. */
export const DotRig: React.FC<{t: number; swaps: readonly Swap[]; x: number; y: number; headR?: number; bounces?: number[]; shadow?: boolean}> = ({
  t, swaps, x, y, headR = 64, bounces = [], shadow = true,
}) => <Dot t={t} sprites={dots} swaps={swaps} feet={{x, y}} headR={headR} bounces={bounces} shadow={shadow} />;

/** A chunky outlined label (kit Label). */
export const Tag: React.FC<{t: number; t0: number; t1?: number; x: number; y: number; size?: number; color?: string; children: React.ReactNode}> = ({
  t, t0, t1, x, y, size = 56, color = '#FFFFFF', children,
}) => (
  <Label t={t} t0={t0} t1={t1} x={x} y={y} size={size} color={color}>
    {children}
  </Label>
);

// ------------------------------------------------------------------------------------------------ backdrops
/** A flat backdrop over exactly the visible box, with an optional floor line. */
export const Backdrop: React.FC<{color: string; floor?: number | null; floorColor?: string}> = ({color, floor = null, floorColor = '#D9C7A6'}) => {
  const B = useBleedBox();
  return (
    <WorldSvg box={B}>
      <rect x={B[0]} y={B[1]} width={B[2] - B[0]} height={B[3] - B[1]} fill={color} />
      {floor !== null ? (
        <>
          <rect x={B[0]} y={floor} width={B[2] - B[0]} height={B[3] - floor} fill={floorColor} />
          <line x1={B[0]} y1={floor} x2={B[2]} y2={floor} stroke={INK} strokeWidth={8} />
        </>
      ) : null}
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

// ------------------------------------------------------------------------------------------------ switches
/** Is a switch that flicks every `period` s (from t0) on at time t? */
export const flick = (t: number, t0: number, period: number) => t >= t0 && Math.floor((t - t0) / period) % 2 === 0;

/** A big wall light switch (plate + rocker) centred at (x, y), `s` = scale (1 = 260 px tall plate). */
export const BigSwitch: React.FC<{x: number; y: number; s?: number; on: boolean; glow?: boolean}> = ({x, y, s = 1, on, glow = true}) => (
  <WorldSvg box={[x - 200 * s, y - 200 * s, x + 200 * s, y + 200 * s]}>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-105} y={-150} width={210} height={300} rx={26} fill="#FFFDF6" stroke={INK} strokeWidth={9} />
      <circle cx={0} cy={-120} r={7} fill="#C9C4BA" stroke={INK} strokeWidth={3} />
      <circle cx={0} cy={120} r={7} fill="#C9C4BA" stroke={INK} strokeWidth={3} />
      <rect x={-52} y={-88} width={104} height={176} rx={16} fill="#E9E4D8" stroke={INK} strokeWidth={7} />
      {/* the rocker: the pressed half is shaded */}
      <rect x={-46} y={on ? -82 : 0} width={92} height={82} rx={12} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
      <rect x={-46} y={on ? 0 : -82} width={92} height={82} rx={12} fill="#CFC8BA" stroke={INK} strokeWidth={6} />
      {glow && on ? <circle cx={0} cy={-41} r={10} fill={ON} stroke={INK} strokeWidth={3} /> : null}
    </g>
  </WorldSvg>
);

/** A tiny switch tile (one bit): yellow when on, slate when off; optional 1/0 digit. */
export const Bit: React.FC<{x: number; y: number; size: number; on: boolean; digit?: boolean}> = ({x, y, size, on, digit = false}) => (
  <g>
    <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={size * 0.18} fill={on ? ON : '#4A5068'} stroke={INK} strokeWidth={Math.max(2, size * 0.08)} />
    {digit ? (
      <text x={x} y={y + size * 0.2} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight={900} fontSize={size * 0.55} fill={on ? INK : '#C9CEDF'}>
        {on ? 1 : 0}
      </text>
    ) : null}
  </g>
);

/** A hanging ceiling bulb at (x, y) that glows when on. */
export const Bulb: React.FC<{x: number; y: number; on: boolean; s?: number}> = ({x, y, on, s = 1}) => (
  <WorldSvg box={[x - 220 * s, y - 400 * s, x + 220 * s, y + 220 * s]}>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {on ? <circle cx={0} cy={30} r={180} fill={ON} opacity={0.25} /> : null}
      <line x1={0} y1={-400} x2={0} y2={-40} stroke={INK} strokeWidth={6} />
      <rect x={-22} y={-44} width={44} height={36} fill="#8E8A80" stroke={INK} strokeWidth={6} />
      <path d="M-22,-8 Q-62,30 -40,70 Q-20,100 0,100 Q20,100 40,70 Q62,30 22,-8 Z" fill={on ? ON : '#EDEAE2'} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    </g>
  </WorldSvg>
);

// ------------------------------------------------------------------------------------------------ other drawn bits
/** A fingertip (Dot-cream, outlined) coming in from the upper right at an angle, pressing a point. */
export const Finger: React.FC<{x: number; y: number; press: number; s?: number}> = ({x, y, press, s = 1}) => (
  <WorldSvg box={[x - 60 * s, y - 260 * s, x + 260 * s, y + 40 * s]}>
    <g transform={`translate(${x + 14 * s * (1 - press)} ${y - 20 * s * (1 - press)}) rotate(35) scale(${s})`}>
      <path d="M-30,-200 L-30,-34 Q-30,0 0,0 Q30,0 30,-34 L30,-200 Z" fill="#FFF1D6" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M-18,-36 Q0,-20 18,-36" fill="none" stroke="#E6CFA8" strokeWidth={6} strokeLinecap="round" />
    </g>
  </WorldSvg>
);

/** Little pile of switch tiles growing from (x, y) (the base centre): `n` tiles in a mound, deterministic. */
export const Pile: React.FC<{x: number; y: number; n: number; size?: number; maxW?: number}> = ({x, y, n, size = 22, maxW = 700}) => {
  const tiles = Math.min(Math.floor(n), 1200);
  const items: {px: number; py: number; i: number}[] = [];
  let layer = 0;
  let left = tiles;
  let i = 0;
  while (left > 0 && layer < 40) {
    const width = Math.max(1, Math.round(Math.min(maxW / size, 34) - layer * 1.6));
    const k = Math.min(width, left);
    for (let j = 0; j < k; j++, i++) {
      items.push({px: x + (j - (width - 1) / 2) * size * 0.95 + (rand(i) - 0.5) * size * 0.4, py: y - layer * size * 0.72 - rand(i + 3) * size * 0.25, i});
    }
    left -= k;
    layer++;
  }
  return (
    <WorldSvg box={[x - maxW, y - maxW, x + maxW, y + 30]}>
      {items.map(({px, py, i: k}) => (
        <rect key={k} x={px - size / 2} y={py - size / 2} width={size} height={size * 0.8} rx={4} fill={rand(k + 9) > 0.5 ? ON : '#4A5068'} stroke={INK} strokeWidth={3}
          transform={`rotate(${(rand(k + 5) - 0.5) * 50} ${px} ${py})`} />
      ))}
    </WorldSvg>
  );
};

/** Wavy heat lines rising from a band (x0..x1 at y). */
export const Heat: React.FC<{t: number; x0: number; x1: number; y: number; strength: number; color?: string}> = ({t, x0, x1, y, strength, color = '#FF8A3D'}) => {
  if (strength <= 0.02) return null;
  const n = Math.max(2, Math.round(((x1 - x0) / 110) * Math.min(1, strength)));
  return (
    <WorldSvg box={[x0 - 60, y - 420, x1 + 60, y + 20]}>
      {Array.from({length: n}, (_, i) => {
        const x = x0 + ((i + 0.5) / n) * (x1 - x0);
        const u = (t * 0.8 + i * 0.37) % 1;
        const h = 120 + 200 * strength;
        const yy = y - u * 160;
        const d = `M${x},${yy} q-22,-${h / 4} 0,-${h / 2} t0,-${h / 2}`;
        return <path key={i} d={d} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" opacity={(1 - u) * Math.min(1, strength)} />;
      })}
    </WorldSvg>
  );
};

/** A clean outline of an open hand (palm towards us), `w` wide, centred at (x, y). */
export const Hand: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => {
  const s = w / 200;
  return (
    <WorldSvg box={[x - w, y - w * 1.4, x + w, y + w]}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-80,40 L-80,-80 Q-80,-100 -62,-100 Q-44,-100 -44,-80 L-44,-120 Q-44,-140 -26,-140 Q-8,-140 -8,-120 L-8,-130 Q-8,-150 10,-150 Q28,-150 28,-130 L28,-110 Q28,-130 46,-130 Q64,-130 64,-110 L64,10 L96,-30 Q110,-46 124,-34 Q136,-22 124,-6 L70,80 Q50,110 10,110 L-30,110 Q-80,110 -80,40 Z"
          fill="#FFF1D6" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      </g>
    </WorldSvg>
  );
};
