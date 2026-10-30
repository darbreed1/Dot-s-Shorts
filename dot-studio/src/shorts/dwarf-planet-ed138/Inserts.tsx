import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeInOutCubic, easeOutBack, easeOutCubic, kick, lerp, popScale, progress, wobble} from '../../kit/anim';
import {DesignSpace} from '../../kit/DesignSpace';
import {Label} from '../../kit/Label';
import {NightSky} from '../../kit/effects/NightSky';
import {ObjectFace} from '../../kit/effects/ObjectFace';
import {Band, Earth, MilkyWay, Sun, bandStars} from '../../kit/effects/Space';
import {DetectBox, DrawnCircle, SweatDrop} from '../../kit/effects/small';
import {sparklePath} from '../../kit/effects/shapes';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {Ball} from './Ball';
import {SHOT, T} from './beats';
import {S} from './sprites';

// The four space cut-aways, drawn in a 1080x1920 design space (DesignSpace scales them to the composition).
const INK = '#15151C';
const GOLD = '#F2C14E';
const SPACE_TOP = '#0E1236';
const SPACE_BOTTOM = '#2A2D6B';

const Space: React.FC<{t: number; children: React.ReactNode}> = ({t, children}) => (
  <>
    <NightSky t={t} moon={null} top={SPACE_TOP} bottom={SPACE_BOTTOM} count={70} />
    <DesignSpace>{children}</DesignSpace>
  </>
);

// ------------------------------------------------------------------------------------------- 46 times farther
// A dotted ruler from the Sun along a diagonal, one tick per Sun-Earth distance. The view zooms out while the
// ticks count to 46 and the new object comes into view at the end.
const SUN0 = {x: 190, y: 210};
const DIR = (() => {
  const dx = 900 - SUN0.x;
  const dy = 1120 - SUN0.y;
  const L = Math.hypot(dx, dy);
  return {x: dx / L, y: dy / L, L};
})();
const P_END = DIR.L / 46;
const P_START = 300;

export const Ruler: React.FC<{t: number}> = ({t}) => {
  const z = easeInOutCubic(progress(t, 7.62, 9.05));
  const p = Math.exp(lerp(Math.log(P_START), Math.log(P_END), z)); // design px per Sun-Earth distance
  const at = (u: number) => ({x: SUN0.x + DIR.x * u * p, y: SUN0.y + DIR.y * u * p});
  const n = Math.max(1, Math.min(46, Math.floor(1 + 45.999 * easeInOutCubic(progress(t, T.times - 0.05, 9.1)))));
  const sunR = Math.min(150, p * 0.42);
  const earthR = Math.max(6, Math.min(40, p * 0.15));
  const earth = at(1);
  const obj = at(46);
  const tip = at(n);
  const sunPulse = 1 + kick(t, T.sun, 0.25, 3, 6);
  const earthPulse = 1 + kick(t, T.earth, 0.5, 3, 6);
  const objIn = popScale(t, 8.6, 99, 0.3);
  const done = t >= 9.12;
  return (
    <Space t={t}>
      <WorldSvg box={[0, 0, 1080, 1920]}>
        {/* the dashed line to the tip, then a tick dot at every whole distance */}
        <line x1={SUN0.x} y1={SUN0.y} x2={tip.x} y2={tip.y} stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={4} strokeDasharray="10 10" />
        {Array.from({length: n}, (_, i) => {
          const q = at(i + 1);
          const big = (i + 1) % 10 === 0 || i === 0;
          return <circle key={i} cx={q.x} cy={q.y} r={big ? 9 : 6} fill={big ? GOLD : '#FFFFFF'} stroke={INK} strokeWidth={3} />;
        })}
      </WorldSvg>
      <Sun t={t} x={SUN0.x} y={SUN0.y} r={sunR} pulse={sunPulse} />
      {sunR > 40 ? <ObjectFace id="sun" x={SUN0.x} y={SUN0.y + sunR * 0.05} r={sunR * 0.95} open={1} brow="relaxed" mouth="smile" look={{x: 0.6, y: 0.6}} pop={sunPulse} /> : null}
      <Earth x={earth.x} y={earth.y} r={earthR} pulse={earthPulse} />
      {objIn > 0 ? <Ball id="objR" sprite={S.ed138} x={obj.x} y={obj.y} R={52 * objIn} face={{open: 1, brow: 'raised', mouth: 'smile', look: {x: -0.7, y: -0.7}}} /> : null}
      <DetectBox t={t} t0={T.sun} t1={T.earth - 0.05} x={SUN0.x} y={SUN0.y} r={Math.max(36, sunR * 1.6)} />
      <DetectBox t={t} t0={T.earth} t1={SHOT.size} x={earth.x} y={earth.y} r={Math.max(26, earthR * 2)} color="#8FD0FF" />
      {/* the running count beside the tip, then the big 46x */}
      {!done ? (
        <Label t={t} t0={T.times - 0.05} x={tip.x + 110} y={tip.y - 10} size={72} color={GOLD}>
          {`${n}×`}
        </Label>
      ) : (
        <Label t={t} t0={9.12} x={obj.x - 160} y={obj.y - 40} size={150} color={GOLD}>
          46×
        </Label>
      )}
      <Label t={t} t0={SHOT.ruler + 0.05} t1={8.0} x={earth.x + 150} y={earth.y + 10} size={64}>
        1×
      </Label>
    </Space>
  );
};

// ------------------------------------------------------------------------------------------- up to 1,500 km
const PLUTO = {x: 300, y: 700, R: 235}; // Pluto is 2,377 km across
const OBJ = {x: 790, y: 720};
const rFor = (km: number) => (PLUTO.R * km) / 2377;

export const SizeCompare: React.FC<{t: number}> = ({t}) => {
  const grow = easeInOutCubic(progress(t, T.fifteen, T.km + 0.05));
  const inflate = progress(t, T.fifteen, T.km + 0.05);
  const r = lerp(rFor(600), rFor(1500), grow) * popScale(t, T.might - 0.05, 99, 0.3);
  // an "inhale" stretch while it inflates, then a springy settle
  const breathe = Math.sin(Math.PI * inflate) * 0.06 + wobble(t, T.km + 0.05, 0.05, 3, 6);
  const plutoWorried = t >= T.fifteen + 0.2;
  const plutoBob = 1 + kick(t, SHOT.size + 0.1, 0.03, 3, 6) + (plutoWorried ? kick(t, T.fifteen + 0.2, -0.04, 4, 7) : 0);
  const arrowY = OBJ.y + rFor(1500) + 70;
  return (
    <Space t={t}>
      <Ball id="plutoS" sprite={S.pluto} x={PLUTO.x} y={PLUTO.y} R={PLUTO.R} sx={2 - plutoBob} sy={plutoBob}
        face={plutoWorried ? {open: 1, brow: 'worried', mouth: 'o', look: {x: 1, y: 0.1}} : {open: 1, brow: 'relaxed', mouth: 'smile', look: {x: 1, y: 0.2}}} />
      <Label t={t} t0={SHOT.size + 0.1} x={PLUTO.x} y={PLUTO.y + PLUTO.R + 75} size={70}>
        Pluto
      </Label>
      <Label t={t} t0={SHOT.size + 0.25} x={PLUTO.x} y={PLUTO.y + PLUTO.R + 150} size={52} color={GOLD}>
        2,377 km
      </Label>
      {/* the small end of the estimate stays as a dashed ring */}
      {t >= T.might ? (
        <WorldSvg box={[OBJ.x - 100, OBJ.y - 100, OBJ.x + 100, OBJ.y + 100]}>
          <circle cx={OBJ.x} cy={OBJ.y} r={rFor(600)} fill="none" stroke="#FFFFFF" strokeOpacity={0.8} strokeWidth={5} strokeDasharray="14 10" />
        </WorldSvg>
      ) : null}
      {r > 1 ? (
        <Ball id="objS" sprite={S.ed138} x={OBJ.x} y={OBJ.y} R={r} sx={1 - breathe * 0.5} sy={1 + breathe}
          face={{open: 1, brow: grow > 0.05 ? 'raised' : 'relaxed', mouth: grow > 0.95 ? 'grin' : 'smile', look: {x: -0.8, y: 0}}} />
      ) : null}
      {/* width arrow under the object, growing with it */}
      {t >= T.fifteen ? (
        <WorldSvg box={[OBJ.x - 200, arrowY - 30, OBJ.x + 200, arrowY + 30]}>
          {(() => {
            const half = Math.max(r, rFor(600));
            const head = 16;
            const d = `M${OBJ.x - half},${arrowY} L${OBJ.x + half},${arrowY} M${OBJ.x - half + head},${arrowY - head} L${OBJ.x - half},${arrowY} L${OBJ.x - half + head},${arrowY + head} M${OBJ.x + half - head},${arrowY - head} L${OBJ.x + half},${arrowY} L${OBJ.x + half - head},${arrowY + head}`;
            return (
              <>
                <path d={d} fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
                <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              </>
            );
          })()}
        </WorldSvg>
      ) : null}
      <Label t={t} t0={T.wide - 0.1} x={OBJ.x} y={arrowY + 75} size={52} color={GOLD}>
        600–1,500 km
      </Label>
      <Label t={t} t0={SHOT.size + 0.2} t1={T.might} x={OBJ.x} y={OBJ.y} size={120}>
        ?
      </Label>
    </Space>
  );
};

// ------------------------------------------------------------------------------------------- the crowded sky
const BAND: Band = {x0: -100, y0: 1150, x1: 1180, y1: 150, w: 150};
const CROSS = {x: 285, y: 820, s: 105}; // the Southern Cross: Gacrux, Acrux, Mimosa, Delta, Epsilon
const CROSS_STARS: readonly (readonly [number, number, number])[] = [
  [0, -1, 1], [0.12, 1.1, 1.1], [-0.78, 0.12, 0.95], [0.62, -0.18, 0.8], [0.36, 0.42, 0.55],
];
const DOT_SKY = {feet: {x: 245, y: 1905}, s: 0.45};
// the slow dot creeps up-left into the band and gets lost in the crowd there
const DOT_PATH = {from: {x: 930, y: 700}, to: {x: 700, y: 545}};
const SWARM: Band = {x0: 630, y0: 600, x1: 770, y1: 490, w: 42};

export const SkySearch: React.FC<{t: number}> = ({t}) => {
  const md = S.dot_magnify;
  const ds = DOT_SKY.s;
  const dotLeft = DOT_SKY.feet.x - md.feet[0] * ds;
  const dotTop = DOT_SKY.feet.y - md.feet[1] * ds;
  const breathe = 1 + 0.009 * Math.sin(2 * Math.PI * 0.6 * t);
  const crossPop = (i: number) => popScale(t, T.southern + i * 0.07, 99, 0.25);
  const lines = easeOutCubic(progress(t, T.southern + 0.35, T.southern + 0.8));
  const cs = (i: number) => ({x: CROSS.x + CROSS_STARS[i][0] * CROSS.s, y: CROSS.y + CROSS_STARS[i][1] * CROSS.s});
  // the slow dot
  const move = easeInOutCubic(progress(t, T.one, T.lost + 0.25));
  const obj = {x: lerp(DOT_PATH.from.x, DOT_PATH.to.x, move), y: lerp(DOT_PATH.from.y, DOT_PATH.to.y, move)};
  const objIn = popScale(t, T.one - 0.05, 99, 0.25);
  const lostU = clamp01((t - (T.lost + 0.05)) / 0.35); // outline + eyes fade: it is just one more star now
  // search ring: follows the dot, then loses it and hunts around
  const hunt = t > T.lost + 0.25 ? {x: 70 * Math.sin(2 * Math.PI * 1.3 * (t - T.lost)), y: 35 * Math.sin(2 * Math.PI * 2.1 * (t - T.lost) + 1)} : {x: 0, y: 0};
  const ringIn = popScale(t, T.one + 0.1, SHOT.round, 0.25);
  const ring = {x: obj.x + hunt.x, y: obj.y + hunt.y};
  const swarm = React.useMemo(() => bandStars(SWARM, 60, 9), []);
  return (
    <Space t={t}>
      <MilkyWay t={t} band={BAND} bandIn={[T.crowded - 0.2, T.milky + 0.2]} starsIn={[T.crowded, T.milky + 0.55]} count={460} box={[-200, 0, 1280, 1500]} />
      <WorldSvg box={[0, 0, 1080, 1920]}>
        {/* Southern Cross */}
        {lines > 0 ? (
          <g stroke="#CFC8FF" strokeOpacity={0.7} strokeWidth={4} strokeDasharray="10 9" strokeLinecap="round">
            <line x1={cs(0).x} y1={cs(0).y} x2={lerp(cs(0).x, cs(1).x, lines)} y2={lerp(cs(0).y, cs(1).y, lines)} />
            <line x1={cs(2).x} y1={cs(2).y} x2={lerp(cs(2).x, cs(3).x, lines)} y2={lerp(cs(2).y, cs(3).y, lines)} />
          </g>
        ) : null}
        {CROSS_STARS.map((c, i) => {
          const p = crossPop(i);
          return p > 0 ? <path key={i} d={sparklePath(cs(i).x, cs(i).y, 24 * c[2] * p)} fill="#FFF6D8" stroke={INK} strokeWidth={3} /> : null;
        })}
        {/* the swarm that hides the dot */}
        {swarm.map((s, i) => {
          const p = easeOutBack(clamp01((t - (T.lost - 0.25 + s.order * 0.5)) / 0.18), 2.5);
          return p > 0 ? <circle key={i} cx={s.x} cy={s.y} r={(s.size / 2.2) * p} fill="#FFF6D8" /> : null;
        })}
        {/* the slow dot: a tiny grey ball with eyes, motion lines while it creeps */}
        {objIn > 0 ? (
          <g transform={`translate(${obj.x} ${obj.y}) scale(${objIn})`}>
            <circle r={11} fill={lostU < 1 ? '#C9C4DA' : '#FFF6D8'} stroke={INK} strokeWidth={4 * (1 - lostU)} />
            {lostU < 1 ? (
              <g opacity={1 - lostU}>
                <circle cx={-3.5} cy={-1.5} r={2.2} fill={INK} />
                <circle cx={3.5} cy={-1.5} r={2.2} fill={INK} />
              </g>
            ) : null}
            {t > T.one && t < T.lost ? (
              <g stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={4} strokeLinecap="round">
                <line x1={22} y1={8} x2={40} y2={20} />
                <line x1={20} y1={18} x2={34} y2={28} />
              </g>
            ) : null}
          </g>
        ) : null}
        {/* search ring with a handle (Dot's lens, seen from far away) */}
        {ringIn > 0 ? (
          <g transform={`translate(${ring.x} ${ring.y}) scale(${ringIn})`}>
            <line x1={46} y1={46} x2={92} y2={92} stroke={INK} strokeWidth={22} strokeLinecap="round" />
            <line x1={46} y1={46} x2={92} y2={92} stroke="#9B6A3A" strokeWidth={12} strokeLinecap="round" />
            <circle r={62} fill="rgba(255, 255, 255, 0.10)" stroke={INK} strokeWidth={18} />
            <circle r={62} fill="none" stroke={GOLD} strokeWidth={9} />
          </g>
        ) : null}
        {/* ground ridge at the bottom */}
        <path d="M-20,1700 Q160,1640 330,1690 T700,1670 T1100,1690 L1100,1940 L-20,1940 Z" fill="#2B2440" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      </WorldSvg>
      <Label t={t} t0={T.lost + 0.3} t1={SHOT.round} x={ring.x + 20} y={ring.y - 120} size={110} color={GOLD}>
        ?
      </Label>
      {/* Dot with his magnifier, looking up at the sky */}
      <div style={{position: 'absolute', left: DOT_SKY.feet.x, top: DOT_SKY.feet.y, transformOrigin: '0 0', transform: `scale(1, ${breathe})`}}>
        <Img src={staticFile(md.src)} style={{position: 'absolute', left: dotLeft - DOT_SKY.feet.x, top: dotTop - DOT_SKY.feet.y, width: md.w * ds, height: md.h * ds}} />
      </div>
      <SweatDrop t={t} t0={T.lost + 0.2} t1={SHOT.round - 0.1} x={dotLeft + (md.head[0] - md.head[2] * 0.75) * ds} y={dotTop + (md.head[1] - md.head[2] * 0.4) * ds} r={13} slide={28} ink={4} />
    </Space>
  );
};

// ------------------------------------------------------------------------------------------- must be round
const BIG = {x: 540, y: 720, R: 270};

export const RoundCheck: React.FC<{t: number}> = ({t}) => {
  // jelly wobble while "to be a dwarf planet", settling round on "round"
  const env = clamp01((t - (T.to - 0.1)) / 0.3) * (1 - clamp01((t - (T.must - 0.1)) / 0.5));
  const jelly = 0.11 * env * Math.sin(2 * Math.PI * 1.7 * (t - T.to));
  const settle = wobble(t, T.round, 0.03, 3, 6);
  const sx = 1 + jelly + settle;
  const sy = 1 - jelly - settle;
  const pop = popScale(t, SHOT.round, 99, 0.3);
  const nervous = t >= T.must;
  return (
    <Space t={t}>
      <Ball id="objB" sprite={S.ed138} x={BIG.x} y={BIG.y} R={BIG.R * pop} sx={sx} sy={sy}
        face={nervous ? {open: 1, brow: 'worried', mouth: 'flat', look: {x: 0.4, y: -0.5}} : {open: 1, brow: 'raised', mouth: 'o', look: {x: 0, y: 0}}} />
      <DrawnCircle t={t} t0={T.must - 0.05} t1={T.round + 0.3} x={BIG.x} y={BIG.y} r={BIG.R + 50} />
      <SweatDrop t={t} t0={T.round + 0.15} t1={SHOT.outro} x={BIG.x + BIG.R * 0.62} y={BIG.y - BIG.R * 0.55} r={22} slide={40} ink={6} />
      <Label t={t} t0={T.round + 0.3} x={BIG.x + BIG.R + 40} y={BIG.y - BIG.R - 10} size={170} color={GOLD}>
        ?
      </Label>
    </Space>
  );
};
