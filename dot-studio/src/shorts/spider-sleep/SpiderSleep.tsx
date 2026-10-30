import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, easeInOutCubic, easeOutCubic, kick, kicks, progress, rand, wobble} from '../../kit/anim';
import {Layer, camAt} from '../../kit/camera';
import {Dot, DotSprite} from '../../kit/Dot';
import {Mixer} from '../../kit/audio';
import {NightSky} from '../../kit/effects/NightSky';
import {Zzz} from '../../kit/effects/Zzz';
import {ThoughtCloud} from '../../kit/effects/ThoughtCloud';
import {Glow, MotionTicks, SweatDrop} from '../../kit/effects/small';
import {crescentPath, starPath} from '../../kit/effects/shapes';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {ringRock, watchTaps} from '../../kit/moves';
import {CAMERA, CUT, DOT_SWAPS, FPS, SPIDER, T} from './beats';
import {CUES} from './cues';
import {S} from './sprites';

// World layout (world px; a layer at Z 1000 is 1:1 at the wide camera).
const Z = {far: 3000, mid: 1800, spider: 1400, near: 1000};
const DOT_FEET = {x: 300, y: 1700};
const HEAD_R = 100;
const SP_S = 0.416; // spider sprite px -> world
const GRIP = {x: 764, y: 200}; // where the spider's leg tips hold the web (world, spider layer)
const WEB_S = 1.333;
const WEB_POS = {x: GRIP.x - S.web.hang[0] * WEB_S, y: GRIP.y + 14 - S.web.hang[1] * WEB_S};
const TRIPOD = {x: 820, y: 1700, s: 0.27};

const dots = S as unknown as Record<string, DotSprite>;
const INK = '#15151C';

// ---------------------------------------------------------------------------------------------------- ground
const hillPath = (y0: number, a1: number, a2: number, x0 = -1600, x1 = 2700) => {
  let d = `M${x0},${y0 + 1600} L${x0},${y0}`;
  for (let x = x0; x <= x1; x += 50) d += ` L${x},${(y0 + a1 * Math.sin(x / 420) + a2 * Math.sin(x / 170 + 1)).toFixed(1)}`;
  return d + ` L${x1},${y0 + 1600} Z`;
};
// flat bands: boxes kept just big enough for every framing in this Short (huge layers are slow to composite)
const Band: React.FC<{d: string; fill: string; top: number; outline?: number}> = ({d, fill, top, outline = 0}) => (
  <WorldSvg box={[-1600, top - 120, 2700, top + 1700]}>
    <path d={d} fill={fill} stroke={outline ? INK : 'none'} strokeWidth={outline} strokeLinejoin="round" />
  </WorldSvg>
);

// ---------------------------------------------------------------------------------------------------- spider
const spiderIsRem = (t: number) =>
  t >= SPIDER.remFrom && t < SPIDER.remTo && !SPIDER.flicks.some((f) => t >= f && t < f + 0.085);

/** Retinas darting inside the big eyes: conjugate saccades every ~0.2 s, quick 0.06 s jumps. */
const gaze = (t: number) => {
  const step = 0.21;
  const i = Math.floor((t - SPIDER.eyesFrom) / step);
  const target = (n: number) => (n < 0 ? {x: 0, y: 0} : {x: (rand(n * 2 + 5) * 2 - 1) * 0.3, y: (rand(n * 2 + 6) * 2 - 1) * 0.22});
  const a = target(i - 1);
  const b = target(i);
  const u = easeOutCubic(clamp01((t - SPIDER.eyesFrom - i * step) / 0.06));
  return {x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u};
};

const SpiderEyes: React.FC<{t: number; blur: boolean}> = ({t, blur}) => {
  if (t < SPIDER.eyesFrom || t >= SPIDER.remTo) return null;
  const g = gaze(t);
  const [x0, x1] = [S.spider_droop.eyes[0][0] - 120, S.spider_droop.eyes[3][0] + 120];
  const y0 = S.spider_droop.eyes[1][1] - 140;
  return (
    <WorldSvg box={[x0, y0, x1, y0 + 280]}>
      <defs>
        <filter id="eyeDof" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={S.spider_droop.blurSigma} />
        </filter>
      </defs>
      {S.spider_droop.eyes.map(([x, y, r], i) => (
        <g key={i} filter={blur ? 'url(#eyeDof)' : undefined}>
          <circle cx={x} cy={y} r={r * 0.97} fill="#4B4256" />
          <circle cx={x + g.x * r} cy={y + g.y * r} r={r * 0.6} fill="#0B0B10" />
          <circle cx={x + g.x * r - r * 0.24} cy={y + g.y * r - r * 0.26} r={r * 0.16} fill="#FFFFFF" />
        </g>
      ))}
    </WorldSvg>
  );
};

const Spider: React.FC<{t: number; blur: boolean}> = ({t, blur}) => {
  const rem = spiderIsRem(t);
  // sleepy sway about the grip, breathing, the "drooped" sag, REM jolts
  let rot = 1.2 * Math.sin(2 * Math.PI * 0.22 * t);
  let sy = 1 + 0.012 * Math.sin(2 * Math.PI * 0.5 * t);
  let sx = 1;
  if (t >= T.drooped && t < SPIDER.remFrom) {
    sy += 0.06 * easeOutCubic(progress(t, T.drooped, T.drooped + 0.55)) + wobble(t, T.drooped + 0.55, 0.015, 2.5, 5);
    rot += 2.5 * easeOutCubic(progress(t, T.drooped, T.drooped + 0.55));
  }
  rot += kicks(t, SPIDER.jolts, 3.2, 5, 9);
  const pop = kick(t, SPIDER.remFrom, 0.045, 4, 7);
  sy += pop;
  sx += pop * 0.6;
  const g = S.spider_droop.grip;
  const m = S.spider_rem.toDroop;
  return (
    <div style={{position: 'absolute', left: GRIP.x, top: GRIP.y, transformOrigin: '0 0', transform: `rotate(${rot}deg) scale(${sx}, ${sy})`}}>
      <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `scale(${SP_S}) translate(${-g[0]}px, ${-g[1]}px)`}}>
        {rem ? (
          <Img
            src={staticFile(blur ? S.spider_rem.blur : S.spider_rem.src)}
            style={{position: 'absolute', left: 0, top: 0, width: S.spider_rem.w, height: S.spider_rem.h, transformOrigin: '0 0',
              transform: `matrix(${m[0]}, ${m[1]}, ${m[2]}, ${m[3]}, ${m[4]}, ${m[5]})`}}
          />
        ) : (
          <Img src={staticFile(blur ? S.spider_droop.blur : S.spider_droop.src)} style={{position: 'absolute', left: 0, top: 0, width: S.spider_droop.w, height: S.spider_droop.h}} />
        )}
        <SpiderEyes t={t} blur={blur} />
      </div>
    </div>
  );
};

// sprite px of the spider -> world (ignores the small sway; fine for effects placement)
const spW = (x: number, y: number) => ({x: GRIP.x + (x - S.spider_droop.grip[0]) * SP_S, y: GRIP.y + (y - S.spider_droop.grip[1]) * SP_S});

// ---------------------------------------------------------------------------------------------------- scene
export const SpiderSleep: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const cam = camAt(CAMERA, t);
  const onDot = (t >= CUT.toDot1 && t < CUT.toSpider) || (t >= CUT.toDot2 && t < CUT.toTwo);
  // depth of field only where it reads: the spider behind Dot in his close-ups, using pre-blurred pictures
  // (prep.py) - a live CSS blur costs seconds per frame in the software renderer
  const dof = onDot;
  const wheel = 360 * easeInOutCubic(progress(t, 6.1, 8.3));

  const body = spW(S.spider_droop.body[0], S.spider_droop.body[1]);
  const face = spW(S.spider_droop.body[0], 1500);
  const zzzAt = spW(960, 1380);

  // REC light: blinks once a second while filming
  const recOn = t >= T.filmed && t < SPIDER.remTo && (t - T.filmed) % 1 < 0.55;
  const light = S.camera.light;

  return (
    <AbsoluteFill style={{backgroundColor: '#141B45'}}>
      <NightSky t={t} wheelDeg={wheel} />

      <Layer cam={cam} z={Z.far}>
        <Band d={hillPath(1830, 55, 30)} fill="#22483F" top={1740} outline={14} />
      </Layer>
      <Layer cam={cam} z={Z.mid}>
        <Band d={hillPath(1716, 35, 18)} fill="#2C5A45" top={1660} />
      </Layer>

      <Layer cam={cam} z={Z.spider}>
        <Img src={staticFile(dof ? S.web.blur : S.web.src)} style={{position: 'absolute', left: WEB_POS.x, top: WEB_POS.y, width: S.web.w * WEB_S, height: S.web.h * WEB_S}} />
        <Spider t={t} blur={dof} />
        {/* pre-rolled so frame 0 already has Zs in the air, like the last frame (loop); the last ones are gone
            before the cut to Dot so nothing sharp floats over the out-of-focus spider */}
        <Zzz t={t} x={zzzAt.x} y={zzzAt.y} t0={-1.7} t1={9.95} size={58} dir={0.45} />
        <Zzz t={t} x={zzzAt.x} y={zzzAt.y} t0={27.35} t1={40} size={58} dir={0.45} />
        <MotionTicks t={t} times={SPIDER.jolts} x={body.x} y={body.y + 40} r={265} len={42} ink={8} angles={[-175, -155, 155, -25, -5, 25]} />
        <ThoughtCloud t={t} t0={T.dream - 0.12} t1={28.5} x={380} y={300} w={300} h={220} from={{x: face.x - 120, y: face.y - 60}} ink={7}>
          <text x={0} y={34} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight={900} fontSize={128}
            fill="#2B3A8C" stroke={INK} strokeWidth={8} paintOrder="stroke" strokeLinejoin="round"
            transform={`rotate(${6 * Math.sin(2 * Math.PI * 1.3 * t)})`}>
            ?
          </text>
        </ThoughtCloud>
      </Layer>

      <Layer cam={cam} z={Z.near}>
        <Band d={`M-1600,3400 L-1600,1560 L2700,1560 L2700,3400 Z`} fill="#376B48" top={1560} />
        {/* tripod camera + REC light */}
        <div style={{position: 'absolute', left: TRIPOD.x - S.camera.feet[0] * TRIPOD.s - 70, top: TRIPOD.y - 12, width: 290, height: 30,
          borderRadius: '50%', background: 'rgba(20, 30, 20, 0.35)', filter: 'blur(3px)'}} />
        <Img src={staticFile(S.camera.src)} style={{position: 'absolute', left: TRIPOD.x - S.camera.feet[0] * TRIPOD.s,
          top: TRIPOD.y - S.camera.feet[1] * TRIPOD.s, width: S.camera.w * TRIPOD.s, height: S.camera.h * TRIPOD.s}} />
        {recOn ? (
          <Glow t={t} t0={T.filmed} t1={SPIDER.remTo} color="255, 70, 60" strength={0.8}
            x={TRIPOD.x + (light[0] - S.camera.feet[0]) * TRIPOD.s} y={TRIPOD.y + (light[1] - S.camera.feet[1]) * TRIPOD.s} r={light[2] * TRIPOD.s * 3.2} />
        ) : null}

        <Dot
          t={t}
          sprites={dots}
          swaps={DOT_SWAPS}
          feet={DOT_FEET}
          headR={HEAD_R}
          bounces={[T.likeWe + 0.05, ...watchTaps(6.0)]}
          rock={ringRock(t, SPIDER.bell[0], SPIDER.bell[1], 2.8, 8)}
          overlay={({sprite, s, pt}) => {
            const b = sprite.ball;
            const h = sprite.head;
            return (
              <>
                {b && sprite.src.endsWith('dot_aha.png') ? (
                  <Glow t={t} t0={T.rem - 0.05} t1={CUT.toTwo} x={pt(b[0], b[1]).x} y={pt(b[0], b[1]).y} r={b[2] * s * 4.2} color="255, 90, 70" strength={0.75} />
                ) : null}
                {sprite.src.endsWith('dot_droop.png') ? (
                  <SweatDrop t={t} t0={25.3} t1={26.7} x={pt(h[0] + h[2] * 0.78, h[1] - h[2] * 0.35).x} y={pt(h[0] + h[2] * 0.78, h[1] - h[2] * 0.35).y} r={15} slide={34} />
                ) : null}
              </>
            );
          }}
        />
        {/* Dot's own dream cloud: "REM sleep, when most vivid dreams happen" */}
        <ThoughtCloud t={t} t0={T.vivid - 0.1} t1={CUT.toTwo - 0.12} x={255} y={905} w={280} h={200} from={{x: 320, y: 1065}} ink={6}>
          <path d={crescentPath(-50, -5, 46)} fill="#FFE07A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          {[
            [40, -40, 22, 0],
            [85, 20, 16, 1],
            [20, 45, 13, 2],
          ].map(([x, y, r, i]) => (
            <path key={i} d={starPath(x, y, r * (1 + 0.15 * Math.sin(2 * Math.PI * 1.6 * t + i * 2)))} fill="#F2C14E" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          ))}
        </ThoughtCloud>
      </Layer>

      <Mixer cues={CUES} />
    </AbsoluteFill>
  );
};
