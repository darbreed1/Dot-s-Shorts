import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeInCubic, easeInOutCubic, easeOutCubic, kick, kicks, lerp, progress} from '../../kit/anim';
import {F, Layer, camAt, shake} from '../../kit/camera';
import {Dot, DotSprite} from '../../kit/Dot';
import {Mixer} from '../../kit/audio';
import {Captions} from '../../kit/Captions';
import {DesignSpace} from '../../kit/DesignSpace';
import {ObjectFace, Brow, Mouth} from '../../kit/effects/ObjectFace';
import {GasPuffs, Puff} from '../../kit/effects/GasPuff';
import {DropletBursts, repeatBursts, Burst} from '../../kit/effects/particles';
import {Glint, StingMarks, SweatDrop} from '../../kit/effects/small';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {CAMERA, DOT_SWAPS, FPS, MOUSE_T, SHOT, T, inCell, inCloseUp} from './beats';
import {Cell} from './Cell';
import {CUES} from './cues';
import {WORDS} from './captions';
import {S} from './sprites';

// World layout (world px; a layer at Z 1000 is 1:1 at camera z 0). Dot stands on a step stool beside a counter;
// the onion sits on the cutting board where his knife lands.
const Z = {wall: 1300, floor: 1010, counter: 1005, onion: 1004, dot: 1000};
const INK = '#15151C';
const DOT_FEET = {x: 200, y: 1598};
const HEAD_R = 100;
const FLOOR_Y = 1873;
const BOARD_Y = 1524; // cutting-board surface
const ONION = {x: 430, y: 1374, r: 150}; // bulb centre + radius (whole onion and the pair of halves)
const C_S = 0.556; // counter sprite -> world
const COUNTER = {x: ONION.x - ((S.counter.board[0] + S.counter.board[2]) / 2) * C_S, y: BOARD_Y - ((S.counter.board[1] + S.counter.board[3]) / 2) * C_S};
const O_S = ONION.r / S.onion_whole.bulb[2];
// each half of a round onion is about half its width: the pair spans ~1.5x the bulb (with the gap)
const H_S = 0.25;
const HALF_GAP_X = (S.onion_halves.halves[0][0] + S.onion_halves.halves[1][0]) / 2;
const HALF_R = S.onion_halves.halves[1][2] * H_S;
const HALF_Y = BOARD_Y - HALF_R; // bulb centre of each half, resting on the board
const RIGHT_HALF = {x: ONION.x + (S.onion_halves.halves[1][0] - HALF_GAP_X) * H_S, y: HALF_Y};
const M_S = 0.13; // mouse sprite -> world

const dots = S as unknown as Record<string, DotSprite>;
const dotS = (pose: keyof typeof S) => HEAD_R / (S[pose] as unknown as DotSprite).head[2];
/** A point on a Dot pose (sprite px) -> world, ignoring squash (fine for effects placement). */
const dotPt = (pose: 'dot_cry_knife' | 'dot_slow_cut' | 'dot_knife_show' | 'dot_chop', x: number, y: number, dy = 0) => {
  const sp = S[pose];
  const s = dotS(pose);
  return {x: DOT_FEET.x + (x - sp.feet[0]) * s, y: DOT_FEET.y + dy + (y - sp.feet[1]) * s};
};
const DOT_EYES = {x: 240, y: 1210};

// ------------------------------------------------------------------------------------------------ background
const Kitchen: React.FC = () => (
  <WorldSvg box={[-1300, -200, 2300, 2700]}>
    <rect x={-1300} y={-200} width={3600} height={2900} fill="#FBE6BE" />
    <rect x={-1300} y={1120} width={3600} height={620} fill="#E3F0F1" />
    {Array.from({length: 40}, (_, i) => (
      <line key={`v${i}`} x1={-1300 + i * 90} y1={1120} x2={-1300 + i * 90} y2={1740} stroke="#C9DDE0" strokeWidth={5} />
    ))}
    {Array.from({length: 7}, (_, i) => (
      <line key={`h${i}`} x1={-1300} y1={1120 + i * 90} x2={2300} y2={1120 + i * 90} stroke="#C9DDE0" strokeWidth={5} />
    ))}
    <line x1={-1300} y1={1120} x2={2300} y2={1120} stroke={INK} strokeWidth={8} />
    {/* window */}
    <rect x={560} y={430} width={380} height={440} rx={18} fill="#A9DCF7" stroke={INK} strokeWidth={10} />
    <circle cx={850} cy={530} r={46} fill="#FFE58A" stroke={INK} strokeWidth={6} />
    <path d="M560,800 Q650,730 740,790 Q830,740 940,800 L940,870 L560,870 Z" fill="#8FCB7A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <line x1={750} y1={430} x2={750} y2={870} stroke={INK} strokeWidth={10} />
    <line x1={560} y1={650} x2={940} y2={650} stroke={INK} strokeWidth={10} />
    <rect x={540} y={866} width={420} height={30} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={8} />
  </WorldSvg>
);

const Floor: React.FC = () => (
  <WorldSvg box={[-1300, 1690, 2300, 2900]}>
    <rect x={-1300} y={1700} width={3600} height={1200} fill="#D49B63" />
    {[1790, 1900, 2030, 2190, 2380].map((y) => (
      <line key={y} x1={-1300} y1={y} x2={2300} y2={y} stroke="#B97F4B" strokeWidth={6} />
    ))}
    <line x1={-1300} y1={1700} x2={2300} y2={1700} stroke={INK} strokeWidth={8} />
  </WorldSvg>
);

const Stool: React.FC = () => (
  <WorldSvg box={[60, 1580, 340, FLOOR_Y + 20]}>
    <path d={`M115,1630 L95,${FLOOR_Y} L130,${FLOOR_Y} L150,1630 Z M285,1630 L305,${FLOOR_Y} L270,${FLOOR_Y} L250,1630 Z`} fill="#B26B38" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <rect x={110} y={1760} width={180} height={22} fill="#B26B38" stroke={INK} strokeWidth={6} />
    <rect x={88} y={1596} width={224} height={38} rx={10} fill="#C98049" stroke={INK} strokeWidth={8} />
  </WorldSvg>
);

// ------------------------------------------------------------------------------------------------ onion face
type FaceState = {open: number; brow: Brow; mouth: Mouth; look: {x: number; y: number}; squeeze?: boolean};
const faceAt = (t: number): FaceState => {
  const L = {x: -1, y: -0.2};
  if (t < T.because) return {open: 0.12, brow: 'relaxed', mouth: 'smile', look: L};
  if (t < T.fighting) return {open: 1, brow: 'angry', mouth: 'frown', look: L};
  if (t < SHOT.chop) return {open: 0.55, brow: 'relaxed', mouth: 'smirk', look: L};
  if (t < T.cut) return {open: 1, brow: 'worried', mouth: 'o', look: {x: -0.6, y: -1}};
  if (t < SHOT.gas) return {open: 1, brow: 'angry', mouth: 'frown', look: L, squeeze: true};
  if (t < SHOT.mouse) return {open: 0.55, brow: 'relaxed', mouth: 'smirk', look: L};
  if (t < MOUSE_T.hit) return {open: 1, brow: 'angry', mouth: 'flat', look: {x: 1, y: 0}};
  if (t < SHOT.knife) return {open: 0.55, brow: 'relaxed', mouth: 'grin', look: {x: 1, y: 0}};
  if (t < T.less) return {open: 1, brow: 'worried', mouth: 'o', look: {x: -1, y: -0.6}};
  return {open: 0.5, brow: 'angry', mouth: 'frown', look: {x: -0.8, y: 0}};
};

const Onion: React.FC<{t: number}> = ({t}) => {
  const halves = t >= T.cut;
  const sy = 1 + kick(t, T.cut, -0.08, 4, 8) + kick(t, T.because, 0.04, 4, 8) + 0.008 * Math.sin(2 * Math.PI * 0.5 * t);
  const sx = 1 - kick(t, T.cut, -0.08, 4, 8) * 0.6;
  const f = faceAt(t);
  const pop = 1 + kick(t, T.because, 0.12, 4, 7);
  const face = halves ? {x: RIGHT_HALF.x, y: RIGHT_HALF.y + HALF_R * 0.1, r: HALF_R * 1.05} : {x: ONION.x, y: ONION.y + 10, r: ONION.r};
  return (
    <div style={{position: 'absolute', left: ONION.x, top: BOARD_Y, transformOrigin: '0 0', transform: `scale(${sx}, ${sy})`}}>
      <div style={{position: 'absolute', left: -ONION.x, top: -BOARD_Y}}>
        {halves ? (
          <Img src={staticFile(S.onion_halves.src)} style={{position: 'absolute', left: ONION.x - HALF_GAP_X * H_S, top: HALF_Y - S.onion_halves.halves[1][1] * H_S, width: S.onion_halves.w * H_S, height: S.onion_halves.h * H_S}} />
        ) : (
          <Img src={staticFile(S.onion_whole.src)} style={{position: 'absolute', left: ONION.x - S.onion_whole.bulb[0] * O_S, top: ONION.y - S.onion_whole.bulb[1] * O_S, width: S.onion_whole.w * O_S, height: S.onion_whole.h * O_S}} />
        )}
        <ObjectFace id="onion" x={face.x} y={face.y} r={face.r} open={f.open} brow={f.brow} mouth={f.mouth} look={f.look} squeeze={f.squeeze} pop={pop} />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------ mouse
const Mouse: React.FC<{t: number}> = ({t}) => {
  const M = MOUSE_T;
  if (t < M.enter || t > M.gone + 0.1) return null;
  const crying = t >= M.hit;
  const walkU = easeOutCubic(progress(t, M.enter, M.arrive));
  let noseX = lerp(1200, RIGHT_HALF.x + HALF_R + 18, walkU);
  noseX += 26 * easeOutCubic(progress(t, M.hit, M.hit + 0.15));
  const run = Math.max(0, t - (M.turn + 0.1));
  noseX += 2600 * run * run;
  const walking = (t < M.arrive) || run > 0;
  const bob = walking ? -Math.abs(Math.sin(2 * Math.PI * 5.5 * t)) * 10 : 0;
  // turn around: scaleX 1 -> -1 through 0 (narrowest frame hides the flip)
  const tu = clamp01((t - (M.turn - 0.1)) / 0.2);
  const flip = Math.cos(Math.PI * tu);
  const sniff = !walking && !crying ? 2 * Math.sin(2 * Math.PI * 8 * t) : 0;
  const recoil = kick(t, M.hit, -9, 3, 6);
  const nose = S.mouse.nose;
  const feet = S.mouse.feet;
  const w = S.mouse.w * M_S;
  const left = noseX - nose[0] * M_S;
  const cx = left + w / 2;
  const m = S.mouse_cry.toMouse;
  // tears flying off while it runs
  const eye = {x: left + 230 * M_S, y: BOARD_Y - (feet[1] - 420) * M_S};
  const tears: Burst[] = crying ? repeatBursts(M.hit + 0.05, M.gone, 0.12, (at, i) => ({at, x: eye.x, y: eye.y + bob, count: 2, speed: [180, 320], angle: flip > 0 ? [-60, -20] : [-160, -120], size: [4, 7], life: 0.6, seed: 300 + i})) : [];
  return (
    <>
      <div style={{position: 'absolute', left: cx, top: BOARD_Y + bob, transformOrigin: '0 0', transform: `rotate(${sniff + recoil}deg) scale(${flip}, 1)`}}>
        <div style={{position: 'absolute', left: -w / 2, top: -feet[1] * M_S, width: w, height: S.mouse.h * M_S}}>
          <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `scale(${M_S})`}}>
            {crying ? (
              <Img src={staticFile(S.mouse_cry.src)} style={{position: 'absolute', left: 0, top: 0, width: S.mouse_cry.w, height: S.mouse_cry.h, transformOrigin: '0 0', transform: `matrix(${m.join(',')})`}} />
            ) : (
              <Img src={staticFile(S.mouse.src)} style={{position: 'absolute', left: 0, top: 0, width: S.mouse.w, height: S.mouse.h}} />
            )}
          </div>
        </div>
      </div>
      <DropletBursts t={t} bursts={tears} color="#8FD0FF" core="#DDF2FF" gravity={1300} />
    </>
  );
};

// ------------------------------------------------------------------------------------------------ close-up
const CloseUp: React.FC<{t: number}> = ({t}) => {
  const sq = S.dot_squeeze;
  const s = 1.0;
  const left = (1080 - sq.w * s) / 2;
  const top = 1920 - sq.h * s;
  const head = {x: left + sq.head[0] * s, y: top + sq.head[1] * s, r: sq.head[2] * s};
  const tremble = {x: 2 * Math.sin(2 * Math.PI * 7.3 * t), y: 1.5 * Math.sin(2 * Math.PI * 6.1 * t + 1)};
  const flinch = kick(t, T.sting, -0.03, 4, 8);
  const eyes = [{x: head.x - head.r * 0.42, y: head.y - head.r * 0.06}, {x: head.x + head.r * 0.42, y: head.y - head.r * 0.06}];
  const gush: Burst[] = [
    ...repeatBursts(T.tears - 0.05, T.away + 0.3, 0.1, (at, i) => ({at, x: head.x - head.r * 0.78, y: head.y + head.r * 0.12, count: 3, speed: [450, 750], angle: [-165, -125], size: [9, 17], life: 0.85, seed: 500 + i})),
    ...repeatBursts(T.tears, T.away + 0.3, 0.1, (at, i) => ({at, x: head.x + head.r * 0.78, y: head.y + head.r * 0.12, count: 3, speed: [450, 750], angle: [-55, -15], size: [9, 17], life: 0.85, seed: 700 + i})),
  ];
  const puff: Puff[] = [{at: SHOT.closeUp, dur: T.away + 0.15 - SHOT.closeUp, from: {x: head.x + 40, y: head.y - head.r * 0.2}, to: {x: head.x + 90, y: head.y - head.r * 0.55}, size: 95, arc: 30}];
  return (
    <DesignSpace background="#FBE6BE">
      <WorldSvg box={[0, 0, 1080, 1920]}>
        <rect x={0} y={1180} width={1080} height={740} fill="#E3F0F1" />
        {Array.from({length: 13}, (_, i) => (
          <line key={i} x1={i * 90} y1={1180} x2={i * 90} y2={1920} stroke="#C9DDE0" strokeWidth={5} />
        ))}
        {[1270, 1360, 1450, 1540, 1630, 1720, 1810].map((y) => (
          <line key={y} x1={0} y1={y} x2={1080} y2={y} stroke="#C9DDE0" strokeWidth={5} />
        ))}
        <line x1={0} y1={1180} x2={1080} y2={1180} stroke={INK} strokeWidth={8} />
      </WorldSvg>
      <Img src={staticFile(sq.src)} style={{position: 'absolute', left: left + tremble.x, top: top + tremble.y, width: sq.w * s, height: sq.h * s, transformOrigin: '50% 100%', transform: `scale(${1 - flinch}, ${1 + flinch})`}} />
      <GasPuffs t={t} puffs={puff} grumpy ink={8} />
      {eyes.map((e, i) => (
        <StingMarks key={i} t={t} times={[T.sting, T.sting + 0.28]} x={e.x} y={e.y} r={95} len={60} ink={8} angles={i === 0 ? [-170, -135, -100] : [-80, -45, -10]} />
      ))}
      <DropletBursts t={t} bursts={gush} color="#8FD0FF" core="#DDF2FF" gravity={2300} />
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------------ scene
export const OnionTears: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let cam = camAt(CAMERA, t);
  // chop: a hard thump of screen shake
  const shakeAmp = 22 * Math.exp(-9 * Math.max(0, t - T.cut)) * (t >= T.cut ? 1 : 0);
  if (shakeAmp > 0.2) {
    const sh = shake(t, shakeAmp);
    const k = F / (Z.dot - cam.z);
    cam = {...cam, x: cam.x + sh.x / k, y: cam.y + sh.y / k};
  }
  const press = 16 * easeInOutCubic(progress(t, T.used, T.sprays));
  const dotFeet = {x: DOT_FEET.x, y: DOT_FEET.y + (t >= SHOT.slow[0] ? press : 0)};

  // gas: a puff at Dot on "fighting back"; four drifting up to his eyes on "drifts up to your eyes"; one at the mouse
  const onionTop = {x: ONION.x, y: ONION.y - 40};
  const puffs: Puff[] = [
    {at: T.fighting + 0.02, dur: 0.75, from: onionTop, to: {x: DOT_EYES.x + 10, y: DOT_EYES.y}, size: 44, arc: -40},
    ...[0, 1, 2, 3].map((i): Puff => ({
      at: SHOT.gas + 0.1 + i * 0.28,
      dur: 1.25,
      from: {x: i % 2 ? RIGHT_HALF.x : ONION.x - 60, y: HALF_Y - HALF_R},
      to: {x: DOT_EYES.x + 15 * i, y: DOT_EYES.y - 10},
      size: 42 + 6 * (i % 2),
      arc: i % 2 ? 70 : -50,
      seed: i,
    })),
  ];
  const mousePuff: Puff[] = [{at: MOUSE_T.puff, dur: 0.42, from: {x: RIGHT_HALF.x + HALF_R * 0.6, y: HALF_Y - HALF_R * 0.4}, to: {x: RIGHT_HALF.x + HALF_R + 70, y: BOARD_Y - 80}, size: 40, arc: -30}];

  // mist: a big spray on the fast chop, a tiny one on the slow sharp cut
  const mist: Burst[] = [
    {at: T.cut, x: ONION.x, y: BOARD_Y - 60, count: 34, speed: [500, 1300], angle: [-170, -10], size: [5, 11], life: 1.0, seed: 11},
    {at: T.cut + 0.05, x: ONION.x, y: BOARD_Y - 30, count: 18, speed: [300, 800], angle: [-150, -30], size: [4, 8], life: 0.9, seed: 29},
    {at: T.sprays + 0.05, x: ONION.x, y: BOARD_Y - 20, count: 6, speed: [110, 260], angle: [-150, -30], size: [3, 6], life: 0.7, seed: 47},
  ];
  // drips from Dot's drawn tear streams while he cries
  const crying = (t < SHOT.chop) || (t >= T.eyes && t < SHOT.knife);
  const tearPts = S.dot_cry_knife.tears.map(([x, y]) => dotPt('dot_cry_knife', x, y));
  const drips: Burst[] = crying ? tearPts.flatMap((p, j) => repeatBursts(j * 0.2 + (t < SHOT.chop ? -0.5 : T.eyes), t < SHOT.chop ? SHOT.chop : SHOT.knife, 0.42, (at, i) => ({at, x: p.x, y: p.y, count: 1, speed: [10, 50], angle: [80, 100], size: [6, 9], life: 0.75, seed: 900 + j * 50 + i}))) : [];
  const knifeTip = dotPt('dot_knife_show', S.dot_knife_show.blade.tip[0], S.dot_knife_show.blade.tip[1]);
  const slowBlade = dotPt('dot_slow_cut', S.dot_slow_cut.blade.mid[0], S.dot_slow_cut.blade.mid[1], press);
  const slowTear = dotPt('dot_slow_cut', 440, 770, press);

  // kitchen shots: below the cutting board (the focal action); cell: under the diagram; close-up: under the face
  const capY = inCloseUp(t) ? 0.72 : inCell(t) ? 0.62 : 0.7;
  const layerMin = 100;

  return (
    <AbsoluteFill style={{backgroundColor: '#FBE6BE'}}>
      {inCell(t) ? (
        <Cell t={t} />
      ) : inCloseUp(t) ? (
        <CloseUp t={t} />
      ) : (
        <>
          <Layer cam={cam} z={Z.wall} minDepth={layerMin}>
            <Kitchen />
          </Layer>
          <Layer cam={cam} z={Z.floor} minDepth={layerMin}>
            <Floor />
          </Layer>
          <Layer cam={cam} z={Z.counter} minDepth={layerMin}>
            <Img src={staticFile(S.counter.src)} style={{position: 'absolute', left: COUNTER.x, top: COUNTER.y, width: S.counter.w * C_S, height: S.counter.h * C_S}} />
          </Layer>
          <Layer cam={cam} z={Z.onion} minDepth={layerMin}>
            <Onion t={t} />
            <Mouse t={t} />
          </Layer>
          <Layer cam={cam} z={Z.dot} minDepth={layerMin}>
            <Stool />
            <Dot
              t={t}
              sprites={dots}
              swaps={DOT_SWAPS}
              feet={dotFeet}
              headR={HEAD_R}
              shadow={false}
              bounces={[2.3, T.fighting + 0.75, T.want]}
            />
            <DropletBursts t={t} bursts={drips} color="#8FD0FF" core="#DDF2FF" gravity={1100} />
            <GasPuffs t={t} puffs={[...puffs, ...mousePuff]} grumpy ink={6} />
            <DropletBursts t={t} bursts={mist} color="#D6ECFA" core="#F4FBFF" gravity={1500} />
            <Glint t={t} t0={T.fewer} x={knifeTip.x} y={knifeTip.y} r={46} />
            <Glint t={t} t0={T.sharp} x={slowBlade.x} y={slowBlade.y} r={40} />
            <SweatDrop t={t} t0={T.mist - 0.1} t1={T.end + 0.3} x={slowTear.x} y={slowTear.y} r={9} slide={26} ink={4} />
          </Layer>
        </>
      )}
      <Captions t={t} words={WORDS} y={capY} />
      <Mixer cues={CUES} />
    </AbsoluteFill>
  );
};
