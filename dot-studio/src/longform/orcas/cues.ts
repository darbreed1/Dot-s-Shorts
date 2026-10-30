// Voice sections + sound effects for the orca long-form. Files are trimmed to their onset, so `at` = the hit;
// whooshes are placed by their peak (whoosh 0.44 s).
import type {Cue} from '../../kit/audio';
import {END, SECTIONS} from './timeline';
import {cue} from './parts';

const fx = (f: string) => `sfx/${f}.wav`;
const pop = (at: number, db = -24): Cue => ({f: fx('pop'), at, db});

export const CUES: Cue[] = [
  ...SECTIONS.map((s): Cue => ({f: `orcas/vo/s${String(s.n).padStart(2, '0')}.wav`, at: s.at, db: 0})),
  {f: fx('underwater'), at: 0, db: -34, loop: true, until: END, keys: [[0, -34], [END - 1.2, -34], [END, -50]]},
  // section changes
  ...SECTIONS.slice(1).map((s): Cue => ({f: fx('whoosh'), at: s.at - 0.5 - 0.44, db: -31})),
  // 1
  {f: fx('orca_call'), at: 0.2, db: -26},
  {f: fx('whoosh'), at: cue(1, 'great white sharks') + 0.5 - 0.44, db: -27},
  {f: fx('chime'), at: cue(1, 'Not one confirmed'), db: -21},
  {f: fx('waves'), at: cue(1, 'People swim') - 0.15, db: -30, until: cue(1, 'So why do')},
  pop(cue(1, 'So why do')),
  {f: fx('ting'), at: cue(1, 'But the clues'), db: -23},
  // 2
  pop(cue(2, 'actually a dolphin')),
  {f: fx('boing'), at: cue(2, 'as much as an elephant'), db: -22},
  {f: fx('chime'), at: cue(2, 'Females can live') + 0.2, db: -24},
  pop(cue(2, 'Orcas live in every')),
  pop(cue(2, 'the ice')),
  {f: fx('orca_call'), at: cue(2, 'tight family groups'), db: -27},
  // 3
  {f: fx('splash'), at: cue(3, 'Off the south coast') - 0.2, db: -26},
  {f: fx('zing'), at: cue(3, 'the liver'), db: -25},
  {f: fx('whoosh'), at: cue(3, 'And when orcas show up') + 0.6 - 0.44, db: -26},
  {f: fx('chime'), at: cue(3, "This is the ocean's"), db: -21},
  // 4
  {f: fx('waves'), at: cue(4, 'one famous close call') - 0.15, db: -30, until: cue(4, 'Scientists think')},
  pop(cue(4, 'In 1972')),
  {f: fx('twitch_one'), at: cue(4, 'let go'), db: -22},
  {f: fx('waves'), at: cue(4, 'In recent years') - 0.15, db: -30, until: cue(4, 'But nobody')},
  {f: fx('chime'), at: cue(4, 'is zero'), db: -21},
  // 5
  pop(cue(5, 'Resident orcas')), pop(cue(5, "Bigg's orcas")), pop(cue(5, 'Offshore orcas')),
  {f: fx('orca_call'), at: cue(5, 'different dialects'), db: -26},
  {f: fx('sad_wah_tail'), at: cue(5, "don't switch") - 0.35, db: -27},
  {f: fx('ting'), at: cue(5, 'So nobody teaches it'), db: -23},
  // 6
  {f: fx('echo_clicks'), at: cue(6, 'clicking'), db: -20},
  {f: fx('echo_clicks'), at: cue(6, 'A person probably'), db: -21},
  {f: fx('pop'), at: cue(6, 'So to an orca'), db: -24},
  // 7
  pop(cue(7, "An orca's brain weighs")), pop(cue(7, 'about four times'), -23),
  {f: fx('chime'), at: cue(7, 'emotion'), db: -24},
  {f: fx('whoosh'), at: cue(7, 'leave it alone') + 0.4 - 0.44, db: -28},
  // 8 (quiet: no gags)
  {f: fx('whoosh'), at: cue(8, 'He was captured') + 0.6 - 0.44, db: -30},
  // 9
  pop(cue(9, "We're not on")), pop(cue(9, 'We probably sound')), pop(cue(9, "And they're careful")),
  {f: fx('boing'), at: cue(9, "can't fully explain"), db: -24},
  // 10
  {f: fx('chime'), at: cue(10, 'about seventy-five'), db: -25},
  {f: fx('orca_call'), at: cue(10, 'So the next time'), db: -25},
  {f: fx('chime'), at: cue(10, 'remember') + 0.3, db: -22},
];
