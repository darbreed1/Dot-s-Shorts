// Voice + sound effects for doomsday-november-13. Files are trimmed to their onset, so `at` = the hit; whooshes are
// placed by their peak (0.44 s); the doom sting's last note peaks at 1.9 s.
import type {Cue} from '../../kit/audio';
import {SHOT, T, VO_AT} from './beats';

const fx = (f: string) => `sfx/${f}.wav`;
const W = 0.44;

export const CUES: Cue[] = [
  {f: 'doomsday-november-13/vo/take1.wav', at: VO_AT, db: 0},
  // 1: the calendar, the cat, the doom sting on "2026"
  {f: fx('ticking'), at: 0, db: -31, until: T.y2026},
  {f: fx('cat_meow'), at: T.november + 0.1, db: -24},
  {f: fx('zing'), at: T.th13, db: -27},
  {f: fx('doom_sting'), at: T.y2026 - 0.05, db: -17},
  // 2: watch tap back to 1960, the paper
  {f: fx('watch_tap'), at: T.that + 0.1, db: -21},
  {f: fx('watch_tap'), at: T.that + 0.42, db: -23},
  {f: fx('time_warp'), at: T.y1960 - 0.2, db: -25},
  {f: fx('paper_rustle'), at: SHOT.paper + 0.02, db: -24},
  {f: fx('ting'), at: T.paper + 0.1, db: -25},
  {f: fx('pop'), at: T.journal - 0.05, db: -26},
  // 3: the chart: researchers, the estimates, the curve
  {f: fx('whoosh'), at: SHOT.chart + 0.05 - W, db: -30},
  {f: fx('pop'), at: T.three, db: -25},
  {f: fx('pop'), at: T.three + 0.24, db: -27},
  {f: fx('pop'), at: T.fitted + 0.3, db: -29},
  {f: fx('pop'), at: T.fitted + 1.1, db: -29},
  {f: fx('pop'), at: T.fitted + 1.9, db: -29},
  {f: fx('pencil_scribble'), at: T.one - 0.05, db: -25, until: T.curve + 0.6},
  // 4: speeding up, off the chart, infinity, the exact Friday
  {f: fx('pencil_scribble'), at: T.growth, db: -27, until: T.up + 0.5},
  {f: fx('slide_whistle_up'), at: T.so + 0.4, db: -21},
  {f: fx('boing'), at: T.infinite - 0.05, db: -24},
  {f: fx('ting'), at: T.friday2 - 0.05, db: -24},
  // 5: warning, not prophecy
  {f: fx('whoosh'), at: SHOT.warning + 0.05 - W, db: -30},
  {f: fx('pop'), at: T.warning, db: -24},
  {f: fx('chime'), at: T.not, db: -27},
  {f: fx('chop_one'), at: T.prophecy, db: -19},
  // 6-7: back to the chart: the real line falls behind, the family shrinks, the cat strolls off
  {f: fx('whoosh'), at: SHOT.chart2 + 0.05 - W, db: -30},
  {f: fx('slide_down'), at: T.didnt, db: -27},
  {f: fx('pop'), at: T.families, db: -25},
  {f: fx('pop'), at: T.smaller + 0.3, db: -26},
  {f: fx('chime'), at: T.behind, db: -25},
  {f: fx('cat_meow'), at: T.curve3 + 0.55, db: -25},
];
