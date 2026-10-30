import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeOutCubic, kick, progress} from '../../kit/anim';
import {Layer, camAt, toScreen} from '../../kit/camera';
import {Dot, DotSprite} from '../../kit/Dot';
import {Mixer} from '../../kit/audio';
import {Captions} from '../../kit/Captions';
import {Label} from '../../kit/Label';
import {NightSky} from '../../kit/effects/NightSky';
import {ThoughtCloud} from '../../kit/effects/ThoughtCloud';
import {DetectBox, FlashRing} from '../../kit/effects/small';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {watchTaps} from '../../kit/moves';
import {Ball, FaceState} from './Ball';
import {CAMERA, DOT_SWAPS, FPS, SHOT, T, inRound, inRuler, inSize, inSky} from './beats';
import {CUES} from './cues';
import {WORDS} from './captions';
import {Ruler, RoundCheck, SizeCompare, SkySearch} from './Inserts';
import {S} from './sprites';

// World layout (world px; a layer at Z 1000 is 1:1 at the wide camera). A night mountain top in Chile: Dot on the
// rocky ground at the left, the observatory on a mesa behind him, Pluto and the new object hanging in the sky.
const Z = {sky: 4000, ridge: 3000, obs: 2200, hill: 1800, near: 1000};
const INK = '#15151C';
const DOT_FEET = {x: 300, y: 1700};
const HEAD_R = 100;
const OBS_W = 1700;
const OBS_S = OBS_W / S.observatory.w;
const OBS_POS = {x: 42, y: 1708 - S.observatory.base * OBS_S}; // top-left; base sits at world y 1708
const DOME = {x: OBS_POS.x + S.observatory.dome[0] * OBS_S, y: OBS_POS.y + S.observatory.dome[1] * OBS_S};
// sky balls (sky layer, k = 0.25 at the wide camera, so world sizes are 4x their screen size)
const PLUTO = {x: -680, y: -1540, R: 470};
const OBJ = {x: 1620, y: -640, R: 280};

const dots = S as unknown as Record<string, DotSprite>;

// ------------------------------------------------------------------------------------------------ ground
const ridgePath = (y0: number, x0: number, x1: number, a1: number, a2: number, step = 60) => {
  let d = `M${x0},${y0 + 1400} L${x0},${y0}`;
  for (let x = x0; x <= x1; x += step) d += ` L${x},${(y0 + a1 * Math.sin(x / 380) + a2 * Math.sin(x / 140 + 2)).toFixed(1)}`;
  return d + ` L${x1},${y0 + 1400} Z`;
};
const Band: React.FC<{d: string; fill: string; box: readonly [number, number, number, number]; outline?: number}> = ({d, fill, box, outline = 0}) => (
  <WorldSvg box={box}>
    <path d={d} fill={fill} stroke={outline ? INK : 'none'} strokeWidth={outline} strokeLinejoin="round" />
  </WorldSvg>
);

const NearGround: React.FC = () => (
  <WorldSvg box={[-900, 1400, 2100, 3000]}>
    <path d={ridgePath(1462, -900, 2100, 10, 6, 50)} fill="#6B5554" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    {/* a few flat rocks */}
    {[[90, 1640, 70, 34], [760, 1600, 95, 40], [960, 1760, 60, 28], [-180, 1720, 80, 36]].map(([x, y, w, h], i) => (
      <g key={i}>
        <path d={`M${x - w},${y} Q${x - w * 0.8},${y - h * 1.3} ${x - w * 0.1},${y - h} Q${x + w * 0.7},${y - h * 1.2} ${x + w},${y} Z`} fill="#86706D" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M${x + w * 0.2},${y - h * 0.95} Q${x + w * 0.75},${y - h * 0.9} ${x + w * 0.9},${y - 4} L${x + w * 0.3},${y - 4} Z`} fill="#735D5B" />
      </g>
    ))}
  </WorldSvg>
);

// ------------------------------------------------------------------------------------------------ sky balls
const objFace = (t: number): FaceState => {
  const toDot = {x: -0.8, y: 0.7};
  if (t < T.new) return {open: 0, brow: 'relaxed', mouth: 'smile', look: toDot};
  if (t < T.maybe) return {open: 1, brow: 'raised', mouth: t < T.new + 0.5 ? 'o' : 'smile', look: toDot};
  if (t < T.spotted) return {open: 1, brow: 'relaxed', mouth: 'smirk', look: toDot};
  if (t < SHOT.ruler) return {open: 1, brow: 'raised', mouth: 'o', look: {x: -0.6, y: 0.9}};
  if (t < SHOT.outro) return {open: 1, brow: 'raised', mouth: 'smile', look: toDot};
  // outro: watches Dot, then dozes off again so the last frame matches frame 0
  return {open: 1 - easeOutCubic(progress(t, 28.15, 28.5)), brow: 'relaxed', mouth: 'smile', look: toDot};
};
const plutoFace = (t: number): FaceState => ({
  open: 1,
  brow: t >= T.pluto && t < T.maybe + 0.5 ? 'raised' : 'relaxed',
  mouth: t >= T.pluto && t < T.maybe ? 'grin' : 'smile',
  look: {x: 1, y: 0.35},
});

const SkyBalls: React.FC<{t: number}> = ({t}) => {
  const plutoK = kick(t, T.pluto, 0.06, 3.5, 7);
  const objK = kick(t, T.new, 0.12, 3.5, 6) + kick(t, T.maybe, -0.1, 3.5, 6) + kick(t, T.spotted, 0.14, 4, 7);
  const bob = (ph: number) => 18 * Math.sin(2 * Math.PI * 0.35 * t + ph);
  const qx = OBJ.x + OBJ.R * 1.35;
  const qy = OBJ.y - OBJ.R * 0.9 + bob(2);
  return (
    <>
      <Ball id="plutoM" sprite={S.pluto} x={PLUTO.x} y={PLUTO.y + bob(0)} R={PLUTO.R} sx={1 - plutoK * 0.6} sy={1 + plutoK} face={plutoFace(t)} />
      <Ball id="objM" sprite={S.ed138} x={OBJ.x} y={OBJ.y + bob(2)} R={OBJ.R} sx={1 - objK * 0.6} sy={1 + objK} face={objFace(t)}
        facePop={1 + kick(t, T.new, 0.15, 4, 7)} />
      {/* a "?" beside the sleepy object at the start and again at the end (the loop) */}
      <Label t={t} t0={-1} t1={T.new + 0.4} x={qx} y={qy} size={300} color="#F2C14E">
        ?
      </Label>
      <Label t={t} t0={SHOT.outro + 0.4} x={qx} y={qy} size={300} color="#F2C14E">
        ?
      </Label>
    </>
  );
};

// ------------------------------------------------------------------------------------------------ scene
export const DwarfPlanet: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const {width, height} = useVideoConfig();
  const cam = camAt(CAMERA, t);
  const insert = inRuler(t) ? <Ruler t={t} /> : inSize(t) ? <SizeCompare t={t} /> : inSky(t) ? <SkySearch t={t} /> : inRound(t) ? <RoundCheck t={t} /> : null;
  // depth of field: the observatory behind Dot in his medium shots
  const medium = (t >= SHOT.dot && t < SHOT.sky) || (t >= SHOT.outro && t < SHOT.back[0] + 0.3);
  // wide shot: above Dot's hat, under the sky balls; elsewhere the usual band (Dot's legs in his medium shots)
  const capY = insert ? (inSky(t) ? 0.6 : 0.66) : t < SHOT.glide[0] ? 0.47 : 0.72;

  // screen-space overlays for "spotted": the dome flashes, a dashed sight line runs to the object, brackets lock on
  const dome = toScreen(cam, Z.obs, DOME.x, DOME.y, width, height);
  const obj = toScreen(cam, Z.sky, OBJ.x, OBJ.y + 18 * Math.sin(2 * Math.PI * 0.35 * t + 2), width, height);
  const sight = easeOutCubic(progress(t, T.spotted + 0.02, T.spotted + 0.3));
  const sightOn = t >= T.spotted && t < SHOT.ruler;
  const sx = width / 1080;

  return (
    <AbsoluteFill style={{backgroundColor: '#141B45'}}>
      {insert ?? (
        <>
          <NightSky t={t} moon={null} top="#10163F" bottom="#3A3C82" count={90} />
          <Layer cam={cam} z={Z.sky}>
            <SkyBalls t={t} />
          </Layer>
          <Layer cam={cam} z={Z.ridge}>
            <Band d={ridgePath(1530, -2600, 4200, 60, 25, 80)} fill="#2C3366" box={[-2600, 1400, 4200, 3000]} outline={14} />
          </Layer>
          <Layer cam={cam} z={Z.obs}>
            <Img src={staticFile(medium ? S.observatory.blur : S.observatory.src)}
              style={{position: 'absolute', left: OBS_POS.x, top: OBS_POS.y, width: S.observatory.w * OBS_S, height: S.observatory.h * OBS_S}} />
          </Layer>
          <Layer cam={cam} z={Z.hill}>
            <Band d={ridgePath(1464, -1500, 3000, 22, 10, 60)} fill="#4A3C55" box={[-1500, 1380, 3000, 3000]} outline={10} />
          </Layer>
          <Layer cam={cam} z={Z.near}>
            <NearGround />
            <Dot
              t={t}
              sprites={dots}
              swaps={DOT_SWAPS}
              feet={DOT_FEET}
              headR={HEAD_R}
              bounces={[T.new + 0.05, T.nobody, ...watchTaps(T.needs, 2, 0.3)]}
            />
            <ThoughtCloud t={t} t0={T.nobody - 0.1} t1={SHOT.sky - 0.05} x={435} y={1105} w={180} h={145} from={{x: 360, y: 1245}} ink={6}>
              <text x={0} y={28} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight={900} fontSize={96}
                fill="#2B3A8C" stroke={INK} strokeWidth={7} paintOrder="stroke" strokeLinejoin="round"
                transform={`rotate(${6 * Math.sin(2 * Math.PI * 1.3 * t)})`}>
                ?
              </text>
            </ThoughtCloud>
          </Layer>
          {sightOn ? (
            <AbsoluteFill>
              <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
                <line x1={dome.x} y1={dome.y} x2={dome.x + (obj.x - dome.x) * sight} y2={dome.y + (obj.y - dome.y) * sight}
                  stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={6 * sx} strokeDasharray={`${18 * sx} ${14 * sx}`} strokeLinecap="round" />
              </svg>
              <FlashRing t={t} t0={T.spotted} x={dome.x} y={dome.y} r={170 * sx} ink={8 * sx} />
              <DetectBox t={t} t0={T.spotted + 0.22} t1={SHOT.ruler} x={obj.x} y={obj.y} r={OBJ.R * obj.k * 1.35} ink={7 * sx} />
            </AbsoluteFill>
          ) : null}
        </>
      )}
      <Captions t={t} words={WORDS} y={capY} />
      <Mixer cues={CUES} />
    </AbsoluteFill>
  );
};
