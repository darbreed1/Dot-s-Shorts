import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeInOutCubic, popScale, rand} from '../../kit/anim';
import {Dot, DotSprite, Swap} from '../../kit/Dot';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {SECTIONS, WORDS} from './timeline';
import {S} from './sprites';

// Building blocks for the orca long-form (16:9, drawn in a 1920x1080 DesignSpace): phrase cues from the voice
// timeline, swimming cut-outs, the underwater / surface / dock backdrops, code-drawn fins, bubbles and kelp.
export const W = 1920;
export const H = 1080;
export const INK = '#15151C';
export const GOLD = '#F2C14E';

// ------------------------------------------------------------------------------------------------ cues
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, '');
const TOK = WORDS.map((w) => ({...w, k: norm(w.w)}));
/** Start time of the first occurrence of `phrase` inside section n (1-based). Throws if the voice never says it. */
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
export type Sprite = {src: string; w: number; h: number; centre: readonly number[]};
/** A cut-out centred at (x, y), `w` wide, gently bobbing; flip mirrors it (the orca faces right as drawn). */
export const Critter: React.FC<{sp: Sprite; x: number; y: number; w: number; t: number; flip?: boolean; rot?: number; bob?: number; phase?: number; opacity?: number; pop?: number}> = ({
  sp, x, y, w, t, flip = false, rot = 0, bob = 6, phase = 0, opacity = 1, pop = 1,
}) => {
  if (pop <= 0.01) return null;
  const s = w / sp.w;
  const yy = y + bob * Math.sin(2 * Math.PI * 0.45 * t + phase);
  const r = rot + 1.4 * Math.sin(2 * Math.PI * 0.45 * t + phase + 1);
  return (
    <div style={{position: 'absolute', left: x, top: yy, opacity, transformOrigin: '0 0', transform: `rotate(${r}deg) scale(${(flip ? -1 : 1) * pop}, ${pop})`}}>
      <Img src={staticFile(sp.src)} style={{position: 'absolute', left: -sp.centre[0] * s, top: -sp.centre[1] * s, width: sp.w * s, height: sp.h * s}} />
    </div>
  );
};

/** Swim from a to b between t0 and t1 (eased), facing the direction of travel. */
export const swim = (t: number, t0: number, t1: number, a: {x: number; y: number}, b: {x: number; y: number}, ease = true) => {
  const u = clamp01((t - t0) / (t1 - t0));
  const e = ease ? easeInOutCubic(u) : u;
  return {x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, flip: b.x < a.x};
};

const dots = S as unknown as Record<string, DotSprite>;
/** Dot standing (or floating) with the kit rig, in design px. */
export const DotRig: React.FC<{t: number; swaps: readonly Swap[]; x: number; y: number; headR?: number; shadow?: boolean; bounces?: number[]}> = ({
  t, swaps, x, y, headR = 70, shadow = false, bounces = [],
}) => <Dot t={t} sprites={dots} swaps={swaps} feet={{x, y}} headR={headR} shadow={shadow} bounces={bounces} />;

// ------------------------------------------------------------------------------------------------ backdrops
/** Underwater: blue gradient, swaying light rays, drifting specks; optional sandy seabed with kelp. */
export const Underwater: React.FC<{t: number; seabed?: boolean; deep?: boolean}> = ({t, seabed = true, deep = false}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: deep ? 'linear-gradient(#1B5E9C, #0B2650)' : 'linear-gradient(#3FA6DD, #10427A)'}} />
    <WorldSvg box={[0, 0, W, H]}>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 200 + i * 380 + 40 * Math.sin(2 * Math.PI * 0.07 * t + i);
        return <path key={i} d={`M${x - 40},0 L${x + 40},0 L${x + 260},${H} L${x + 90},${H} Z`} fill="#FFFFFF" opacity={0.07 + 0.03 * Math.sin(2 * Math.PI * 0.2 * t + i * 2)} />;
      })}
      {Array.from({length: 40}, (_, i) => {
        const x = (rand(i) * W + t * 12 * (0.5 + rand(i + 9))) % W;
        const y = (rand(i + 3) * H - t * 6 * (0.5 + rand(i + 5)) + H * 10) % H;
        return <circle key={`s${i}`} cx={x} cy={y} r={2 + 3 * rand(i + 7)} fill="#FFFFFF" opacity={0.25} />;
      })}
      {seabed ? (
        <>
          {[180, 420, 1480, 1700, 1820].map((x, i) => (
            <path key={`k${i}`} d={`M${x},${H} ${Array.from({length: 8}, (_, k) => `Q${x + (k % 2 ? 30 : -30) + 14 * Math.sin(2 * Math.PI * 0.3 * t + i + k * 0.5)},${H - 40 - k * 45} ${x + 6 * Math.sin(2 * Math.PI * 0.3 * t + i + k)},${H - 60 - k * 45}`).join(' ')}`}
              fill="none" stroke="#2E7D4F" strokeWidth={16} strokeLinecap="round" />
          ))}
          <path d={`M0,${H} L0,975 Q300,945 640,968 T1280,962 T1920,970 L1920,${H} Z`} fill="#E3C68A" stroke={INK} strokeWidth={6} />
          {[[300, 990, 40], [900, 1005, 26], [1600, 995, 34]].map(([x, y, r], i) => (
            <ellipse key={`r${i}`} cx={x} cy={y} rx={r * 1.5} ry={r * 0.8} fill="#9C8F86" stroke={INK} strokeWidth={5} />
          ))}
        </>
      ) : null}
    </WorldSvg>
  </>
);

/** A wavy sea surface line at y (the water below is drawn by the caller or Underwater). */
export const wavePath = (t: number, y: number, amp = 10, x0 = -20, x1 = W + 20) => {
  let d = `M${x0},${y}`;
  for (let x = x0; x <= x1; x += 40) d += ` L${x},${(y + amp * Math.sin(x / 90 + 2 * Math.PI * 0.4 * t)).toFixed(1)}`;
  return d;
};

/** Sky above, the sea below the surface line at `sea` (y). Children draw between (boats, boards...). */
export const SurfaceSplit: React.FC<{t: number; sea?: number; children?: React.ReactNode; under?: React.ReactNode}> = ({t, sea = 430, children, under}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#8ED3F7, #D6F0FF)'}} />
    <WorldSvg box={[0, 0, W, H]}>
      <circle cx={1620} cy={130} r={64} fill="#FFE27A" stroke={INK} strokeWidth={6} />
    </WorldSvg>
    <div style={{position: 'absolute', left: 0, top: sea - 20, width: W, height: H - sea + 20, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: -(sea - 20), width: W, height: H}}>
        <Underwater t={t} seabed={false} />
        {under}
      </div>
    </div>
    <WorldSvg box={[0, 0, W, H]}>
      <path d={`${wavePath(t, sea, 10)} L${W + 20},${sea - 400} L-20,${sea - 400} Z`} fill="none" />
      <path d={wavePath(t, sea, 10)} fill="none" stroke={INK} strokeWidth={7} />
      <path d={wavePath(t + 0.6, sea + 22, 6)} fill="none" stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={5} />
    </WorldSvg>
    {children}
  </>
);

/** An orca's dorsal fin and back breaking the surface at (x, y), facing right unless flip. */
export const Fin: React.FC<{x: number; y: number; s?: number; flip?: boolean}> = ({x, y, s = 1, flip = false}) => (
  <WorldSvg box={[x - 200 * s, y - 220 * s, x + 200 * s, y + 40 * s]}>
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-170,8 Q-60,-34 120,-4 Q150,4 170,10 Z" fill="#1B1B22" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-30,-22 Q-20,-150 30,-200 Q36,-120 70,-14 Z" fill="#1B1B22" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M40,-12 Q70,-24 92,-12" fill="none" stroke="#C9CBD1" strokeWidth={10} strokeLinecap="round" />
    </g>
  </WorldSvg>
);

/** A spout of spray above a surfacing whale: white puffs that rise and shrink. */
export const Spout: React.FC<{t: number; t0: number; x: number; y: number; s?: number}> = ({t, t0, x, y, s = 1}) => {
  const u = (t - t0) / 1.1;
  if (u < 0 || u > 1) return null;
  return (
    <WorldSvg box={[x - 120 * s, y - 260 * s, x + 120 * s, y + 20]}>
      {[0, 1, 2, 3].map((i) => {
        const r = 34 * s * Math.sin(Math.PI * Math.min(1, u * 1.4)) * (1 - i * 0.12);
        return r > 0.5 ? <circle key={i} cx={x + (i - 1.5) * 26 * s * u} cy={y - (60 + i * 50) * s * Math.sqrt(u)} r={r} fill="#FFFFFF" stroke={INK} strokeWidth={4} /> : null;
      })}
    </WorldSvg>
  );
};

/** Rising bubbles from a point (a diver's regulator), in pulses. */
export const Bubbles: React.FC<{t: number; x: number; y: number; n?: number}> = ({t, x, y, n = 6}) => (
  <WorldSvg box={[x - 80, y - 420, x + 80, y + 10]}>
    {Array.from({length: n}, (_, i) => {
      const u = ((t * 0.6 + i / n) % 1);
      return <circle key={i} cx={x + 18 * Math.sin(u * 9 + i)} cy={y - u * 400} r={5 + 6 * rand(i)} fill="#DDF4FF" fillOpacity={0.5} stroke="#FFFFFF" strokeWidth={3} />;
    })}
  </WorldSvg>
);

/** The presenter set: sky, sea with fins going by, and a wooden pier at the left where Dot stands. */
export const Dock: React.FC<{t: number; fins?: boolean; dusk?: boolean; children?: React.ReactNode}> = ({t, fins = true, dusk = false, children}) => {
  const sea = 600;
  const finX = ((t * 70) % 2600) - 300;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: dusk ? 'linear-gradient(#F5A97A, #FFE2B8)' : 'linear-gradient(#7CC8F2, #DDF3FF)'}} />
      <WorldSvg box={[0, 0, W, H]}>
        <circle cx={dusk ? 1500 : 1580} cy={dusk ? 520 : 150} r={dusk ? 110 : 66} fill={dusk ? '#FFC36B' : '#FFE27A'} stroke={INK} strokeWidth={6} />
        <path d={`M1100,${sea} Q1250,${sea - 120} 1420,${sea - 60} Q1560,${sea - 140} 1760,${sea} Z`} fill={dusk ? '#9B7A8E' : '#6FAE7B'} stroke={INK} strokeWidth={6} />
        <rect x={0} y={sea} width={W} height={H - sea} fill={dusk ? '#4F6FA8' : '#2F86C4'} />
        <path d={wavePath(t, sea, 6)} fill="none" stroke={INK} strokeWidth={6} />
        {[660, 760, 880].map((y, i) => (
          <path key={i} d={wavePath(t + i, y, 5, 600, W + 20)} fill="none" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={5} />
        ))}
      </WorldSvg>
      {fins ? (
        <>
          <Fin x={finX} y={sea + 70 + 4 * Math.sin(2 * Math.PI * 0.4 * t)} s={0.55} />
          <Fin x={finX - 260} y={sea + 95 + 4 * Math.sin(2 * Math.PI * 0.4 * t + 1)} s={0.42} />
        </>
      ) : null}
      <WorldSvg box={[0, 0, W, H]}>
        {/* pier */}
        <rect x={-20} y={840} width={720} height={44} fill="#B9814E" stroke={INK} strokeWidth={8} />
        {[60, 260, 460, 640].map((x) => (
          <rect key={x} x={x} y={884} width={34} height={240} fill="#8E5C34" stroke={INK} strokeWidth={7} />
        ))}
        {[100, 220, 340, 460, 580].map((x) => (
          <line key={x} x1={x} y1={846} x2={x} y2={878} stroke="#8E5C34" strokeWidth={5} />
        ))}
      </WorldSvg>
      {children}
    </>
  );
};

/** A light paper card background for the diagram beats. */
export const Paper: React.FC<{tone?: 'sand' | 'sea' | 'dark'}> = ({tone = 'sand'}) => (
  <div style={{position: 'absolute', inset: 0, background: tone === 'sea' ? 'linear-gradient(#DDF1FB, #B9DFF3)' : tone === 'dark' ? 'linear-gradient(#26314A, #141B2C)' : 'linear-gradient(#FBEFD5, #F1DDB4)'}} />
);

/** Pop-in scale for things that appear on a cue and stay (or leave at t1). */
export const appear = (t: number, t0: number, t1 = 1e9) => popScale(t, t0, t1, 0.3, 0.2);
