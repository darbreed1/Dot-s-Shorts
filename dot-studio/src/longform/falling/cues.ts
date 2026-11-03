// Voice sections + sound effects for the falling long-form. Files are trimmed to their onset, so `at` = the hit;
// whooshes are placed by their peak (whoosh 0.44 s). Chapter 3 (the record) is kept quiet on purpose: no beds, no
// comedy sounds, just a few soft chimes.
import type {Cue} from '../../kit/audio';
import {END, SECTIONS} from './timeline';
import {cue, secEnd, secStart} from './parts';

const fx = (f: string) => `sfx/${f}.wav`;
const pop = (at: number, db = -26): Cue => ({f: fx('pop'), at, db});
const W = 0.44;

export const CUES: Cue[] = [
  ...SECTIONS.map((s): Cue => ({f: `falling/vo/s${String(s.n).padStart(2, '0')}.wav`, at: s.at, db: 0})),
  // section changes
  ...SECTIONS.slice(1).map((s): Cue => ({f: fx('whoosh'), at: s.at - 0.5 - W, db: -31})),
  // 1 intro
  {f: fx('bubbles_mid'), at: cue(1, 'Raindrops'), db: -34, until: cue(1, 'skydivers') + 1},
  {f: fx('plane_drone'), at: cue(1, 'skydivers') - 0.6, db: -32, until: cue(1, 'skydivers') + 3.5},
  {f: fx('wind_rush'), at: cue(1, 'skydivers') + 0.9, db: -32, until: cue(1, 'skydivers') + 3.5},
  {f: fx('space_hum'), at: cue(1, 'International Space Station') - 0.3, db: -32, until: cue(1, 'Falling sounds')},
  {f: fx('boing'), at: cue(1, 'you go down') + 0.15, db: -24},
  pop(cue(1, "There's a speed")),
  pop(cue(1, 'famous record')),
  pop(cue(1, 'piece of fabric')),
  pop(cue(1, "space station that's")),
  {f: fx('chime'), at: cue(1, "So let's find out"), db: -23},
  // 2 how fast
  {f: fx('plane_drone'), at: secStart(2) - 0.5, db: -28, until: cue(2, 'Jump out of a plane') + 1.6},
  {f: fx('wind_rush'), at: cue(2, 'Jump out of a plane') + 0.6, db: -28, loop: true, until: cue(2, 'When you first jump') - 0.1},
  {f: fx('chop_one'), at: cue(2, "But that's not how"), db: -24},
  {f: fx('pencil_scribble'), at: cue(2, 'When you first jump'), db: -30, until: cue(2, 'you stop speeding up') + 1},
  {f: fx('ting'), at: cue(2, 'terminal velocity'), db: -24},
  {f: fx('wind_rush'), at: cue(2, 'Lying flat') - 0.2, db: -29, loop: true, until: cue(2, 'Speed skydivers') - 0.1},
  {f: fx('slide_whistle_up'), at: cue(2, 'Turn head down'), db: -27},
  pop(cue(2, 'In August 2025') - 0.05),
  {f: fx('chime'), at: cue(2, 'about 537'), db: -23},
  {f: fx('ting'), at: cue(2, 'The air sets'), db: -24},
  // 3 the record (quiet)
  {f: fx('chime'), at: cue(3, '10,160 metres'), db: -28},
  {f: fx('chime'), at: cue(3, 'record books'), db: -30},
  {f: fx('paper_rustle'), at: cue(3, 'Then, in 2009'), db: -30},
  // 4 parachute
  {f: fx('wind_rush'), at: secStart(4) - 0.4, db: -29, until: cue(4, 'something much bigger') - 0.1},
  {f: fx('canopy_open'), at: cue(4, 'something much bigger') - 0.1, db: -22},
  {f: fx('wind_rush'), at: cue(4, "Here's what happens") - 0.2, db: -31, loop: true, until: cue(4, 'the canopy fills with air')},
  {f: fx('whoosh'), at: cue(4, 'pilot chute') + 0.3 - W, db: -27},
  {f: fx('tap_one'), at: cue(4, 'pulls a pin'), db: -22},
  {f: fx('velcro_rip'), at: cue(4, 'opens the container'), db: -27},
  {f: fx('whoosh'), at: cue(4, 'drags out a bag') + 0.3 - W, db: -28},
  {f: fx('canopy_open'), at: cue(4, 'the canopy fills with air') - 0.1, db: -20},
  {f: fx('slide_down'), at: cue(4, 'called a slider'), db: -28},
  pop(cue(4, "They're wings")),
  {f: fx('ting'), at: cue(4, 'slow right down'), db: -25},
  pop(cue(4, 'one jump in a thousand')),
  {f: fx('twitch_one'), at: cue(4, 'The lines can twist'), db: -26},
  {f: fx('sad_wah'), at: cue(4, 'stuck in its bag') + 0.2, db: -27},
  {f: fx('velcro_rip'), at: cue(4, 'to cut it away'), db: -20},
  {f: fx('canopy_open'), at: cue(4, 'to open the reserve'), db: -21},
  pop(cue(4, 'certified rigger')),
  {f: fx('chime'), at: cue(4, 'every 180 days'), db: -25},
  {f: fx('wind_rush'), at: cue(4, 'small computer') - 0.2, db: -31, until: cue(4, 'it fires')},
  {f: fx('aad_pop'), at: cue(4, 'it fires') - 0.6, db: -20},
  {f: fx('canopy_open'), at: cue(4, 'it fires') + 0.05, db: -22},
  {f: fx('chime'), at: cue(4, 'chain of backups'), db: -23},
  // 5 the station
  {f: fx('space_hum'), at: secStart(5) - 0.4, db: -30, loop: true, until: secEnd(5) + 0.5},
  {f: fx('slide_down'), at: cue(5, 'straight down') - 0.3, db: -28},
  {f: fx('whoosh'), at: cue(5, 'moving sideways') + 0.2 - W, db: -27},
  {f: fx('boing'), at: cue(5, 'Picture throwing a ball') + 0.6, db: -27},
  {f: fx('boing'), at: cue(5, 'Throw it harder') + 0.2, db: -27},
  {f: fx('slide_whistle_up'), at: cue(5, 'Throw it hard enough') + 0.3, db: -27},
  {f: fx('chime'), at: cue(5, "That's an orbit"), db: -23},
  pop(cue(5, 'And the astronauts float') - 0.1),
  {f: fx('thruster_burn'), at: cue(5, 'gives it a push') - 0.1, db: -25},
  {f: fx('ting'), at: cue(5, 'Around 2030'), db: -25},
  {f: fx('splash'), at: cue(5, 'remote part of the ocean') + 0.8, db: -30},
  // 6 outro
  {f: fx('space_hum'), at: cue(6, 'Everything is falling') - 0.3, db: -30, until: END, keys: [[cue(6, 'Everything is falling'), -30], [END - 1, -30], [END, -50]]},
  pop(cue(6, 'You speed up')),
  pop(cue(6, 'A record can be')),
  pop(cue(6, 'A few square metres')),
  pop(cue(6, 'And if you move sideways')),
  {f: fx('chime'), at: cue(6, 'Everything is falling'), db: -23},
];
