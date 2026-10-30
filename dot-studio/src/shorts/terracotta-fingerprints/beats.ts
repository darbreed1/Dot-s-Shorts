// Beat times (s) for terracotta-fingerprints. Voice at VO_AT (the take's 8 s silent gap after "fifteen" was cut
// by images/lib/tighten.py); word times = whisper + VO_AT, snapped to loudness pauses (images/lib/captions.py).
import type {Swap} from '../../kit/Dot';
import type {Cam, Move} from '../../kit/camera';

export const FPS = 60;
export const VO_AT = 0.1;

export const T = {
  // 1 Who built China's Terracotta Army?
  who: 0.38,
  army: 2.0,
  // 2 Not just men.
  not: 3.24,
  men: 3.72,
  // 3 The clay soldiers are about twenty-two hundred years old, and their makers left fingerprints in the clay.
  the: 4.48,
  soldiers: 4.78,
  twentyTwo: 5.64,
  years: 6.4,
  old: 6.92,
  makers: 7.98,
  left: 8.3,
  fingerprints: 8.58,
  clay: 9.48,
  // 4 Smaller hands, like women's and children's, have tighter-packed ridges.
  smaller: 10.36,
  hands: 10.82,
  women: 11.66,
  children: 12.28,
  tighter: 13.1,
  ridges: 13.7,
  // 5 Researchers measured seventy-nine prints from one pit.
  researchers: 14.96,
  seventyNine: 15.88,
  prints: 16.58,
  one: 17.28,
  // 6 About a third came from women, and a fifth from children under fifteen.
  about: 18.06,
  third: 18.4,
  women2: 19.08,
  fifth: 19.9,
  children2: 20.38,
  fifteen: 21.08,
  // 7 It's a small sample, but this army had more helpers than we thought.
  its: 22.36,
  small: 22.62,
  but: 23.64,
  more: 24.4,
  helpers: 24.6,
  thought: 25.38,
  end: 26.45,
} as const;

export const SHOT = {
  iris: [6.55, 7.35] as const, // time travel: the workshop opens out of Dot's watch
  ridges: 10.05, // fingertip comparison
  count: 14.6, // the 79 prints
  back: 21.85, // back in the pit today
} as const;

export const inWorkshop = (t: number) => t >= SHOT.iris[0] && t < SHOT.ridges;
export const inRidges = (t: number) => t >= SHOT.ridges && t < SHOT.count;
export const inCount = (t: number) => t >= SHOT.count && t < SHOT.back;

export const DOT_SWAPS: Swap[] = [
  {at: 0, pose: 'dot_lookup'},
  {at: T.not, pose: 'dot_aha', style: 'squash'},
  {at: 4.62, pose: 'dot_watch', style: 'turn'},
  {at: SHOT.back, pose: 'dot_shrug', style: 'cut'},
  {at: T.more - 0.05, pose: 'dot_aha', style: 'squash'},
  {at: 25.95, pose: 'dot_lookup', style: 'turn'},
];

// helpers pop in beside Dot on "more helpers" and pop away before the loop
export const HELPERS = {in: [T.more - 0.1, T.more + 0.05, T.more + 0.2] as const, out: 25.75};

export const WIDE: Cam = {x: 540, y: 960, z: 0};
const WATCH: Cam = {x: 420, y: 1300, z: 380};

export const CAMERA: Move[] = [
  {t0: 0, t1: 4.6, a: WIDE, b: {...WIDE, z: 50}},
  {t0: 4.6, t1: SHOT.iris[0] + 0.3, a: {...WIDE, z: 50}, b: WATCH},
  {t0: SHOT.back, t1: 23.4, a: {x: 520, y: 1020, z: 160}, b: {x: 540, y: 980, z: 110}},
  {t0: 23.4, t1: 25.9, a: {x: 540, y: 980, z: 110}, b: WIDE},
];
