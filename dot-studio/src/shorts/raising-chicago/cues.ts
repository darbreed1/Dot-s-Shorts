// Voice + sound effects for raising-chicago. Files are trimmed to their onset, so `at` = the hit; whooshes are placed
// by their peak (0.44 s), dirt_pour peaks late (2.27 s), the ratchet clicks every ~1 s from 0.2 s.
import type {Cue} from '../../kit/audio';
import {SHOT, T, VO_AT} from './beats';

const fx = (f: string) => `sfx/${f}.wav`;
const W = 0.44;

export const CUES: Cue[] = [
  {f: 'raising-chicago/vo/take1.wav', at: VO_AT, db: 0},
  {f: fx('street_tone'), at: 0, db: -33, loop: true, until: T.end, keys: [[0, -33], [SHOT.swamp, -40], [SHOT.street2, -33], [T.end - 0.4, -33], [T.end, -50]]},
  // 1: the building creaks up on its jacks, people pop up at the windows, Dot's surprise
  {f: fx('creak'), at: T.lifted - 0.05, db: -19},
  {f: fx('ratchet'), at: T.lifted - 0.2, db: -29, until: T.buildings + 0.6},
  {f: fx('pop'), at: T.people, db: -25},
  {f: fx('pop'), at: T.people + 0.24, db: -27},
  {f: fx('pop'), at: T.people + 0.48, db: -27},
  {f: fx('boing'), at: T.people + 0.25, db: -24},
  // 2-3: the swamp cross-section, the frog, the sewer pipe
  {f: fx('whoosh'), at: SHOT.swamp + 0.05 - W, db: -29},
  {f: fx('pop'), at: T.city, db: -27},
  {f: fx('mud_squelch'), at: T.swamp - 0.05, db: -23},
  {f: fx('bubbles_mid'), at: T.swamp, db: -31, until: T.lake + 0.5},
  {f: fx('frog_croak'), at: T.swamp + 0.2, db: -19},
  {f: fx('ting'), at: T.barely, db: -24},
  {f: fx('slide_down'), at: T.sewers - 0.05, db: -29},
  {f: fx('pipe_gurgle'), at: T.downhill - 0.1, db: -24, until: T.wasnt + 0.3, keys: [[T.downhill - 0.1, -24], [T.wasnt, -24], [T.wasnt + 0.3, -45]]},
  {f: fx('sad_wah'), at: T.one - 0.05, db: -22},
  // 4: back on the street: the fill pours in, the building rises out of it
  {f: fx('whoosh'), at: SHOT.street2 + 0.05 - W, db: -30},
  {f: fx('dirt_pour'), at: T.raised - 0.2, db: -21},
  {f: fx('boing'), at: T.raised, db: -24},
  {f: fx('creak'), at: T.rise - 0.45, db: -20},
  {f: fx('ratchet'), at: T.rise - 0.6, db: -27, until: T.match + 0.4},
  {f: fx('chime'), at: T.match, db: -24},
  // 5: the watch tap, then the men at the jacks
  {f: fx('watch_tap'), at: T.in2 + 0.1, db: -21},
  {f: fx('watch_tap'), at: T.in2 + 0.42, db: -23},
  {f: fx('time_warp'), at: T.y1860 + 0.25, db: -25},
  {f: fx('whoosh'), at: SHOT.jacks + 0.05 - W, db: -29},
  {f: fx('ratchet'), at: SHOT.jacks + 0.0, db: -20, until: SHOT.row + 0.1},
  {f: fx('ratchet'), at: SHOT.jacks + 0.5, db: -23, until: SHOT.row + 0.1},
  {f: fx('pop'), at: T.men - 0.05, db: -25},
  {f: fx('pop'), at: T.jacks - 0.05, db: -25},
  // 6: the row of shops rises over five days
  {f: fx('whoosh'), at: SHOT.row + 0.05 - W, db: -29},
  {f: fx('creak'), at: T.lifted2 - 0.05, db: -22},
  {f: fx('ticking'), at: T.row - 0.05, db: -29, until: T.days + 0.3},
  {f: fx('chime'), at: T.days, db: -24},
  // 7: the shop is open
  {f: fx('whoosh'), at: SHOT.street3 + 0.05 - W, db: -30},
  {f: fx('pop'), at: T.shops2, db: -26},
  {f: fx('shop_bell'), at: T.open - 0.05, db: -19},
  {f: fx('whoosh'), at: SHOT.back[0] + 0.3 - W, db: -31},
];
