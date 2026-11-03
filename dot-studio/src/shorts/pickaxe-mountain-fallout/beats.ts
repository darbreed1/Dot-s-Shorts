// Beat times (s) for pickaxe-mountain-fallout. Voice at VO_AT; pauses capped at 0.5 s by images/lib/tighten.py; word
// times = whisper + VO_AT, snapped to loudness pauses (images/lib/captions.py).
import type {Swap} from '../../kit/Dot';

export const FPS = 60;
export const VO_AT = 0.1;

export const T = {
  // 1 If the US bombs Iran's Pickaxe Mountain, would nuclear fallout spread?
  bombs: 1.16,
  mountain: 2.42,
  hit: 2.86, // the bomb lands in the pause after "Mountain,"
  would: 3.22,
  fallout: 3.86,
  spread: 4.34,
  // 2 Fallout comes from a nuclear explosion, and bombing uranium can't start one.
  fallout2: 5.44,
  nuclear: 6.54,
  explosion: 6.84,
  bombing: 8.24,
  uranium: 8.58,
  cant: 9.18,
  start: 9.62,
  // 3 A nuclear bomb squeezes its uranium together perfectly.
  bomb2: 11.26,
  squeezes: 11.68,
  together: 12.84,
  perfectly: 13.38,
  // 4 An ordinary blast scatters it.
  ordinary: 14.8,
  blast: 15.28,
  scatters: 15.8,
  // 5 The real worry is the enrichment gas, which turns to acid in damp air.
  worry: 17.5,
  enrichment: 18.24,
  gas: 18.62,
  turns: 19.9,
  acid: 20.38,
  damp: 21.04,
  // 6 But it's heavy, and under rock it wouldn't get far.
  heavy: 22.36,
  under: 23.24,
  rock: 23.62,
  wouldnt: 24.46,
  far: 24.94,
  // 7 Only a nuclear weapon would make fallout, and experts call that highly unlikely.
  only: 25.84,
  weapon: 26.64,
  fallout3: 27.68,
  experts: 28.92,
  highly: 30.32,
  unlikely: 30.76,
  end: 32.1,
} as const;

export const SHOT = {
  source: 5.2, // where fallout comes from / bombing uranium
  squeeze: 10.5, // the squeeze and the ordinary blast
  gas: 16.85, // the enrichment gas
  cutaway: 21.75, // inside the mountain
  mountain2: 25.6, // back outside: only a nuclear weapon
} as const;

export const DOT_SWAPS: Swap[] = [
  {at: 0, pose: 'dot_lookup'},
  {at: T.hit, pose: 'dot_surprised', style: 'squash'},
  {at: SHOT.source, pose: 'dot_lookup', style: 'cut'},
  {at: T.cant - 0.05, pose: 'dot_shrug', style: 'squash'},
  {at: SHOT.squeeze, pose: 'dot_magnify', style: 'cut'},
  {at: T.scatters - 0.05, pose: 'dot_aha', style: 'squash'},
  {at: SHOT.gas, pose: 'dot_scratch', style: 'cut'},
  {at: SHOT.cutaway, pose: 'dot_lookup', style: 'cut'},
  {at: T.heavy - 0.05, pose: 'dot_aha', style: 'squash'},
  {at: SHOT.mountain2, pose: 'dot_lookup', style: 'cut'},
  {at: T.highly - 0.05, pose: 'dot_shrug', style: 'squash'},
];
