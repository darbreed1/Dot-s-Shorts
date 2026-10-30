// Voice + sound effects for onion-tears. Files are trimmed to their onset (sfx.py / slices), so `at` = the hit;
// whooshes / the ting are placed by their peak (whoosh 0.44 s, ting 0.35 s, slow_slice_tail 0.51 s).
import type {Cue} from '../../kit/audio';
import {MOUSE_T, SHOT, T, VO_AT} from './beats';

const fx = (f: string) => `sfx/${f}.wav`;
const CHOMPS = [11.06, 11.4, 11.74, 12.08];

export const CUES: Cue[] = [
  {f: 'onion-tears/vo/take1.wav', at: VO_AT, db: 0},
  {f: fx('kitchen_tone'), at: 0, db: -33, loop: true, until: T.end, keys: [[0, -33], [30.3, -33], [T.end, -50]]},
  // 1-2: sniffles, the onion wakes up and puffs at Dot
  {f: fx('sniff_one'), at: 2.3, db: -18},
  {f: fx('pop'), at: T.because, db: -22},
  {f: fx('gas_hiss'), at: T.fighting, db: -25, until: T.fighting + 0.8},
  {f: fx('sniff_one'), at: T.fighting + 0.75, db: -19},
  // 3: into the onion
  {f: fx('whoosh'), at: 4.95 - 0.44, db: -26},
  {f: fx('bubbles_mid'), at: SHOT.cell1, db: -31, until: SHOT.chop},
  {f: fx('pop'), at: T.two, db: -24},
  {f: fx('pop'), at: T.ingredients, db: -24},
  // 4: the chop + mist, then mixing
  {f: fx('chop_one'), at: T.cut, db: -13},
  {f: fx('squirt'), at: T.cut + 0.01, db: -19},
  {f: fx('twitch_one'), at: SHOT.cell2 + 0.06, db: -22},
  {f: fx('bubbles_mid'), at: SHOT.cell2 + 0.05, db: -25},
  // 5: the enzyme chomps, gas hisses, gas drifts to Dot
  {f: fx('boing'), at: T.enzyme, db: -24},
  ...CHOMPS.map((at): Cue => ({f: fx('chomp_one'), at, db: -20})),
  {f: fx('gas_hiss'), at: 11.15, db: -28, until: SHOT.gas},
  {f: fx('gas_hiss'), at: SHOT.gas + 0.1, db: -25, until: 14.4},
  {f: fx('sniff_one'), at: T.eyes, db: -18},
  // 6: the sting and the tears
  {f: fx('zing'), at: T.sting, db: -18},
  {f: fx('zing'), at: T.sting + 0.28, db: -22},
  {f: fx('squirt'), at: T.tears, db: -23},
  {f: fx('squirt'), at: T.tears + 0.5, db: -26},
  // 7: the mouse
  {f: fx('gas_hiss'), at: MOUSE_T.puff, db: -26, until: MOUSE_T.hit + 0.1},
  {f: fx('squeak'), at: MOUSE_T.hit, db: -16},
  {f: fx('scurry'), at: MOUSE_T.turn + 0.08, db: -21, until: MOUSE_T.gone + 0.3, keys: [[MOUSE_T.turn, -21], [MOUSE_T.gone, -24], [MOUSE_T.gone + 0.3, -45]]},
  // 8-9: the sharp knife, the slow cut, a tiny spritz
  {f: fx('ting'), at: T.fewer - 0.35 + 0.14, db: -18},
  {f: fx('whoosh'), at: 25.1 - 0.44, db: -30},
  {f: fx('ting'), at: T.sharp - 0.35 + 0.14, db: -21},
  {f: fx('slow_slice_tail'), at: T.sprays - 0.51, db: -20},
  {f: fx('squirt'), at: T.sprays + 0.05, db: -32},
  {f: fx('whoosh'), at: 30.4 - 0.44, db: -31},
];
