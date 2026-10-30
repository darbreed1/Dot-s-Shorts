import React from 'react';
import {WorldSvg} from './WorldSvg';

// A cartoon face for any object (onion, volcano, rock...): white eyes with pupils + glint, eyelids that close from
// the top (a grey lid clipped to the eye with a black lid line), thick round brows, simple mouths, and a squeezed
// "> <" state. Units: r = the face's size unit (eye spacing ~0.56 r). Drawn in the layer's world units.

export type Brow = 'none' | 'angry' | 'worried' | 'relaxed' | 'raised';
export type Mouth = 'none' | 'smile' | 'grin' | 'frown' | 'smirk' | 'o' | 'flat';

export const ObjectFace: React.FC<{
  x: number;
  y: number;
  r: number;
  open?: number; // 0 = closed (a lid line), 1 = wide open
  squeeze?: boolean; // "> <"
  look?: {x: number; y: number}; // -1..1
  brow?: Brow;
  mouth?: Mouth;
  pop?: number; // overall scale (pop-in with overshoot)
  ink?: number;
  id: string; // unique per face (clip path ids)
}> = ({x, y, r, open = 1, squeeze = false, look = {x: 0, y: 0}, brow = 'none', mouth = 'none', pop = 1, ink, id}) => {
  if (pop <= 0.01) return null;
  const k = ink ?? r * 0.06;
  const ex = r * 0.28;
  const erx = r * 0.15;
  const ery = r * 0.19;
  const eyes = [-1, 1].map((side) => {
    const cx = side * ex;
    if (squeeze) {
      const d = side < 0 ? `M${cx - erx},${-ery * 0.7} L${cx + erx * 0.9},0 L${cx - erx},${ery * 0.7}` : `M${cx + erx},${-ery * 0.7} L${cx - erx * 0.9},0 L${cx + erx},${ery * 0.7}`;
      return <path key={side} d={d} fill="none" stroke="#15151C" strokeWidth={k * 1.3} strokeLinecap="round" strokeLinejoin="round" />;
    }
    const lidY = -ery + 2 * ery * (1 - Math.max(0, Math.min(1, open)));
    const px = cx + look.x * erx * 0.45;
    const py = look.y * ery * 0.45;
    return (
      <g key={side}>
        <clipPath id={`${id}e${side}`}>
          <ellipse cx={cx} cy={0} rx={erx} ry={ery} />
        </clipPath>
        <ellipse cx={cx} cy={0} rx={erx} ry={ery} fill="#FFFFFF" />
        <g clipPath={`url(#${id}e${side})`}>
          <circle cx={px} cy={py} r={erx * 0.58} fill="#15151C" />
          <circle cx={px - erx * 0.2} cy={py - erx * 0.22} r={erx * 0.18} fill="#FFFFFF" />
          {open < 0.999 ? <rect x={cx - erx * 1.2} y={-ery * 1.2} width={erx * 2.4} height={lidY + ery * 1.2} fill="#C9B8A6" /> : null}
          {open < 0.999 ? <line x1={cx - erx * 1.2} y1={lidY} x2={cx + erx * 1.2} y2={lidY} stroke="#15151C" strokeWidth={k} /> : null}
        </g>
        <ellipse cx={cx} cy={0} rx={erx} ry={ery} fill="none" stroke="#15151C" strokeWidth={k} />
      </g>
    );
  });
  const brows =
    brow === 'none'
      ? null
      : [-1, 1].map((side) => {
          const cx = side * ex;
          const by = -ery * 1.45 - (brow === 'raised' ? ery * 0.35 : 0);
          // inner end down = angry, inner end up = worried
          const tilt = brow === 'angry' ? 0.45 : brow === 'worried' ? -0.4 : brow === 'relaxed' ? 0.08 : 0;
          const inner = {x: cx - side * erx * 0.9, y: by + tilt * ery};
          const outer = {x: cx + side * erx * 0.9, y: by - tilt * ery * 0.5};
          return <line key={side} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#15151C" strokeWidth={k * 1.6} strokeLinecap="round" />;
        });
  const my = r * 0.3;
  const mw = r * 0.18;
  const mouths: Record<Mouth, React.ReactNode> = {
    none: null,
    smile: <path d={`M${-mw},${my} Q0,${my + mw * 0.9} ${mw},${my}`} fill="none" stroke="#15151C" strokeWidth={k} strokeLinecap="round" />,
    grin: <path d={`M${-mw * 1.2},${my - mw * 0.1} Q0,${my + mw * 1.3} ${mw * 1.2},${my - mw * 0.1} Z`} fill="#7A2E2E" stroke="#15151C" strokeWidth={k} strokeLinejoin="round" />,
    frown: <path d={`M${-mw},${my + mw * 0.5} Q0,${my - mw * 0.4} ${mw},${my + mw * 0.5}`} fill="none" stroke="#15151C" strokeWidth={k} strokeLinecap="round" />,
    smirk: <path d={`M${-mw * 0.9},${my + mw * 0.15} Q${mw * 0.2},${my + mw * 0.5} ${mw},${my - mw * 0.3}`} fill="none" stroke="#15151C" strokeWidth={k} strokeLinecap="round" />,
    o: <ellipse cx={0} cy={my + mw * 0.2} rx={mw * 0.42} ry={mw * 0.55} fill="#7A2E2E" stroke="#15151C" strokeWidth={k} />,
    flat: <line x1={-mw * 0.8} y1={my + mw * 0.2} x2={mw * 0.8} y2={my + mw * 0.2} stroke="#15151C" strokeWidth={k} strokeLinecap="round" />,
  };
  const m = r * 1.2;
  return (
    <WorldSvg box={[x - m, y - m, x + m, y + m]}>
      <g transform={`translate(${x} ${y}) scale(${pop})`}>
        {eyes}
        {brows}
        {mouths[mouth]}
      </g>
    </WorldSvg>
  );
};
