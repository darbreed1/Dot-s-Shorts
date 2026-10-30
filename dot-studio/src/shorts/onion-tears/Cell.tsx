import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeInOutCubic, easeOutBack, kick, lerp, progress, rand} from '../../kit/anim';
import {DesignSpace} from '../../kit/DesignSpace';
import {GasPuffs, Puff} from '../../kit/effects/GasPuff';
import {MotionTicks} from '../../kit/effects/small';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {SHOT, T} from './beats';
import {S} from './sprites';

// "Inside the onion": one cell (design px, 1080x1920). Purple drops (ingredient 1) wait inside a pouch, green
// enzymes (ingredient 2) float outside it. The cut bursts the pouch, both swirl together, one enzyme grows a face
// and chomps drops - each chomp lets out a grumpy gas puff that floats up and away.
const INK = '#15151C';
const CELL = {x0: 120, y0: 330, x1: 960, y1: 1010};
const POUCH = {cx: 375, cy: 670, rx: 185, ry: 235};
const MIX = {cx: 540, cy: 690};
const BIG = {x: 560, y: 820, r: 92};
const CHOMPS = [11.06, 11.4, 11.74, 12.08];

const drops = Array.from({length: 8}, (_, i) => {
  const a = rand(i + 11) * Math.PI * 2;
  const rr = Math.sqrt(rand(i + 23)) * 0.72;
  return {x: POUCH.cx + Math.cos(a) * POUCH.rx * rr, y: POUCH.cy + Math.sin(a) * POUCH.ry * rr, ph: rand(i + 5) * 6};
});
const enzymes = Array.from({length: 6}, (_, i) => ({
  x: 680 + (i % 2) * 150 + rand(i + 41) * 30,
  y: 470 + Math.floor(i / 2) * 170 + rand(i + 53) * 40,
  ph: rand(i + 61) * 6,
}));

/** Swirl slot for item k of n around the mixing centre. */
const swirl = (k: number, n: number, t: number) => {
  const a = (k / n) * Math.PI * 2 + 0.7 * (t - SHOT.cell2);
  const r = 150 + 70 * ((k * 37) % 3) / 2;
  return {x: MIX.cx + Math.cos(a) * r, y: MIX.cy + Math.sin(a) * r * 0.75};
};

const Enzyme: React.FC<{x: number; y: number; r: number; mouth: number; face?: number}> = ({x, y, r, mouth, face = 0}) => {
  const m = (mouth * 38 * Math.PI) / 180; // half-angle of the mouth wedge, facing left
  const a0 = Math.PI - m;
  const a1 = Math.PI + m;
  const path = m < 0.02
    ? `M${x - r},${y} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`
    : `M${x},${y} L${x + r * Math.cos(a1)},${y + r * Math.sin(a1)} A${r},${r} 0 1,1 ${x + r * Math.cos(a0)},${y + r * Math.sin(a0)} Z`;
  return (
    <g>
      <path d={path} fill="#7DC36A" stroke={INK} strokeWidth={Math.max(5, r * 0.09)} strokeLinejoin="round" />
      <circle cx={x + r * 0.18} cy={y + r * 0.22} r={r * 0.32} fill="#69AE58" />
      {face > 0 ? (
        <g transform={`translate(${x} ${y - r * 0.38}) scale(${face})`}>
          {[-1, 1].map((s) => (
            <g key={s}>
              <ellipse cx={s * r * 0.24} cy={0} rx={r * 0.15} ry={r * 0.19} fill="#FFFFFF" stroke={INK} strokeWidth={r * 0.06} />
              <circle cx={s * r * 0.24 - r * 0.05} cy={r * 0.02} r={r * 0.08} fill={INK} />
            </g>
          ))}
        </g>
      ) : (
        <circle cx={x + r * 0.1} cy={y - r * 0.38} r={r * 0.12} fill={INK} />
      )}
    </g>
  );
};

export const Cell: React.FC<{t: number}> = ({t}) => {
  const second = t >= SHOT.cell2;
  const mixU = second ? easeInOutCubic(progress(t, SHOT.cell2 + 0.05, T.mix + 0.45)) : 0;
  const bob = (ph: number, amp = 6) => amp * Math.sin(2 * Math.PI * 0.9 * t + ph);
  const hopDrops = kick(t, T.two, -0.18, 3, 7) + kick(t, T.apart, -0.1, 4, 8);
  const hopEnz = kick(t, T.ingredients, -0.18, 3, 7) + kick(t, T.apart, -0.1, 4, 8);

  // the special enzyme: enzyme 0 travels to the middle and grows a face
  const grow = easeInOutCubic(progress(t, T.special - 0.05, T.enzyme + 0.05));
  const facePop = easeOutBack(clamp01((t - T.enzyme) / 0.25), 2.4);
  const mouth = CHOMPS.reduce((acc, c) => {
    const u = t - (c - 0.18);
    return u < 0 || u > 0.3 ? acc : Math.max(acc, u < 0.18 ? u / 0.18 : 1 - (u - 0.18) / 0.12);
  }, 0);

  // eaten drops: the k-th chomp eats drop k (it zips into the mouth just before)
  const eaten = (i: number) => (i < CHOMPS.length ? CHOMPS[i] : Infinity);
  const puffs: Puff[] = CHOMPS.map((c, i) => ({
    at: c + 0.05,
    dur: 1.6,
    from: {x: BIG.x, y: BIG.y - BIG.r},
    to: {x: BIG.x + (i % 2 ? 160 : -170), y: 160},
    size: 62,
    arc: i % 2 ? 60 : -60,
    seed: i,
  }));

  const dropAt = (i: number) => {
    const d = drops[i];
    const home = {x: d.x + bob(d.ph, 5), y: d.y + bob(d.ph + 1, 5) + hopDrops * 60};
    if (!second) return home;
    const sw = swirl(i * 2, 14, t);
    let p = {x: lerp(d.x, sw.x, mixU), y: lerp(d.y, sw.y, mixU)};
    const c = eaten(i);
    if (t > c - 0.22 && c < Infinity) {
      const u = easeInOutCubic(clamp01((t - (c - 0.22)) / 0.2));
      p = {x: lerp(p.x, BIG.x - BIG.r * 0.6, u), y: lerp(p.y, BIG.y, u)};
    }
    return p;
  };
  const enzAt = (i: number) => {
    const e = enzymes[i];
    const home = {x: e.x + bob(e.ph, 6), y: e.y + bob(e.ph + 2, 6) + hopEnz * 60};
    if (!second) return home;
    const sw = swirl(i * 2 + 1, 14, t);
    const p = {x: lerp(e.x, sw.x, mixU), y: lerp(e.y, sw.y, mixU)};
    return i === 0 ? {x: lerp(p.x, BIG.x, grow), y: lerp(p.y, BIG.y, grow)} : p;
  };

  // the cut: a slash across the cell, the pouch bursts
  const slash = second ? easeOutBack(clamp01((t - SHOT.cell2) / 0.12), 1.2) : 0;

  return (
    <DesignSpace background="#FFF1D2">
      <WorldSvg box={[0, 0, 1080, 1920]}>
        {/* onion rings in the background */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={540} cy={2100} r={700 + i * 230} fill="none" stroke="#F6E2B6" strokeWidth={70} />
        ))}
        <rect x={CELL.x0} y={CELL.y0} width={CELL.x1 - CELL.x0} height={CELL.y1 - CELL.y0} rx={130} fill="#F6F9DA" stroke={INK} strokeWidth={11} />
        {!second ? (
          <ellipse cx={POUCH.cx} cy={POUCH.cy} rx={POUCH.rx * (1 + 0.03 * Math.sin(2 * Math.PI * 1.2 * t))} ry={POUCH.ry} fill="#EBDDF7" stroke={INK} strokeWidth={8} />
        ) : null}
        {drops.map((_, i) => {
          const c = eaten(i);
          if (t >= c) return null;
          const p = dropAt(i);
          const s = t > c - 0.06 ? 1 - (t - (c - 0.06)) / 0.06 : 1;
          return <path key={i} transform={`translate(${p.x} ${p.y}) scale(${s})`} d="M0,-30 C12,-14 24,-2 24,10 A24,24 0 1,1 -24,10 C-24,-2 -12,-14 0,-30Z" fill="#A774D3" stroke={INK} strokeWidth={5} strokeLinejoin="round" />;
        })}
        {enzymes.map((_, i) => {
          const p = enzAt(i);
          const r = i === 0 ? lerp(32, BIG.r, grow) : 32;
          return <Enzyme key={i} x={p.x} y={p.y} r={r} mouth={i === 0 ? mouth : 0.55 + 0.45 * Math.sin(2 * Math.PI * 1.4 * t + i)} face={i === 0 ? facePop : 0} />;
        })}
        {slash > 0 ? (
          <g opacity={1}>
            <line x1={980} y1={300} x2={980 - 860 * slash} y2={300 + 760 * slash} stroke={INK} strokeWidth={16} strokeLinecap="round" />
            <line x1={980} y1={300} x2={980 - 860 * slash} y2={300 + 760 * slash} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
          </g>
        ) : null}
      </WorldSvg>
      {/* the knife sweeping through on the cut */}
      {second && t < SHOT.cell2 + 0.3 ? (
        <Img
          src={staticFile(S.knife.src)}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: S.knife.w * 0.42,
            transformOrigin: '0 0',
            transform: `translate(${lerp(1050, -150, easeInOutCubic(clamp01((t - SHOT.cell2) / 0.25)))}px, ${lerp(230, 1300, easeInOutCubic(clamp01((t - SHOT.cell2) / 0.25)))}px) rotate(138deg)`,
          }}
        />
      ) : null}
      <MotionTicks t={t} times={second ? [SHOT.cell2 + 0.08] : []} x={POUCH.cx} y={POUCH.cy} r={200} len={60} ink={9} angles={[-150, -110, -70, -30, 30, 150]} />
      <GasPuffs t={t} puffs={puffs} grumpy ink={7} />
    </DesignSpace>
  );
};
