// Beat times (s) for raising-chicago. Voice at VO_AT, recorded as one take (no pauses tightened); word times =
// whisper + VO_AT, snapped to loudness pauses (images/lib/captions.py).
import type {Swap} from '../../kit/Dot';
import type {Cam, Move} from '../../kit/camera';
import {clamp01, easeInOutCubic, easeOutBack, easeOutCubic, lerp, progress} from '../../kit/anim';

export const FPS = 60;
export const VO_AT = 0.1;

export const T = {
  // 1 In the 1860s, Chicago lifted whole buildings with people still inside.
  in: 0.32,
  chicago: 1.7,
  lifted: 2.06,
  buildings: 2.84,
  people: 3.52,
  inside: 4.06,
  // 2 The city sat on a swamp, barely above the lake.
  city: 5.36,
  swamp: 6.2,
  barely: 6.96,
  lake: 7.7,
  // 3 Sewers need a downhill slope. There wasn't one.
  sewers: 8.9,
  downhill: 9.86,
  slope: 10.32,
  wasnt: 11.52,
  one: 11.84,
  // 4 So Chicago raised its streets by several feet, and buildings had to rise to match.
  so: 12.76,
  raised: 13.26,
  streets: 13.98,
  feet: 14.9,
  buildings2: 15.78,
  rise: 16.48,
  match: 16.94,
  // 5 In 1860, 600 men turned 6,000 jackscrews
  in2: 17.94,
  y1860: 18.06,
  men: 19.36,
  turned: 19.66,
  jacks: 19.94,
  // 6 and lifted a row of Lake Street shops in five days.
  lifted2: 21.62,
  row: 22.04,
  lakeSt: 22.46,
  shops: 22.9,
  five: 23.76,
  days: 24.28,
  // 7 The shops stayed open.
  shops2: 26.02,
  stayed: 26.28,
  open: 26.66,
  end: 27.6,
} as const;

export const SHOT = {
  swamp: 5.05, // cross-section: the city on a swamp, the sewer pipe
  street2: 12.5, // back on the street, before the raise
  jacks: 19.15, // under the building: the men at the jackscrews
  row: 21.35, // the row of Lake Street shops over five days
  street3: 25.6, // the shop door: still open
  back: [26.95, 27.5] as const, // ease back to the opening framing
} as const;

export const inSwamp = (t: number) => t >= SHOT.swamp && t < SHOT.street2;
export const inJacks = (t: number) => t >= SHOT.jacks && t < SHOT.row;
export const inRow = (t: number) => t >= SHOT.row && t < SHOT.street3;

// The street world (Z 1000 layer, world px). G1 = the raised street, G0 = the old muddy street (lower = larger y).
export const G1 = 1700;
export const G0 = 1850;

/** Street surface height at time t. */
export const groundAt = (t: number) => {
  if (t < SHOT.street2 || t >= SHOT.street3) return G1;
  return lerp(G0, G1, easeInOutCubic(progress(t, T.raised - 0.1, T.feet + 0.35)));
};

/** Bottom edge of the big building at time t (above the street = on its jackscrews). */
export const buildingBottomAt = (t: number) => {
  if (t < SHOT.street2) return lerp(G1 - 80, G1 - 150, easeInOutCubic(progress(t, T.lifted - 0.05, T.buildings + 0.5)));
  if (t < SHOT.street3) {
    const u = clamp01((t - (T.rise - 0.45)) / 0.95);
    return lerp(G0, G1 - 60, u <= 0 ? 0 : easeOutBack(u, 1.2));
  }
  return lerp(G1 - 40, G1 - 80, easeOutCubic(progress(t, SHOT.street3, T.end - 0.3)));
};

export const DOT_SWAPS: Swap[] = [
  {at: 0, pose: 'dot_lookup'},
  {at: T.people + 0.25, pose: 'dot_surprised', style: 'squash'},
  {at: SHOT.street2, pose: 'dot_lookup', style: 'cut'},
  {at: T.raised, pose: 'dot_surprised', style: 'squash'},
  {at: T.match - 0.05, pose: 'dot_aha', style: 'squash'},
  {at: T.in2, pose: 'dot_watch', style: 'squash'},
  {at: SHOT.street3, pose: 'dot_lookup', style: 'cut'},
  {at: T.stayed - 0.05, pose: 'dot_shrug', style: 'squash'},
  {at: 27.15, pose: 'dot_lookup', style: 'turn'},
];

export const WIDE: Cam = {x: 700, y: 1479, z: -163};
const WINDOWS: Cam = {x: 720, y: 1000, z: -110};
const WIDE2: Cam = {x: 700, y: 1520, z: -200};
const WATCH: Cam = {x: 430, y: 1480, z: 40};
const SHOP: Cam = {x: 640, y: 1500, z: 0};

export const CAMERA: Move[] = [
  {t0: 0, t1: T.people - 0.3, a: WIDE, b: {...WIDE, z: -140}},
  {t0: T.people - 0.3, t1: T.inside + 0.5, a: {...WIDE, z: -140}, b: WINDOWS},
  {t0: SHOT.street2, t1: SHOT.street2, a: WIDE2, b: WIDE2},
  {t0: T.so, t1: T.feet + 0.4, a: WIDE2, b: {...WIDE2, y: 1460}},
  {t0: T.in2 - 0.25, t1: T.y1860 + 0.6, a: {...WIDE2, y: 1460}, b: WATCH},
  {t0: SHOT.street3, t1: SHOT.street3, a: SHOP, b: SHOP},
  {t0: SHOT.street3, t1: SHOT.back[0], a: SHOP, b: {...SHOP, z: 60}},
  {t0: SHOT.back[0], t1: SHOT.back[1], a: {...SHOP, z: 60}, b: WIDE},
];
