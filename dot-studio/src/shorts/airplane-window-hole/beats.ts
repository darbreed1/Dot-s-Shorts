// Beat times (s) for airplane-window-hole. Voice at VO_AT (long pauses capped at 0.7 s by images/lib/tighten.py);
// word times = whisper + VO_AT, snapped to loudness pauses (images/lib/captions.py).
import type {Swap} from '../../kit/Dot';
import type {Cam, Move} from '../../kit/camera';

export const FPS = 60;
export const VO_AT = 0.1;

export const T = {
  // 1 Why is there a tiny hole in airplane windows?
  why: 0.48,
  tiny: 1.52,
  hole: 1.96,
  windows: 3.3,
  // 2 It's on purpose.
  its: 4.8,
  purpose: 5.12,
  // 3 Each window has three panes, and the hole is in the middle one.
  each: 6.52,
  three: 7.46,
  panes: 7.86,
  hole2: 9.18,
  middle: 10.04,
  // 4 Up high, cabin air pushes hard against the thin air outside.
  up: 11.22,
  cabin: 12.16,
  pushes: 12.86,
  hard: 13.32,
  thin: 14.42,
  outside: 15.0,
  // 5 The hole lets that pressure reach the outer pane, so it carries the load alone,
  hole3: 16.56,
  pressure: 17.42,
  reach: 17.8,
  outer: 18.38,
  carries: 19.8,
  load: 20.42,
  alone: 20.66,
  // 6 and the middle pane stays ready as a backup.
  middle2: 21.98,
  stays: 22.66,
  ready: 23.1,
  backup: 24.02,
  // 7 The hole also lets moisture out, so your window doesn't fog up.
  hole4: 25.42,
  moisture: 26.46,
  out: 26.96,
  window: 28.28,
  doesnt: 28.68,
  fog: 29.08,
  up2: 29.64,
  end: 30.8,
} as const;

export const SHOT = {
  panes: 6.35, // exploded view of the three panes
  high: 11.1, // the plane up high
  cross: 12.05, // cross-section: cabin air, the panes, outside
  fog: 25.25, // back at the window
  back: [29.95, 30.6] as const, // ease back to the opening framing
} as const;

export const inPanes = (t: number) => t >= SHOT.panes && t < SHOT.high;
export const inHigh = (t: number) => t >= SHOT.high && t < SHOT.cross;
export const inCross = (t: number) => t >= SHOT.cross && t < SHOT.fog;

export const DOT_SWAPS: Swap[] = [
  {at: 0, pose: 'dot_magnify'},
  {at: T.its - 0.05, pose: 'dot_aha', style: 'squash'},
  {at: SHOT.fog, pose: 'dot_lookup', style: 'cut'},
  {at: T.doesnt, pose: 'dot_aha', style: 'squash'},
  {at: 30.35, pose: 'dot_magnify', style: 'turn'},
];

export const WIDE: Cam = {x: 600, y: 1180, z: 220};
const HOLE: Cam = {x: 720, y: 1180, z: 520};
const MED: Cam = {x: 600, y: 1170, z: 260};
const FOG: Cam = {x: 640, y: 1140, z: 330};

export const CAMERA: Move[] = [
  {t0: 0, t1: T.tiny - 0.1, a: WIDE, b: {...WIDE, z: 250}},
  {t0: T.tiny - 0.1, t1: T.hole + 0.35, a: {...WIDE, z: 250}, b: HOLE},
  {t0: T.hole + 0.35, t1: 4.55, a: HOLE, b: {...HOLE, z: 545}},
  {t0: 4.55, t1: 5.35, a: {...HOLE, z: 545}, b: MED},
  {t0: SHOT.fog, t1: SHOT.back[0], a: FOG, b: {...FOG, z: 360}},
  {t0: SHOT.back[0], t1: SHOT.back[1], a: {...FOG, z: 360}, b: WIDE},
];
