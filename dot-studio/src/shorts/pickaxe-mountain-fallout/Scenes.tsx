import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeInOutCubic, easeOutBack, easeOutCubic, lerp, popScale, progress, rand, wobble} from '../../kit/anim';
import {DesignSpace} from '../../kit/DesignSpace';
import {Dot, DotSprite} from '../../kit/Dot';
import {Label} from '../../kit/Label';
import {GasPuffs, Puff as GasPuff} from '../../kit/effects/GasPuff';
import {Pictogram} from '../../kit/effects/Pictogram';
import {FalloutCloud} from '../../kit/effects/Radiation';
import {FlashRing, Glow} from '../../kit/effects/small';
import {ThoughtCloud} from '../../kit/effects/ThoughtCloud';
import {DOT_SWAPS, SHOT, T} from './beats';
import {S} from './sprites';

// Every scene is drawn in a 1080x1920 design space; Dot stands at the bottom left on the ground line, captions sit
// below it. Outside shots: the mountain in the desert. Diagram shots: plain paper.
const INK = '#15151C';
const GOLD = '#F2C14E';
const RED = '#E8483F';
const ACID = '#B5D33E';
const dots = S as unknown as Record<string, DotSprite>;
const GROUND = 1300;
const DOT_FEET = {x: 185, y: GROUND};
const DOT_HEAD = {x: 205, y: 990};

const DotHere: React.FC<{t: number}> = ({t}) => (
  <Dot t={t} sprites={dots} swaps={DOT_SWAPS} feet={DOT_FEET} headR={78} bounces={[T.would, T.start, T.far, T.unlikely]} />
);

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
    {children}
  </svg>
);

/** Dust puff (circles with one merged outline) that grows then shrinks away. */
const Dust: React.FC<{t: number; t0: number; x: number; y: number; r: number; dur?: number; fill?: string}> = ({t, t0, x, y, r, dur = 0.8, fill = '#D8CBB4'}) => {
  const u = (t - t0) / dur;
  if (u <= 0 || u >= 1) return null;
  const s = Math.sin(Math.PI * Math.min(1, u * 1.4)) * (1 - 0.3 * u);
  const cs = [[0, 0, 1], [-0.8, 0.25, 0.7], [0.8, 0.2, 0.75], [-0.35, -0.55, 0.7], [0.4, -0.5, 0.62], [0, 0.35, 0.6]];
  return (
    <g>
      {cs.map(([dx, dy, k], i) => <circle key={`i${i}`} cx={x + dx * r * (1 + u)} cy={y + dy * r - u * 50} r={k * r * s + 7} fill={INK} />)}
      {cs.map(([dx, dy, k], i) => <circle key={`f${i}`} cx={x + dx * r * (1 + u)} cy={y + dy * r - u * 50} r={k * r * s} fill={fill} />)}
    </g>
  );
};

const StarBurst: React.FC<{x: number; y: number; r: number; s: number; fill?: string; core?: string}> = ({x, y, r, s, fill = '#FFB23F', core = '#FFE27A'}) => {
  if (s <= 0.01) return null;
  const pts = (rr: number, k: number) =>
    Array.from({length: 24}, (_, i) => {
      const a = (i / 24) * Math.PI * 2;
      const q = i % 2 === 0 ? rr : rr * k;
      return `${q * Math.cos(a)},${q * Math.sin(a)}`;
    }).join(' ');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <polygon points={pts(r, 0.62)} fill={fill} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      <polygon points={pts(r * 0.6, 0.65)} fill={core} />
    </g>
  );
};

const Arrow: React.FC<{x0: number; y0: number; x1: number; y1: number; s: number; color?: string; w?: number}> = ({x0, y0, x1, y1, s, color = INK, w = 14}) => {
  if (s <= 0.01) return null;
  const xe = lerp(x0, x1, s);
  const ye = lerp(y0, y1, s);
  const a = Math.atan2(ye - y0, xe - x0);
  const h = w * 2.4;
  const p = (d: number, da: number) => `${xe - h * Math.cos(a + da) * d},${ye - h * Math.sin(a + da) * d}`;
  return (
    <g>
      <line x1={x0} y1={y0} x2={xe - Math.cos(a) * h * 0.6} y2={ye - Math.sin(a) * h * 0.6} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <polygon points={`${xe},${ye} ${p(1, 0.5)} ${p(1, -0.5)}`} fill={color} stroke={color} strokeWidth={w * 0.4} strokeLinejoin="round" />
    </g>
  );
};

const Pellet: React.FC<{x: number; y: number; r: number; s?: number}> = ({x, y, r, s = 1}) =>
  s <= 0.01 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={r} fill="#C9E05A" stroke={INK} strokeWidth={7} />
      <circle cx={r * 0.22} cy={r * 0.25} r={r * 0.55} fill="#A9C442" />
      <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.18} fill="#F4FAD0" />
    </g>
  );

// ------------------------------------------------------------------------------------------- backgrounds
const Desert: React.FC = () => (
  <Svg>
    <defs>
      <linearGradient id="pmSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8FCBEB" />
        <stop offset="100%" stopColor="#F8E3B6" />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={1080} height={GROUND} fill="url(#pmSky)" />
    <circle cx={900} cy={260} r={70} fill="#FFE28A" stroke={INK} strokeWidth={8} />
    <path d={`M0,1170 Q160,1090 330,1150 Q520,1070 700,1140 Q880,1080 1080,1150 L1080,${GROUND} L0,${GROUND} Z`} fill="#E3C79A" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <rect x={0} y={GROUND} width={1080} height={1920 - GROUND} fill="#D6AE74" />
    <line x1={0} y1={GROUND} x2={1080} y2={GROUND} stroke={INK} strokeWidth={8} />
  </Svg>
);

const Paper: React.FC = () => (
  <Svg>
    <rect x={0} y={0} width={1080} height={GROUND} fill="#F6EBD6" />
    <rect x={0} y={GROUND} width={1080} height={1920 - GROUND} fill="#E6D2AE" />
    <line x1={0} y1={GROUND} x2={1080} y2={GROUND} stroke={INK} strokeWidth={8} />
  </Svg>
);

/** The mountain cut-out standing on the ground line, centred on cx, `w` wide; returns world points of its features. */
const mountainAt = (cx: number, w: number) => {
  const k = w / S.mountain.w;
  const x0 = cx - w / 2;
  const y0 = GROUND - S.mountain.h * k;
  const pt = (x: number, y: number) => ({x: x0 + x * k, y: y0 + y * k});
  return {k, x0, y0, w, h: S.mountain.h * k, peak: pt(S.mountain.peak[0], S.mountain.peak[1]), tunnels: S.mountain.tunnels.map(([x, y]) => pt(x, y))};
};

const MountainImg: React.FC<{m: ReturnType<typeof mountainAt>}> = ({m}) => (
  <Img src={staticFile(S.mountain.src)} style={{position: 'absolute', left: m.x0, top: m.y0 + 4, width: m.w, height: m.h}} />
);

// ------------------------------------------------------------------------------------------- outside (shots 1 and 7)
const M1 = mountainAt(610, 960);
const BOMB_W = 92;
const BOMB_H = (S.bomb.h * BOMB_W) / S.bomb.w;

const Gauge: React.FC<{t: number; x: number; y: number; r: number}> = ({t, x, y, r}) => {
  const s = easeOutBack(clamp01((t - (T.experts + 0.35)) / 0.3), 2) * (1 - easeOutCubic(progress(t, T.end - 0.5, T.end - 0.25)));
  if (s <= 0.01) return null;
  // needle: wavers near the middle, then swings over to "unlikely" on "highly unlikely"
  const swing = easeOutBack(progress(t, T.highly - 0.05, T.unlikely + 0.35), 1.6);
  const ang = lerp(-8 + 6 * Math.sin(2 * Math.PI * 1.4 * t), 62, swing); // deg from straight up, + = right
  const a = ((ang - 90) * Math.PI) / 180;
  const arc = (a0: number, a1: number) => {
    const p = (d: number) => `${x + r * Math.cos(((d - 90) * Math.PI) / 180)},${y + r * Math.sin(((d - 90) * Math.PI) / 180)}`;
    return `M${x},${y} L${p(a0)} A${r},${r} 0 0,1 ${p(a1)} Z`;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      <path d={arc(-90, 90)} fill="#FFFDF6" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <path d={arc(-90, -30)} fill="#F4A79F" />
      <path d={arc(30, 90)} fill="#A8D98A" />
      <path d={arc(-90, 90)} fill="none" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      {[-60, -30, 0, 30, 60].map((d) => {
        const q = ((d - 90) * Math.PI) / 180;
        return <line key={d} x1={x + r * 0.78 * Math.cos(q)} y1={y + r * 0.78 * Math.sin(q)} x2={x + r * 0.94 * Math.cos(q)} y2={y + r * 0.94 * Math.sin(q)} stroke={INK} strokeWidth={7} strokeLinecap="round" />;
      })}
      <line x1={x} y1={y} x2={x + r * 0.8 * Math.cos(a)} y2={y + r * 0.8 * Math.sin(a)} stroke={RED} strokeWidth={14} strokeLinecap="round" />
      <circle cx={x} cy={y} r={20} fill={INK} />
    </g>
  );
};

export const Outside: React.FC<{t: number}> = ({t}) => {
  const first = t < SHOT.source;
  const shake = first ? wobble(t, T.hit, 12, 9, 4) : 0;
  // the bomb falls (gravity: ease-in) onto the peak, landing in the pause after "Mountain,"
  const fallU = progress(t, T.bombs - 0.15, T.hit);
  const bombY = lerp(-BOMB_H - 40, M1.peak.y + 30 - BOMB_H, fallU * fallU);
  const bombX = lerp(M1.peak.x + 120, M1.peak.x, fallU);
  return (
    <DesignSpace background="#F8E3B6">
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${shake}px, ${shake * 0.4}px)`}}>
        <Desert />
        {first && t < T.hit ? (
          <Img src={staticFile(S.bomb.src)} style={{position: 'absolute', left: bombX - BOMB_W / 2, top: bombY, width: BOMB_W, height: BOMB_H, transform: `rotate(${-6 * (1 - fallU)}deg)`}} />
        ) : null}
        <MountainImg m={M1} />
        <Svg>
          {first ? (
            <>
              <Dust t={t} t0={T.hit} x={M1.peak.x} y={M1.peak.y + 50} r={130} dur={1.1} />
              <Dust t={t} t0={T.hit + 0.1} x={M1.peak.x - 120} y={M1.peak.y + 120} r={75} dur={0.9} />
              <Dust t={t} t0={T.hit + 0.14} x={M1.peak.x + 130} y={M1.peak.y + 110} r={80} dur={0.9} />
            </>
          ) : (
            <>
              {[700, 830, 960].map((x, i) => (
                <Pictogram key={x} x={x} y={GROUND + 6} h={200} color={['#5AA9E6', '#E8A15A', '#8C7BD6'][i]} coat={i === 1}
                  scale={easeOutBack(clamp01((t - (T.experts - 0.05 + i * 0.15)) / 0.3), 2.2) * (1 + 0.03 * Math.sin(2 * Math.PI * 1.2 * t + i)) * (1 - easeOutCubic(progress(t, T.end - 0.5, T.end - 0.25)))} />
              ))}
              <Gauge t={t} x={560} y={560} r={220} />
            </>
          )}
        </Svg>
        {first ? (
          <ThoughtCloud t={t} t0={T.fallout - 0.35} t1={SHOT.source - 0.05} x={420} y={520} w={480} h={340} from={DOT_HEAD}>
            <FalloutCloud x={-60} y={10} r={95} />
          </ThoughtCloud>
        ) : (
          <ThoughtCloud t={t} t0={T.weapon - 0.45} t1={T.experts + 0.1} x={420} y={520} w={480} h={340} from={DOT_HEAD}>
            <FalloutCloud x={0} y={10} r={100} />
          </ThoughtCloud>
        )}
        {first ? <Label t={t} t0={T.spread} t1={SHOT.source - 0.1} x={560} y={500} size={150} color={GOLD}>?</Label> : null}
        {!first ? (
          <>
            <Label t={t} t0={T.experts + 0.45} t1={T.end - 0.3} x={330} y={625} size={62}>likely</Label>
            <Label t={t} t0={T.experts + 0.45} t1={T.end - 0.3} x={800} y={625} size={62}>unlikely</Label>
            <Label t={t} t0={T.unlikely} t1={T.end - 0.3} x={560} y={740} size={96} color={GOLD}>highly unlikely</Label>
          </>
        ) : null}
        <DotHere t={t} />
      </div>
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- where fallout comes from
const PILE = [[-62, 0], [0, 0], [62, 0], [-31, -54], [31, -54], [0, -108]];
const PILE_AT = {x: 650, y: GROUND - 40};

export const Source: React.FC<{t: number}> = ({t}) => {
  const cloud = easeOutBack(clamp01((t - T.fallout2) / 0.35), 2);
  const star = easeOutBack(clamp01((t - (T.nuclear - 0.05)) / 0.3), 2.4) * (1 + 0.04 * Math.sin(2 * Math.PI * 2 * t));
  const arrow = easeOutCubic(progress(t, T.explosion - 0.1, T.explosion + 0.35));
  // the bomb drops onto the uranium pile
  const hit = T.uranium + 0.12;
  const fallU = progress(t, T.bombing - 0.1, hit);
  const bw = 80;
  const bh = (S.bomb.h * bw) / S.bomb.w;
  const bombY = lerp(760, PILE_AT.y - 190 - bh, fallU * fallU);
  const pileS = easeOutBack(clamp01((t - (T.bombing - 0.3)) / 0.3), 2);
  const jolt = wobble(t, hit, 10, 8, 5);
  const no = easeOutBack(clamp01((t - (T.cant - 0.05)) / 0.3), 2.4);
  return (
    <DesignSpace background="#F6EBD6">
      <Paper />
      <Svg>
        <StarBurst x={290} y={430} r={160} s={star} />
        <Arrow x0={470} y0={430} x1={630} y1={430} s={arrow} w={18} />
        <FalloutCloud x={830} y={410} r={165} scale={cloud} />
        {PILE.map(([dx, dy], i) => (
          <Pellet key={i} x={PILE_AT.x + dx * 1.35 + (t > hit ? jolt * (i % 2 ? 1 : -1) : 0)} y={PILE_AT.y - 10 + dy * 1.35} r={46} s={pileS} />
        ))}
        <Dust t={t} t0={hit} x={PILE_AT.x} y={PILE_AT.y - 80} r={80} dur={0.8} />
        {no > 0.01 ? (
          <g transform={`translate(${PILE_AT.x} ${PILE_AT.y - 80}) scale(${no})`} opacity={0.95}>
            <path d="M-120,-120 L120,120 M120,-120 L-120,120" stroke={INK} strokeWidth={46} strokeLinecap="round" />
            <path d="M-120,-120 L120,120 M120,-120 L-120,120" stroke={RED} strokeWidth={30} strokeLinecap="round" />
          </g>
        ) : null}
      </Svg>
      {t < hit ? (
        <Img src={staticFile(S.bomb.src)} style={{position: 'absolute', left: PILE_AT.x - bw / 2, top: bombY, width: bw, height: bh, opacity: fallU > 0 ? 1 : 0}} />
      ) : null}
      <Label t={t} t0={T.fallout2 + 0.1} x={830} y={650} size={80}>fallout</Label>
      <Label t={t} t0={T.nuclear} x={300} y={650} size={62}>nuclear explosion</Label>
      <Label t={t} t0={T.bombing} x={PILE_AT.x} y={820} size={72}>bomb + uranium</Label>
      <Label t={t} t0={T.cant} x={PILE_AT.x} y={920} size={80} color={RED}>no nuclear blast</Label>
      <DotHere t={t} />
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- the squeeze and the blast
const C = {x: 600, y: 640};
const BALL = 50;
const BALLS = [{a: 0, d: 0}, ...Array.from({length: 6}, (_, i) => ({a: (i / 6) * Math.PI * 2 - Math.PI / 2, d: 1}))];

export const Squeeze: React.FC<{t: number}> = ({t}) => {
  const ringR = lerp(330, BALL * 2, easeInOutCubic(progress(t, T.squeezes, T.together + 0.25)));
  const arrowS = popScale(t, T.bomb2 - 0.05, T.together + 0.1);
  const blastT = t - T.blast;
  const g = 2600;
  const ballPos = (b: (typeof BALLS)[number], i: number) => {
    const bx = C.x + Math.cos(b.a) * ringR * b.d;
    const by = C.y + Math.sin(b.a) * ringR * b.d;
    if (blastT <= 0) return {x: bx, y: by};
    // thrown out of the blast, falling with gravity, coming to rest on the floor
    const a = b.d === 0 ? -Math.PI / 2 - 0.25 : b.a + (rand(i + 3) - 0.5) * 0.5;
    const v = 950 + 350 * rand(i + 9);
    let vx = Math.cos(a) * v;
    const vy = Math.sin(a) * v - 500;
    const floor = GROUND - BALL;
    // time to reach the floor: by + vy t + g t^2 / 2 = floor
    const tf = (-vy + Math.sqrt(vy * vy + 2 * g * (floor - by))) / g;
    const tt = Math.min(blastT, tf);
    let x = bx + vx * tt;
    const y = blastT < tf ? by + vy * tt + 0.5 * g * tt * tt : floor;
    if (blastT > tf) x += vx * 0.08 * (1 - Math.exp(-(blastT - tf) * 8)); // a little skid
    vx = 0;
    return {x: Math.max(330, Math.min(1010, x)), y};
  };
  const glow = t > T.perfectly - 0.1 && t < T.blast;
  return (
    <DesignSpace background="#F6EBD6">
      <Paper />
      {glow ? <Glow t={t} t0={T.perfectly - 0.1} t1={T.blast} x={C.x} y={C.y} r={260} color="255, 226, 122" strength={0.75} /> : null}
      <Svg>
        {arrowS > 0.01
          ? BALLS.filter((b) => b.d).map((b, i) => {
              const r0 = ringR + 190;
              const r1 = ringR + 80;
              return <Arrow key={i} x0={C.x + Math.cos(b.a) * r0} y0={C.y + Math.sin(b.a) * r0} x1={C.x + Math.cos(b.a) * r1} y1={C.y + Math.sin(b.a) * r1} s={arrowS} w={12} />;
            })
          : null}
        <StarBurst x={C.x} y={C.y} r={240} s={blastT > 0 ? Math.sin(Math.PI * clamp01(blastT / 0.55)) * 1.1 : 0} fill="#FF8A3D" core="#FFD15C" />
        {BALLS.map((b, i) => {
          const p = ballPos(b, i);
          return <Pellet key={i} x={p.x} y={p.y} r={BALL} s={easeOutBack(clamp01((t - (SHOT.squeeze + 0.1 + i * 0.05)) / 0.3), 2)} />;
        })}
        <Dust t={t} t0={T.blast + 0.1} x={C.x} y={C.y} r={110} dur={0.9} fill="#E0D6C4" />
      </Svg>
      <FlashRing t={t} t0={T.perfectly} x={C.x} y={C.y} r={200} />
      <Label t={t} t0={SHOT.squeeze + 0.2} t1={T.ordinary - 0.1} x={C.x} y={210} size={84}>nuclear bomb</Label>
      <Label t={t} t0={T.ordinary} x={C.x} y={210} size={84} color={GOLD}>ordinary blast</Label>
      <Label t={t} t0={T.perfectly} t1={T.blast - 0.05} x={C.x + 60} y={1000} size={84} color={GOLD}>perfect squeeze</Label>
      <Label t={t} t0={T.scatters} x={C.x} y={1000} size={84}>scattered</Label>
      <DotHere t={t} />
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- the enrichment gas
const CYL_W = 660;
const CYL_CX = 650;
const CYL_K = CYL_W / S.cylinder.w;
const CYL = {x: CYL_CX - CYL_W / 2, y: 1150 - S.cylinder.h * CYL_K};
const VALVE = {x: CYL.x + S.cylinder.valve[0] * CYL_K, y: CYL.y + S.cylinder.valve[1] * CYL_K + 18};

const gasPuffs = (t0: number, t1: number): GasPuff[] => {
  const out: GasPuff[] = [];
  for (let at = t0, i = 0; at < t1; at += 0.28, i++) {
    out.push({at, dur: 2.4, from: VALVE, to: {x: VALVE.x + 160 + 420 * rand(i + 1), y: VALVE.y - 260 - 160 * rand(i + 5)}, size: 62 + 30 * rand(i + 2), arc: 60, seed: i});
  }
  return out;
};
const GAS = gasPuffs(T.gas - 0.2, SHOT.cutaway);

const Drop: React.FC<{x: number; y: number; r: number; color: string}> = ({x, y, r, color}) => (
  <path transform={`translate(${x} ${y})`} d={`M0,${-r * 1.7} C${r * 0.6},${-r * 0.6} ${r},0 ${r},${r * 0.35} A${r},${r} 0 0,1 ${-r},${r * 0.35} C${-r},0 ${-r * 0.6},${-r * 0.6} 0,${-r * 1.7} Z`}
    fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
);

export const Gas: React.FC<{t: number}> = ({t}) => {
  const acid = t >= T.acid;
  const cylS = easeOutBack(clamp01((t - SHOT.gas) / 0.35), 1.8);
  const drops: React.ReactNode[] = [];
  // damp air: blue drops drifting down into the gas; after "acid", green acid drops falling out of it
  for (let i = 0; i < 26; i++) {
    const at = T.turns - 0.2 + i * 0.16;
    const u = (t - at) / 1.1;
    if (u < 0 || u > 1) continue;
    const isAcid = at >= T.acid - 0.1;
    const x = 560 + 440 * rand(i + 11);
    const y = isAcid ? lerp(420, CYL.y + 40, u * u) : lerp(120, 420, u);
    drops.push(<Drop key={i} x={x} y={y} r={isAcid ? 16 : 14} color={isAcid ? ACID : '#7CC4F2'} />);
  }
  return (
    <DesignSpace background="#F6EBD6">
      <Paper />
      <div style={{position: 'absolute', left: CYL_CX, top: 1150, transformOrigin: '0 0', transform: `scale(${cylS})`}}>
        <Img src={staticFile(S.cylinder.src)} style={{position: 'absolute', left: -CYL_W / 2, top: -S.cylinder.h * CYL_K, width: CYL_W, height: S.cylinder.h * CYL_K}} />
      </div>
      <GasPuffs t={t} puffs={GAS} fill={acid ? '#DCE98A' : '#E9EBEE'} shade={acid ? '#C3D45F' : '#CDD2D8'} />
      <Svg>
        {drops}
      </Svg>
      <FlashRing t={t} t0={T.acid} x={820} y={430} r={160} />
      <Label t={t} t0={T.enrichment} x={CYL_CX} y={1225} size={76}>enrichment gas</Label>
      <Label t={t} t0={T.damp} x={330} y={330} size={76} color="#7CC4F2">damp air</Label>
      <Label t={t} t0={T.acid} x={820} y={250} size={110} color={ACID}>acid</Label>
      <DotHere t={t} />
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- inside the mountain
const M2 = mountainAt(560, 1040);
const CAVE = {x0: 410, x1: 760, y0: 1085, y1: GROUND - 36};

const cavePuffs = (): GasPuff[] => {
  const out: GasPuff[] = [];
  for (let at = SHOT.cutaway - 0.1, i = 0; at < SHOT.mountain2; at += 0.32, i++) {
    const x = lerp(CAVE.x0 + 70, CAVE.x1 - 70, rand(i + 4));
    out.push({at, dur: 2.0, from: {x, y: CAVE.y0 + 60}, to: {x: x + (rand(i + 8) - 0.5) * 80, y: CAVE.y1 - 40}, size: 38 + 18 * rand(i + 6), arc: 20, seed: i});
  }
  return out;
};
const CAVE_GAS = cavePuffs();

export const Cutaway: React.FC<{t: number}> = ({t}) => {
  const open = easeOutBack(clamp01((t - SHOT.cutaway) / 0.4), 1.6);
  const [, tr] = M2.tunnels;
  const rockArrow = easeOutCubic(progress(t, T.under - 0.1, T.rock + 0.3));
  // one puff drifts out of the right tunnel and stops close by
  const escape: GasPuff[] = t > T.wouldnt - 0.2 ? [{at: T.wouldnt - 0.2, dur: SHOT.mountain2 - T.wouldnt + 0.4, from: {x: tr.x - 20, y: tr.y - 10}, to: {x: tr.x + 120, y: tr.y - 30}, size: 52, seed: 3}] : [];
  const cx = (CAVE.x0 + CAVE.x1) / 2;
  const cy = (CAVE.y0 + CAVE.y1) / 2;
  return (
    <DesignSpace background="#F8E3B6">
      <Desert />
      <MountainImg m={M2} />
      <Svg>
        {/* the cut-away: a chamber and a passage out to the right tunnel, opening from its centre */}
        <g transform={`translate(${cx} ${cy}) scale(${open}) translate(${-cx} ${-cy})`}>
          <rect x={CAVE.x0} y={CAVE.y0} width={CAVE.x1 - CAVE.x0} height={CAVE.y1 - CAVE.y0} rx={46} fill="#4A3B33" stroke={INK} strokeWidth={9} />
          <rect x={CAVE.x1 - 30} y={CAVE.y1 - 70} width={tr.x - CAVE.x1 + 30} height={62} fill="#4A3B33" stroke={INK} strokeWidth={9} />
          <rect x={CAVE.x1 - 40} y={CAVE.y1 - 61} width={tr.x - CAVE.x1 + 34} height={44} fill="#4A3B33" />
          <rect x={CAVE.x0 + 20} y={CAVE.y1 - 22} width={CAVE.x1 - CAVE.x0 - 40} height={14} rx={7} fill="#6B5A4E" />
        </g>
        {/* ~100 m of rock above the chamber */}
        {rockArrow > 0.01 ? (
          <g>
            <line x1={cx} y1={M2.y0 - 20} x2={cx} y2={lerp(M2.y0 - 20, CAVE.y0 - 24, rockArrow)} stroke={INK} strokeWidth={10} strokeDasharray="22 16" strokeLinecap="round" />
            <Arrow x0={cx} y0={CAVE.y0 - 90} x1={cx} y1={CAVE.y0 - 14} s={rockArrow} w={12} />
          </g>
        ) : null}
      </Svg>
      <GasPuffs t={t} puffs={[...CAVE_GAS, ...escape]} fill="#DCE98A" shade="#C3D45F" ink={5} />
      <Label t={t} t0={T.heavy} t1={T.under - 0.1} x={cx} y={CAVE.y0 - 80} size={84} color={GOLD}>heavy</Label>
      <Label t={t} t0={T.rock} x={cx} y={M2.y0 - 90} size={72}>about 100 m of rock</Label>
      <Label t={t} t0={T.far} x={tr.x + 20} y={tr.y - 250} size={72} color={GOLD}>stays close</Label>
      <DotHere t={t} />
    </DesignSpace>
  );
};
