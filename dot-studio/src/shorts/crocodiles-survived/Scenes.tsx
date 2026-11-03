import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeInOutCubic, easeOutBack, easeOutCubic, kick, lerp, popScale, progress, rand, wobble} from '../../kit/anim';
import {DesignSpace} from '../../kit/DesignSpace';
import {Dot, DotSprite} from '../../kit/Dot';
import {Label} from '../../kit/Label';
import {watchTaps} from '../../kit/moves';
import {DOT_SWAPS, SHOT, T} from './beats';
import {S} from './sprites';

// Every scene is drawn in a 1080x1920 design space; Dot stands at the bottom left, captions sit below him.
const INK = '#15151C';
const GOLD = '#F2C14E';
const RED = '#E8483F';
const dots = S as unknown as Record<string, DotSprite>;
const DOT_FEET = {x: 185, y: 1300};

// ------------------------------------------------------------------------------------------- the river
const FAR_BANK = 1060;
const WATER = 1160; // the river's surface
const NEAR_BANK = 1270;
const CROC = {x: 700, w: 820};
const DINO_H = 430;
const CS = CROC.w / S.croc.w;

const Fern: React.FC<{x: number; y: number; s: number; flip?: boolean}> = ({x, y, s, flip}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {[-50, -25, 0, 25, 50].map((a, i) => (
      <g key={i} transform={`rotate(${a})`}>
        <path d="M0,0 Q10,-90 0,-170" fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" />
        <path d="M0,0 Q10,-90 0,-170" fill="none" stroke="#4E8F3A" strokeWidth={6} strokeLinecap="round" />
        {[40, 75, 110, 140].map((d, j) => (
          <ellipse key={j} cx={8} cy={-d} rx={30 - j * 5} ry={9} fill="#5FA845" stroke={INK} strokeWidth={4} transform={`rotate(-25 8 ${-d})`} />
        ))}
      </g>
    ))}
  </g>
);

/** Puff of smoke circles (one merged outline) that grows then shrinks away. */
const Puff: React.FC<{t: number; t0: number; x: number; y: number; r: number}> = ({t, t0, x, y, r}) => {
  const u = (t - t0) / 0.7;
  if (u <= 0 || u >= 1) return null;
  const s = Math.sin(Math.PI * u);
  const cs = [[0, 0, 1], [-0.7, 0.2, 0.7], [0.7, 0.15, 0.75], [-0.3, -0.5, 0.65], [0.35, -0.45, 0.6]];
  return (
    <g>
      {cs.map(([dx, dy, k], i) => <circle key={`i${i}`} cx={x + dx * r} cy={y + dy * r - u * 40} r={k * r * s + 6} fill={INK} />)}
      {cs.map(([dx, dy, k], i) => <circle key={`f${i}`} cx={x + dx * r} cy={y + dy * r - u * 40} r={k * r * s} fill="#E8E3DA" />)}
    </g>
  );
};

const Badge: React.FC<{t: number; t0: number; x: number; y: number; icon: 'cold' | 'small' | 'water'}> = ({t, t0, x, y, icon}) => {
  const s = easeOutBack(clamp01((t - t0) / 0.3), 2.2);
  if (s <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={82} fill="#FFF6E0" stroke={INK} strokeWidth={9} />
      {icon === 'cold' ? (
        <g>
          <rect x={-14} y={-55} width={28} height={80} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
          <circle cy={36} r={24} fill="#5AA9E6" stroke={INK} strokeWidth={6} />
          <rect x={-6} y={-10} width={12} height={40} fill="#5AA9E6" />
        </g>
      ) : icon === 'small' ? (
        <g stroke={INK} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M-50,0 L-12,0 M-30,-18 L-12,0 L-30,18" />
          <path d="M50,0 L12,0 M30,-18 L12,0 L30,18" />
        </g>
      ) : (
        <path d="M0,-55 C25,-20 40,0 40,20 A40,40 0 0,1 -40,20 C-40,0 -25,-20 0,-55 Z" fill="#5AA9E6" stroke={INK} strokeWidth={7} />
      )}
    </g>
  );
};

export const River: React.FC<{t: number}> = ({t}) => {
  const first = t < SHOT.fossils;
  // the asteroid: streaks in behind the volcano on "asteroid", flash + shake on impact
  // visible far off from frame 0, then speeding in (ease-in) to hit on "wiped"
  const aU = 0.12 + 0.88 * Math.pow(progress(t, 0, T.wiped), 2.4);
  const hit = T.wiped;
  const flash = first && t > hit ? Math.max(0, 1 - (t - hit) / 0.6) : 0;
  const soot = first ? easeOutCubic(progress(t, hit, hit + 1.2)) : 0;
  const shake = first ? wobble(t, hit, 14, 9, 4) : 0;
  const dinoGone = t > hit + 0.3;
  const dinoS = first ? 1 - easeOutBack(clamp01((t - (hit + 0.15)) / 0.25), 1.5) * (t > hit + 0.15 ? 1 : 0) : 0;
  // the croc: squashes small on "small", dips under on "water"
  const dip = first ? 0 : easeInOutCubic(progress(t, T.water - 0.2, T.water + 0.25)) * (1 - easeInOutCubic(progress(t, T.helped + 0.2, T.helped + 0.6)));
  const lineY = lerp(250, 105, dip); // waterline in croc sprite px
  const smallK = first ? 0 : kick(t, T.small, -0.12, 2.5, 4) * (t > T.small ? 1 : 0);
  const bob = 4 * Math.sin(2 * Math.PI * 0.5 * t);
  const crocTop = WATER - lineY * CS + bob;
  const ax = lerp(-120, 900, aU);
  const ay = lerp(120, 760, aU);
  return (
    <DesignSpace background="#F6D7A7">
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${shake}px, ${shake * 0.5}px)`}}>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <linearGradient id="riverSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8EC9E8" />
              <stop offset="100%" stopColor="#FBE3B8" />
            </linearGradient>
          </defs>
          <rect x={0} y={0} width={1080} height={FAR_BANK} fill="url(#riverSky)" />
          <rect x={0} y={0} width={1080} height={FAR_BANK} fill="#4A2E2A" opacity={0.45 * soot} />
          {/* the asteroid and its trail */}
          {first && t < T.wiped ? (
            <g>
              <path d={`M${ax},${ay} L${ax - 260},${ay - 160}`} stroke="#FFB347" strokeWidth={34} strokeLinecap="round" opacity={0.75} />
              <path d={`M${ax},${ay} L${ax - 160},${ay - 98}`} stroke="#FFE27A" strokeWidth={18} strokeLinecap="round" />
              <circle cx={ax} cy={ay} r={36} fill="#7A6A5E" stroke={INK} strokeWidth={7} />
            </g>
          ) : null}
          {/* volcano on the horizon */}
          <path d="M700,980 L860,720 L920,720 L1080,960 L1080,1000 L700,1000 Z" fill="#8C6B5A" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
          {flash > 0 ? <circle cx={900} cy={860} r={260 + 500 * (1 - flash)} fill="#FFF2B0" opacity={0.8 * flash} /> : null}
          {/* far bank, river, near bank */}
          <rect x={0} y={980} width={1080} height={FAR_BANK - 980 + 10} fill="#7FA35A" stroke={INK} strokeWidth={8} />
          <Fern x={90} y={1000} s={0.75} />
          <Fern x={330} y={995} s={0.6} flip />
          <Fern x={1010} y={1000} s={0.7} flip />
        </svg>
        {/* the dinosaur on the far bank (pops away on the impact) */}
        {first && !dinoGone ? (
          <div style={{position: 'absolute', left: 890, top: FAR_BANK + 10, transformOrigin: '0 0', transform: `scale(${Math.max(0.001, dinoS)})`}}>
            <Img src={staticFile(S.dino.src)} style={{position: 'absolute', left: -S.dino.feet[0] * (DINO_H / S.dino.h), top: -DINO_H, width: S.dino.w * (DINO_H / S.dino.h), height: DINO_H}} />
          </div>
        ) : null}
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <Puff t={t} t0={hit + 0.2} x={880} y={FAR_BANK - 150} r={90} />
          <rect x={0} y={FAR_BANK} width={1080} height={NEAR_BANK - FAR_BANK} fill="#4C9BD6" />
        </svg>
        {/* the croc, cut at the waterline */}
        <div style={{position: 'absolute', left: CROC.x - CROC.w / 2, top: 0, width: CROC.w * 1.2, height: WATER + 6, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: crocTop, transformOrigin: `${CROC.w / 2}px ${lineY * CS}px`, transform: `scale(${1 + smallK}, ${1 + smallK})`}}>
            <Img src={staticFile(S.croc.src)} style={{width: CROC.w, height: S.croc.h * CS}} />
          </div>
        </div>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          <path d={Array.from({length: 12}, (_, i) => `M${i * 95 + ((t * 30) % 95) - 60},${WATER + 4} q22,-14 44,0`).join(' ')} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
          <line x1={0} y1={FAR_BANK} x2={1080} y2={FAR_BANK} stroke={INK} strokeWidth={6} />
          {/* bubbles while the croc is under */}
          {dip > 0.5
            ? Array.from({length: 6}, (_, i) => {
                const u = ((t * 1.3 + i / 6) % 1);
                return <circle key={i} cx={CROC.x - 150 + i * 30 + 10 * Math.sin(t * 6 + i)} cy={WATER + 60 - u * 70} r={8 + 4 * rand(i)} fill="#D9F0FF" stroke={INK} strokeWidth={3} opacity={1 - u} />;
              })
            : null}
          <rect x={0} y={NEAR_BANK} width={1080} height={700} fill="#A77B4F" />
          <line x1={0} y1={NEAR_BANK} x2={1080} y2={NEAR_BANK} stroke={INK} strokeWidth={8} />
          {!first ? (
            <>
              <Badge t={t} t0={T.cold - 0.05} x={380} y={740} icon="cold" />
              <Badge t={t} t0={T.small - 0.05} x={620} y={740} icon="small" />
              <Badge t={t} t0={T.home - 0.05} x={860} y={740} icon="water" />
            </>
          ) : null}
        </svg>
        {!first ? (
          <>
            <Label t={t} t0={T.cold} x={380} y={880} size={44}>cold-blooded</Label>
            <Label t={t} t0={T.small} x={620} y={880} size={44}>small</Label>
            <Label t={t} t0={T.home} x={860} y={880} size={44}>in water</Label>
          </>
        ) : null}
        <Dot t={t} sprites={dots} swaps={DOT_SWAPS} feet={DOT_FEET} headR={78} bounces={[T.why, T.too]} />
      </div>
      {flash > 0 ? <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, background: '#FFFFFF', opacity: 0.3 * flash}} /> : null}
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- the fossils
const Fossil: React.FC<{kind: number; x: number; y: number; s: number}> = ({kind, x, y, s}) => {
  if (s <= 0.01) return null;
  const k = kind % 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${(kind * 37) % 40 - 20})`}>
      {k === 0 ? (
        <g fill="#EFE3C8" stroke={INK} strokeWidth={4}>
          <rect x={-22} y={-6} width={44} height={12} />
          <circle cx={-24} cy={-7} r={8} /><circle cx={-24} cy={7} r={8} /><circle cx={24} cy={-7} r={8} /><circle cx={24} cy={7} r={8} />
          <rect x={-20} y={-5} width={40} height={10} stroke="none" />
        </g>
      ) : k === 1 ? (
        <g>
          <circle r={24} fill="#D9C39A" stroke={INK} strokeWidth={4} />
          <path d="M0,0 m-4,0 a4,4 0 1,1 8,0 a9,9 0 1,1 -16,0 a14,14 0 1,1 26,0 a19,19 0 1,1 -34,0" fill="none" stroke={INK} strokeWidth={3} />
        </g>
      ) : k === 2 ? (
        <path d="M-10,-26 Q0,-34 10,-26 L6,26 Q0,32 -6,26 Z" fill="#F4ECD8" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      ) : (
        <g>
          <path d="M-30,6 Q-28,-16 0,-18 Q30,-16 32,0 L20,10 L-26,12 Z" fill="#E6D5B0" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={-8} cy={-6} r={5} fill={INK} />
        </g>
      )}
    </g>
  );
};

export const Fossils: React.FC<{t: number}> = ({t}) => {
  const cols = 9;
  const rows = 8;
  const n = cols * rows;
  const t0 = T.study - 0.1;
  const t1 = T.k7000 + 0.3;
  return (
    <DesignSpace background="#2F5A5C">
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {/* the board the fossils fill up */}
        <rect x={110} y={250} width={860} height={720} rx={24} fill="#3E7072" stroke={INK} strokeWidth={10} />
        {Array.from({length: n}, (_, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          const s = popScale(t, t0 + (i / n) * (t1 - t0), SHOT.globe + 1, 0.2, 0.2);
          return <Fossil key={i} kind={i * 7 + r} x={170 + c * 92} y={310 + r * 86} s={s * 1.15} />;
        })}
        {/* the table */}
        <rect x={0} y={1080} width={1080} height={60} fill="#8A5A34" stroke={INK} strokeWidth={8} />
        <rect x={0} y={1140} width={1080} height={800} fill="#6C4426" />
      </svg>
      <Label t={t} t0={T.university - 0.05} x={540} y={160} size={64}>University College London</Label>
      <Label t={t} t0={T.k7000 - 0.05} x={540} y={620} size={150} color={GOLD}>7,000</Label>
      <Label t={t} t0={T.fossils - 0.05} x={540} y={780} size={84} color={GOLD}>fossils</Label>
      <Dot t={t} sprites={dots} swaps={DOT_SWAPS} feet={DOT_FEET} headR={78} bounces={[T.looked]} />
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- the globe
const G = {x: 560, y: 640, r: 380};
type Mini = {src: string; w: number; h: number};

/** Little animals drifting around the globe inside a latitude band (y offset from the equator, in globe px). */
const Drifters: React.FC<{sp: Mini; n: number; t: number; band: number; h: number; speed: number; scale: (i: number) => number; seed: number}> = ({sp, n, t, band, h, speed, scale, seed}) => (
  <>
    {Array.from({length: n}, (_, i) => {
      const s = scale(i);
      if (s <= 0.01) return null;
      const lat = (rand(seed + i) - 0.5) * 2 * band;
      const side = seed > 50 ? (i % 2 ? 1 : -1) : 0;
      const yOff = side ? side * (band + 0.0) : lat;
      const x = G.x - G.r + ((((rand(seed + i * 3) * 2 * G.r + t * speed * (i % 2 ? 1 : -1)) % (2 * G.r)) + 2 * G.r) % (2 * G.r));
      const hh = h * s;
      const w = (sp.w / sp.h) * hh;
      return <Img key={i} src={staticFile(sp.src)} style={{position: 'absolute', left: x - w / 2, top: G.y + yOff - hh / 2, width: w, height: hh}} />;
    })}
  </>
);

export const Globe: React.FC<{t: number}> = ({t}) => {
  // warm belt half-height: breathes with the climate over 250 million years, then narrows after the impact but holds
  const breathe = t < T.after ? 40 * Math.sin(2 * Math.PI * 0.45 * (t - SHOT.globe)) : 0;
  const warm = lerp(150 + breathe, 100, easeInOutCubic(progress(t, T.impact, T.stayed + 0.4)));
  // the dinosaurs' climate: cooler bands either side, which collapse after the impact
  const dino = lerp(150, 18, easeInOutCubic(progress(t, T.lost - 0.2, T.climate + 0.4)));
  const dark = easeOutCubic(progress(t, T.impact - 0.05, T.impact + 0.8));
  const hitGlow = t > T.impact - 0.05 ? Math.max(0, 1 - (t - T.impact) / 0.7) : 0;
  const shake = wobble(t, T.impact, 10, 9, 4);
  const crocsIn = (i: number) => popScale(t, T.crocodile + i * 0.08, SHOT.river2 + 1, 0.25, 0.2);
  const dinoIn = (i: number) => popScale(t, T.dinosaurs2 + i * 0.07, T.lost + 0.25 + i * 0.3, 0.25, 0.25);
  const clip = `circle(${G.r}px at ${G.x}px ${G.y}px)`;
  return (
    <DesignSpace background="#17213F">
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${shake}px, 0)`}}>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          {Array.from({length: 40}, (_, i) => (
            <circle key={i} cx={rand(i + 3) * 1080} cy={rand(i + 9) * 1150} r={2 + 3 * rand(i)} fill="#F4F1E4" opacity={0.7} />
          ))}
          <defs>
            <clipPath id="globe">
              <circle cx={G.x} cy={G.y} r={G.r} />
            </clipPath>
          </defs>
          <g clipPath="url(#globe)">
            <rect x={G.x - G.r} y={G.y - G.r} width={2 * G.r} height={2 * G.r} fill="#EAF4FA" />
            <rect x={G.x - G.r} y={G.y - warm - dino} width={2 * G.r} height={2 * (warm + dino)} fill="#7FBF6A" />
            <rect x={G.x - G.r} y={G.y - warm} width={2 * G.r} height={2 * warm} fill="#F2A65A" />
            <line x1={G.x - G.r} y1={G.y - warm} x2={G.x + G.r} y2={G.y - warm} stroke={INK} strokeWidth={5} />
            <line x1={G.x - G.r} y1={G.y + warm} x2={G.x + G.r} y2={G.y + warm} stroke={INK} strokeWidth={5} />
            <line x1={G.x - G.r} y1={G.y - warm - dino} x2={G.x + G.r} y2={G.y - warm - dino} stroke={INK} strokeWidth={4} strokeDasharray="12 10" />
            <line x1={G.x - G.r} y1={G.y + warm + dino} x2={G.x + G.r} y2={G.y + warm + dino} stroke={INK} strokeWidth={4} strokeDasharray="12 10" />
            <rect x={G.x - G.r} y={G.y - G.r} width={2 * G.r} height={2 * G.r} fill="#2A1E26" opacity={0.35 * dark} />
            {/* a soft shade on the right for roundness */}
            <circle cx={G.x + G.r * 0.35} cy={G.y + G.r * 0.1} r={G.r * 1.05} fill="none" stroke="#000000" strokeWidth={G.r * 0.5} opacity={0.08} />
          </g>
          <circle cx={G.x} cy={G.y} r={G.r} fill="none" stroke={INK} strokeWidth={10} />
          {hitGlow > 0 ? <circle cx={G.x - G.r * 0.55} cy={G.y - G.r * 0.62} r={60 + 160 * (1 - hitGlow)} fill="#FFE27A" opacity={0.9 * hitGlow} /> : null}
          <rect x={0} y={1270} width={1080} height={700} fill="#26304F" />
          <line x1={0} y1={1270} x2={1080} y2={1270} stroke={INK} strokeWidth={8} />
        </svg>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, clipPath: clip}}>
          <Drifters sp={S.croc} n={5} t={t} band={Math.max(10, warm - 30)} h={56} speed={26} scale={crocsIn} seed={1} />
          <Drifters sp={S.dino} n={4} t={t} band={warm + dino * 0.5} h={78} speed={18} scale={dinoIn} seed={77} />
        </div>
        <Label t={t} t0={T.m250 - 0.05} t1={T.after} x={540} y={170} size={72} color={GOLD}>250 million years</Label>
        <Label t={t} t0={T.warm - 0.05} t1={T.after} x={G.x} y={G.y + G.r + 80} size={66}>warm places</Label>
        <Label t={t} t0={T.tropics - 0.05} x={G.x} y={G.y + G.r + 80} size={66} color={GOLD}>tropics stay warm</Label>
        <Label t={t} t0={T.dinosaurs2 - 0.05} x={540} y={170} size={66} color={RED}>dinosaurs' climate</Label>
        <Dot t={t} sprites={dots} swaps={DOT_SWAPS} feet={DOT_FEET} headR={70} bounces={watchTaps(SHOT.globe + 0.2)} />
      </div>
    </DesignSpace>
  );
};
