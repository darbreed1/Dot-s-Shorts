// Voice + sound effects for pickaxe-mountain-fallout. Files are trimmed to their onset, so `at` = the hit; whooshes
// are placed by their peak (whoosh 0.44 s).
import type {Cue} from '../../kit/audio';
import {SHOT, T, VO_AT} from './beats';

const fx = (f: string) => `sfx/${f}.wav`;
const W = 0.44;

export const CUES: Cue[] = [
  {f: 'pickaxe-mountain-fallout/vo/take1.wav', at: VO_AT, db: 0},
  {f: fx('desert_wind'), at: 0, db: -32, until: SHOT.source + 0.2, keys: [[0, -32], [SHOT.source - 0.2, -32], [SHOT.source + 0.2, -50]]},
  {f: fx('desert_wind'), at: SHOT.mountain2 - 0.2, db: -32, until: T.end, keys: [[SHOT.mountain2 - 0.2, -50], [SHOT.mountain2 + 0.3, -32], [T.end - 0.4, -32], [T.end, -50]]},
  // 1: the bomb whistles down onto the mountain; dust and a rumble
  {f: fx('bomb_whistle'), at: T.bombs - 0.1, db: -27, until: T.hit, keys: [[T.bombs - 0.1, -27], [T.hit - 0.3, -26], [T.hit, -40]]},
  {f: fx('distant_boom'), at: T.hit, db: -17},
  {f: fx('rock_rumble'), at: T.hit + 0.05, db: -22},
  {f: fx('pop'), at: T.fallout - 0.3, db: -27},
  // 2: where fallout comes from; a bomb on uranium
  {f: fx('whoosh'), at: SHOT.source + 0.05 - W, db: -30},
  {f: fx('pop'), at: T.nuclear - 0.05, db: -25},
  {f: fx('pop'), at: T.explosion + 0.05, db: -26},
  {f: fx('zing'), at: T.bombing, db: -27},
  {f: fx('distant_boom'), at: T.uranium + 0.12, db: -24},
  {f: fx('slide_down'), at: T.cant, db: -26},
  // 3-4: the squeeze, then the ordinary blast
  {f: fx('whoosh'), at: SHOT.squeeze + 0.05 - W, db: -30},
  {f: fx('pop'), at: T.bomb2 - 0.05, db: -26},
  {f: fx('ratchet'), at: T.squeezes, db: -27},
  {f: fx('chime'), at: T.perfectly, db: -24},
  {f: fx('distant_boom'), at: T.blast, db: -18},
  {f: fx('bones_clatter'), at: T.scatters - 0.1, db: -26},
  // 5: the gas hisses out of the cylinder, turns to acid
  {f: fx('whoosh'), at: SHOT.gas + 0.05 - W, db: -30},
  {f: fx('gas_hiss'), at: T.gas - 0.2, db: -27, until: T.damp + 0.6, keys: [[T.gas - 0.2, -27], [T.damp, -27], [T.damp + 0.6, -45]]},
  {f: fx('drip'), at: T.turns + 0.1, db: -24},
  {f: fx('drip'), at: T.turns + 0.45, db: -26},
  {f: fx('fizz'), at: T.acid, db: -24},
  // 6: inside the mountain: the gas sinks and stays put
  {f: fx('whoosh'), at: SHOT.cutaway + 0.05 - W, db: -30},
  {f: fx('slide_down'), at: T.heavy, db: -27},
  {f: fx('rock_rumble'), at: T.rock - 0.1, db: -30},
  {f: fx('ting'), at: T.far, db: -26},
  // 7: back outside; the experts and the dial
  {f: fx('whoosh'), at: SHOT.mountain2 + 0.05 - W, db: -30},
  {f: fx('pop'), at: T.weapon - 0.3, db: -27},
  {f: fx('pop'), at: T.experts - 0.05, db: -26},
  {f: fx('pop'), at: T.experts + 0.1, db: -27},
  {f: fx('pop'), at: T.experts + 0.25, db: -28},
  {f: fx('ratchet'), at: T.highly - 0.05, db: -28},
  {f: fx('ting'), at: T.unlikely + 0.35, db: -25},
];
