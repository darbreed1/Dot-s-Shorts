// Beat times (s) for doomsday-november-13. Voice at VO_AT; long pauses capped at 0.7 s by images/lib/tighten.py
// (the take had a 5 s gap after "2026"); word times = whisper + VO_AT, snapped to loudness pauses.
import type {Swap} from '../../kit/Dot';

export const FPS = 60;
export const VO_AT = 0.1;

export const T = {
  // 1 Is the world ending on Friday, November 13th, 2026?
  is: 0.32,
  friday: 1.32,
  november: 2.26,
  th13: 2.52,
  y2026: 3.64,
  // 2 That date comes from a real 1960 paper in the journal Science.
  that: 5.3,
  y1960: 6.36,
  paper: 6.9,
  journal: 7.76,
  science: 8.02,
  // 3 Three researchers fitted 2,000 years of population estimates to one curve.
  three: 9.62,
  fitted: 10.28,
  k2000: 10.86,
  estimates: 12.68,
  one: 13.5,
  curve: 13.76,
  // 4 Growth kept speeding up, so their curve hit infinite people on that exact Friday.
  growth: 14.66,
  speeding: 15.36,
  up: 15.82,
  so: 16.62,
  hit: 17.44,
  infinite: 17.68,
  people: 18.2,
  exact: 19.24,
  friday2: 19.78,
  // 5 It was a warning, not a prophecy.
  it: 21.18,
  warning: 21.54,
  not: 22.32,
  prophecy: 23.14,
  // 6 And it didn't hold.
  and: 24.46,
  didnt: 24.72,
  hold: 25.02,
  // 7 Families got smaller, and real numbers fell behind the curve.
  families: 26.16,
  smaller: 26.74,
  real: 27.8,
  fell: 28.3,
  behind: 28.54,
  curve3: 29.08,
  end: 30.2,
} as const;

export const SHOT = {
  paper: 6.7, // the 1960 paper on a desk
  chart: 9.35, // the population chart
  warning: 20.85, // warning sign vs crystal ball
  chart2: 24.25, // back to the chart: the real numbers
} as const;

export const inRoom = (t: number) => t < SHOT.paper;
export const inPaper = (t: number) => t >= SHOT.paper && t < SHOT.chart;
export const inChart = (t: number) => (t >= SHOT.chart && t < SHOT.warning) || t >= SHOT.chart2;
export const inWarning = (t: number) => t >= SHOT.warning && t < SHOT.chart2;

export const DOT_SWAPS: Swap[] = [
  {at: 0, pose: 'dot_scared'},
  {at: T.that, pose: 'dot_watch', style: 'squash'},
  {at: SHOT.chart, pose: 'dot_lookup', style: 'cut'},
  {at: T.infinite - 0.05, pose: 'dot_surprised', style: 'squash'},
  {at: SHOT.warning, pose: 'dot_aha', style: 'cut'},
  {at: SHOT.chart2, pose: 'dot_lookup', style: 'cut'},
  {at: T.smaller - 0.05, pose: 'dot_shrug', style: 'squash'},
];
