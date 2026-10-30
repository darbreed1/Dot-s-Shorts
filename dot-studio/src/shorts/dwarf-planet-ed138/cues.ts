// Voice + sound effects for dwarf-planet-ed138. Files are trimmed to their onset (sfx.py), so `at` = the hit;
// whooshes / the sad wah / the inflate are placed by their peak (whoosh 0.44 s, sad_wah_tail 0.35 s,
// inflate 2.65 s = its end pop).
import type {Cue} from '../../kit/audio';
import {SHOT, T, VO_AT} from './beats';

const fx = (f: string) => `sfx/${f}.wav`;

export const CUES: Cue[] = [
  {f: 'dwarf-planet-ed138/vo/take1.wav', at: VO_AT, db: 0},
  {f: fx('space_hum'), at: 0, db: -33, loop: true, until: T.end, keys: [[0, -33], [28.3, -33], [T.end, -50]]},
  // 1-2: the object wakes up, Pluto grins, Dot shrugs
  {f: fx('pop'), at: T.new, db: -22},
  {f: fx('ting'), at: T.pluto, db: -27},
  {f: fx('boing'), at: T.maybe, db: -21},
  // 3: glide to the observatory, the flash, the lock-on; the ruler counts to 46
  {f: fx('whoosh'), at: 5.05 - 0.44, db: -27},
  {f: fx('shutter'), at: T.spotted, db: -15},
  {f: fx('chime'), at: T.spotted + 0.25, db: -23},
  {f: fx('whoosh'), at: SHOT.ruler + 0.02 - 0.44, db: -29},
  {f: fx('ticking'), at: T.times, db: -25, until: 9.15, keys: [[T.times, -32], [8.2, -25], [8.9, -25], [9.15, -40]]},
  {f: fx('chime'), at: 9.12, db: -20},
  {f: fx('pop'), at: T.sun, db: -25},
  {f: fx('pop'), at: T.earth, db: -24},
  // 4: size: pops in small, inflates, the label
  {f: fx('whoosh'), at: SHOT.size + 0.02 - 0.44, db: -30},
  {f: fx('pop'), at: T.might, db: -22},
  {f: fx('inflate'), at: T.km + 0.05 - 2.65, db: -17},
  {f: fx('zing'), at: T.wide - 0.1, db: -27},
  // 5: Dot puzzled
  {f: fx('pop'), at: T.nobody + 0.1, db: -23},
  // 6: the sky: Southern Cross, the crowd, the slow dot, lost
  {f: fx('whoosh'), at: SHOT.sky + 0.02 - 0.44, db: -30},
  {f: fx('chime'), at: T.southern, db: -24},
  {f: fx('zing'), at: T.crowded, db: -26},
  {f: fx('bubbles'), at: T.crowded + 0.05, db: -31, until: T.milky + 0.7},
  {f: fx('pop'), at: T.one, db: -24},
  {f: fx('sad_wah_tail'), at: T.lost + 0.25 - 0.35, db: -21},
  // 7: jelly wobble, the compass ring, "?"
  {f: fx('whoosh'), at: SHOT.round + 0.02 - 0.44, db: -30},
  {f: fx('boing'), at: T.to + 0.05, db: -24},
  {f: fx('boing'), at: 24.65, db: -26},
  {f: fx('ting'), at: T.round + 0.3, db: -22},
  {f: fx('pop'), at: T.round + 0.32, db: -24},
  // 8: watch taps, ticking, back to wide
  {f: fx('tap_one'), at: T.needs, db: -16},
  {f: fx('tap_one'), at: T.needs + 0.3, db: -17},
  {f: fx('ticking'), at: T.needs + 0.1, db: -25, until: 28.2, keys: [[T.needs + 0.1, -32], [27.5, -25], [27.9, -25], [28.2, -42]]},
  {f: fx('whoosh'), at: 28.15 - 0.44, db: -30},
];
