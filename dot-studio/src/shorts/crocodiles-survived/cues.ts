// Voice + sound effects for crocodiles-survived. Files are trimmed to their onset, so `at` = the hit; whooshes are
// placed by their peak (whoosh 0.44 s, meteor_whoosh 0.46 s).
import type {Cue} from '../../kit/audio';
import {SHOT, T, VO_AT} from './beats';

const fx = (f: string) => `sfx/${f}.wav`;
const W = 0.44;

export const CUES: Cue[] = [
  {f: 'crocodiles-survived/vo/take1.wav', at: VO_AT, db: 0},
  {f: fx('swamp_tone'), at: 0, db: -31, until: SHOT.fossils + 0.2},
  {f: fx('swamp_tone'), at: SHOT.river2, db: -31, until: T.end, keys: [[SHOT.river2, -31], [T.end - 0.4, -31], [T.end, -50]]},
  // 1: the asteroid streaks in, the impact, the dinosaur's yelp and puff
  {f: fx('meteor_whoosh'), at: T.asteroid - 0.2, db: -22, until: T.wiped + 0.2},
  {f: fx('distant_boom'), at: T.wiped, db: -15},
  {f: fx('dino_yelp'), at: T.wiped + 0.05, db: -21},
  {f: fx('pop'), at: T.wiped + 0.25, db: -24},
  // 2: the fossils
  {f: fx('whoosh'), at: SHOT.fossils + 0.05 - W, db: -30},
  {f: fx('bones_clatter'), at: T.study - 0.1, db: -23},
  {f: fx('pop'), at: T.university - 0.05, db: -27},
  {f: fx('chime'), at: T.k7000, db: -23},
  // 3: the globe over 250 million years
  {f: fx('whoosh'), at: SHOT.globe + 0.05 - W, db: -30},
  {f: fx('watch_tap'), at: SHOT.globe + 0.2, db: -22},
  {f: fx('watch_tap'), at: SHOT.globe + 0.52, db: -24},
  {f: fx('time_warp'), at: T.m250 - 0.1, db: -26},
  {f: fx('pop'), at: T.crocodile, db: -26},
  {f: fx('ting'), at: T.warm, db: -25},
  // 4: the impact on the globe; the dinosaurs' climate shrinks
  {f: fx('distant_boom'), at: T.impact - 0.05, db: -19},
  {f: fx('chime'), at: T.tropics, db: -25},
  {f: fx('pop'), at: T.dinosaurs2, db: -27},
  {f: fx('slide_down'), at: T.lost, db: -25},
  {f: fx('sad_wah'), at: T.climate, db: -25},
  // 5: what else helped
  {f: fx('whoosh'), at: SHOT.river2 + 0.05 - W, db: -30},
  {f: fx('pop'), at: T.cold - 0.05, db: -25},
  {f: fx('pop'), at: T.small - 0.05, db: -25},
  {f: fx('pop'), at: T.home - 0.05, db: -25},
  {f: fx('splash'), at: T.water - 0.05, db: -22},
  {f: fx('bubbles_mid'), at: T.water + 0.2, db: -30, until: T.helped + 0.5},
  {f: fx('chime'), at: T.too, db: -25},
];
