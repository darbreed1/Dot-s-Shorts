import React from 'react';
import {Img, staticFile} from 'remotion';
import {easeInOutCubic, easeOutCubic, kick, lerp, popScale, progress, rand, wobble} from '../../kit/anim';
import {DesignSpace} from '../../kit/DesignSpace';
import {Label} from '../../kit/Label';
import {ObjectFace} from '../../kit/effects/ObjectFace';
import {DetectBox, SweatDrop} from '../../kit/effects/small';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {SHOT, T} from './beats';
import {S} from './sprites';

// The exploded window, the plane up high and the pressure cross-section, in a 1080x1920 design space.
const INK = '#15151C';
const GOLD = '#F2C14E';
const GLASS = 'rgba(170, 215, 240, 0.6)';

// ------------------------------------------------------------------------------------------- three panes
// Three panes seen at an angle (squeezed + sheared), sliding apart along a diagonal on "three panes".
const PANE = {w: 300, h: 430};
const paneD = (w: number, h: number) => {
  const r = w / 2;
  return `M${-r},${-h / 2 + r} A${r},${r} 0 0,1 ${r},${-h / 2 + r} L${r},${h / 2 - r} A${r},${r} 0 0,1 ${-r},${h / 2 - r} Z`;
};

export const Panes: React.FC<{t: number}> = ({t}) => {
  const apart = easeInOutCubic(progress(t, T.three - 0.15, T.panes + 0.3));
  const focusMid = easeOutCubic(progress(t, T.middle - 0.2, T.middle + 0.2));
  const panes = [
    {key: 'outer', dx: 1, label: 'outer'},
    {key: 'middle', dx: 0, label: 'middle'},
    {key: 'inner', dx: -1, label: 'inner'},
  ];
  const sep = 235 * apart;
  const C = {x: 560, y: 620};
  const at = (dx: number) => ({x: C.x + dx * sep, y: C.y - dx * sep * 0.35});
  const dotIn = popScale(t, T.three - 0.2, 99, 0.3);
  const ds = 500 / S.dot_three.h;
  return (
    <DesignSpace background="#DCE8F1">
      <WorldSvg box={[0, 0, 1080, 1920]}>
        {panes.map((p, i) => {
          const c = at(p.dx);
          const dim = p.key === 'middle' ? 1 : 1 - 0.55 * focusMid;
          const pop = popScale(t, SHOT.panes + 0.05 + i * 0.08, 99, 0.3);
          return (
            <g key={p.key} opacity={dim} transform={`translate(${c.x} ${c.y}) scale(${pop * 1.3}) matrix(0.5, -0.17, 0, 1, 0, 0)`}>
              <path d={paneD(PANE.w + 50, PANE.h + 50)} fill={p.key === 'middle' && focusMid > 0 ? '#F7E7B0' : '#E8E4DC'} stroke={INK} strokeWidth={10} />
              <path d={paneD(PANE.w, PANE.h)} fill={GLASS} stroke={INK} strokeWidth={8} />
              <path d={`M-60,140 L50,-150 L90,-150 L-20,140 Z`} fill="#FFFFFF" opacity={0.4} />
              {p.key === 'middle' ? <circle cx={0} cy={PANE.h / 2 - 48} r={11} fill="#3A3A44" stroke="#FFFFFF" strokeWidth={4} /> : null}
            </g>
          );
        })}
      </WorldSvg>
      {panes.map((p, i) => {
        const c = at(p.dx);
        return (
          <Label key={p.key} t={t} t0={T.panes + 0.1 + i * 0.12} x={c.x + 15} y={c.y + 400} size={60} color={p.key === 'middle' ? GOLD : '#FFFFFF'}>
            {p.label}
          </Label>
        );
      })}
      <DetectBox t={t} t0={T.middle - 0.1} t1={SHOT.high} x={at(0).x} y={at(0).y + (PANE.h / 2 - 48) * 1.3 - 8} r={48} ink={6} />
      {dotIn > 0 ? (
        <div style={{position: 'absolute', left: 250, top: 1880, transformOrigin: '0 0', transform: `scale(${dotIn})`}}>
          <Img src={staticFile(S.dot_three.src)} style={{position: 'absolute', left: -S.dot_three.feet[0] * ds, top: -S.dot_three.feet[1] * ds, width: S.dot_three.w * ds, height: S.dot_three.h * ds}} />
        </div>
      ) : null}
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- up high
export const UpHigh: React.FC<{t: number}> = ({t}) => {
  const u = easeOutCubic(progress(t, SHOT.high, SHOT.cross));
  const pw = 760;
  const ps = pw / S.airliner.w;
  const x = lerp(-300, 560, u);
  const bob = 8 * Math.sin(2 * Math.PI * 0.8 * t);
  return (
    <DesignSpace background="#2F6FC9">
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#1E4FA8, #6FB2EC)'}} />
      <WorldSvg box={[0, 0, 1080, 1920]}>
        {Array.from({length: 7}, (_, i) => {
          const cx = ((i * 190 - t * 120) % 1330 + 1330) % 1330 - 120;
          return (
            <g key={i} transform={`translate(${cx} ${1150 + (i % 2) * 70})`}>
              {[[-60, 0, 50], [0, -25, 64], [60, 0, 52]].map(([dx, dy, r], k) => <circle key={k} cx={dx} cy={dy} r={r + 6} fill={INK} />)}
              {[[-60, 0, 50], [0, -25, 64], [60, 0, 52]].map(([dx, dy, r], k) => <circle key={`f${k}`} cx={dx} cy={dy} r={r} fill="#FFFFFF" />)}
            </g>
          );
        })}
        <rect x={0} y={1190} width={1080} height={800} fill="#FFFFFF" />
        <line x1={0} y1={1190} x2={1080} y2={1190} stroke="#C9DDEB" strokeWidth={6} />
      </WorldSvg>
      <Img src={staticFile(S.airliner.src)} style={{position: 'absolute', left: x - pw / 2, top: 520 + bob, width: pw, height: S.airliner.h * ps}} />
      <Label t={t} t0={T.up + 0.05} x={540} y={300} size={90} color={GOLD}>
        up high
      </Label>
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- cross-section
// Side view: cabin on the left, outside on the right, the three panes as thick bars between. Dense air in the
// cabin pushes right; the hole in the middle pane lets it into the gap, so the OUTER pane takes the push.
const P = {top: 330, bot: 870, inner: 380, middle: 560, outer: 740, thick: 50};
const HOLE_Y = 780;
const REG = {cabin: [40, P.inner - 40], gap1: [P.inner + 40, P.middle - 40], gap2: [P.middle + 40, P.outer - 40], out: [P.outer + 40, 1040]} as const;

const particles = (seed: number, n: number, x0: number, x1: number, t: number, speed = 1) =>
  Array.from({length: n}, (_, i) => {
    const bx = x0 + rand(seed + i * 3) * (x1 - x0);
    const by = P.top + 20 + rand(seed + i * 3 + 1) * (P.bot - P.top - 40);
    const ph = rand(seed + i * 3 + 2) * 6.28;
    return {x: bx + 7 * speed * Math.sin(2 * Math.PI * 1.7 * t + ph), y: by + 7 * speed * Math.cos(2 * Math.PI * 1.3 * t + ph * 1.3)};
  });

const Arrow: React.FC<{x: number; y: number; len: number; s: number; color?: string}> = ({x, y, len, s, color = '#FF8A3D'}) => {
  if (s <= 0) return null;
  const d = `M${x - len * s},${y} L${x - 26},${y} M${x - 40},${y - 24} L${x},${y} L${x - 40},${y + 24}`;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

export const Cross: React.FC<{t: number}> = ({t}) => {
  // the gap behind the middle pane fills through the hole
  const fill = easeInOutCubic(progress(t, T.hole3, T.outer + 0.2));
  const bulge = 26 * easeOutCubic(progress(t, T.outer - 0.1, T.outer + 0.5)) + wobble(t, T.outer + 0.5, 4, 3, 5);
  const push = (t0: number) => popScale(t, t0, SHOT.fog, 0.3) * (1 + 0.08 * Math.sin(2 * Math.PI * 2.4 * t));
  const cabin = particles(11, 70, REG.cabin[0], REG.cabin[1], t);
  const gap1 = particles(37, 22, REG.gap1[0], REG.gap1[1], t);
  const gap2 = particles(71, 26, REG.gap2[0], REG.gap2[1], t).slice(0, Math.round(3 + 23 * fill));
  const outside = particles(97, 9, REG.out[0], REG.out[1], t, 1.6);
  // a stream of particles squeezing through the hole while it fills
  const stream = t > T.hole3 && t < T.outer + 0.4 ? Array.from({length: 6}, (_, i) => {
    const u = ((t - T.hole3) * 1.6 + i / 6) % 1;
    return {x: lerp(P.middle - 70, P.middle + 70, u), y: HOLE_Y + 10 * Math.sin(u * 6 + i)};
  }) : [];
  const straining = t >= T.carries - 0.1;
  const backup = t >= T.middle2 - 0.1;
  const outerX = P.outer;
  const outerPath = `M${outerX - P.thick / 2},${P.top} L${outerX + P.thick / 2},${P.top} Q${outerX + P.thick / 2 + bulge * 2},${(P.top + P.bot) / 2} ${outerX + P.thick / 2},${P.bot} L${outerX - P.thick / 2},${P.bot} Q${outerX - P.thick / 2 + bulge * 2},${(P.top + P.bot) / 2} ${outerX - P.thick / 2},${P.top} Z`;
  const bar = (x: number, top = P.top, bot = P.bot) => <rect x={x - P.thick / 2} y={top} width={P.thick} height={bot - top} rx={14} fill={GLASS} stroke={INK} strokeWidth={8} />;
  return (
    <DesignSpace background="#F3E9D6">
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '560px 600px', transform: 'scale(1.22)'}}>
      <WorldSvg box={[-200, -400, 1400, 2300]}>
        <rect x={P.outer} y={-400} width={700} height={2700} fill="#1E3566" />
        {[...cabin, ...gap1, ...gap2].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={10} fill="#8FC7FF" stroke={INK} strokeWidth={3} />
        ))}
        {outside.map((p, i) => (
          <circle key={`o${i}`} cx={p.x} cy={p.y} r={10} fill="#8FC7FF" stroke={INK} strokeWidth={3} opacity={0.85} />
        ))}
        {stream.map((p, i) => (
          <circle key={`s${i}`} cx={p.x} cy={p.y} r={9} fill="#BFE0FF" stroke={INK} strokeWidth={3} />
        ))}
        {/* inner scratch pane (not sealed: shorter), middle pane with the hole, outer pane (bows out under load) */}
        {bar(P.inner, P.top + 50, P.bot - 50)}
        {bar(P.middle)}
        <rect x={P.middle - P.thick / 2 - 4} y={HOLE_Y - 10} width={P.thick + 8} height={20} fill="#F3E9D6" />
        <line x1={P.middle - P.thick / 2} y1={HOLE_Y - 10} x2={P.middle + P.thick / 2} y2={HOLE_Y - 10} stroke={INK} strokeWidth={6} />
        <line x1={P.middle - P.thick / 2} y1={HOLE_Y + 10} x2={P.middle + P.thick / 2} y2={HOLE_Y + 10} stroke={INK} strokeWidth={6} />
        <path d={outerPath} fill={GLASS} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        {/* the push: from the cabin on "pushes hard", then on the outer pane once the gap is full */}
        {[440, 600, 760].map((y, i) => <Arrow key={i} x={P.inner - 60} y={y - 60} len={200} s={push(T.pushes + i * 0.08) * (1 - fill)} />)}
        {[470, 640].map((y, i) => <Arrow key={`g${i}`} x={P.outer - P.thick / 2 - 14} y={y} len={110} s={push(T.outer + i * 0.1)} />)}
      </WorldSvg>
      {/* faces: the outer pane strains, the middle pane relaxes */}
      <ObjectFace id="outerP" x={P.outer + bulge} y={520} r={70} open={1} squeeze={straining} brow={straining ? 'worried' : 'raised'} mouth={straining ? 'flat' : 'o'}
        look={{x: -1, y: 0}} pop={popScale(t, T.outer, 99, 0.3) * (1 + kick(t, T.carries, 0.12, 4, 7))} ink={6} />
      <SweatDrop t={t} t0={T.load} t1={SHOT.fog} x={P.outer + 52} y={410} r={16} slide={34} ink={5} />
      <ObjectFace id="midP" x={P.middle} y={520} r={70} open={backup ? 0.55 : 1} brow={backup ? 'relaxed' : 'raised'} mouth={backup ? 'smirk' : 'smile'}
        look={{x: 1, y: 0}} pop={popScale(t, T.middle2 - 0.1, 99, 0.3)} ink={6} />
      <Label t={t} t0={SHOT.cross + 0.1} x={200} y={250} size={54}>
        cabin
      </Label>
      <Label t={t} t0={T.thin - 0.1} x={905} y={250} size={54}>
        outside
      </Label>
      <Label t={t} t0={T.carries} x={P.outer + 20} y={935} size={46} color="#FFFFFF">
        takes the load
      </Label>
      <Label t={t} t0={T.backup - 0.05} x={P.middle - 30} y={250} size={56} color={GOLD}>
        backup
      </Label>
      <DetectBox t={t} t0={T.hole3} t1={T.reach + 0.3} x={P.middle} y={HOLE_Y} r={46} ink={6} />
      </div>
    </DesignSpace>
  );
};
