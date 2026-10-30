// Voice + sound effects for spider-sleep. Files are trimmed to their onset (sfx.py), so `at` = the hit;
// whooshes are placed by their peak (whoosh peak at 0.44 s, slide_down 0.26 s, sad_wah_tail 0.35 s).
import type {Cue} from '../../kit/audio';
import {SPIDER, T, VO_AT} from './beats';

const fx = (f: string) => `sfx/${f}.wav`;

export const CUES: Cue[] = [
  {f: 'spider-sleep/vo/take1.wav', at: VO_AT, db: 0},
  {f: fx('crickets'), at: 0, db: -30, loop: true, until: T.end, keys: [[0, -30], [28.6, -30], [T.end, -48]]},
  {f: fx('pop'), at: 2.6, db: -25},
  {f: fx('tap_one'), at: 6.0, db: -16},
  {f: fx('tap_one'), at: 6.32, db: -17},
  {f: fx('ticking'), at: 6.1, db: -24, until: 8.6, keys: [[6.1, -32], [6.6, -24], [8.0, -24], [8.55, -42]]},
  {f: fx('whoosh'), at: 9.35 - 0.44, db: -27},
  {f: fx('slide_down'), at: T.drooped + 0.02, db: -24},
  {f: fx('boing'), at: 13.12, db: -20},
  ...SPIDER.jolts.map((at, i): Cue => ({f: fx('twitch_one'), at, db: i === 0 ? -19 : at < 20 ? -22 : -26})),
  {f: fx('chime'), at: T.rem - 0.05, db: -21},
  {f: fx('pop'), at: T.vivid + 0.1, db: -21},
  {f: fx('bell'), at: SPIDER.bell[0], db: -19, until: SPIDER.bell[1] + 0.25, keys: [[SPIDER.bell[0], -19], [SPIDER.bell[1] - 0.1, -19], [SPIDER.bell[1] + 0.25, -45]]},
  {f: fx('sad_wah_tail'), at: 25.16 - 0.1, db: -20},
  {f: fx('pop'), at: T.dream + 0.08, db: -21},
  {f: fx('whoosh'), at: 28.1 - 0.44, db: -29},
];
