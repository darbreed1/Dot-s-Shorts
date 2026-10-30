// Voice + sound effects for airplane-window-hole. Files are trimmed to their onset, so `at` = the hit; whooshes /
// the hiss are placed by their peak (whoosh 0.44 s, air_hiss 0.85 s).
import type {Cue} from '../../kit/audio';
import {SHOT, T, VO_AT} from './beats';

const fx = (f: string) => `sfx/${f}.wav`;

export const CUES: Cue[] = [
  {f: 'airplane-window-hole/vo/take1.wav', at: VO_AT, db: 0},
  {f: fx('cabin_hum'), at: 0, db: -32, loop: true, until: T.end, keys: [[0, -32], [30.3, -32], [T.end, -50]]},
  // 1-2: push in on the hole, the glint; "It's on purpose" + the cabin chime
  {f: fx('whoosh'), at: 1.8 - 0.44, db: -30},
  {f: fx('ting'), at: T.hole, db: -23},
  {f: fx('boing'), at: T.its - 0.05, db: -23},
  {f: fx('cabin_chime'), at: T.purpose + 0.15, db: -21},
  // 3: three panes slide apart, the middle one is picked out
  {f: fx('whoosh'), at: SHOT.panes + 0.02 - 0.44, db: -29},
  {f: fx('pop'), at: T.three - 0.2, db: -24},
  {f: fx('slide_down'), at: T.three - 0.1, db: -27},
  {f: fx('chime'), at: T.middle - 0.1, db: -23},
  // 4: up high; cabin air pushes
  {f: fx('whoosh'), at: SHOT.high + 0.3 - 0.44, db: -26},
  {f: fx('whoosh'), at: SHOT.cross + 0.02 - 0.44, db: -30},
  {f: fx('boing'), at: T.pushes, db: -25},
  // 5: air through the hole, the outer pane strains
  {f: fx('air_hiss'), at: T.hole3 + 0.4 - 0.85, db: -22},
  {f: fx('twitch_one'), at: T.outer, db: -22},
  {f: fx('squeak'), at: T.carries, db: -25},
  // 6: the relaxed backup
  {f: fx('pop'), at: T.middle2 - 0.1, db: -25},
  {f: fx('ting'), at: T.backup - 0.05, db: -23},
  // 7: back at the window: fog, it vents out through the hole, clear
  {f: fx('whoosh'), at: SHOT.fog + 0.02 - 0.44, db: -30},
  {f: fx('gas_hiss'), at: T.moisture - 0.2, db: -29, until: T.out + 0.2},
  {f: fx('air_hiss'), at: T.out + 0.5 - 0.85, db: -24},
  {f: fx('glass_squeak'), at: T.fog + 0.3, db: -27},
  {f: fx('chime'), at: T.up2, db: -24},
  {f: fx('whoosh'), at: SHOT.back[0] + 0.3 - 0.44, db: -31},
];
