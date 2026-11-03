import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeInOutCubic, easeOutBack, lerp, popScale, progress, rand, wobble} from '../../kit/anim';
import {DesignSpace} from '../../kit/DesignSpace';
import {Label} from '../../kit/Label';
import {fontFamily} from '../../kit/font';
import {ObjectFace} from '../../kit/effects/ObjectFace';
import {ScrewJack} from '../../kit/effects/ScrewJack';
import {Glint} from '../../kit/effects/small';
import {SHOT, T} from './beats';
import {S} from './sprites';

// The swamp cross-section with the sewer pipe, the men at the jackscrews, and the row of Lake Street shops over
// five days, drawn in a 1080x1920 design space (action in the top ~55 %, captions sit below).
const INK = '#15151C';
const GOLD = '#F2C14E';

// ------------------------------------------------------------------------------------------- the swamp
const SURF = 600; // lake surface
const LAND = 570; // the city's ground, barely above it
const SHORE = 690;
const PIPE_X0 = 70;
const PIPE_X1 = 740;

const House: React.FC<{x: number; w: number; h: number; roof: string; wall: string; s: number}> = ({x, w, h, roof, wall, s}) => {
  if (s <= 0.01) return null;
  return (
    <g transform={`translate(${x + w / 2} ${LAND}) scale(${s}) translate(${-w / 2} 0)`}>
      <rect x={0} y={-h} width={w} height={h} fill={wall} stroke={INK} strokeWidth={6} />
      <path d={`M${-12},${-h} L${w / 2},${-h - w * 0.42} L${w + 12},${-h} Z`} fill={roof} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <rect x={w * 0.2} y={-h * 0.72} width={w * 0.22} height={h * 0.26} fill="#BFE6FF" stroke={INK} strokeWidth={4} />
      <rect x={w * 0.58} y={-h * 0.5} width={w * 0.24} height={h * 0.5} fill="#7A4B2A" stroke={INK} strokeWidth={4} />
    </g>
  );
};

const Frog: React.FC<{x: number; y: number; s: number; t: number}> = ({x, y, s, t}) => {
  if (s <= 0.01) return null;
  const blink = Math.sin(2 * Math.PI * 0.7 * t) > 0.96 ? 0.1 : 1;
  const croak = clamp01(1 - Math.abs(t - (T.swamp + 0.25)) / 0.18);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-34} rx={66} ry={40} fill="#6DBE45" stroke={INK} strokeWidth={6} />
      <ellipse cx={0} cy={-14 + croak * 10} rx={30 + croak * 22} ry={14 + croak * 18} fill="#F3E9A6" stroke={INK} strokeWidth={5} />
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <circle cx={sd * 30} cy={-74} r={20} fill="#6DBE45" stroke={INK} strokeWidth={6} />
          <ellipse cx={sd * 30} cy={-74} rx={11} ry={13 * blink} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={sd * 30 + 2} cy={-72} r={5 * blink} fill={INK} />
        </g>
      ))}
    </g>
  );
};

/** The pipe's end heights at time t: flat, tilted downhill (the ideal), then flat again ("There wasn't one"). */
const pipeEnds = (t: number) => {
  const tilt = easeInOutCubic(progress(t, T.downhill - 0.3, T.slope + 0.2)) * (1 - easeInOutCubic(progress(t, T.wasnt - 0.1, T.one + 0.15)));
  return {y0: lerp(650, 616, tilt), y1: lerp(650, 712, tilt), tilt};
};

export const Swamp: React.FC<{t: number}> = ({t}) => {
  const {y0, y1, tilt} = pipeEnds(t);
  const draw = easeInOutCubic(progress(t, T.sewers - 0.1, T.sewers + 0.55));
  const xEnd = lerp(PIPE_X0, PIPE_X1, draw);
  const yAt = (x: number) => lerp(y0, y1, (x - PIPE_X0) / (PIPE_X1 - PIPE_X0));
  // dirty water in the pipe: flows downhill while tilted, then stalls and sloshes
  const flowing = t > T.downhill - 0.2;
  const stall = progress(t, T.wasnt, T.one + 0.4);
  const sad = popScale(t, T.one - 0.1, SHOT.street2 + 1, 0.3, 0.2);
  const frogS = popScale(t, T.swamp - 0.05, T.sewers - 0.1, 0.3, 0.25);
  return (
    <DesignSpace background="#CBEAF7">
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <linearGradient id="swampSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8CCBF0" />
            <stop offset="100%" stopColor="#E6F5FA" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={1080} height={SURF} fill="url(#swampSky)" />
        {/* lake */}
        <rect x={SHORE - 40} y={SURF} width={1080} height={1400} fill="#3C8FD6" />
        <path d={Array.from({length: 9}, (_, i) => `M${SHORE + i * 50 + ((t * 40) % 50)},${SURF + 6} q12,-12 24,0`).join(' ')} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" />
        <line x1={SHORE - 40} y1={SURF} x2={1080} y2={SURF} stroke={INK} strokeWidth={8} />
        {/* the swampy ground the city sits on */}
        <path d={`M0,${LAND} L${SHORE},${LAND} Q${SHORE + 30},${LAND + 20} ${SHORE + 10},${SURF + 120} L${SHORE - 30},1920 L0,1920 Z`} fill="#6B6A3C" stroke={INK} strokeWidth={8} />
        <rect x={0} y={SURF + 260} width={SHORE - 10} height={1200} fill="#4E4630" />
        <line x1={0} y1={SURF + 260} x2={SHORE - 12} y2={SURF + 260} stroke={INK} strokeWidth={6} />
        {Array.from({length: 18}, (_, i) => (
          <ellipse key={i} cx={30 + rand(i + 3) * 620} cy={LAND + 40 + rand(i + 9) * 200} rx={22 + 18 * rand(i)} ry={9} fill="#58572F" />
        ))}
        {/* water seeping in: the ground is full of it */}
        {Array.from({length: 10}, (_, i) => {
          const r = popScale(t, T.swamp + i * 0.05, SHOT.street2 + 1, 0.25, 0.2);
          return r > 0 ? <circle key={i} cx={50 + rand(i + 21) * 600} cy={LAND + 80 + rand(i + 31) * 160 - ((t * 18 + i * 13) % 40)} r={8 * r} fill="#9DD3F2" stroke={INK} strokeWidth={3} /> : null;
        })}
        {/* reeds on "swamp" */}
        {Array.from({length: 9}, (_, i) => {
          const s = easeOutBack(clamp01((t - (T.swamp + i * 0.04)) / 0.3), 2);
          const x = 20 + i * 75 + 20 * rand(i + 50);
          const h = (60 + 40 * rand(i + 60)) * s;
          const sway = 6 * Math.sin(2 * Math.PI * 0.8 * t + i);
          return s > 0.01 ? (
            <g key={i}>
              <path d={`M${x},${LAND} q${sway},${-h / 2} ${sway * 1.6},${-h}`} fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
              <path d={`M${x},${LAND} q${sway},${-h / 2} ${sway * 1.6},${-h}`} fill="none" stroke="#5E9E3A" strokeWidth={5} strokeLinecap="round" />
              {i % 3 === 0 ? <ellipse cx={x + sway * 1.6} cy={LAND - h - 10} rx={8} ry={20} fill="#7A4B2A" stroke={INK} strokeWidth={4} /> : null}
            </g>
          ) : null;
        })}
        {/* the city */}
        <House x={40} w={140} h={150} roof="#9B4A3A" wall="#E8D3B0" s={easeOutBack(clamp01((t - T.city) / 0.3), 2)} />
        <House x={230} w={110} h={200} roof="#4E5E8C" wall="#F2E6CF" s={easeOutBack(clamp01((t - T.city - 0.1) / 0.3), 2)} />
        <House x={400} w={150} h={130} roof="#7A4B2A" wall="#E2C9A0" s={easeOutBack(clamp01((t - T.city - 0.2) / 0.3), 2)} />
        <Frog x={600} y={LAND + 8} s={frogS} t={t} />
        {/* "barely above the lake": a gold bracket between land and water */}
        {t > T.barely - 0.05 ? (
          <g opacity={clamp01((t - T.barely + 0.05) / 0.2)}>
            <path d={`M${SHORE + 50},${LAND} L${SHORE + 80},${LAND} L${SHORE + 80},${SURF} L${SHORE + 50},${SURF}`} fill="none" stroke={INK} strokeWidth={14} strokeLinejoin="round" />
            <path d={`M${SHORE + 50},${LAND} L${SHORE + 80},${LAND} L${SHORE + 80},${SURF} L${SHORE + 50},${SURF}`} fill="none" stroke={GOLD} strokeWidth={7} strokeLinejoin="round" />
            <line x1={SHORE - 10} y1={LAND} x2={SHORE + 50} y2={LAND} stroke={GOLD} strokeWidth={4} strokeDasharray="10 8" />
          </g>
        ) : null}
        {/* the sewer pipe */}
        {draw > 0.01 ? (
          <g>
            <line x1={PIPE_X0} y1={yAt(PIPE_X0)} x2={xEnd} y2={yAt(xEnd)} stroke={INK} strokeWidth={58} strokeLinecap="round" />
            <line x1={PIPE_X0} y1={yAt(PIPE_X0)} x2={xEnd} y2={yAt(xEnd)} stroke="#9AA3AD" strokeWidth={44} strokeLinecap="round" />
            <line x1={PIPE_X0} y1={yAt(PIPE_X0) - 10} x2={xEnd} y2={yAt(xEnd) - 10} stroke="#C9D0D6" strokeWidth={8} strokeLinecap="round" />
            {flowing
              ? Array.from({length: 7}, (_, i) => {
                  // along-pipe position 0..1: moves with the tilt, stalls and sloshes once it is flat
                  const run = (((t - T.downhill) * 0.55 * (1 - stall) + i / 7) % 1 + 1) % 1;
                  const slosh = 0.45 + 0.08 * i - 0.25 + wobble(t, T.wasnt, 0.06, 1.6, 1.5);
                  const u = lerp(run, slosh, stall);
                  const x = lerp(PIPE_X0 + 30, PIPE_X1 - 20, u);
                  return <circle key={i} cx={x} cy={yAt(x) + 6} r={13} fill="#8A7A55" stroke={INK} strokeWidth={3} />;
                })
              : null}
            {/* dirty water dropping into the lake while it flows */}
            {tilt > 0.6
              ? Array.from({length: 4}, (_, i) => {
                  const u = ((t * 1.6 + i / 4) % 1);
                  return <circle key={`o${i}`} cx={PIPE_X1 + 30 + u * 40} cy={y1 + u * u * 60} r={10 * (1 - u * 0.5)} fill="#8A7A55" stroke={INK} strokeWidth={3} />;
                })
              : null}
          </g>
        ) : null}
        {/* the downhill arrow while tilted */}
        {tilt > 0.05 ? (
          <g opacity={tilt}>
            <path d={`M${200},${y0 - 80} L${620},${y1 - 80}`} stroke={INK} strokeWidth={16} strokeLinecap="round" />
            <path d={`M${200},${y0 - 80} L${620},${y1 - 80}`} stroke={GOLD} strokeWidth={8} strokeLinecap="round" />
            <path d={`M${590},${y1 - 110} L${632},${y1 - 78} L${584},${y1 - 58}`} fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M${590},${y1 - 110} L${632},${y1 - 78} L${584},${y1 - 58}`} fill="none" stroke={GOLD} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </svg>
      {sad > 0.01 ? <ObjectFace id="pipe" x={625} y={yAt(625) - 2} r={130} brow="worried" mouth="frown" pop={sad} look={{x: 0.4, y: 0.6}} ink={5} /> : null}
      <Label t={t} t0={T.lake - 0.05} t1={T.sewers - 0.1} x={760} y={430} size={70}>
        lake
      </Label>
      <Label t={t} t0={T.city - 0.05} t1={T.sewers - 0.1} x={290} y={250} size={70}>
        Chicago
      </Label>
      <Label t={t} t0={T.sewers} t1={SHOT.street2 + 1} x={360} y={860} size={64}>
        sewer
      </Label>
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- the jackscrews
type Sprite = {src: string; w: number; h: number; bottom: number; plate: readonly number[]};
const WK = S.worker_jack as unknown as Sprite;
// clicks of the ratchet (two staggered files, ~1 click / 0.5 s): each push lands on one
const PUSHES = Array.from({length: 5}, (_, i) => SHOT.jacks + 0.2 + i * 0.5);

/** One worker with his jack, the jack's top plate pinned to (px, py), `s` = sprite scale. */
const Worker: React.FC<{t: number; px: number; py: number; s: number; phase: number; dim?: boolean}> = ({t, px, py, s, phase, dim = false}) => {
  // push = a quick lean into the lever on every click, settling back (rotation about the plate)
  const lean = PUSHES.reduce((a, p) => a + wobble(t, p + phase, 5, 2.4, 6), 0);
  const left = px - WK.plate[0] * s;
  const top = py - WK.plate[1] * s;
  return (
    <div style={{position: 'absolute', left: px, top: py, transformOrigin: '0 0', transform: `rotate(${lean * 0.6}deg)`}}>
      <Img
        src={staticFile(WK.src)}
        style={{position: 'absolute', left: left - px, top: top - py, width: WK.w * s, height: WK.h * s, filter: dim ? 'brightness(0.72) saturate(0.8)' : undefined}}
      />
    </div>
  );
};

export const Jacks: React.FC<{t: number}> = ({t}) => {
  const UNDER = 520; // the building's underside (near edge)
  const FAR = 640; // where the far row's plates meet it
  const sFront = 0.55;
  const sBack = 0.3;
  const floorFront = UNDER + (WK.bottom - WK.plate[1]) * sFront;
  const floorBack = FAR + (WK.bottom - WK.plate[1]) * sBack;
  const shakeY = PUSHES.reduce((a, p) => a + wobble(t, p, 4, 9, 14), 0);
  return (
    <DesignSpace background="#2A211B">
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {/* the dug-out space under the building: back wall of earth, floor */}
        <rect x={0} y={FAR} width={1080} height={floorBack - FAR + 40} fill="#5A4231" />
        <rect x={0} y={floorBack} width={1080} height={1920} fill="#7B5A3C" />
        <line x1={0} y1={floorBack} x2={1080} y2={floorBack} stroke={INK} strokeWidth={6} />
        <rect x={0} y={floorFront} width={1080} height={1920} fill="#8E6A46" />
        <line x1={0} y1={floorFront} x2={1080} y2={floorFront} stroke={INK} strokeWidth={8} />
        {/* the building's underside seen from below: heavy timbers */}
        <g transform={`translate(0 ${shakeY})`}>
          <path d={`M0,${UNDER} L1080,${UNDER} L1080,${FAR} L0,${FAR} Z`} fill="#4A3424" stroke={INK} strokeWidth={8} />
          {Array.from({length: 7}, (_, i) => (
            <path key={i} d={`M${i * 180 - 40},${UNDER} L${i * 160},${FAR}`} stroke={INK} strokeWidth={6} />
          ))}
        </g>
      </svg>
      {/* the brick building above */}
      <div style={{position: 'absolute', left: -60, top: UNDER + shakeY - S.building_a.bottom * 1.2, transform: 'none'}}>
        <Img src={staticFile(S.building_a.src)} style={{width: S.building_a.w * 1.2, height: S.building_a.h * 1.2}} />
      </div>
      {/* far row (darker, smaller), then the near row */}
      {[90, 330, 570, 810].map((x, i) => (
        <Worker key={`b${i}`} t={t} px={x} py={FAR + shakeY} s={sBack} phase={0.12 * i} dim />
      ))}
      {[120, 600].map((x, i) => (
        <Worker key={`f${i}`} t={t} px={x} py={UNDER + shakeY} s={sFront} phase={0.18 * i} />
      ))}
      <Label t={t} t0={T.men - 0.05} t1={SHOT.row + 1} x={300} y={170} size={92} color={GOLD}>
        600 men
      </Label>
      <Label t={t} t0={T.jacks - 0.05} t1={SHOT.row + 1} x={600} y={330} size={84}>
        6,000 jackscrews
      </Label>
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- the row of shops
const STREET = 1180;
const ROW_H = 740;
const DAY0 = T.row - 0.05;
const DAY_LEN = 0.47; // five days, the fifth ends just after "days"

/** 0 = noon, 1 = midnight, for the fast day/night cycle. */
const nightAt = (t: number) => {
  if (t < DAY0) return 0;
  const d = (t - DAY0) / DAY_LEN;
  if (d >= 5) return 0;
  return 0.5 - 0.5 * Math.cos(2 * Math.PI * (d % 1));
};

export const Row: React.FC<{t: number}> = ({t}) => {
  const night = nightAt(t);
  const lift = 110 * easeInOutCubic(progress(t, T.lifted2 - 0.1, T.days + 0.6));
  const B = STREET - 10 - lift;
  const sky = (a: string, b: string) => `rgb(${[0, 1, 2].map((i) => Math.round(lerp(parseInt(a.slice(1 + 2 * i, 3 + 2 * i), 16), parseInt(b.slice(1 + 2 * i, 3 + 2 * i), 16), night))).join(',')})`;
  const day = Math.min(5, Math.floor(Math.max(0, t - DAY0) / DAY_LEN) + 1);
  const dayIn = (t - DAY0) % DAY_LEN;
  const fronts: readonly {k: 'building_a' | 'building_b'; hue: number}[] = [
    {k: 'building_b', hue: 0},
    {k: 'building_a', hue: 0},
    {k: 'building_b', hue: 150},
    {k: 'building_a', hue: 200},
    {k: 'building_b', hue: 290},
    {k: 'building_a', hue: 60},
  ];
  let x = -150;
  const placed = fronts.map((f) => {
    const sp = S[f.k];
    const s = ROW_H / sp.h;
    const p = {...f, x, s, w: sp.w * s};
    x += sp.w * s - 6;
    return p;
  });
  // sun and moon arc over the rooftops
  const phase = t < DAY0 ? 0 : ((t - DAY0) / DAY_LEN) % 1;
  const a = Math.PI * (phase * 2);
  return (
    <DesignSpace background={sky('#9FD4F2', '#1B2550')}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {night > 0.3
          ? Array.from({length: 24}, (_, i) => (
              <circle key={i} cx={rand(i + 70) * 1080} cy={40 + rand(i + 90) * 300} r={3 + 3 * rand(i)} fill="#FFF6C8" opacity={(night - 0.3) / 0.7} />
            ))
          : null}
        {t >= DAY0 && t < DAY0 + 5 * DAY_LEN ? (
          <>
            <circle cx={540 - 420 * Math.cos(a)} cy={420 - 300 * Math.sin(a)} r={46} fill="#FFD447" stroke={INK} strokeWidth={6} opacity={Math.sin(a) > -0.05 ? 1 : 0} />
            <circle cx={540 + 420 * Math.cos(a)} cy={420 + 300 * Math.sin(a)} r={38} fill="#F4F1E4" stroke={INK} strokeWidth={6} opacity={Math.sin(a) < 0.05 ? 1 : 0} />
          </>
        ) : null}
        {/* the voids under the shops and their jacks */}
        <rect x={0} y={B - 4} width={1080} height={STREET - B + 6} fill="#3B2B20" />
        {Array.from({length: 11}, (_, i) => (
          <ScrewJack key={i} x={40 + i * 100} yTop={B} yBottom={STREET + 2} w={56} turn={t * 1.4 + i * 0.37} ink={3.5} />
        ))}
      </svg>
      {placed.map((p, i) => (
        <div key={i} style={{position: 'absolute', left: p.x, top: B - S[p.k].bottom * p.s}}>
          <Img
            src={staticFile(S[p.k].src)}
            style={{width: p.w, height: ROW_H, filter: `hue-rotate(${p.hue}deg) brightness(${1 - 0.45 * night})`}}
          />
          {/* lamps lit at night: the shops never closed */}
          {night > 0.2
            ? [...S[p.k].windows, S[p.k].shop].map((wb, j) => (
                <div
                  key={j}
                  style={{
                    position: 'absolute', left: wb[0] * p.s, top: wb[1] * p.s, width: wb[2] * p.s, height: wb[3] * p.s,
                    background: '#FFD86B', opacity: (night - 0.2) * 1.1, borderRadius: 4,
                  }}
                />
              ))
            : null}
        </div>
      ))}
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={0} y={STREET} width={1080} height={900} fill="#B98A58" />
        <line x1={0} y1={STREET} x2={1080} y2={STREET} stroke={INK} strokeWidth={8} />
        {/* the street sign */}
        <rect x={86} y={STREET - 300} width={16} height={300} fill="#3E3328" stroke={INK} strokeWidth={4} />
      </svg>
      <div
        style={{
          position: 'absolute', left: 30, top: STREET - 370, width: 300, height: 82, borderRadius: 10,
          background: '#2F5D3A', border: `6px solid ${INK}`, textAlign: 'center', lineHeight: '74px',
          fontFamily, fontSize: 50, color: '#FFFFFF', WebkitTextStroke: `7px ${INK}`, paintOrder: 'stroke fill',
          transform: `scale(${easeOutBack(clamp01((t - (T.lakeSt - 0.1)) / 0.3), 2.2)})`, transformOrigin: '50% 100%',
        }}
      >
        LAKE STREET
      </div>
      {t >= DAY0 ? (
        <Label t={t} t0={DAY0 + (day - 1) * DAY_LEN} x={540} y={120} size={day === 5 ? 96 : 84} color={day === 5 ? GOLD : '#FFFFFF'}>
          {`Day ${day}`}
        </Label>
      ) : null}
      {dayIn < 0.12 && t >= DAY0 && day <= 5 ? <Glint t={t} t0={DAY0 + (day - 1) * DAY_LEN} x={700} y={90} r={26} ink={3} /> : null}
    </DesignSpace>
  );
};
