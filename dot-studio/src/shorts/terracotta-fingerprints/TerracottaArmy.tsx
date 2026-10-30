import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInCubic, kick, popScale, progress} from '../../kit/anim';
import {Layer, camAt, toScreen} from '../../kit/camera';
import {Dot, DotSprite} from '../../kit/Dot';
import {Mixer} from '../../kit/audio';
import {Captions} from '../../kit/Captions';
import {Label} from '../../kit/Label';
import {Fingerprint} from '../../kit/effects/Fingerprint';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {watchTaps} from '../../kit/moves';
import {CAMERA, DOT_SWAPS, FPS, HELPERS, SHOT, T, inCount, inRidges, inWorkshop} from './beats';
import {CUES} from './cues';
import {WORDS} from './captions';
import {Count, Ridges, Workshop} from './Inserts';
import {S} from './sprites';

// World layout (world px; a layer at Z 1000 is 1:1 at the wide camera). Inside Pit 1 today: Dot on the trench
// floor at the left, a big clay warrior beside him, rows of warriors in their trenches behind, earth walls between.
const Z = {wall: 3200, row3: 2600, row2: 2000, row1: 1500, near: 1000};
const INK = '#15151C';
const EARTH = '#B88559';
const FLOOR = '#CFA273';
const DOT_FEET = {x: 300, y: 1700};
const HEAD_R = 100;
const WARRIOR_H = 760;
const BIG_WARRIOR = {x: 790, y: 1705};
const ROWS = [
  {z: Z.row3, feet: 1454, x0: -900, n: 13, blur: true},
  {z: Z.row2, feet: 1560, x0: -720, n: 10, blur: true},
  {z: Z.row1, feet: 1622, x0: -480, n: 8, blur: false},
] as const;
const SPACING = 240;
// where the watch sits on the watch pose (sprite px, measured off public/dot/dot_watch.png)
const WATCH_PX = [358, 1176];

const dots = S as unknown as Record<string, DotSprite>;

const Warrior: React.FC<{x: number; y: number; h: number; blur?: boolean; sway?: number}> = ({x, y, h, blur, sway = 0}) => {
  const sp = S.warrior;
  const s = h / sp.h;
  return (
    <div style={{position: 'absolute', left: x, top: y, transformOrigin: '0 0', transform: `rotate(${sway}deg)`}}>
      <Img src={staticFile(blur ? sp.blur : sp.src)} style={{position: 'absolute', left: -sp.feet[0] * s, top: -sp.feet[1] * s, width: sp.w * s, height: sp.h * s}} />
    </div>
  );
};

/** A trench row: floor strip, a line of warriors, then the earth partition in front of their feet. */
const Row: React.FC<{feet: number; x0: number; n: number; blur: boolean}> = ({feet, x0, n, blur}) => (
  <>
    <WorldSvg box={[x0 - 400, feet - 120, x0 + n * SPACING + 400, feet + 40]}>
      <rect x={x0 - 400} y={feet - 110} width={n * SPACING + 800} height={150} fill={FLOOR} />
    </WorldSvg>
    {Array.from({length: n}, (_, i) => (
      <Warrior key={i} x={x0 + i * SPACING} y={feet} h={WARRIOR_H} blur={blur} />
    ))}
    <WorldSvg box={[x0 - 400, feet - 60, x0 + n * SPACING + 400, feet + 1400]}>
      <path d={`M${x0 - 400},${feet + 1400} L${x0 - 400},${feet - 28} ${Array.from({length: 30}, (_, i) => `L${x0 - 400 + i * ((n * SPACING + 800) / 29)},${feet - 28 + 8 * Math.sin(i * 1.9)}`).join(' ')} L${x0 + n * SPACING + 400},${feet + 1400} Z`}
        fill={EARTH} stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    </WorldSvg>
  </>
);

const Pit: React.FC<{t: number; cam: ReturnType<typeof camAt>}> = ({t, cam}) => {
  const helperPop = (i: number) => popScale(t, HELPERS.in[i], HELPERS.out + i * 0.06, 0.3, 0.2);
  // the big warrior sways ever so slightly when the helpers arrive (they bump it)
  const sway = kick(t, T.more, 1.2, 3, 5);
  return (
    <>
      {/* hangar roof over the pit */}
      <AbsoluteFill style={{background: 'linear-gradient(#2E2622, #5B463A)'}} />
      <Layer cam={cam} z={Z.wall}>
        <WorldSvg box={[-2600, -1600, 3700, 1700]}>
          <rect x={-2600} y={-900} width={6300} height={2600} fill="#A87650" stroke={INK} strokeWidth={14} />
          {[-500, -150, 200, 560, 900, 1200].map((y, i) => (
            <path key={y} d={`M-2600,${y} ${Array.from({length: 40}, (_, k) => `L${-2600 + k * 162},${y + 20 * Math.sin(k * 0.9 + i)}`).join(' ')}`}
              fill="none" stroke="#946240" strokeWidth={12} />
          ))}
          {/* roof trusses */}
          {Array.from({length: 9}, (_, i) => (
            <line key={i} x1={-2600 + i * 800} y1={-1600} x2={-2200 + i * 800} y2={-900} stroke="#2A221E" strokeWidth={40} />
          ))}
        </WorldSvg>
      </Layer>
      {ROWS.map((r) => (
        <Layer key={r.z} cam={cam} z={r.z}>
          <Row feet={r.feet} x0={r.x0} n={r.n} blur={r.blur} />
        </Layer>
      ))}
      <Layer cam={cam} z={Z.near}>
        <WorldSvg box={[-900, 1540, 2100, 2800]}>
          <rect x={-900} y={1560} width={3000} height={1240} fill={FLOOR} />
          {[[120, 1820, 26], [640, 1880, 20], [1000, 1790, 30], [-200, 1900, 24]].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx={r * 1.6} ry={r * 0.6} fill="#B8895A" />
          ))}
        </WorldSvg>
        {/* contact shadow + the big warrior */}
        <div style={{position: 'absolute', left: BIG_WARRIOR.x - 150, top: BIG_WARRIOR.y - 16, width: 300, height: 32, borderRadius: '50%', background: 'rgba(72, 54, 42, 0.26)', filter: 'blur(3px)'}} />
        <Warrior x={BIG_WARRIOR.x} y={BIG_WARRIOR.y} h={WARRIOR_H} sway={sway} />
        {/* a fingerprint on the big warrior's robe, found with the magnifier... it glints on "fingerprints" */}
        <Fingerprint x={BIG_WARRIOR.x - 36} y={BIG_WARRIOR.y - 300} rx={13} ry={17} ridges={6} color="#6E3418" reveal={1} rot={-15} seed={3} />
        <Dot
          t={t}
          sprites={dots}
          swaps={DOT_SWAPS}
          feet={DOT_FEET}
          headR={HEAD_R}
          bounces={[T.men, ...watchTaps(5.6, 2, 0.3), T.small]}
        />
        {[
          {sp: S.worker_woman, x: 95, y: 1735, h: 540, flip: false},
          {sp: S.worker_man, x: 555, y: 1720, h: 560, flip: false},
          {sp: S.worker_child, x: 985, y: 1740, h: 400, flip: true},
        ].map((w, i) => {
          const p = helperPop(i);
          if (p <= 0) return null;
          const s = w.h / w.sp.h;
          const hop = -30 * Math.max(0, Math.sin(Math.PI * Math.min(1, (t - HELPERS.in[i]) / 0.35)));
          return (
            <div key={i} style={{position: 'absolute', left: w.x, top: w.y + hop, transformOrigin: '0 0', transform: `scale(${p * (w.flip ? -1 : 1)}, ${p})`}}>
              <Img src={staticFile(w.sp.src)} style={{position: 'absolute', left: -w.sp.feet[0] * s, top: -w.sp.feet[1] * s, width: w.sp.w * s, height: w.sp.h * s}} />
            </div>
          );
        })}
        <Label t={t} t0={T.years - 0.1} t1={SHOT.iris[0] + 0.25} x={DOT_FEET.x + 200} y={1420} size={64} color="#F2C14E">
          −2,200 years
        </Label>
      </Layer>
    </>
  );
};

export const TerracottaArmy: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const {width, height} = useVideoConfig();
  const cam = camAt(CAMERA, t);
  // time travel: the workshop opens as a circle out of Dot's watch
  const sw = S.dot_watch;
  const ws = HEAD_R / sw.head[2];
  const watch = toScreen(cam, Z.near, DOT_FEET.x + (WATCH_PX[0] - sw.feet[0]) * ws, DOT_FEET.y + (WATCH_PX[1] - sw.feet[1]) * ws, width, height);
  const irisR = Math.hypot(width, height) * 1.05 * easeInCubic(progress(t, SHOT.iris[0], SHOT.iris[1]));
  const irising = t >= SHOT.iris[0] && t < SHOT.iris[1];
  const insert = inRidges(t) ? <Ridges t={t} /> : inCount(t) ? <Count t={t} /> : null;
  const capY = inWorkshop(t) || inRidges(t) ? 0.66 : inCount(t) ? 0.64 : t >= 4.6 && t < SHOT.back ? 0.72 : 0.47;
  return (
    <AbsoluteFill style={{backgroundColor: '#2E2622'}}>
      {insert ?? (
        <>
          {!inWorkshop(t) || irising ? <Pit t={t} cam={cam} /> : null}
          {inWorkshop(t) ? (
            <AbsoluteFill style={{clipPath: irising ? `circle(${irisR}px at ${watch.x}px ${watch.y}px)` : undefined}}>
              <Workshop t={t} />
            </AbsoluteFill>
          ) : null}
          {irising ? (
            <AbsoluteFill>
              <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
                <circle cx={watch.x} cy={watch.y} r={irisR} fill="none" stroke={INK} strokeWidth={22 * (width / 1080)} />
                <circle cx={watch.x} cy={watch.y} r={irisR} fill="none" stroke="#F2C14E" strokeWidth={11 * (width / 1080)} strokeDasharray={`${30 * (width / 1080)} ${18 * (width / 1080)}`}
                  transform={`rotate(${-200 * t} ${watch.x} ${watch.y})`} />
              </svg>
            </AbsoluteFill>
          ) : null}
        </>
      )}
      <Captions t={t} words={WORDS} y={capY} />
      <Mixer cues={CUES} />
    </AbsoluteFill>
  );
};
