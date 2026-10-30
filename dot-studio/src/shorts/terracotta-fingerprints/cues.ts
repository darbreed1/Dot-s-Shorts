// Voice + sound effects for terracotta-fingerprints. Files are trimmed to their onset, so `at` = the hit; whooshes /
// the time warp / the sad wah are placed by their peak (whoosh 0.44 s, time_warp 0.95 s, sad_wah_tail 0.35 s).
import type {Cue} from '../../kit/audio';
import {HELPERS, SHOT, T, VO_AT} from './beats';

const fx = (f: string) => `sfx/${f}.wav`;

export const CUES: Cue[] = [
  {f: 'terracotta-fingerprints/vo/take1.wav', at: VO_AT, db: 0},
  {f: fx('kitchen_tone'), at: 0, db: -37, loop: true, until: T.end, keys: [[0, -37], [26.0, -37], [T.end, -50]]},
  // 1-2: "Not just men."
  {f: fx('boing'), at: T.not, db: -22},
  // 3: watch taps, ticking back, the time warp into the workshop; workers pop in and press their prints
  {f: fx('pop'), at: 4.62, db: -27},
  ...[5.6, 5.9].map((at, i): Cue => ({f: fx('tap_one'), at, db: i ? -17 : -16})),
  {f: fx('ticking'), at: 5.7, db: -25, until: 6.7, keys: [[5.7, -32], [6.0, -25], [6.4, -25], [6.7, -40]]},
  {f: fx('time_warp'), at: 6.95 - 0.95, db: -17},
  ...[0, 0.12, 0.24].map((d): Cue => ({f: fx('pop'), at: T.makers + d, db: -24})),
  ...[0, 0.22, 0.44].map((d): Cue => ({f: fx('clay_squish'), at: T.left + d, db: -15})),
  {f: fx('ting'), at: T.clay - 0.05, db: -25},
  // 4: fingertips, the squares, "tighter-packed ridges"
  {f: fx('whoosh'), at: SHOT.ridges + 0.02 - 0.44, db: -29},
  {f: fx('pop'), at: T.hands, db: -24},
  {f: fx('pop'), at: T.women, db: -25},
  {f: fx('pop'), at: T.children, db: -25},
  {f: fx('zing'), at: T.tighter, db: -26},
  {f: fx('chime'), at: T.ridges, db: -24},
  // 5-6: 79 prints count up, then sort into three groups
  {f: fx('whoosh'), at: SHOT.count + 0.02 - 0.44, db: -29},
  {f: fx('ticking'), at: SHOT.count + 0.15, db: -26, until: 16.3, keys: [[SHOT.count + 0.15, -31], [15.0, -26], [16.0, -26], [16.3, -40]]},
  {f: fx('chime'), at: 16.25, db: -22},
  {f: fx('pop'), at: T.one, db: -24},
  ...[T.women2 - 0.35, T.children2 - 0.3, T.fifteen + 0.05].map((at): Cue => ({f: fx('whoosh'), at: at + 0.3 - 0.44, db: -31})),
  ...[T.women2, T.children2 + 0.05, T.fifteen + 0.4].map((at): Cue => ({f: fx('pop'), at, db: -23})),
  // 7: back in the pit: "small sample", then the helpers pop in
  {f: fx('whoosh'), at: SHOT.back + 0.02 - 0.44, db: -29},
  {f: fx('sad_wah_tail'), at: T.small + 0.35 - 0.35, db: -26},
  ...HELPERS.in.map((at): Cue => ({f: fx('pop'), at, db: -21})),
  {f: fx('chime'), at: T.helpers, db: -23},
  {f: fx('pop'), at: HELPERS.out, db: -28},
  {f: fx('whoosh'), at: 25.95 - 0.2, db: -31},
];
