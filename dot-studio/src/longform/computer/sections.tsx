import React from 'react';
import {clamp01, easeInOutCubic, easeOutCubic, kick, lerp, progress, rand} from '../../kit/anim';
import type {Swap} from '../../kit/Dot';
import {ObjectFace} from '../../kit/effects/ObjectFace';
import {ThoughtCloud} from '../../kit/effects/ThoughtCloud';
import {Glint, Glow, SweatDrop} from '../../kit/effects/small';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {Zzz} from '../../kit/effects/Zzz';
import {fontFamily} from '../../kit/font';
import {Backdrop, Bit, BigSwitch, Bulb, Card, Cutout, DotRig, Finger, GOLD, Hand, Heat, INK, ON, Pile, RED, Tag, cue, flick, pop, secEnd, secStart} from './parts';
import {S} from './sprites';

// One component per voice section (stage px, 1080x1080 safe square). Each one is also a vertical Short on its own,
// so each opens already moving (frame 0 = its section start minus the 0.55 s lead) and closes its own question in
// its last few seconds. Shots switch on voice cues (cue(n, phrase)).

type P = {t: number};
const FLOOR = 860;

const Txt: React.FC<{x: number; y: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, size, color = INK, children}) => (
  <div style={{position: 'absolute', left: x - 500, top: y - size * 0.6, width: 1000, textAlign: 'center', fontFamily, fontSize: size, lineHeight: 1.1, color, whiteSpace: 'nowrap'}}>{children}</div>
);

// ================================================================================================ 1 only two things
// "A" in 8 bits (ASCII 65)
const A_BITS = [0, 1, 0, 0, 0, 0, 0, 1];
// a 12x12 smiley drawn with switches (1 = on)
const FACE = [
  '000111111000', '001000000100', '010000000010', '100110011001', '100110011001', '100000000001',
  '100000000001', '101000000101', '100111111001', '010000000010', '001000000100', '000111111000',
];

export const S1: React.FC<P> = ({t}) => {
  const t0 = secStart(1) - 1.2; // already flicking at frame 0
  const every = cue(1, 'Every photo');
  const inside = cue(1, 'Inside the chip');
  const each = cue(1, 'Each one holds');
  const eight = cue(1, 'Eight of them');
  const line = cue(1, 'Line up enough');
  const change = cue(1, 'Change them fast');
  const trick = cue(1, "So what's the trick");
  const isSwitch = cue(1, 'Each transistor is a switch');
  const onOff = cue(1, 'on, or off');
  if (t < every - 0.15 || t >= isSwitch - 0.15) {
    // the single switch: flicking, Dot unimpressed; at the payoff it is the answer
    const on = t < isSwitch ? flick(t, t0, 0.55) : t >= onOff + 0.25 ? false : flick(t, isSwitch, 0.45);
    const press = kick(t, t0 + Math.floor((t - t0) / 0.55) * 0.55, 1, 3, 9);
    const payoff = t >= isSwitch - 0.15;
    const swaps: Swap[] = payoff ? [{at: 0, pose: 'dot_aha'}] : [{at: 0, pose: 'dot_droop'}];
    return (
      <>
        <Backdrop color={on ? '#FBEFD2' : '#3A3F5C'} floor={FLOOR} floorColor={on ? '#D9C7A6' : '#2A2E44'} />
        <Bulb x={230} y={150} on={on} s={1.1} />
        <BigSwitch x={540} y={520} s={1.25} on={on} />
        <Finger x={556} y={on ? 470 : 575} press={Math.min(1, Math.abs(press))} s={0.9} />
        <DotRig t={t} swaps={swaps} x={860} y={FLOOR} headR={70} bounces={payoff ? [isSwitch] : []} />
        {payoff ? <Tag t={t} t0={isSwitch + 0.2} x={540} y={250} size={90} color={GOLD}>on / off</Tag> : null}
      </>
    );
  }
  if (t < inside - 0.15) {
    // pull back: the one switch is one of a row; a photo, a note and a game pad pop above
    const icons = ['photo', 'song', 'game'];
    return (
      <>
        <Backdrop color="#FBEFD2" floor={FLOOR} />
        <WorldSvg box={[-400, 0, 1480, 1080]}>
          {Array.from({length: 9}, (_, i) => (
            <g key={i} transform={`translate(${60 + i * 120} 560) scale(${pop(t, every - 0.1 + i * 0.05)})`}>
              <Bit x={0} y={0} size={92} on={flick(t, every + i * 0.13, 0.4 + 0.05 * i)} />
            </g>
          ))}
        </WorldSvg>
        {icons.map((ic, i) => (
          <Card key={ic} x={110 + i * 300} y={160} w={260} h={220} s={pop(t, every + 0.2 + i * 0.25)}>
            <WorldSvg box={[0, 0, 260, 220]}>
              {ic === 'photo' ? (
                <>
                  <rect x={40} y={40} width={180} height={130} fill="#9BD6FF" stroke={INK} strokeWidth={6} />
                  <path d="M40,170 L100,100 L140,140 L170,110 L220,170 Z" fill="#6CC56A" stroke={INK} strokeWidth={5} />
                  <circle cx={180} cy={70} r={14} fill={ON} stroke={INK} strokeWidth={4} />
                </>
              ) : ic === 'song' ? (
                <path d="M100,160 a26,20 0 1,1 0,-1 M126,158 L126,50 L190,36 L190,140 M190,142 a26,20 0 1,1 0,-1" fill={INK} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
              ) : (
                <>
                  <rect x={40} y={70} width={180} height={90} rx={40} fill="#C9CBD1" stroke={INK} strokeWidth={6} />
                  <path d="M80,100 v30 M65,115 h30" stroke={INK} strokeWidth={9} strokeLinecap="round" />
                  <circle cx={170} cy={105} r={9} fill={RED} /><circle cx={190} cy={125} r={9} fill="#5AA9E6" />
                </>
              )}
            </WorldSvg>
          </Card>
        ))}
        <Tag t={t} t0={cue(1, 'one tiny trick')} x={540} y={760} size={64} color={GOLD}>one tiny trick?</Tag>
      </>
    );
  }
  if (t < eight - 0.15) {
    // the chip, its lid crawling with tiny switches; "yes" / "no"
    const lid = S.chip.lid;
    const w = 640;
    const sc = w / S.chip.w;
    return (
      <>
        <Backdrop color="#DCEBF5" />
        <Cutout sp={S.chip} x={540} y={470} w={w} pop={pop(t, inside - 0.15)} rot={-3} />
        <WorldSvg box={[0, 0, 1080, 1080]}>
          {t > inside + 0.4
            ? Array.from({length: 120}, (_, i) => {
                const x = 540 + (lid[0] - S.chip.centre[0]) * sc + ((i % 12) - 5.5) * 30;
                const y = 470 + (lid[1] - S.chip.centre[1]) * sc + (Math.floor(i / 12) - 4.5) * 30;
                return <Bit key={i} x={x} y={y} size={20} on={rand(i + Math.floor(t * 6) * 131) > 0.5} />;
              })
            : null}
        </WorldSvg>
        <Tag t={t} t0={cue(1, 'transistors')} x={540} y={140} size={64}>transistors</Tag>
        <Tag t={t} t0={each + 0.4} x={300} y={800} size={70} color={GOLD}>yes</Tag>
        <Tag t={t} t0={each + 0.7} x={780} y={800} size={70} color="#FFFFFF">no</Tag>
      </>
    );
  }
  if (t < line - 0.15) {
    // 8 switches in a row cycle through patterns, then settle on "A" (01000001)
    const settle = t > cue(1, 'like a letter') - 0.1;
    const k = Math.floor((t - eight) * 6);
    const n = settle ? 65 : Math.floor(rand(k + 3) * 256);
    return (
      <>
        <Backdrop color="#FBEFD2" />
        <WorldSvg box={[0, 0, 1080, 1080]}>
          {Array.from({length: 8}, (_, i) => (
            <g key={i} transform={`translate(${120 + i * 120} 470) scale(${pop(t, eight - 0.1 + i * 0.04)})`}>
              <Bit x={0} y={0} size={100} on={settle ? A_BITS[i] === 1 : ((n >> (7 - i)) & 1) === 1} digit />
            </g>
          ))}
        </WorldSvg>
        <Tag t={t} t0={cue(1, 'two hundred and fifty-six')} x={540} y={250} size={110} color={GOLD}>256 patterns</Tag>
        {settle ? <Txt x={540} y={700} size={180} color={INK}>A</Txt> : null}
      </>
    );
  }
  // a face made of switches, which winks when "changed fast enough"
  const wink = t > change + 0.2 && Math.floor((t - change) * 3) % 2 === 0;
  return (
    <>
      <Backdrop color="#2C3150" />
      <WorldSvg box={[0, 0, 1080, 1080]}>
        {FACE.map((row, r) =>
          row.split('').map((c, k) => {
            const eye = (r === 3 || r === 4) && (k === 7 || k === 8);
            const lit = c === '1' && !(wink && eye);
            return <Bit key={`${r}-${k}`} x={232 + k * 56} y={80 + r * 56} size={48} on={lit && t > line + (r * 12 + k) * 0.006} />;
          }),
        )}
      </WorldSvg>
      <Tag t={t} t0={cue(1, 'or a face')} t1={trick - 0.05} x={540} y={790} size={70} color={GOLD}>a face</Tag>
      <Tag t={t} t0={trick - 0.05} x={540} y={790} size={80} color="#FFFFFF">so what's the trick?</Tag>
    </>
  );
};

// ================================================================================================ 2 the number
const fmt = (n: number) => Math.round(n).toLocaleString('en-GB');

export const S2: React.FC<P> = ({t}) => {
  const first = cue(2, 'That first chip');
  const count = cue(2, 'Say you tried');
  const hour = cue(2, 'under an hour');
  const billion = cue(2, 'A billion would');
  const laptop = cue(2, 'Even an everyday');
  const biggest = cue(2, 'And the biggest yet');
  const hundred = cue(2, 'thirty-four billion');
  const years = cue(2, 'Counting those would');
  // the pile pours from frame 0 and never stops; it grows much faster than Dot can count
  const pour = (t - (secStart(2) - 1.2)) * (t > billion ? 90 : 26);
  const counted = Math.max(0, Math.floor((t - count) * 1));
  if (t < laptop - 0.15) {
    const swaps: Swap[] = [{at: 0, pose: 'dot_aha'}, {at: count - 0.05, pose: 'dot_watch', style: 'squash'}, {at: billion, pose: 'dot_surprised', style: 'squash'}];
    return (
      <>
        <Backdrop color="#FBEFD2" floor={FLOOR} />
        {/* tiles falling into the pile */}
        <WorldSvg box={[0, -200, 700, FLOOR]}>
          {Array.from({length: 14}, (_, i) => {
            const u = ((t * 1.4 + i / 14) % 1);
            const x = 300 + (rand(i) - 0.5) * 120;
            return <rect key={i} x={x - 10} y={-150 + u * (FLOOR - 120)} width={20} height={16} rx={3} fill={rand(i + 2) > 0.5 ? ON : '#4A5068'} stroke={INK} strokeWidth={3}
              transform={`rotate(${u * 300 + i * 40} ${x} ${-150 + u * (FLOOR - 120)})`} />;
          })}
        </WorldSvg>
        <Pile x={300} y={FLOOR - 6} n={pour} />
        <DotRig t={t} swaps={swaps} x={800} y={FLOOR} headR={70} />
        {t < first - 0.1 ? <Tag t={t} t0={secStart(2) - 0.55} x={540} y={150} size={110} color={GOLD}>2,300</Tag> : null}
        {t >= first - 0.1 && t < count - 0.1 ? (
          <>
            <Cutout sp={S.chip} x={540} y={250} w={220} pop={pop(t, first - 0.1)} />
            <Tag t={t} t0={first + 0.3} x={540} y={420} size={58}>Intel 4004 · 1971</Tag>
          </>
        ) : null}
        {t >= count - 0.1 ? (
          <>
            <Tag t={t} t0={count} x={540} y={130} size={70}>{`counting: ${fmt(counted)}`}</Tag>
            <Tag t={t} t0={hour - 0.1} t1={billion - 0.1} x={540} y={250} size={64} color={GOLD}>2,300 → under an hour</Tag>
            <Tag t={t} t0={billion} x={540} y={250} size={64} color={GOLD}>1 billion → 30+ years</Tag>
          </>
        ) : null}
        {t > billion ? <SweatDrop t={t} t0={billion + 0.3} t1={laptop} x={850} y={560} r={16} slide={30} /> : null}
      </>
    );
  }
  if (t < biggest - 0.15) {
    return (
      <>
        <Backdrop color="#DCEBF5" floor={FLOOR} />
        <Cutout sp={S.laptop} x={540} y={560} w={620} pop={pop(t, laptop - 0.1)} />
        <Tag t={t} t0={cue(2, 'has billions')} x={540} y={180} size={96} color={GOLD}>billions</Tag>
      </>
    );
  }
  // the payoff: the number, and the pile buries Dot up to his hat
  const big = pop(t, hundred - 0.2);
  const bury = easeInOutCubic(progress(t, years - 0.3, years + 2));
  return (
    <>
      <Backdrop color="#2C3150" floor={FLOOR} floorColor="#232740" />
      <WorldSvg box={[-500, 0, 1580, 1100]}>
        <path d={`M-500,${FLOOR} Q540,${lerp(FLOOR, 380, bury)} 1580,${FLOOR} Z`} fill={ON} stroke={INK} strokeWidth={8} />
        {Array.from({length: 160}, (_, i) => {
          const x = -460 + rand(i + 1) * 2000;
          const h = lerp(FLOOR, 380, bury) + Math.abs(x - 540) * 0.45 * bury;
          const y = Math.max(h, FLOOR - (FLOOR - h) * rand(i + 4));
          return <rect key={i} x={x} y={y} width={22} height={16} rx={3} fill={rand(i + 7) > 0.5 ? ON : '#4A5068'} stroke={INK} strokeWidth={3} opacity={y < FLOOR ? 1 : 0} />;
        })}
      </WorldSvg>
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_surprised'}]} x={800} y={FLOOR + 380 * bury} headR={70} shadow={false} />
      <Cutout sp={S.chip} x={300} y={330} w={300} pop={pop(t, biggest - 0.1)} />
      <Tag t={t} t0={cue(2, 'M2 Ultra')} x={300} y={520} size={52}>Apple M2 Ultra · 2023</Tag>
      {big > 0 ? <Tag t={t} t0={hundred - 0.2} x={540} y={130} size={92} color={GOLD}>134,000,000,000</Tag> : null}
      <Tag t={t} t0={cue(2, 'fifty-eight million')} x={760} y={300} size={64}>× 58 million</Tag>
      <Tag t={t} t0={years + 0.4} x={540} y={720} size={90} color="#FFFFFF">4,000+ years to count</Tag>
    </>
  );
};

// ================================================================================================ 3 Grace Hopper's wire
const NAVY = '#1F2A56';
/** A straight wire from (x0, y) to (x1, y) with stripped copper ends. */
const Wire: React.FC<{x0: number; x1: number; y: number; w?: number}> = ({x0, x1, y, w = 14}) => (
  <WorldSvg box={[Math.min(x0, x1) - 30, y - 30, Math.max(x0, x1) + 30, y + 30]}>
    <line x1={x0} y1={y} x2={x1} y2={y} stroke={INK} strokeWidth={w + 8} strokeLinecap="round" />
    <line x1={x0} y1={y} x2={x1} y2={y} stroke="#3B7DD8" strokeWidth={w} strokeLinecap="round" />
    <line x1={x0} y1={y} x2={x0 + 18} y2={y} stroke="#D98E4A" strokeWidth={w * 0.6} strokeLinecap="round" />
    <line x1={x1 - 18} y1={y} x2={x1} y2={y} stroke="#D98E4A" strokeWidth={w * 0.6} strokeLinecap="round" />
  </WorldSvg>
);

export const S3: React.FC<P> = ({t}) => {
  const hopper = cue(3, 'Hopper was');
  const talks = cue(3, 'At her talks');
  const light = cue(3, 'the farthest light');
  const micro = cue(3, 'A microsecond');
  const neck = cue(3, 'She joked');
  const ghz = cue(3, 'Now, a processor');
  const cut = cue(3, 'So cut her wire');
  const tick = cue(3, 'In one tick');
  const hand = cue(3, 'Roughly the width');
  if (t < hopper - 0.15) {
    // a wire unspools across a navy card from frame 0
    const len = lerp(0, 800, easeOutCubic(progress(t, secStart(3) - 0.9, secStart(3) + 1.2)));
    return (
      <>
        <Backdrop color={NAVY} />
        <Wire x0={140} x1={140 + len} y={520} />
        <Tag t={t} t0={cue(3, 'a nanosecond')} x={540} y={300} size={96} color={GOLD}>a nanosecond</Tag>
        <Tag t={t} t0={cue(3, 'in her pocket') + 0.1} x={540} y={720} size={60}>in her pocket?</Tag>
      </>
    );
  }
  if (t < micro - 0.15) {
    // the name card (no likeness), then Dot holding up the 30 cm wire with a light pulse racing along it
    const pulse = t > light ? ((t - light) * 1.4) % 1 : -1;
    return (
      <>
        <Backdrop color="#FBEFD2" floor={FLOOR} />
        <Card x={190} y={90} w={700} h={190} s={pop(t, hopper - 0.15)}>
          <Txt x={350} y={70} size={64}>Grace Hopper</Txt>
          <Txt x={350} y={140} size={40} color="#5B6178">computer pioneer · US Navy admiral</Txt>
        </Card>
        {t > talks - 0.2 ? (
          <>
            <Wire x0={120} x1={680} y={440} />
            <WorldSvg box={[60, 360, 740, 520]}>
              <line x1={120} y1={490} x2={680} y2={490} stroke={INK} strokeWidth={4} strokeDasharray="10 8" />
              {pulse >= 0 ? <circle cx={120 + 560 * pulse} cy={440} r={22} fill="#FFFFFF" stroke={ON} strokeWidth={8} /> : null}
            </WorldSvg>
            <Tag t={t} t0={cue(3, 'thirty centimetres')} x={400} y={560} size={60} color={GOLD}>30 cm = 1 nanosecond</Tag>
            <DotRig t={t} swaps={[{at: 0, pose: 'dot_snip'}]} x={870} y={FLOOR} headR={66} />
          </>
        ) : null}
        {pulse >= 0 ? <Tag t={t} t0={light + 0.2} x={400} y={350} size={50} color="#5B6178">as far as light gets</Tag> : null}
      </>
    );
  }
  if (t < ghz - 0.15) {
    // a microsecond: a coil 1,000 times longer, hung round Dot's neck
    const neckOn = t > neck;
    return (
      <>
        <Backdrop color="#FBEFD2" floor={FLOOR} />
        <WorldSvg box={[0, 0, 1080, 1080]}>
          {Array.from({length: 16}, (_, i) => (
            <ellipse key={i} cx={neckOn ? 560 : 600} cy={(neckOn ? 630 : 430) + i * 4} rx={neckOn ? 120 : 290 - i * 2} ry={neckOn ? 36 : 170 - i * 3} fill="none" stroke={i % 2 ? '#2E66B8' : '#3B7DD8'} strokeWidth={9} />
          ))}
        </WorldSvg>
        {neckOn ? <DotRig t={t} swaps={[{at: 0, pose: 'dot_droop'}]} x={560} y={FLOOR} headR={70} /> : null}
        {neckOn ? (
          // the front half of each loop passes in front of Dot, so the coil reads as hung round his neck
          <WorldSvg box={[0, 0, 1080, 1080]}>
            {Array.from({length: 16}, (_, i) => (
              <path key={i} d={`M ${440} ${630 + i * 4} A 120 36 0 0 0 ${680} ${630 + i * 4}`} fill="none" stroke={i % 2 ? '#2E66B8' : '#3B7DD8'} strokeWidth={9} />
            ))}
          </WorldSvg>
        ) : null}
        <Tag t={t} t0={micro} x={540} y={130} size={80} color={GOLD}>1 microsecond = 300 m</Tag>
      </>
    );
  }
  // 3 GHz: one tick is a third of her wire; Dot snips it and stares at the stub next to a hand
  const snipped = t > cut + 0.5;
  const fall = easeOutCubic(progress(t, cut + 0.5, cut + 1.4));
  const stubX0 = 260;
  const third = 560 / 3;
  return (
    <>
      <Backdrop color="#FBEFD2" floor={FLOOR} />
      <Tag t={t} t0={ghz} x={540} y={120} size={64} color={GOLD}>3 GHz: one step = ⅓ nanosecond</Tag>
      <Wire x0={stubX0} x1={stubX0 + third - 6} y={420} />
      {snipped ? (
        <>
          <div style={{position: 'absolute', inset: 0, transform: `translate(${30 * fall}px, ${380 * fall}px) rotate(${14 * fall}deg)`, transformOrigin: '640px 420px'}}>
            <Wire x0={stubX0 + third + 6} x1={stubX0 + 2 * third - 6} y={420} />
          </div>
          <div style={{position: 'absolute', inset: 0, transform: `translate(${60 * fall}px, ${400 * fall}px) rotate(${-10 * fall}deg)`, transformOrigin: '730px 420px'}}>
            <Wire x0={stubX0 + 2 * third + 6} x1={stubX0 + 3 * third} y={420} />
          </div>
        </>
      ) : (
        <Wire x0={stubX0 + third + 6} x1={stubX0 + 3 * third} y={420} />
      )}
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_snip'}, {at: tick, pose: 'dot_surprised', style: 'squash'}]} x={760} y={FLOOR} headR={66} bounces={[cut + 0.5]} />
      {t > hand - 0.2 ? <Hand x={stubX0 + third / 2} y={640} w={190} /> : null}
      <Tag t={t} t0={tick + 0.3} x={350} y={330} size={70} color={GOLD}>~10 cm</Tag>
      <Glint t={t} t0={cut + 0.5} x={stubX0 + third} y={420} r={40} />
    </>
  );
};

// ================================================================================================ 4 waiting
export const S4: React.FC<P> = ({t}) => {
  const step = cue(4, 'A processor can finish');
  const stored = cue(4, 'The information it needs');
  const waits = cue(4, 'So it waits');
  const tricks = cue(4, 'Here are the tricks');
  const caches = cue(4, 'caches');
  const guess = cue(4, 'And it guesses');
  const fast = cue(4, 'A lot of what makes');
  const chipX = 300;
  const chipY = 470;
  const cacheOn = t > caches - 0.2;
  // data packets: before the tricks one crawls slowly from far memory; after, they zip in from the cache
  const slow = ((t - stored) / 5) % 1;
  const zip = ((t - caches) * 1.6) % 1;
  const bored = t < tricks;
  const tap = Math.sin(2 * Math.PI * 3 * t) > 0;
  const face = bored
    ? {open: t > waits ? 0.45 : 0.75, brow: 'flat' as const, mouth: 'flat' as const, look: {x: 1, y: 0}}
    : {open: 1, brow: 'raised' as const, mouth: 'smile' as const, look: {x: 1, y: 0}};
  return (
    <>
      <Backdrop color="#DCEBF5" />
      {/* the long road to memory */}
      <WorldSvg box={[-400, 300, 1500, 700]}>
        <path d={`M${chipX + 150},${chipY} L1460,${chipY}`} stroke="#9AA3B8" strokeWidth={26} strokeLinecap="round" strokeDasharray="2 34" />
      </WorldSvg>
      <Cutout sp={S.ram_stick} x={1240} y={chipY} w={430} pop={pop(t, stored - 0.2)} />
      <Tag t={t} t0={cue(4, 'in memory')} x={1240} y={chipY + 140} size={52}>memory</Tag>
      <Cutout sp={S.chip} x={chipX} y={chipY} w={300} rot={bored && tap ? 1.5 : 0} />
      <ObjectFace id="chip4" x={chipX} y={chipY - 10} r={110} open={face.open} brow={bored ? 'none' : 'raised'} mouth={face.mouth} look={face.look} ink={6} />
      {t > waits && t < tricks ? <Zzz t={t} x={chipX + 80} y={chipY - 140} t0={waits} t1={tricks} size={46} dir={0.4} /> : null}
      {t > step && t < step + 0.6 ? <Glint t={t} t0={step} x={chipX + 120} y={chipY - 120} r={44} /> : null}
      {t > stored && !cacheOn ? (
        <WorldSvg box={[chipX, chipY - 60, 1300, chipY + 60]}>
          <rect x={lerp(1180, chipX + 160, slow) - 22} y={chipY - 22} width={44} height={44} rx={8} fill={ON} stroke={INK} strokeWidth={5} />
        </WorldSvg>
      ) : null}
      {cacheOn ? (
        <>
          <WorldSvg box={[chipX + 120, chipY - 200, chipX + 420, chipY + 60]}>
            <rect x={chipX + 180} y={chipY - 170} width={180} height={120} rx={16} fill="#FFFDF6" stroke={INK} strokeWidth={7}
              transform={`translate(${chipX + 270} ${chipY - 110}) scale(${pop(t, caches - 0.2)}) translate(${-(chipX + 270)} ${-(chipY - 110)})`} />
            <rect x={lerp(chipX + 250, chipX + 150, zip) - 16} y={chipY - 16 - 70 * (1 - zip)} width={32} height={32} rx={6} fill={ON} stroke={INK} strokeWidth={4} />
          </WorldSvg>
          <Tag t={t} t0={caches} x={chipX + 270} y={chipY - 230} size={50} color={GOLD}>cache</Tag>
        </>
      ) : null}
      <ThoughtCloud t={t} t0={guess} t1={fast} x={chipX + 40} y={190} w={220} h={150} from={{x: chipX + 20, y: chipY - 130}} ink={6}>
        <rect x={-22} y={-22} width={44} height={44} rx={8} fill={ON} stroke={INK} strokeWidth={5} />
      </ThoughtCloud>
      <Tag t={t} t0={cue(4, 'doing nothing')} t1={step} x={540} y={140} size={72} color={GOLD}>doing nothing?</Tag>
      <Tag t={t} t0={waits + 0.2} t1={tricks} x={540} y={140} size={80}>waiting...</Tag>
      <Tag t={t} t0={fast + 0.3} x={600} y={760} size={74} color={GOLD}>fast = waiting less</Tag>
    </>
  );
};

// ================================================================================================ 5 why it gets hot
const Blades: React.FC<{x: number; y: number; r: number; angle: number}> = ({x, y, r, angle}) => (
  <WorldSvg box={[x - r - 10, y - r - 10, x + r + 10, y + r + 10]}>
    <circle cx={x} cy={y} r={r} fill="#2A2D35" stroke={INK} strokeWidth={6} />
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {Array.from({length: 7}, (_, i) => (
        <path key={i} transform={`rotate(${(i * 360) / 7})`} d={`M${r * 0.2},${-r * 0.08} Q${r * 0.7},${-r * 0.5} ${r * 0.92},${-r * 0.18} Q${r * 0.6},${r * 0.05} ${r * 0.2},${r * 0.1} Z`}
          fill="#3E424C" stroke={INK} strokeWidth={4} />
      ))}
      <circle r={r * 0.24} fill="#22252C" stroke={INK} strokeWidth={5} />
    </g>
  </WorldSvg>
);

export const S5: React.FC<P> = ({t}) => {
  const heat = cue(5, 'The heat comes');
  const inside = cue(5, 'Inside the chip');
  const each = cue(5, 'Each flip takes');
  const add = cue(5, 'add up');
  const stored = cue(5, "And that electricity doesn't");
  const fan = cue(5, 'So the fan');
  const sound = cue(5, 'When your fan spins up');
  // the fan spins from frame 0, faster as the chip heats up
  const spin = (t - (secStart(5) - 1)) * 360 * (t > sound ? 4 : t > fan ? 2.6 : 1.4);
  if (t < inside - 0.15) {
    // Dot warming his hands over a hot laptop
    return (
      <>
        <Backdrop color="#FBEFD2" floor={FLOOR} />
        <Cutout sp={S.cooler} x={180} y={330} w={230} />
        <Blades x={180 + (S.cooler.fan[0] - S.cooler.centre[0]) * (230 / S.cooler.w)} y={330 + (S.cooler.fan[1] - S.cooler.centre[1]) * (230 / S.cooler.w)} r={S.cooler.fan[2] * (230 / S.cooler.w) * 0.92} angle={spin} />
        <Cutout sp={S.laptop} x={480} y={FLOOR - 140} w={420} />
        <Heat t={t} x0={340} x1={620} y={FLOOR - 230} strength={0.6} />
        <DotRig t={t} swaps={[{at: 0, pose: 'dot_warm'}]} x={790} y={FLOOR} headR={70} />
        <Tag t={t} t0={heat} x={540} y={130} size={64} color={GOLD}>where's the heat from?</Tag>
      </>
    );
  }
  if (t < fan - 0.15) {
    // inside the chip: switches flicking, a spark per flip, the chip warming up
    const warm = clamp01((t - add) / 2.5) * 0.7 + (t > stored ? 0.3 * clamp01((t - stored) / 1) : 0);
    const sparks = t > each ? (t > add ? 40 : 4) : 0;
    return (
      <>
        <Backdrop color="#2C3150" />
        <Glow t={t} t0={add} t1={fan + 1} x={540} y={470} r={480} color="255, 110, 50" strength={0.55 * warm} />
        <Cutout sp={S.chip} x={540} y={470} w={620} />
        <WorldSvg box={[0, 0, 1080, 1080]}>
          {Array.from({length: 100}, (_, i) => (
            <Bit key={i} x={540 + ((i % 10) - 4.5) * 36 - 10} y={440 + (Math.floor(i / 10) - 4.5) * 34} size={24} on={rand(i + Math.floor(t * 10) * 97) > 0.5} />
          ))}
          {Array.from({length: sparks}, (_, i) => {
            const u = ((t * 2 + rand(i) * 3) % 1);
            const x = 540 + (rand(i + 11) - 0.5) * 520;
            const y = 470 + (rand(i + 13) - 0.5) * 440 - u * 60;
            return <path key={`s${i}`} d={`M${x},${y - 18} l-8,14 h12 l-8,16`} fill="none" stroke={ON} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={1 - u} />;
          })}
        </WorldSvg>
        <Heat t={t} x0={260} x1={820} y={180} strength={warm} />
        <Tag t={t} t0={each + 0.2} t1={add} x={540} y={95} size={60}>each flip: a tiny bit of energy</Tag>
        <Tag t={t} t0={cue(5, 'Almost all of it')} x={540} y={95} size={74} color={GOLD}>→ almost all heat</Tag>
      </>
    );
  }
  // the cooler carries it away; the fan spins up and blows out arithmetic
  const blow = t > sound;
  const fr = S.cooler.fan;
  const cw = 420;
  const cs = cw / S.cooler.w;
  const fx = 420 + (fr[0] - S.cooler.centre[0]) * cs;
  const fy = 470 + (fr[1] - S.cooler.centre[1]) * cs;
  return (
    <>
      <Backdrop color="#FBEFD2" />
      <Cutout sp={S.cooler} x={420} y={470} w={cw} />
      <Blades x={fx} y={fy} r={fr[2] * cs * 0.92} angle={spin} />
      <Heat t={t} x0={300} x1={540} y={830} strength={0.5} color="#FF6A2B" />
      <WorldSvg box={[500, 100, 1500, 900]}>
        {Array.from({length: 8}, (_, i) => {
          const u = ((t * (blow ? 1.4 : 0.9) + i / 8) % 1);
          const x = fx + 150 + u * 700;
          const y = fy + (rand(i) - 0.5) * 300 + 20 * Math.sin(u * 8 + i);
          return blow ? (
            <text key={i} x={x} y={y} fontFamily={fontFamily} fontSize={110} fill={['#FFFFFF', ON, '#FF8A3D', '#9BD6FF'][i % 4]} stroke={INK} strokeWidth={9} paintOrder="stroke" opacity={Math.min(1, 1.6 * (1 - u))}>
              {['+', '−', '×', '÷', '=', '1', '0', '+'][i]}
            </text>
          ) : (
            <path key={i} d={`M${x},${y} q30,-14 60,0 t60,0`} fill="none" stroke="#9BD6FF" strokeWidth={8} strokeLinecap="round" opacity={1 - u} />
          );
        })}
      </WorldSvg>
      <Tag t={t} t0={cue(5, 'the metal fins')} t1={sound} x={760} y={180} size={56}>fins + pipes + fan</Tag>
      <Tag t={t} t0={cue(5, 'the sound of arithmetic') - 0.1} x={760} y={180} size={70} color={GOLD}>the sound of arithmetic</Tag>
    </>
  );
};

// ================================================================================================ 6 none of it means anything
export const S6: React.FC<P> = ({t}) => {
  const all = cue(6, 'All it does');
  const open = cue(6, 'When you open');
  const song = cue(6, 'When you play');
  const know = cue(6, "The switches don't know");
  const flipC = cue(6, 'They just flip');
  const where = cue(6, 'So where does');
  const reaches = cue(6, 'It only happens');
  if (t < song - 0.15) {
    // a photo of Dot breaking into numbered dots (in motion from frame 0)
    const melt = easeInOutCubic(progress(t, secStart(6) - 0.6, open + 1.2));
    const n = 10;
    return (
      <>
        <Backdrop color="#2C3150" />
        <Card x={240} y={120} w={600} h={600}>
          <div style={{position: 'absolute', inset: 0, background: '#9BD6FF', opacity: 1 - melt}} />
          <div style={{position: 'absolute', left: 300, top: 600, opacity: 1 - melt}}>
            <DotRig t={0} swaps={[{at: 0, pose: 'dot_lookup'}]} x={0} y={0} headR={150} shadow={false} />
          </div>
          <WorldSvg box={[0, 0, 600, 600]}>
            {Array.from({length: n * n}, (_, i) => {
              const r = Math.floor(i / n);
              const c = i % n;
              const v = Math.round(255 * (0.25 + 0.7 * rand(i * 7 + 3)));
              const on = melt > (r * n + c) / (n * n) * 0.8;
              return on ? (
                <g key={i}>
                  <rect x={c * 60 + 3} y={r * 60 + 3} width={54} height={54} rx={6} fill={`rgb(${v},${v},${Math.min(255, v + 30)})`} stroke={INK} strokeWidth={3} />
                  <text x={c * 60 + 30} y={r * 60 + 38} textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize={20} fill={v > 140 ? INK : '#FFFFFF'}>{v}</text>
                </g>
              ) : null;
            })}
          </WorldSvg>
        </Card>
        <Tag t={t} t0={cue(6, 'never seen')} t1={all} x={540} y={820} size={60} color={GOLD}>never seen a photo?</Tag>
        <Tag t={t} t0={all} t1={open} x={540} y={820} size={60}>just on and off</Tag>
        <Tag t={t} t0={cue(6, 'how bright')} x={540} y={820} size={60} color={GOLD}>numbers: how bright each dot is</Tag>
      </>
    );
  }
  if (t < flipC - 0.15) {
    const k = clamp01((t - song) / 0.3);
    return (
      <>
        <Backdrop color="#FBEFD2" />
        <Cutout sp={S.speaker} x={760} y={460} w={300} pop={pop(t, song - 0.15)} rot={kick(t, song + 0.4, 1.2, 4, 6)} />
        <WorldSvg box={[0, 200, 760, 700]}>
          {Array.from({length: 7}, (_, i) => {
            const u = ((t * 0.9 + i / 7) % 1);
            return (
              <text key={i} x={80 + u * 520} y={460 + 30 * Math.sin(i * 2 + u * 6)} fontFamily="Arial Black, Arial, sans-serif" fontSize={42} fill={INK} opacity={k * Math.sin(Math.PI * u)}>
                {Math.floor(rand(i + Math.floor(t * 2)) * 255)}
              </text>
            );
          })}
        </WorldSvg>
        {t > know - 0.15 ? (
          <>
            {['face', 'song', 'joke'].map((w, i) => (
              <Tag key={w} t={t} t0={cue(6, w) - 0.05} x={220 + i * 320} y={170} size={70}>{`${w}?`}</Tag>
            ))}
            <Cutout sp={S.chip} x={300} y={600} w={300} pop={pop(t, know - 0.15)} />
          </>
        ) : null}
      </>
    );
  }
  // "They just flip": the single switch from beat 1; then Dot at the screen, where the meaning is
  const back = t >= where - 0.15;
  const on = flick(t, flipC, 0.4);
  return back ? (
    <>
      <Backdrop color="#FBEFD2" floor={FLOOR} />
      <Cutout sp={S.laptop} x={360} y={FLOOR - 150} w={460} />
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <WorldSvg box={[0, 0, 1080, 1080]}>
          {/* the photo comes back on the screen */}
          <rect x={360 + (S.laptop.screen[0] - S.laptop.centre[0]) * (460 / S.laptop.w) + 10} y={FLOOR - 150 + (S.laptop.screen[1] - S.laptop.centre[1]) * (460 / S.laptop.w) + 10}
            width={(S.laptop.screen[2] - S.laptop.screen[0]) * (460 / S.laptop.w) - 20} height={(S.laptop.screen[3] - S.laptop.screen[1]) * (460 / S.laptop.w) - 20} fill="#9BD6FF" />
        </WorldSvg>
      </div>
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_lookup'}, {at: reaches + 0.3, pose: 'dot_aha', style: 'squash'}]} x={780} y={FLOOR} headR={72} />
      <Tag t={t} t0={reaches + 0.4} x={560} y={160} size={72} color={GOLD}>the meaning is on your side</Tag>
      <Glow t={t} t0={reaches + 0.3} t1={secEnd(6) + 3} x={780 - 40} y={FLOOR - 470} r={90} color="255, 90, 70" strength={0.7} />
    </>
  ) : (
    <>
      <Backdrop color={on ? '#FBEFD2' : '#3A3F5C'} floor={FLOOR} floorColor={on ? '#D9C7A6' : '#2A2E44'} />
      <Bulb x={230} y={150} on={on} s={1.1} />
      <BigSwitch x={540} y={520} s={1.25} on={on} />
      <Finger x={556} y={on ? 470 : 575} press={1} s={0.9} />
    </>
  );
};

export const PARTS = [S1, S2, S3, S4, S5, S6];
