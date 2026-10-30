import React from 'react';
import {staticFile} from 'remotion';
import {clamp01, easeInOutCubic, easeOutCubic, lerp, progress, wobble} from '../../kit/anim';
import {Label} from '../../kit/Label';
import {ThoughtCloud} from '../../kit/effects/ThoughtCloud';
import {DetectBox, SweatDrop} from '../../kit/effects/small';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import type {Swap} from '../../kit/Dot';
import {Bubbles, Critter, DotRig, Dock, Fin, GOLD, H, INK, Paper, SurfaceSplit, Underwater, W, appear, cue, secEnd, secStart, swim} from './parts';
import {S} from './sprites';

// One component per script section. Each picks its shot from the voice cues of that section (cue(n, phrase)),
// so every visual sits on its words. Everything is drawn in a 1920x1080 design space.

type P = {t: number};
const ORCA_W = 520;

const BigNumber: React.FC<{t: number; t0: number; t1?: number; text: string; x?: number; y?: number; size?: number; color?: string}> = ({t, t0, t1, text, x = W / 2, y = 300, size = 260, color = GOLD}) => (
  <Label t={t} t0={t0} t1={t1} x={x} y={y} size={size} color={color}>
    {text}
  </Label>
);

const QCloud: React.FC<{t: number; t0: number; t1: number; x: number; y: number; from: {x: number; y: number}; w?: number; h?: number; children?: React.ReactNode}> = ({t, t0, t1, x, y, from, w = 230, h = 170, children}) => (
  <ThoughtCloud t={t} t0={t0} t1={t1} x={x} y={y} w={w} h={h} from={from} ink={6}>
    {children ?? (
      <text x={0} y={32} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight={900} fontSize={110} fill="#2B3A8C" stroke={INK} strokeWidth={7} paintOrder="stroke">
        ?
      </text>
    )}
  </ThoughtCloud>
);

// ================================================================================================ 1 Zero
export const S1: React.FC<P> = ({t}) => {
  const sharks = cue(1, 'great white sharks');
  const whales = cue(1, 'blue whales');
  const never = cue(1, 'never killed');
  const notOne = cue(1, 'Not one confirmed');
  const people = cue(1, 'People swim');
  const why = cue(1, 'So why do');
  const honest = cue(1, 'The honest answer');
  const clues = cue(1, 'But the clues');
  if (t < people - 0.15) {
    const orca = swim(t, secStart(1), never + 1.2, {x: -400, y: 560}, {x: 980, y: 540});
    const near = swim(t, never + 1.2, people, {x: 980, y: 540}, {x: 1100, y: 600});
    const o = t < never + 1.2 ? orca : near;
    const shark = swim(t, sharks + 0.2, sharks + 2.4, {x: 1400, y: 380}, {x: 2300, y: 320});
    const whale = swim(t, whales - 0.3, whales + 9, {x: 2600, y: 240}, {x: 700, y: 230}, false);
    const dotX = 1450;
    return (
      <>
        <Underwater t={t} />
        <Critter sp={S.blue_whale} x={whale.x} y={whale.y} w={1500} t={t} opacity={0.55} bob={4} />
        {t > sharks ? <Critter sp={S.shark} x={shark.x} y={shark.y} w={420} t={t} rot={-6} /> : null}
        {t > sharks + 0.3 && t < sharks + 2 ? <SweatDrop t={t} t0={sharks + 0.3} t1={sharks + 2} x={shark.x + 120} y={shark.y - 70} r={16} slide={30} /> : null}
        <Critter sp={S.orca} x={o.x} y={o.y} w={ORCA_W} t={t} flip={false} rot={t > never + 1.2 ? 6 : 0} />
        <DotRig t={t} swaps={[{at: 0, pose: 'dot_scuba'}]} x={dotX} y={760 + 8 * Math.sin(2 * Math.PI * 0.3 * t)} headR={64} />
        <Bubbles t={t} x={dotX + 70} y={560} />
        <BigNumber t={t} t0={notOne - 0.05} text="0" x={W / 2} y={250} />
        <Label t={t} t0={notOne + 0.35} x={W / 2} y={430} size={58}>
          confirmed wild orca kills of people
        </Label>
      </>
    );
  }
  if (t < why - 0.15) {
    // people in the water: a surfboard, a kayak and Dot diving, a fin cruising past
    const finX = lerp(-200, 2100, progress(t, people, why));
    return (
      <SurfaceSplit t={t} sea={470} under={
        <>
          <DotRig t={t} swaps={[{at: 0, pose: 'dot_scuba'}]} x={1300} y={900} headR={58} />
          <Bubbles t={t} x={1360} y={720} />
          <Critter sp={S.orca} x={finX - 120} y={640} w={460} t={t} opacity={0.9} />
        </>
      }>
        <WorldSvg box={[0, 0, W, H]}>
          {/* surfboard */}
          <g transform={`translate(420 ${462 + 6 * Math.sin(2 * Math.PI * 0.4 * t)}) rotate(-4)`}>
            <ellipse rx={170} ry={22} fill="#FF8A5B" stroke={INK} strokeWidth={7} />
            <line x1={-150} y1={0} x2={150} y2={0} stroke="#FFFFFF" strokeWidth={6} />
          </g>
          {/* kayak */}
          <g transform={`translate(860 ${458 + 6 * Math.sin(2 * Math.PI * 0.4 * t + 1)})`}>
            <path d="M-170,0 Q0,40 170,0 Q0,-14 -170,0 Z" fill="#FFD23F" stroke={INK} strokeWidth={7} />
            <line x1={-90} y1={-60} x2={90} y2={30} stroke="#6B4A2E" strokeWidth={10} strokeLinecap="round" />
          </g>
        </WorldSvg>
        <Fin x={finX} y={478} s={0.7} />
      </SurfaceSplit>
    );
  }
  const swaps: Swap[] = [{at: 0, pose: 'dot_scratch'}, {at: honest - 0.05, pose: 'dot_shrug', style: 'squash'}, {at: clues - 0.05, pose: 'dot_magnify', style: 'squash'}];
  return (
    <Dock t={t}>
      <DotRig t={t} swaps={swaps} x={360} y={846} headR={72} />
      <QCloud t={t} t0={why} t1={honest} x={560} y={330} from={{x: 420, y: 470}} />
      <Label t={t} t0={honest + 0.3} t1={clues} x={1100} y={300} size={70}>
        not completely sure...
      </Label>
      <Label t={t} t0={clues + 0.3} x={1100} y={300} size={80} color={GOLD}>
        3 clues
      </Label>
    </Dock>
  );
};

// ================================================================================================ 2 Meet the orca
export const S2: React.FC<P> = ({t}) => {
  const dolphin = cue(2, 'actually a dolphin');
  const big = cue(2, 'A big male');
  const elephant = cue(2, 'as much as an elephant');
  const females = cue(2, 'Females can live');
  const ocean = cue(2, 'Orcas live in every');
  const pods = cue(2, 'tight family groups');
  const grandma = cue(2, 'a grandmother');
  if (t < big - 0.15) {
    const d = appear(t, dolphin - 0.1);
    return (
      <>
        <Paper tone="sea" />
        <Critter sp={S.dolphin} x={560} y={560} w={420} t={t} pop={d} />
        <Critter sp={S.orca} x={1260} y={540} w={760} t={t} pop={appear(t, secStart(2) + 0.1)} />
        <Label t={t} t0={dolphin + 0.1} x={560} y={350} size={58}>bottlenose dolphin</Label>
        <Label t={t} t0={secStart(2) + 0.3} x={1260} y={250} size={62} color={GOLD}>orca: the biggest dolphin</Label>
        <Label t={t} t0={dolphin + 0.6} x={W / 2} y={780} size={66}>same family</Label>
      </>
    );
  }
  if (t < females - 0.15) {
    // a see-saw: an orca on one end, an elephant on the other, balancing on "as much as an elephant"
    const tilt = t < elephant ? 9 * easeOutCubic(progress(t, big, big + 0.6)) : 9 * (1 - easeOutCubic(progress(t, elephant, elephant + 0.8))) + wobble(t, elephant + 0.8, 2, 2.5, 4);
    return (
      <>
        <Paper />
        <div style={{position: 'absolute', left: W / 2, top: 760, transformOrigin: '0 0', transform: `rotate(${tilt}deg)`}}>
          <div style={{position: 'absolute', left: -760, top: -18, width: 1520, height: 36, background: '#B9814E', border: `7px solid ${INK}`, borderRadius: 12}} />
          <div style={{position: 'absolute', left: 0, top: 0}}>
            <Critter sp={S.orca} x={-460} y={-170} w={600} t={0} bob={0} />
            {t >= elephant - 0.1 ? <Critter sp={S.elephant} x={470} y={-190} w={430} t={0} bob={0} pop={appear(t, elephant - 0.1)} /> : null}
          </div>
        </div>
        <WorldSvg box={[0, 0, W, H]}>
          <path d={`M${W / 2 - 90},960 L${W / 2},760 L${W / 2 + 90},960 Z`} fill="#8E5C34" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
          <rect x={0} y={958} width={W} height={130} fill="#E3C68A" stroke={INK} strokeWidth={6} />
        </WorldSvg>
        <Label t={t} t0={cue(2, 'nine metres')} x={480} y={240} size={78} color={GOLD}>~9 metres</Label>
        <Label t={t} t0={cue(2, 'six tonnes')} x={1440} y={240} size={78} color={GOLD}>~6 tonnes</Label>
      </>
    );
  }
  if (t < ocean - 0.15) {
    const candles = 8;
    const c = appear(t, females + 0.2);
    return (
      <>
        <Paper tone="sea" />
        <Critter sp={S.orca} x={700} y={520} w={700} t={t} />
        <WorldSvg box={[0, 0, W, H]}>
          <g transform={`translate(1380 760) scale(${c})`}>
            <rect x={-200} y={-120} width={400} height={170} rx={20} fill="#FFD6E2" stroke={INK} strokeWidth={8} />
            <path d="M-200,-80 Q-150,-40 -100,-80 Q-50,-40 0,-80 Q50,-40 100,-80 Q150,-40 200,-80" fill="none" stroke="#FFFFFF" strokeWidth={14} />
            {Array.from({length: candles}, (_, i) => (
              <g key={i}>
                <rect x={-175 + i * 48} y={-200} width={16} height={80} fill="#7FB0E0" stroke={INK} strokeWidth={4} />
                <path d={`M${-167 + i * 48},${-238 + 3 * Math.sin(2 * Math.PI * 3 * t + i)} q12,18 0,32 q-12,-14 0,-32 Z`} fill="#FFB43B" stroke={INK} strokeWidth={3} />
              </g>
            ))}
          </g>
        </WorldSvg>
        <Label t={t} t0={females + 0.5} x={1380} y={400} size={84} color={GOLD}>80+ years</Label>
      </>
    );
  }
  if (t < pods - 0.15) {
    const warmIn = appear(t, ocean);
    const iceIn = appear(t, cue(2, 'the ice'));
    return (
      <>
        <Paper tone="sea" />
        <WorldSvg box={[0, 0, W, H]}>
          <g transform={`translate(520 540) scale(${warmIn})`}>
            <rect x={-400} y={-300} width={800} height={600} rx={30} fill="#7FD6F5" stroke={INK} strokeWidth={8} />
            <rect x={-400} y={20} width={800} height={280} rx={0} fill="#2F9CD8" />
            <ellipse cx={120} cy={30} rx={190} ry={40} fill="#F4D58D" stroke={INK} strokeWidth={6} />
            <path d="M120,30 Q110,-120 140,-200" fill="none" stroke="#8E5C34" strokeWidth={18} strokeLinecap="round" />
            {[-60, 0, 60, 120].map((a, i) => <path key={i} d={`M140,-200 q${80 * Math.cos(((a - 90) * Math.PI) / 180)},${30 * Math.sin(((a - 90) * Math.PI) / 180) + 20} ${150 * Math.cos(((a - 60) * Math.PI) / 180)},${60}`} fill="none" stroke="#3E9B4F" strokeWidth={22} strokeLinecap="round" />)}
            <circle cx={-260} cy={-190} r={60} fill="#FFE27A" stroke={INK} strokeWidth={6} />
            <rect x={-400} y={-300} width={800} height={600} rx={30} fill="none" stroke={INK} strokeWidth={8} />
          </g>
          <g transform={`translate(1400 540) scale(${iceIn})`}>
            <rect x={-400} y={-300} width={800} height={600} rx={30} fill="#DDEBF7" stroke={INK} strokeWidth={8} />
            <rect x={-400} y={20} width={800} height={280} fill="#3D6FA8" />
            <path d="M-260,40 L-180,-160 L-60,-60 L40,-200 L160,40 Z" fill="#FFFFFF" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            <rect x={-400} y={-300} width={800} height={600} rx={30} fill="none" stroke={INK} strokeWidth={8} />
          </g>
        </WorldSvg>
        {warmIn > 0.5 ? <Fin x={420} y={600} s={0.5} /> : null}
        {iceIn > 0.5 ? <Fin x={1520} y={600} s={0.5} flip /> : null}
        <Label t={t} t0={ocean + 0.3} x={W / 2} y={130} size={74} color={GOLD}>every ocean</Label>
      </>
    );
  }
  // the pod, led by grandmother
  const gIn = appear(t, grandma - 0.1);
  const x0 = lerp(-200, 1100, easeInOutCubic(progress(t, pods - 0.2, secEnd(2) + 1)));
  const pod = [{dx: 0, dy: 0, w: 560}, {dx: -420, dy: -150, w: 470}, {dx: -460, dy: 170, w: 460}, {dx: -820, dy: 10, w: 300}, {dx: -880, dy: 220, w: 280}];
  return (
    <>
      <Underwater t={t} />
      {pod.map((o, i) => (
        <Critter key={i} sp={S.orca} x={x0 + o.dx} y={520 + o.dy} w={o.w} t={t} phase={i * 1.3} />
      ))}
      <WorldSvg box={[0, 0, W, H]}>
        {/* grandmother's spectacles */}
        <g opacity={Math.min(1, gIn)} transform={`translate(${x0 + 200} ${470 + 6 * Math.sin(2 * Math.PI * 0.45 * t)})`}>
          <circle r={26} fill="none" stroke={GOLD} strokeWidth={8} />
          <circle cx={-62} cy={8} r={22} fill="none" stroke={GOLD} strokeWidth={8} />
          <line x1={-40} y1={6} x2={-26} y2={2} stroke={GOLD} strokeWidth={6} />
        </g>
      </WorldSvg>
      <Label t={t} t0={pods + 0.2} x={W / 2} y={140} size={80}>a pod</Label>
      <Label t={t} t0={grandma + 0.1} x={x0 + 140} y={300} size={60} color={GOLD}>grandmother</Label>
    </>
  );
};

// ================================================================================================ 3 Top predator
export const S3: React.FC<P> = ({t}) => {
  const wa = cue(3, 'Off the south coast');
  const turns = cue(3, 'The orcas took turns');
  const sharks = cue(3, 'With great white sharks');
  const liver = cue(3, 'the liver');
  const sa = cue(3, 'Off South Africa');
  const show = cue(3, 'And when orcas show up');
  const gentle = cue(3, 'So this is not');
  const top = cue(3, "This is the ocean's");
  if (t < wa - 0.15) {
    // the pod sweeping by
    return (
      <>
        <Underwater t={t} deep />
        {[0, 1, 2, 3].map((i) => {
          const o = swim(t, secStart(3) - 0.5 + i * 0.25, wa + 0.5, {x: -500 - i * 200, y: 300 + i * 160}, {x: 2300, y: 340 + i * 140});
          return <Critter key={i} sp={S.orca} x={o.x} y={o.y} w={460} t={t} phase={i} rot={-3} />;
        })}
      </>
    );
  }
  if (t < sharks - 0.15) {
    // the blue whale with orcas taking turns around it, two pressing down from above
    const whaleX = 1000 + 20 * Math.sin(2 * Math.PI * 0.1 * t);
    const tired = progress(t, turns, sharks);
    return (
      <SurfaceSplit t={t} sea={160} under={
        <>
          <Critter sp={S.blue_whale} x={whaleX} y={560 + 40 * tired} w={1300} t={t} bob={3} />
          {[0, 1, 2].map((i) => {
            const a = 2 * Math.PI * (0.18 * (t - turns) + i / 3);
            const on = t > turns;
            const x = whaleX + (on ? 760 * Math.cos(a) : -900 + i * 120);
            const y = 600 + (on ? 230 * Math.sin(a) : 260 + i * 40);
            return <Critter key={i} sp={S.orca} x={x} y={y} w={380} t={t} flip={on ? Math.sin(a) > 0 : false} phase={i} />;
          })}
          {t > cue(3, 'pressed down') - 0.2 ? (
            <>
              <Critter sp={S.orca} x={whaleX - 260} y={420 + 40 * tired} w={330} t={t} rot={12} phase={4} pop={appear(t, cue(3, 'pressed down') - 0.2)} />
              <Critter sp={S.orca} x={whaleX + 60} y={410 + 40 * tired} w={330} t={t} rot={10} phase={5} pop={appear(t, cue(3, 'pressed down'))} />
            </>
          ) : null}
        </>
      }>
        <Label t={t} t0={wa + 0.2} t1={turns} x={W / 2} y={90} size={64} color={GOLD}>Western Australia</Label>
        <Label t={t} t0={cue(3, 'three times')} t1={turns} x={W / 2} y={300} size={110} color="#FFFFFF">×3</Label>
      </SurfaceSplit>
    );
  }
  if (t < show - 0.15) {
    // the shark's big oily liver (an x-ray view), then "South Africa"
    const xr = appear(t, liver - 0.1);
    return (
      <>
        <Paper tone="sea" />
        <Critter sp={S.shark} x={900} y={540} w={1100} t={t} bob={4} />
        <WorldSvg box={[0, 0, W, H]}>
          <g opacity={0.92} transform={`translate(860 590) scale(${xr})`}>
            <path d="M-260,-20 Q-120,-80 120,-50 Q250,-30 260,10 Q120,60 -180,50 Q-280,30 -260,-20 Z" fill="#B8634A" stroke={INK} strokeWidth={8} />
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx={-160 + i * 90} cy={-6 + 14 * Math.sin(i * 2 + 4 * t)} r={14} fill="#FFD866" stroke={INK} strokeWidth={4} />
            ))}
          </g>
        </WorldSvg>
        <Label t={t} t0={liver + 0.2} x={860} y={240} size={68} color={GOLD}>liver: packed with oil</Label>
        <Label t={t} t0={sa} x={W / 2} y={110} size={64}>South Africa</Label>
        {t > sa ? <DetectBox t={t} t0={sa + 0.3} t1={show} x={860} y={590} r={170} ink={8} /> : null}
      </>
    );
  }
  if (t < gentle - 0.15) {
    const orca = swim(t, show, show + 2, {x: -400, y: 560}, {x: 520, y: 540});
    return (
      <>
        <Underwater t={t} />
        {[0, 1, 2].map((i) => {
          const s = swim(t, show + 0.4 + i * 0.2, show + 2.4 + i * 0.2, {x: 1100 + i * 150, y: 380 + i * 170}, {x: 2400, y: 330 + i * 170});
          return (
            <React.Fragment key={i}>
              <Critter sp={S.shark} x={s.x} y={s.y} w={360} t={t} phase={i} rot={-4} />
              <SweatDrop t={t} t0={show + 0.5 + i * 0.2} t1={show + 2.4} x={s.x + 110} y={s.y - 60} r={14} slide={26} />
            </React.Fragment>
          );
        })}
        <Critter sp={S.orca} x={orca.x} y={orca.y} w={560} t={t} />
        <Label t={t} t0={cue(3, 'for weeks')} x={1400} y={170} size={74} color={GOLD}>gone for weeks... or months</Label>
      </>
    );
  }
  // the podium: the orca on top
  const p1 = appear(t, top);
  return (
    <>
      <Paper />
      <WorldSvg box={[0, 0, W, H]}>
        <rect x={760} y={620} width={400} height={360} fill="#F2C14E" stroke={INK} strokeWidth={8} />
        <rect x={360} y={760} width={400} height={220} fill="#C9CBD1" stroke={INK} strokeWidth={8} />
        <text x={960} y={840} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize={150} fill={INK}>1</text>
        <text x={560} y={910} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize={110} fill={INK}>2</text>
        <rect x={0} y={978} width={W} height={110} fill="#E3C68A" stroke={INK} strokeWidth={6} />
      </WorldSvg>
      <Critter sp={S.shark} x={560} y={650} w={360} t={t} bob={2} />
      <Critter sp={S.orca} x={960} y={470 - 30 * (1 - Math.min(1, p1))} w={440} t={t} bob={4} pop={Math.max(0.01, p1)} />
      <Label t={t} t0={gentle + 0.1} t1={top} x={W / 2} y={200} size={80}>not gentle</Label>
      <Label t={t} t0={top + 0.2} x={W / 2} y={200} size={90} color={GOLD}>top predator</Label>
    </>
  );
};

// ================================================================================================ 4 Close calls
export const S4: React.FC<P> = ({t}) => {
  const close = cue(4, 'one famous close call');
  const seal = cue(4, 'Scientists think');
  const spain = cue(4, 'In recent years');
  const nobody = cue(4, 'But nobody');
  const zero = cue(4, 'is zero');
  if (t < close - 0.15) {
    return (
      <Dock t={t}>
        <DotRig t={t} swaps={[{at: 0, pose: 'dot_lookup'}]} x={360} y={846} headR={72} />
        <QCloud t={t} t0={secStart(4) + 0.2} t1={close} x={560} y={330} from={{x: 420, y: 470}} />
      </Dock>
    );
  }
  if (t < seal - 0.15) {
    const board = 470 + 6 * Math.sin(2 * Math.PI * 0.4 * t);
    return (
      <SurfaceSplit t={t} sea={480} under={<Critter sp={S.orca} x={lerp(300, 760, progress(t, close, seal))} y={700} w={520} t={t} />}>
        <WorldSvg box={[0, 0, W, H]}>
          <g transform={`translate(960 ${board}) rotate(-3)`}>
            <path d="M-260,0 Q-260,-26 0,-26 Q260,-26 280,0 Q260,26 0,26 Q-260,26 -260,0 Z" fill="#FF8A5B" stroke={INK} strokeWidth={8} />
            <line x1={-230} y1={0} x2={240} y2={0} stroke="#FFFFFF" strokeWidth={7} />
          </g>
        </WorldSvg>
        <Label t={t} t0={cue(4, 'In 1972')} x={W / 2} y={150} size={80} color={GOLD}>1972, California</Label>
        <Label t={t} t0={cue(4, 'about a hundred stitches')} x={W / 2} y={290} size={60}>about 100 stitches</Label>
      </SurfaceSplit>
    );
  }
  if (t < spain - 0.15) {
    // seen from below, a surfer on a board looks a lot like a seal
    const morph = easeInOutCubic(progress(t, cue(4, 'mistook him'), cue(4, 'mistook him') + 0.6));
    return (
      <>
        <Underwater t={t} seabed={false} />
        <WorldSvg box={[0, 0, W, H]}>
          <rect x={0} y={0} width={W} height={150} fill="#BFE6FF" opacity={0.5} />
          <g transform="translate(960 200)" opacity={1 - morph}>
            <path d="M-260,0 Q-260,-24 0,-24 Q260,-24 280,0 Q260,24 0,24 Q-260,24 -260,0 Z" fill="#26304A" />
            <path d="M-120,20 q20,90 70,110 M-40,20 q10,100 40,120 M40,20 q-10,90 -40,110" fill="none" stroke="#26304A" strokeWidth={28} strokeLinecap="round" />
          </g>
        </WorldSvg>
        <Critter sp={S.seal} x={960} y={230} w={560} t={t} opacity={morph} flip />
        <Critter sp={S.orca} x={lerp(700, 860, progress(t, seal, spain))} y={760} w={560} t={t} rot={-14} />
        <QCloud t={t} t0={seal + 0.4} t1={spain - 0.2} x={1440} y={620} from={{x: 1050, y: 720}}>
          <image href={staticFile(S.seal.src)} x={-95} y={-55} width={190} height={190 * (S.seal.h / S.seal.w)} />
        </QCloud>
        <Label t={t} t0={cue(4, 'let go')} x={480} y={420} size={70} color={GOLD}>...and let go</Label>
      </>
    );
  }
  if (t < nobody - 0.15) {
    const nudge = Math.sin(2 * Math.PI * 1.6 * t) * 4;
    const boatS = 520 / S.sailboat.h;
    const rx = 1100 + (S.sailboat.rudder[0] - S.sailboat.centre[0]) * boatS;
    return (
      <SurfaceSplit t={t} sea={560} under={
        <>
          <Critter sp={S.orca} x={rx + 160} y={820} w={420} t={t} flip rot={-18} />
          <Critter sp={S.orca} x={rx - 600} y={900} w={360} t={t} phase={2} />
        </>
      }>
        <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '1100px 560px', transform: `rotate(${nudge}deg)`}}>
          <Critter sp={S.sailboat} x={1100} y={560 - (S.sailboat.deck - S.sailboat.centre[1]) * boatS} w={S.sailboat.w * boatS} t={t} bob={0} />
        </div>
        <Label t={t} t0={spain + 0.4} x={520} y={160} size={74} color={GOLD}>Spain & Portugal</Label>
        <Label t={t} t0={cue(4, 'breaking their rudders')} x={520} y={280} size={58}>rudders broken</Label>
      </SurfaceSplit>
    );
  }
  return (
    <Dock t={t}>
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_two'}, {at: zero - 0.05, pose: 'dot_aha', style: 'squash'}]} x={360} y={846} headR={72} />
      <Label t={t} t0={nobody + 0.2} t1={zero - 0.05} x={1100} y={330} size={80}>nobody killed</Label>
      <BigNumber t={t} t0={zero} x={1100} y={330} size={300} text="0" />
    </Dock>
  );
};

// ================================================================================================ 5 Clue 1
const MENU = [
  {name: 'Resident', food: S.salmon, label: 'fish', x: 380},
  {name: "Bigg's", food: S.seal, label: 'seals & sea lions', x: 960},
  {name: 'Offshore', food: S.shark, label: 'fish & sharks', x: 1540},
] as const;
const Squiggle: React.FC<{x: number; y: number; kind: number; t: number}> = ({x, y, kind, t}) => {
  const pts = Array.from({length: 9}, (_, i) => {
    const a = kind === 0 ? Math.sin(i * 1.2) : kind === 1 ? (i % 2 ? 1 : -1) : Math.sin(i * 0.6) * Math.cos(i * 2);
    return `${x - 90 + i * 22},${y + 28 * a * (0.8 + 0.2 * Math.sin(2 * Math.PI * 1.5 * t + i))}`;
  });
  return <polyline points={pts.join(' ')} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />;
};

export const S5: React.FC<P> = ({t}) => {
  const res = cue(5, 'Resident orcas');
  const bigg = cue(5, "Bigg's orcas");
  const off = cue(5, 'Offshore orcas');
  const mix = cue(5, "They don't mix");
  const dial = cue(5, 'different dialects');
  const learned = cue(5, 'And their menu');
  const fixed = cue(5, "It's so fixed");
  const humans = cue(5, 'Humans have never');
  if (t < learned - 0.15) {
    const showAt = [res, bigg, off];
    return (
      <>
        <Paper tone="sea" />
        <Label t={t} t0={secStart(5)} x={W / 2} y={110} size={84} color={GOLD}>Clue 1: family food rules</Label>
        {MENU.map((m, i) => {
          const p = appear(t, showAt[i] - 0.1);
          return p > 0 ? (
            <React.Fragment key={m.name}>
              <WorldSvg box={[m.x - 260, 230, m.x + 260, 960]}>
                <rect x={m.x - 240} y={250} width={480} height={680} rx={28} fill="#FFFFFF" stroke={INK} strokeWidth={8} transform={`translate(${m.x} 590) scale(${p}) translate(${-m.x} -590)`} />
              </WorldSvg>
              <Critter sp={S.orca} x={m.x} y={390} w={360} t={t} phase={i} pop={p} />
              <Critter sp={m.food} x={m.x} y={640} w={i === 1 ? 260 : 300} t={t} phase={i + 3} pop={p} flip={i === 2} />
              <Label t={t} t0={showAt[i]} x={m.x} y={540} size={56} color={GOLD}>{m.name}</Label>
              <Label t={t} t0={showAt[i] + 0.3} x={m.x} y={790} size={46}>{m.label}</Label>
              {t > mix ? (
                <WorldSvg box={[m.x - 140, 840, m.x + 140, 940]}>
                  <g opacity={t > dial - 0.3 ? 1 : 0}>
                    <Squiggle x={m.x} y={890} kind={i} t={t} />
                  </g>
                </WorldSvg>
              ) : null}
            </React.Fragment>
          ) : null;
        })}
        <Label t={t} t0={mix} t1={dial - 0.3} x={W / 2} y={205} size={56}>they don't mix</Label>
      </>
    );
  }
  if (t < fixed - 0.15) {
    // mother and calf chasing salmon together
    const m = swim(t, learned, fixed, {x: -300, y: 520}, {x: 1200, y: 500});
    return (
      <>
        <Underwater t={t} />
        {[0, 1, 2].map((i) => (
          <Critter key={i} sp={S.salmon} x={m.x + 520 + i * 140} y={440 + i * 70} w={170} t={t} flip={false} phase={i * 2} />
        ))}
        <Critter sp={S.orca} x={m.x} y={m.y} w={560} t={t} />
        <Critter sp={S.orca} x={m.x - 180} y={m.y + 200} w={300} t={t} phase={1.5} />
        <Label t={t} t0={cue(5, 'Calves learn')} x={m.x - 470} y={m.y + 200} size={56} color={GOLD}>calf</Label>
        <Label t={t} t0={cue(5, 'from their mothers')} x={m.x} y={m.y - 210} size={56}>mum</Label>
      </>
    );
  }
  if (t < humans - 0.15) {
    // a seal swims right past a hungry resident, who ignores it
    const s = swim(t, fixed + 0.6, humans, {x: 2200, y: 430}, {x: -300, y: 470}, false);
    return (
      <>
        <Underwater t={t} />
        <Critter sp={S.orca} x={760} y={620} w={600} t={t} rot={t > fixed + 2 ? -6 : 0} />
        <Critter sp={S.seal} x={s.x} y={s.y} w={300} t={t} />
        <Critter sp={S.salmon} x={1500} y={640} w={150} t={t} flip opacity={0.8} />
        <Label t={t} t0={cue(5, 'salmon is scarce')} x={1500} y={760} size={52}>salmon: scarce</Label>
        <Label t={t} t0={cue(5, "don't switch")} x={760} y={300} size={70} color={GOLD}>no thanks</Label>
      </>
    );
  }
  // the family menu: no Dot on it
  const m = appear(t, humans - 0.1);
  return (
    <>
      <Paper />
      <WorldSvg box={[0, 0, W, H]}>
        <g transform={`translate(760 500) scale(${m})`}>
          <rect x={-330} y={-380} width={660} height={720} rx={26} fill="#FFFDF5" stroke={INK} strokeWidth={9} />
          <line x1={-260} y1={-240} x2={260} y2={-240} stroke={INK} strokeWidth={6} />
        </g>
      </WorldSvg>
      <Label t={t} t0={humans} x={760} y={200} size={62} color={GOLD}>Family menu</Label>
      {[S.salmon, S.seal, S.shark].map((sp, i) => (
        <Critter key={i} sp={sp} x={760} y={370 + i * 160} w={230} t={t} bob={2} pop={appear(t, humans + 0.15 * i)} flip={i === 2} />
      ))}
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_scuba'}]} x={1420} y={900} headR={70} />
      <Label t={t} t0={cue(5, 'So nobody teaches it')} x={1420} y={320} size={60}>not on the menu</Label>
    </>
  );
};

// ================================================================================================ 6 Clue 2
const Arcs: React.FC<{t: number; t0: number; x: number; y: number; dir?: 1 | -1; color?: string; jag?: boolean}> = ({t, t0, x, y, dir = 1, color = '#FFFFFF', jag = false}) => {
  if (t < t0) return null;
  return (
    <WorldSvg box={[x - 900, y - 400, x + 900, y + 400]}>
      {[0, 1, 2, 3].map((i) => {
        const u = (((t - t0) * 0.9 + i / 4) % 1);
        const r = 40 + u * 700;
        const a = 0.5;
        const pts = Array.from({length: 13}, (_, k) => {
          const ang = -a + (2 * a * k) / 12;
          const rr = r + (jag ? (k % 2 ? 18 : -18) : 0);
          return `${x + dir * rr * Math.cos(ang)},${y + rr * Math.sin(ang)}`;
        });
        return <polyline key={i} points={pts.join(' ')} fill="none" stroke={color} strokeOpacity={1 - u} strokeWidth={9} strokeLinecap="round" />;
      })}
    </WorldSvg>
  );
};

export const S6: React.FC<P> = ({t}) => {
  const click = cue(6, 'clicking');
  const precise = cue(6, "It's so precise");
  const bladder = cue(6, 'swim bladder');
  const person = cue(6, 'A person probably');
  const strange = cue(6, 'So to an orca');
  if (t < person - 0.15) {
    const xr = appear(t, bladder - 0.1);
    return (
      <>
        <Underwater t={t} seabed={false} />
        <Label t={t} t0={secStart(6)} t1={click + 1.2} x={W / 2} y={110} size={84} color={GOLD}>Clue 2: sound</Label>
        <Critter sp={S.orca} x={420} y={560} w={560} t={t} bob={4} />
        <Arcs t={t} t0={click} x={700} y={520} />
        <Arcs t={t} t0={precise} x={1320} y={520} dir={-1} color="#FFE27A" />
        <Critter sp={S.salmon} x={1500} y={540} w={520} t={t} bob={3} />
        <WorldSvg box={[0, 0, W, H]}>
          <g opacity={xr > 0 ? 1 : 0} transform={`translate(1520 520) scale(${xr})`}>
            <ellipse rx={120} ry={34} fill="#F7F7F7" stroke={INK} strokeWidth={6} />
            <ellipse rx={80} ry={16} fill="#BFE6FF" opacity={0.8} />
          </g>
        </WorldSvg>
        <Label t={t} t0={cue(6, 'echolocation')} x={700} y={250} size={70}>echolocation</Label>
        <Label t={t} t0={bladder + 0.2} x={1500} y={380} size={56} color={GOLD}>swim bladder</Label>
      </>
    );
  }
  return (
    <>
      <Underwater t={t} />
      <Critter sp={S.orca} x={420} y={560} w={560} t={t} bob={4} />
      <Arcs t={t} t0={person} x={700} y={520} />
      <Arcs t={t} t0={person + 0.8} x={1260} y={520} dir={-1} color="#FFB0C8" jag />
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_scuba'}]} x={1460} y={800} headR={64} />
      <Bubbles t={t} x={1530} y={600} n={8} />
      {[cue(6, 'wetsuits'), cue(6, 'metal tanks'), cue(6, 'and bubbles')].map((a, i) => (
        <Label key={i} t={t} t0={a} x={1640} y={250 + i * 90} size={52} color={GOLD}>{['wetsuit', 'metal tank', 'bubbles'][i]}</Label>
      ))}
      <QCloud t={t} t0={strange} t1={secEnd(6) + 1} x={520} y={260} from={{x: 520, y: 470}} />
    </>
  );
};

// ================================================================================================ 7 Clue 3
const Brain: React.FC<{x: number; y: number; r: number; glow?: number; folds?: number}> = ({x, y, r, glow = 0, folds = 6}) => (
  <WorldSvg box={[x - r * 1.5, y - r * 1.2, x + r * 1.5, y + r * 1.2]}>
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-r * 1.25},0 C${-r * 1.3},${-r * 0.9} ${-r * 0.3},${-r * 1.05} 0,${-r * 0.85} C${r * 0.4},${-r * 1.05} ${r * 1.3},${-r * 0.8} ${r * 1.25},0 C${r * 1.25},${r * 0.75} ${r * 0.3},${r * 0.85} 0,${r * 0.7} C${-r * 0.4},${r * 0.9} ${-r * 1.25},${r * 0.7} ${-r * 1.25},0 Z`}
        fill="#F7B6C2" stroke={INK} strokeWidth={Math.max(5, r * 0.05)} />
      {glow > 0 ? <ellipse cx={-r * 0.2} cy={r * 0.15} rx={r * 0.55} ry={r * 0.35} fill="#FFE27A" opacity={0.6 * glow} /> : null}
      {Array.from({length: folds}, (_, i) => {
        const yy = -r * 0.6 + (i * r * 1.2) / folds;
        return <path key={i} d={`M${-r * 0.9},${yy} q${r * 0.2},${-r * 0.15} ${r * 0.4},0 t${r * 0.4},0 t${r * 0.4},0 t${r * 0.4},0`} fill="none" stroke="#C9788A" strokeWidth={Math.max(3, r * 0.04)} strokeLinecap="round" />;
      })}
    </g>
  </WorldSvg>
);

export const S7: React.FC<P> = ({t}) => {
  const weighs = cue(7, "An orca's brain weighs");
  const four = cue(7, 'about four times');
  const scans = cue(7, 'Brain scans');
  const emotion = cue(7, 'emotion');
  const curious = cue(7, 'Orcas are curious');
  const when = cue(7, 'When something big');
  if (t < curious - 0.15) {
    const big = appear(t, weighs);
    const small = appear(t, four - 0.1);
    const zoom = 1 + 0.25 * easeInOutCubic(progress(t, scans, scans + 1));
    return (
      <>
        <Paper />
        <Label t={t} t0={secStart(7)} t1={weighs} x={W / 2} y={110} size={84} color={GOLD}>Clue 3: the brain</Label>
        <div style={{position: 'absolute', inset: 0, transformOrigin: '700px 520px', transform: `scale(${zoom})`}}>
          {big > 0 ? (
            <div style={{position: 'absolute', inset: 0, transformOrigin: '700px 520px', transform: `scale(${big})`}}>
              <Brain x={700} y={520} r={300} folds={9} glow={clamp01((t - emotion + 0.2) / 0.5)} />
            </div>
          ) : null}
        </div>
        {small > 0 ? (
          <div style={{position: 'absolute', inset: 0, transformOrigin: '1500px 600px', transform: `scale(${small})`}}>
            <Brain x={1500} y={600} r={150} folds={5} />
          </div>
        ) : null}
        <Label t={t} t0={weighs + 0.5} x={700} y={815} size={60} color={GOLD}>orca: 5–6 kg</Label>
        <Label t={t} t0={four} x={1500} y={815} size={60}>us: ~1.4 kg</Label>
        <Label t={t} t0={four + 0.4} t1={scans} x={1100} y={200} size={110} color={GOLD}>×4</Label>
        <Label t={t} t0={emotion + 0.2} x={700} y={190} size={60}>emotion & social life</Label>
      </>
    );
  }
  // curious and cautious: an orca comes over to Dot, looks, and leaves
  const approach = swim(t, curious, when + 0.8, {x: -300, y: 520}, {x: 980, y: 520});
  const leave = swim(t, when + 1.6, secEnd(7) + 1, {x: 980, y: 520}, {x: -400, y: 420});
  const o = t < when + 1.6 ? approach : leave;
  return (
    <>
      <Underwater t={t} />
      <Critter sp={S.orca} x={o.x} y={o.y} w={560} t={t} flip={t >= when + 1.6} />
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_scuba'}]} x={1450} y={800} headR={64} />
      <Bubbles t={t} x={1520} y={600} />
      <QCloud t={t} t0={cue(7, 'check it out') - 0.2} t1={when + 1.7} x={900} y={250} from={{x: o.x + 200, y: o.y - 80}}>
        <text x={0} y={30} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize={90} fill="#2B3A8C" stroke={INK} strokeWidth={6} paintOrder="stroke">?</text>
      </QCloud>
      <Label t={t} t0={cue(7, 'leave it alone')} x={W / 2} y={160} size={64} color={GOLD}>...and leave it alone</Label>
    </>
  );
};

// ================================================================================================ 8 Captivity
const Tank: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
  <WorldSvg box={[x - 40, y - 40, x + w + 40, y + h + 40]}>
    <rect x={x - 26} y={y - 26} width={w + 52} height={h + 52} rx={20} fill="#C9C4BA" stroke={INK} strokeWidth={8} />
    <rect x={x} y={y} width={w} height={h} rx={10} fill="#5FB7E8" stroke={INK} strokeWidth={7} />
    <path d={`M${x},${y + 30} Q${x + w / 4},${y + 18} ${x + w / 2},${y + 30} T${x + w},${y + 30}`} fill="none" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={6} />
  </WorldSvg>
);

export const S8: React.FC<P> = ({t}) => {
  const four = cue(8, 'Four times');
  const captivity = cue(8, 'in captivity');
  const three = cue(8, 'Three of them');
  const captured = cue(8, 'He was captured');
  const rest = cue(8, 'spent the rest');
  const many = cue(8, 'Many scientists');
  const record = cue(8, 'So the captive record');
  if (t < captivity - 0.15) {
    return (
      <>
        <Paper tone="dark" />
        <Label t={t} t0={four} x={W / 2} y={460} size={320} color="#FFFFFF">4</Label>
      </>
    );
  }
  if (t < captured - 0.15) {
    const lap = 2 * Math.PI * 0.12 * (t - captivity);
    const x = 960 + 300 * Math.cos(lap);
    return (
      <>
        <Paper />
        <Tank x={460} y={380} w={1000} h={460} />
        <Critter sp={S.orca} x={x} y={620} w={380} t={t} flip={Math.sin(lap) > 0} bob={3} />
        <Label t={t} t0={captivity + 0.2} x={W / 2} y={200} size={74} color={GOLD}>all in captivity</Label>
        <Label t={t} t0={three + 0.3} x={W / 2} y={300} size={70}>Tilikum</Label>
      </>
    );
  }
  if (t < many - 0.15) {
    // captured young: the pod swims off, the calf is left behind; then tanks with strangers
    const podGone = swim(t, captured + 0.5, rest, {x: 900, y: 460}, {x: 2400, y: 420});
    return rest > t ? (
      <>
        <Underwater t={t} deep />
        <Critter sp={S.orca} x={podGone.x} y={podGone.y} w={520} t={t} />
        <Critter sp={S.orca} x={podGone.x - 300} y={podGone.y + 160} w={460} t={t} phase={1} />
        <Critter sp={S.orca} x={620} y={720} w={240} t={t} flip phase={2} />
        <Label t={t} t0={cue(8, 'off Iceland')} x={W / 2} y={130} size={74} color={GOLD}>Iceland, 1983</Label>
        <Label t={t} t0={cue(8, 'about two years old')} x={620} y={590} size={56}>about 2 years old</Label>
      </>
    ) : (
      <>
        <Paper />
        <Tank x={260} y={360} w={1400} h={480} />
        {[0, 1, 2].map((i) => (
          <Critter key={i} sp={S.orca} x={520 + i * 440} y={560 + (i % 2) * 120} w={300} t={t} flip={i === 1} phase={i * 2} />
        ))}
        <Label t={t} t0={rest + 0.3} x={W / 2} y={200} size={66}>strangers, not family</Label>
      </>
    );
  }
  if (t < record - 0.15) {
    // wild vs tank
    return (
      <>
        <Paper tone="sea" />
        <WorldSvg box={[0, 0, W, H]}>
          <rect x={80} y={180} width={1000} height={640} rx={26} fill="#2F86C4" stroke={INK} strokeWidth={8} />
        </WorldSvg>
        {[0, 1, 2, 3].map((i) => (
          <Critter key={i} sp={S.orca} x={300 + i * 210} y={380 + (i % 2) * 220} w={i === 0 ? 300 : 230} t={t} phase={i} />
        ))}
        <Tank x={1300} y={500} w={480} h={260} />
        <Critter sp={S.orca} x={1540} y={640} w={240} t={t} bob={2} />
        <Label t={t} t0={many + 0.2} x={580} y={115} size={60} color={GOLD}>family, space</Label>
        <Label t={t} t0={cue(8, 'no family')} x={1540} y={420} size={56}>no family, no space</Label>
        <SweatDrop t={t} t0={cue(8, 'stress')} t1={record} x={1660} y={560} r={16} slide={28} />
      </>
    );
  }
  return (
    <Dock t={t} fins={false}>
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_droop'}, {at: cue(8, 'It shows'), pose: 'dot_lookup', style: 'squash'}]} x={360} y={846} headR={72} />
      <Label t={t} t0={record + 0.3} x={1150} y={300} size={64}>the wild record still stands</Label>
    </Dock>
  );
};

// ================================================================================================ 9 Putting the clues together
export const S9: React.FC<P> = ({t}) => {
  const menu = cue(9, "We're not on");
  const sound = cue(9, 'We probably sound');
  const careful = cue(9, "And they're careful");
  const even = cue(9, 'Even so');
  const maybe = cue(9, "Maybe it's a mix");
  if (t < even - 0.15) {
    const cards = [
      {at: menu, label: 'not on the menu', draw: (x: number, y: number) => <Critter sp={S.salmon} x={x} y={y} w={220} t={t} bob={2} />},
      {at: sound, label: 'we sound strange', draw: (x: number, y: number) => <Arcs t={t} t0={sound} x={x - 120} y={y} />},
      {at: careful, label: 'careful minds', draw: (x: number, y: number) => <Brain x={x} y={y} r={90} />},
    ];
    return (
      <>
        <Paper tone="sea" />
        <Label t={t} t0={secStart(9) + 0.1} x={W / 2} y={110} size={80} color={GOLD}>Putting the clues together</Label>
        {cards.map((c, i) => {
          const x = 380 + i * 580;
          const p = appear(t, c.at - 0.1);
          return p > 0 ? (
            <React.Fragment key={i}>
              <WorldSvg box={[x - 260, 220, x + 260, 900]}>
                <rect x={x - 240} y={240} width={480} height={590} rx={28} fill="#FFFFFF" stroke={INK} strokeWidth={8} transform={`translate(${x} 535) scale(${p}) translate(${-x} -535)`} />
              </WorldSvg>
              <div style={{position: 'absolute', inset: 0, overflow: 'hidden', clipPath: `inset(250px ${W - x - 230}px ${H - 820}px ${x - 230}px round 24px)`}}>{c.draw(x, 520)}</div>
              <Label t={t} t0={c.at + 0.2} x={x} y={760} size={50}>{c.label}</Label>
              <Label t={t} t0={c.at + 0.2} x={x} y={330} size={70} color={GOLD}>{`${i + 1}`}</Label>
            </React.Fragment>
          ) : null;
        })}
      </>
    );
  }
  return (
    <Dock t={t}>
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_scratch'}, {at: maybe, pose: 'dot_three', style: 'squash'}, {at: cue(9, "Maybe it's something"), pose: 'dot_shrug', style: 'squash'}]} x={360} y={846} headR={72} />
      <BigNumber t={t} t0={cue(9, "can't fully explain")} x={1150} y={330} size={280} text="?" />
    </Dock>
  );
};

// ================================================================================================ 10 Every chance
export const S10: React.FC<P> = ({t}) => {
  const sixties = cue(10, 'In the 1960s');
  const today = cue(10, 'Today the Southern');
  const salmon = cue(10, 'partly because');
  const next = cue(10, 'So the next time');
  const remember = cue(10, 'remember');
  if (t < sixties - 0.15) {
    return (
      <Dock t={t}>
        <DotRig t={t} swaps={[{at: 0, pose: 'dot_droop'}]} x={360} y={846} headR={72} />
      </Dock>
    );
  }
  if (t < today - 0.15) {
    // young orcas taken away from their pods
    return (
      <>
        <Paper />
        <Tank x={1260} y={420} w={520} h={300} />
        {[0, 1, 2].map((i) => {
          const u = easeInOutCubic(clamp01((t - sixties - 0.6 - i * 0.5) / 1.6));
          return <Critter key={i} sp={S.orca} x={lerp(360 + i * 60, 1440 + i * 70, u)} y={lerp(420 + i * 160, 560 + (i % 2) * 70, u)} w={lerp(260, 170, u)} t={t} phase={i} />;
        })}
        {[0, 1].map((i) => <Critter key={`m${i}`} sp={S.orca} x={300 + i * 30} y={300 + i * 420} w={420} t={t} phase={i + 4} />)}
        <Label t={t} t0={sixties + 0.2} x={W / 2} y={130} size={74} color={GOLD}>1960s–70s: dozens captured</Label>
      </>
    );
  }
  if (t < next - 0.15) {
    // about 75 orcas left: a grid of little fins; the salmon thins out
    const n = Math.floor(75 * easeInOutCubic(progress(t, today, today + 2.2)));
    return (
      <>
        <Paper tone="sea" />
        <WorldSvg box={[0, 0, W, H]}>
          {Array.from({length: n}, (_, i) => {
            const x = 220 + (i % 15) * 70;
            const y = 300 + Math.floor(i / 15) * 100;
            return <path key={i} d={`M${x - 26},${y + 16} Q${x - 4},${y - 50} ${x + 6},${y - 60} Q${x + 8},${y - 20} ${x + 26},${y + 16} Z`} fill="#1B1B22" stroke={INK} strokeWidth={4} />;
          })}
        </WorldSvg>
        <Label t={t} t0={today + 0.3} x={710} y={180} size={80} color={GOLD}>about 75 left</Label>
        <Label t={t} t0={cue(10, 'endangered')} x={710} y={790} size={62}>endangered</Label>
        {[0, 1, 2, 3, 4].map((i) => (
          <Critter key={i} sp={S.salmon} x={1560} y={300 + i * 130} w={220} t={t} phase={i} opacity={t > salmon ? (i < 2 ? 1 : 1 - clamp01((t - salmon - i * 0.2) / 0.5)) : 1} />
        ))}
        <Label t={t} t0={salmon + 0.3} x={1560} y={200} size={56}>less salmon</Label>
      </>
    );
  }
  // the end: swimming side by side; the camera drifts up to the surface light
  const o = swim(t, next - 0.2, secEnd(10) + 1.6, {x: -300, y: 560}, {x: 1000, y: 520});
  return (
    <>
      <Underwater t={t} />
      <Critter sp={S.orca} x={o.x} y={o.y} w={600} t={t} />
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_scuba'}]} x={1400} y={820} headR={66} />
      <Bubbles t={t} x={1470} y={620} />
      <Label t={t} t0={remember + 0.3} x={W / 2} y={170} size={74} color={GOLD}>every chance... and it hasn't</Label>
    </>
  );
};
