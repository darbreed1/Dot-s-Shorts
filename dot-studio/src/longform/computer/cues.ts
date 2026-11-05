// Voice chapters + sound effects for "How a computer actually works". Files are trimmed to their onset, so `at` = the
// hit; whooshes are placed by their peak (whoosh 0.44 s).
import type {Cue} from '../../kit/audio';
import {END, SECTIONS} from './timeline';
import {cue, secEnd, secStart} from './parts';

const fx = (f: string) => `sfx/${f}.wav`;
const pop = (at: number, db = -26): Cue => ({f: fx('pop'), at, db});
const W = 0.44;
/** a click on every flick of a switch flicking every `period` s between t0 and t1 */
const clicks = (t0: number, t1: number, period: number, db = -23): Cue[] => {
  const out: Cue[] = [];
  for (let t = t0; t < t1; t += period) out.push({f: fx('switch_click'), at: t, db});
  return out;
};

export const CUES: Cue[] = [
  ...SECTIONS.map((s): Cue => ({f: `computer/vo/s${String(s.n).padStart(2, '0')}.wav`, at: s.at, db: 0})),
  {f: fx('computer_hum'), at: 0, db: -37, loop: true, until: END, keys: [[0, -37], [END - 1.5, -37], [END, -50]]},
  ...SECTIONS.slice(1).map((s): Cue => ({f: fx('whoosh'), at: s.at - 0.5 - W, db: -31})),
  // 1 only two things: the switch flicks from frame 0, then again on the answer
  ...clicks(secStart(1) - 1.2, cue(1, 'Every photo') - 0.15, 0.55),
  pop(cue(1, 'Every photo') + 0.2), pop(cue(1, 'Every photo') + 0.45), pop(cue(1, 'Every photo') + 0.7),
  {f: fx('zing'), at: cue(1, 'Inside the chip'), db: -27},
  {f: fx('ting'), at: cue(1, 'like a letter'), db: -24},
  {f: fx('chime'), at: cue(1, 'Each transistor is a switch'), db: -22},
  ...clicks(cue(1, 'Each transistor is a switch'), cue(1, 'on, or off') + 0.3, 0.45, -24),
  // 2 the number: switches pour from frame 0; Dot loses count; the pile buries him
  {f: fx('pour'), at: secStart(2) - 1.2, db: -29, loop: true, until: cue(2, 'Even an everyday') - 0.1},
  {f: fx('boing'), at: cue(2, 'A billion would'), db: -23},
  {f: fx('chime'), at: cue(2, 'thirty-four billion'), db: -22},
  {f: fx('pour'), at: cue(2, 'Counting those would') - 0.3, db: -26, until: secEnd(2) + 1},
  // 3 Grace Hopper's wire
  {f: fx('whoosh'), at: secStart(3) - 0.2 - W, db: -28},
  {f: fx('chime'), at: cue(3, 'a nanosecond'), db: -24},
  {f: fx('ting'), at: cue(3, 'the farthest light') + 0.1, db: -24},
  {f: fx('boing'), at: cue(3, 'She joked'), db: -24},
  {f: fx('scissors_snip'), at: cue(3, 'So cut her wire') + 0.5, db: -16},
  {f: fx('chime'), at: cue(3, 'In one tick') + 0.3, db: -22},
  // 4 waiting: a ticking wait, then the tricks
  {f: fx('ticking'), at: secStart(4) - 1.2, db: -27, until: cue(4, 'Here are the tricks')},
  pop(cue(4, 'caches')),
  pop(cue(4, 'And it guesses')),
  {f: fx('ting'), at: cue(4, 'A lot of what makes') + 0.3, db: -23},
  // 5 why it gets hot: the fan whirs from frame 0 and gets louder
  {f: fx('fan_whir'), at: secStart(5) - 1.2, db: -31, loop: true, until: secEnd(5) + 1.5,
    keys: [[secStart(5) - 1.2, -33], [cue(5, 'So the fan'), -29], [cue(5, 'When your fan spins up'), -25], [secEnd(5) + 1.5, -40]]},
  {f: fx('zing'), at: cue(5, 'add up'), db: -26},
  {f: fx('chime'), at: cue(5, 'the sound of arithmetic'), db: -22},
  // 6 none of it means anything
  pop(cue(6, 'When you open'), -27),
  {f: fx('boing'), at: cue(6, 'When you play') + 0.4, db: -25},
  ...clicks(cue(6, 'They just flip'), cue(6, 'So where does') - 0.15, 0.4, -24),
  {f: fx('chime'), at: cue(6, 'It only happens') + 0.3, db: -22},
];
