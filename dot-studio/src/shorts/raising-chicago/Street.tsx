import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeInCubic, easeOutBack, rand, wobble} from '../../kit/anim';
import {fontFamily} from '../../kit/font';
import {ScrewJack} from '../../kit/effects/ScrewJack';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {G0, SHOT, T, buildingBottomAt, groundAt} from './beats';
import {S} from './sprites';

// The street world (Z 1000 layer): the big brick building (on its jackscrews when lifted), townsfolk waving in its
// windows, the street that gets raised in front of it, a plank walk where Dot stands. The far skyline is its own
// layer (Skyline).
const INK = '#15151C';
export const BUILDING = {x: 430, h: 1150};
const BS = BUILDING.h / S.building_a.h;
const BW = S.building_a.w * BS;
export const DOT_X = 230;

type Person = 'townsman' | 'townswoman';
// window index (row-major, 4 per row) -> who waves there, mirrored or not, pop delay
const WAVERS: readonly {win: number; who: Person; flip: boolean; d: number}[] = [
  {win: 1, who: 'townswoman', flip: false, d: 0},
  {win: 4, who: 'townsman', flip: false, d: 0.12},
  {win: 6, who: 'townswoman', flip: true, d: 0.24},
  {win: 3, who: 'townsman', flip: true, d: 0.36},
  {win: 11, who: 'townsman', flip: false, d: 0.48},
];

/** A townsperson rising into a window box (sprite px of the building) and waving; clipped by the arched glass. */
const Waver: React.FC<{t: number; box: readonly number[]; who: Person; flip: boolean; t0: number; t1: number; bottom: number; arch?: boolean; dx?: number}> = ({
  t, box, who, flip, t0, t1, bottom, arch = true, dx = 0.5,
}) => {
  if (t < t0 || t > t1) return null;
  const sp = S[who];
  const [bx, by, bw, bh] = box.map((v) => v * BS);
  const left = BUILDING.x + bx;
  const top = bottom - S.building_a.bottom * BS + by;
  const winW = Math.min(bw, bh);
  const ps = (0.82 * winW) / (2 * sp.head[2]);
  // rise up from below the sill, duck back down at t1
  const up = easeOutBack(clamp01((t - t0) / 0.32), 1.8) * (1 - easeInCubic(clamp01((t - (t1 - 0.3)) / 0.3)));
  const hx = bw * dx;
  const hy = bh * 0.47 + (1 - up) * bh * 0.9;
  const wave = 5 * Math.sin(2 * Math.PI * 1.8 * (t - t0) + (flip ? 1 : 0));
  return (
    <div
      style={{
        position: 'absolute', left, top, width: bw, height: bh, overflow: 'hidden',
        borderTopLeftRadius: arch ? bw / 2 : 4, borderTopRightRadius: arch ? bw / 2 : 4,
      }}
    >
      <div style={{position: 'absolute', left: hx, top: hy, transformOrigin: '0 0', transform: `rotate(${wave}deg) scale(${flip ? -1 : 1}, 1)`}}>
        <Img src={staticFile(sp.src)} style={{position: 'absolute', left: -sp.head[0] * ps, top: -sp.head[1] * ps, width: sp.w * ps, height: sp.h * ps}} />
      </div>
    </div>
  );
};

/** The hanging OPEN board on the shop door; swings on "open". */
const OpenSign: React.FC<{t: number; bottom: number}> = ({t, bottom}) => {
  const [dx, dy, dw] = S.building_a.door.map((v) => v * BS);
  const cx = BUILDING.x + dx + dw / 2;
  const top = bottom - S.building_a.bottom * BS + dy + dw * 0.35;
  const w = dw * 0.86;
  const h = w * 0.4;
  const swing = wobble(t, T.open - 0.05, 22, 1.5, 2.4);
  return (
    <div style={{position: 'absolute', left: cx, top, transformOrigin: '0 0', transform: `rotate(${swing}deg)`}}>
      <svg style={{position: 'absolute', left: -w / 2 - 6, top: -h * 0.55, overflow: 'visible'}} width={w + 12} height={h * 1.6}>
        <path d={`M${w * 0.22 + 6},${h * 0.55} L${w / 2 + 6},${6} L${w * 0.78 + 6},${h * 0.55}`} fill="none" stroke={INK} strokeWidth={3} />
        <circle cx={w / 2 + 6} cy={6} r={4} fill={INK} />
        <rect x={6} y={h * 0.55} width={w} height={h} rx={6} fill="#FFF1D6" stroke={INK} strokeWidth={4} />
      </svg>
      <div
        style={{
          position: 'absolute', left: -w / 2, top: h * 0.05, width: w, height: h, lineHeight: `${h}px`, textAlign: 'center',
          fontFamily, fontSize: h * 0.62, color: '#E8483F', WebkitTextStroke: `${h * 0.07}px ${INK}`, paintOrder: 'stroke fill',
        }}
      >
        OPEN
      </div>
    </div>
  );
};

/** The building (behind the street fill) with the people at the windows and the shop door sign. */
export const BuildingA: React.FC<{t: number}> = ({t}) => {
  const B = buildingBottomAt(t);
  const top = B - S.building_a.bottom * BS;
  const main1 = t < SHOT.swamp;
  const main3 = t >= SHOT.street3;
  return (
    <>
      <Img src={staticFile(S.building_a.src)} style={{position: 'absolute', left: BUILDING.x, top, width: BW, height: S.building_a.h * BS}} />
      {WAVERS.map((p) => (
        <Waver
          key={p.win}
          t={t}
          box={S.building_a.windows[p.win]}
          who={p.who}
          flip={p.flip}
          t0={main1 ? T.people + p.d : SHOT.street3}
          t1={main1 ? SHOT.swamp + 1 : T.end - 0.15}
          bottom={B}
        />
      ))}
      {main3 ? (
        <Waver t={t} box={S.building_a.shop} who="townsman" flip={false} t0={T.shops2} t1={T.end - 0.15} bottom={B} arch={false} dx={0.62} />
      ) : null}
      {main3 ? <OpenSign t={t} bottom={B} /> : null}
    </>
  );
};

/** In front of the building: the dark gap and the jackscrews under it, the raised fill, the old mud, the plank walk. */
export const StreetFront: React.FC<{t: number}> = ({t}) => {
  const g = groundAt(t);
  const B = buildingBottomAt(t);
  const gap = g - B;
  const jacks = 6;
  const turn = t * 1.4;
  return (
    <WorldSvg box={[-1200, 900, 2600, 2900]}>
      {/* the void under the lifted building, with its jackscrews */}
      {gap > 4 ? (
        <>
          <rect x={BUILDING.x + 10} y={B - 4} width={BW - 20} height={gap + 4} fill="#3B2B20" />
          {Array.from({length: jacks}, (_, i) => (
            <ScrewJack key={i} x={BUILDING.x + 70 + (i * (BW - 140)) / (jacks - 1)} yTop={B} yBottom={g + 2} w={72} turn={turn + i * 0.3} ink={4} />
          ))}
        </>
      ) : null}
      {/* old mud street */}
      <rect x={-1200} y={G0} width={3800} height={2000} fill="#6E4B2F" />
      {[[-300, 60, 120], [260, 140, 90], [980, 80, 150], [1500, 170, 100]].map(([x, dy, w], i) => (
        <ellipse key={i} cx={x} cy={G0 + dy} rx={w} ry={w * 0.22} fill="#8C7A6A" stroke={INK} strokeWidth={4} />
      ))}
      <line x1={-1200} y1={G0} x2={2600} y2={G0} stroke={INK} strokeWidth={8} />
      {/* the raised fill */}
      {g < G0 - 1 ? (
        <>
          <rect x={-1200} y={g} width={3800} height={G0 - g} fill="#B98A58" />
          {Array.from({length: 40}, (_, i) => {
            const px = -1100 + rand(i * 5 + 1) * 3600;
            const py = g + 12 + rand(i * 5 + 2) * Math.max(0, G0 - g - 24);
            return py < G0 - 8 ? <ellipse key={i} cx={px} cy={py} rx={9 + 8 * rand(i)} ry={6} fill="#9B6E42" /> : null;
          })}
          <line x1={-1200} y1={g} x2={2600} y2={g} stroke={INK} strokeWidth={8} />
        </>
      ) : null}
      {/* plank walk under Dot */}
      <rect x={-1200} y={g - 10} width={BUILDING.x - 20 + 1200} height={34} fill="#A8743F" stroke={INK} strokeWidth={5} />
      {Array.from({length: 22}, (_, i) => (
        <line key={i} x1={-1160 + i * 80} y1={g - 10} x2={-1160 + i * 80} y2={g + 24} stroke={INK} strokeWidth={3} />
      ))}
    </WorldSvg>
  );
};

/** Dot's feet on the plank walk. */
export const dotFeet = (t: number) => ({x: DOT_X, y: groundAt(t) - 10});

/** Far skyline (its own deep layer): plain flat blocks with windows, slightly bluish. */
export const Skyline: React.FC = () => (
  <WorldSvg box={[-1000, -200, 2400, 2600]}>
    {[[-900, 260, 330], [-560, 120, 300], [-240, 330, 280], [60, 40, 340], [420, 230, 300], [740, 90, 360], [1120, 280, 300], [1440, 150, 330], [1790, 300, 320]].map(
      ([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={2600 - y} fill={i % 2 ? '#B9C4CF' : '#AAB6C3'} stroke="#5B6675" strokeWidth={8} />
          <rect x={x - 12} y={y - 26} width={w + 24} height={30} fill="#97A3B1" stroke="#5B6675" strokeWidth={8} />
          {Array.from({length: 12}, (_, r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}-${c}`} x={x + 34 + c * ((w - 68) / 3)} y={y + 50 + r * 120} width={(w - 68) / 3 - 30} height={64} fill="#D8E2EA" stroke="#5B6675" strokeWidth={5} />
            )),
          )}
        </g>
      ),
    )}
  </WorldSvg>
);
