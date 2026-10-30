// Beat times (s) for spider-sleep. Voice placed at VO_AT; word times = whisper + VO_AT, checked against loudness pauses.
import type {Swap} from '../../kit/Dot';
import type {Cam, Move} from '../../kit/camera';

export const FPS = 60;
export const VO_AT = 0.1;

export const T = {
  // 1 Spiders don't just sleep.
  spiders: 0.1,
  // 2 They seem to sleep in stages, like we do.
  stages: 2.82,
  likeWe: 3.5,
  // 3 Scientists in Bonn filmed Australian jumping spiders all night.
  scientists: 4.98,
  filmed: 5.9,
  allNight: 7.54,
  // 4 First, they hung upside down under their webs and drooped.
  first: 8.76,
  hung: 9.42,
  drooped: 11.28,
  // 5 Then came a second stage: legs curling, eyes moving, small twitches.
  then: 12.5,
  second: 13.18,
  legs: 14.76,
  eyes: 15.92,
  small: 17.1,
  twitches: 17.32,
  // 6 It looks like our REM sleep, when most vivid dreams happen.
  looks: 18.86,
  rem: 19.5,
  vivid: 20.98,
  dreams: 21.24,
  // 7 Spiders in this stage were the hardest to wake.
  spiders2: 23.06,
  hardest: 24.24,
  wake: 24.78,
  // 8 So do they dream? Nobody can tell yet.
  so: 25.92,
  dream: 26.4,
  nobody: 27.56,
  yet: 28.28,
  end: 29.2,
} as const;

// cuts sit inside loudness pauses
export const CUT = {toDot1: 12.42, toSpider: 14.3, toDot2: 18.42, toTwo: 22.5} as const;

export const DOT_SWAPS: Swap[] = [
  {at: 0, pose: 'dot_lookup'},
  {at: 2.62, pose: 'dot_two', style: 'turn'},
  {at: 4.45, pose: 'dot_lookup', style: 'turn'},
  {at: 5.82, pose: 'dot_watch', style: 'squash'},
  {at: 13.12, pose: 'dot_surprised', style: 'squash'},
  {at: CUT.toDot2, pose: 'dot_aha', style: 'cut'},
  {at: CUT.toTwo, pose: 'dot_bell', style: 'cut'},
  {at: 25.16, pose: 'dot_droop', style: 'squash'},
  {at: 27.48, pose: 'dot_shrug', style: 'squash'},
  {at: 28.86, pose: 'dot_lookup', style: 'turn'},
];

// spider: legs curl on "legs"; back to calm sleep after "So do they dream?"
export const SPIDER = {
  remFrom: T.legs,
  remTo: 27.2,
  eyesFrom: 15.86,
  // quick leg flicks (swap to the open-leg drawing for a few frames) and jolts
  flicks: [17.42, 23.95, 25.3],
  jolts: [T.legs, 17.12, 17.42, 17.74, 23.4, 23.95, 24.55, 25.3, 26.1],
  bell: [23.05, 24.45] as const,
};

const WIDE: Cam = {x: 540, y: 960, z: 0};
const SPI: Cam = {x: 763, y: 580, z: 700};
const DOTC: Cam = {x: 380, y: 1300, z: 400};
const TWO: Cam = {x: 560, y: 980, z: 150};

export const CAMERA: Move[] = [
  {t0: 0, t1: 0, a: WIDE, b: WIDE},
  {t0: 8.6, t1: 10.1, a: WIDE, b: SPI},
  {t0: 10.1, t1: CUT.toDot1, a: SPI, b: {...SPI, z: 735}},
  {t0: CUT.toDot1, t1: CUT.toSpider, a: DOTC, b: {...DOTC, z: 430}},
  {t0: CUT.toSpider, t1: CUT.toDot2, a: {...SPI, z: 735}, b: {x: 763, y: 590, z: 790}},
  {t0: CUT.toDot2, t1: CUT.toTwo, a: DOTC, b: {...DOTC, z: 440}},
  {t0: CUT.toTwo, t1: 27.2, a: TWO, b: {...TWO, z: 185}},
  {t0: 27.2, t1: 29.0, a: {...TWO, z: 185}, b: WIDE},
];
