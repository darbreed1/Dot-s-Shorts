// Beat times (s) for dwarf-planet-ed138. Voice at VO_AT; word times = whisper + VO_AT, first word after each
// loudness pause snapped to where speech resumes (images/lib/captions.py).
import type {Swap} from '../../kit/Dot';
import type {Cam, Move} from '../../kit/camera';

export const FPS = 60;
export const VO_AT = 0.1;

export const T = {
  // 1 Is there a new dwarf planet past Pluto?
  is: 0.32,
  new: 0.78,
  pluto: 2.22,
  // 2 Maybe.
  maybe: 3.36,
  // 3 Chile's new Rubin Observatory spotted an object forty-six times farther from the Sun than Earth.
  chiles: 4.68,
  observatory: 5.68,
  spotted: 6.24,
  object: 7.02,
  fortySix: 7.4,
  times: 7.9,
  farther: 8.54,
  sun: 9.36,
  earth: 9.88,
  // 4 It might be up to fifteen hundred kilometres wide.
  might: 11.34,
  fifteen: 12.12,
  km: 12.94,
  wide: 13.36,
  // 5 Why did nobody see it before?
  why: 14.96,
  nobody: 15.28,
  before: 15.98,
  // 6 It sits in the southern sky, in front of the crowded Milky Way, where one slow dot gets lost.
  sits: 16.88,
  southern: 17.46,
  crowded: 19.06,
  milky: 19.36,
  one: 20.98,
  slow: 21.28,
  dot: 21.64,
  lost: 22.26,
  // 7 To be a dwarf planet, it must be round.
  to: 23.88,
  must: 25.32,
  round: 25.78,
  // 8 That still needs checking.
  that: 26.72,
  needs: 27.16,
  checking: 27.38,
  end: 28.75,
} as const;

// shots: cuts sit inside loudness pauses, except the ruler, which lands on "forty-six"
export const SHOT = {
  glide: [4.45, 5.65] as const, // wide -> observatory
  ruler: 7.36,
  size: 10.6,
  dot: 14.45,
  sky: 16.62,
  round: 23.3,
  outro: 26.45,
  back: [27.75, 28.5] as const, // ease back to the wide shot
} as const;

export const inRuler = (t: number) => t >= SHOT.ruler && t < SHOT.size;
export const inSize = (t: number) => t >= SHOT.size && t < SHOT.dot;
export const inSky = (t: number) => t >= SHOT.sky && t < SHOT.round;
export const inRound = (t: number) => t >= SHOT.round && t < SHOT.outro;

export const DOT_SWAPS: Swap[] = [
  {at: 0, pose: 'dot_lookup'},
  {at: T.maybe, pose: 'dot_shrug', style: 'squash'},
  {at: SHOT.dot, pose: 'dot_scratch', style: 'cut'},
  {at: SHOT.outro, pose: 'dot_watch', style: 'cut'},
  {at: 28.2, pose: 'dot_lookup', style: 'turn'},
];

export const WIDE: Cam = {x: 540, y: 960, z: 0};
const OBS: Cam = {x: 960, y: 930, z: 930};
const DOTC: Cam = {x: 390, y: 1400, z: 410};

export const CAMERA: Move[] = [
  {t0: 0, t1: SHOT.glide[0], a: WIDE, b: {...WIDE, z: 45}},
  {t0: SHOT.glide[0], t1: SHOT.glide[1], a: {...WIDE, z: 45}, b: OBS},
  {t0: SHOT.glide[1], t1: SHOT.ruler, a: OBS, b: {...OBS, z: 990}},
  {t0: SHOT.dot, t1: SHOT.sky, a: DOTC, b: {...DOTC, z: 440}},
  {t0: SHOT.outro, t1: SHOT.back[0], a: DOTC, b: {...DOTC, z: 435}},
  {t0: SHOT.back[0], t1: SHOT.back[1], a: {...DOTC, z: 435}, b: WIDE},
];
