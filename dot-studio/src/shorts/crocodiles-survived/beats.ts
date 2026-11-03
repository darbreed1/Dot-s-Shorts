// Beat times (s) for crocodiles-survived. Voice at VO_AT; pauses capped at 0.5 s by images/lib/tighten.py; word
// times = whisper + VO_AT, snapped to loudness pauses (images/lib/captions.py).
import type {Swap} from '../../kit/Dot';

export const FPS = 60;
export const VO_AT = 0.1;

export const T = {
  // 1 Why did crocodiles survive the asteroid that wiped out the dinosaurs?
  why: 0.54,
  asteroid: 2.14,
  wiped: 2.9,
  dinosaurs: 3.48,
  // 2 A new study from University College London looked at over 7,000 fossils.
  study: 5.46,
  university: 6.1,
  looked: 7.46,
  k7000: 8.58,
  fossils: 9.68,
  // 3 For 250 million years, crocodile relatives mostly stuck to warm places.
  m250: 10.98,
  crocodile: 13.46,
  mostly: 14.54,
  warm: 15.94,
  // 4 After the impact, the tropics stayed warm enough for them, while dinosaurs lost far more of the climate they needed.
  after: 17.38,
  impact: 17.84,
  tropics: 18.78,
  stayed: 19.24,
  dinosaurs2: 21.32,
  lost: 21.92,
  far: 22.52,
  climate: 23.58,
  // 5 Being cold-blooded, small, and at home in water probably helped too.
  cold: 25.28,
  small: 26.44,
  home: 27.6,
  water: 28.1,
  helped: 28.88,
  too: 29.78,
  end: 30.9,
} as const;

export const SHOT = {
  fossils: 4.55, // the fossil count
  globe: 10.6, // the climate globe, before and after the impact
  river2: 24.75, // back at the river: what else helped
} as const;

export const inRiver = (t: number) => t < SHOT.fossils || t >= SHOT.river2;
export const inFossils = (t: number) => t >= SHOT.fossils && t < SHOT.globe;

export const DOT_SWAPS: Swap[] = [
  {at: 0, pose: 'dot_lookup'},
  {at: T.asteroid, pose: 'dot_scared', style: 'squash'},
  {at: SHOT.fossils, pose: 'dot_magnify', style: 'cut'},
  {at: SHOT.globe, pose: 'dot_watch', style: 'cut'},
  {at: T.crocodile, pose: 'dot_lookup', style: 'squash'},
  {at: T.tropics - 0.05, pose: 'dot_aha', style: 'squash'},
  {at: T.far - 0.05, pose: 'dot_scared', style: 'squash'},
  {at: SHOT.river2, pose: 'dot_lookup', style: 'cut'},
  {at: T.helped - 0.05, pose: 'dot_aha', style: 'squash'},
];
