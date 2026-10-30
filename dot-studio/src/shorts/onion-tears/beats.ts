// Beat times (s) for onion-tears. Voice at VO_AT; word times = whisper + VO_AT, first word after each loudness
// pause snapped to where speech resumes (see images/lib/captions.py).
import type {Swap} from '../../kit/Dot';
import type {Cam, Move} from '../../kit/camera';

export const FPS = 60;
export const VO_AT = 0.1;

export const T = {
  // 1 Why do onions make you cry?
  why: 0.1,
  cry: 1.56,
  // 2 Because they're fighting back.
  because: 3.04,
  fighting: 3.84,
  back: 4.06,
  // 3 An onion stores two ingredients apart.
  an: 5.3,
  two: 6.08,
  ingredients: 6.42,
  apart: 6.92,
  // 4 Cut it, and they mix.
  cut: 8.12,
  and: 8.8,
  mix: 9.08,
  // 5 A special enzyme turns them into an irritating gas that drifts up to your eyes.
  special: 10.28,
  enzyme: 10.62,
  turns: 11.06,
  gas: 12.38,
  drifts: 13.08,
  eyes: 14.06,
  // 6 Nerves there feel the sting, so tears wash it away.
  nerves: 15.48,
  sting: 16.56,
  tears: 17.6,
  away: 18.56,
  // 7 It's probably how onions put off hungry animals.
  its: 19.7,
  putOff: 20.82,
  hungry: 21.22,
  animals: 21.52,
  // 8 Want fewer tears?
  want: 23.1,
  fewer: 23.3,
  // 9 Cornell researchers found that a sharp knife, used slowly, sprays less mist.
  cornell: 24.88,
  sharp: 26.72,
  used: 27.36,
  slowly: 27.64,
  sprays: 28.52,
  less: 28.96,
  mist: 29.72,
  end: 30.9,
} as const;

// shots: cuts sit inside loudness pauses
export const SHOT = {
  pushIn: [4.45, 5.25] as const, // glide into the onion, then cut to the cell
  cell1: 5.25,
  chop: 7.62, // kitchen: the chop
  cell2: 8.56, // cell: mixing + the enzyme
  gas: 12.78, // kitchen: gas drifts to Dot
  closeUp: 15.0, // Dot's stinging eyes (screen-space close-up)
  mouse: 19.2,
  knife: 22.6,
  slow: [24.5, 25.7] as const, // glide to the slow-cut framing
  outro: [29.9, 30.9] as const, // ease back to the wide shot
} as const;

export const inCell = (t: number) => (t >= SHOT.cell1 && t < SHOT.chop) || (t >= SHOT.cell2 && t < SHOT.gas);
export const inCloseUp = (t: number) => t >= SHOT.closeUp && t < SHOT.mouse;

export const DOT_SWAPS: Swap[] = [
  {at: 0, pose: 'dot_cry_knife'},
  {at: SHOT.chop, pose: 'dot_chop', style: 'cut'},
  {at: T.cut, pose: 'dot_slow_cut', style: 'squash'},
  {at: T.eyes, pose: 'dot_cry_knife', style: 'squash'},
  {at: SHOT.knife, pose: 'dot_knife_show', style: 'cut'},
  {at: 24.98, pose: 'dot_slow_cut', style: 'turn'},
];

const WIDE: Cam = {x: 400, y: 1400, z: 167};
const INTO_ONION: Cam = {x: 470, y: 1380, z: 860}; // a little right of the bulb so Dot's knife leaves the frame first
const CHOP: Cam = {x: 360, y: 1420, z: 350};
const GAS: Cam = {x: 380, y: 1390, z: 330};
const MOUSE: Cam = {x: 640, y: 1500, z: 450};
const MED: Cam = {x: 250, y: 1300, z: 380};
const SLOW: Cam = {x: 370, y: 1420, z: 300};

export const CAMERA: Move[] = [
  {t0: 0, t1: SHOT.pushIn[0], a: WIDE, b: {...WIDE, z: 200}, ease: 'inOut'},
  {t0: SHOT.pushIn[0], t1: SHOT.pushIn[1], a: {...WIDE, z: 200}, b: INTO_ONION, ease: 'inOut'},
  {t0: SHOT.chop, t1: SHOT.cell2, a: CHOP, b: {...CHOP, z: 380}},
  {t0: SHOT.gas, t1: SHOT.closeUp, a: GAS, b: {x: 330, y: 1360, z: 420}},
  {t0: SHOT.mouse, t1: SHOT.knife, a: MOUSE, b: {...MOUSE, z: 490}},
  {t0: SHOT.knife, t1: SHOT.slow[0], a: MED, b: {...MED, z: 400}},
  {t0: SHOT.slow[0], t1: SHOT.slow[1], a: {...MED, z: 400}, b: SLOW},
  {t0: SHOT.slow[1], t1: SHOT.outro[0], a: SLOW, b: {...SLOW, z: 330}},
  {t0: SHOT.outro[0], t1: SHOT.outro[1], a: {...SLOW, z: 330}, b: WIDE},
];

// the mouse beat
export const MOUSE_T = {enter: 19.4, arrive: 20.3, puff: 20.5, hit: 20.86, turn: 21.22, gone: 21.95};
