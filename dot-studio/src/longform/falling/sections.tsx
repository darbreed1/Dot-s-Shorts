import React from 'react';
import {clamp01, easeInOutCubic, easeOutCubic, lerp, popScale, progress, rand, wobble} from '../../kit/anim';
import type {Swap} from '../../kit/Dot';
import {Earth} from '../../kit/effects/Space';
import {Pictogram} from '../../kit/effects/Pictogram';
import {DrawnCircle, Glint} from '../../kit/effects/small';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {fontFamily} from '../../kit/font';
import {Arrow, BLUE, BigEarth, Canopy, Card, Cutout, DotRig, GOLD, Gauge, INK, Paper, RED, Sky, Space, Streaks, Tag, cue, pop, secEnd, secStart} from './parts';
import {useBleedBox} from '../../kit/Stage';
import {S} from './sprites';

// One component per voice section (stage px, 1080x1080 safe square). Each picks its shot from the voice cues of that
// section (cue(n, phrase)), so every visual sits on its words. Sections 2-5 are the four chapters that also render
// on their own as vertical Shorts (FallingChapter).

type P = {t: number};
const FLOOR = 840;

const Txt: React.FC<{x: number; y: number; size: number; color?: string; children: React.ReactNode}> = ({x, y, size, color = INK, children}) => (
  <div style={{position: 'absolute', left: x - 500, top: y - size * 0.6, width: 1000, textAlign: 'center', fontFamily, fontSize: size, lineHeight: 1.1, color, whiteSpace: 'nowrap'}}>{children}</div>
);

// ================================================================================================ the four "promise" cards
/** The 2x2 cards shared by the intro and the outro: speed limit, doubtful record, fabric, the falling station. */
const Promise: React.FC<{t: number; at: readonly number[]}> = ({t, at}) => {
  const cards = [
    {x: 40, y: 40, label: 'a speed limit'},
    {x: 560, y: 40, label: 'a doubtful record'},
    {x: 40, y: 440, label: 'a soft landing'},
    {x: 560, y: 440, label: 'always falling'},
  ];
  return (
    <>
      {cards.map((c, i) => {
        const s = pop(t, at[i]);
        return (
          <Card key={i} x={c.x} y={c.y} w={480} h={370} s={s}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 480, height: 370}}>
              {i === 0 ? <Gauge x={240} y={230} r={150} kmh={Math.min(200, 200 * clamp01((t - at[0]) / 1.2)) + 3 * Math.sin(t * 9)} band={[190, 210]} /> : null}
              {i === 1 ? (
                <>
                  <WorldSvg box={[0, 0, 480, 370]}>
                    <rect x={110} y={50} width={260} height={200} rx={10} fill="#FFF1C9" stroke={INK} strokeWidth={6} />
                    <circle cx={330} cy={225} r={34} fill={GOLD} stroke={INK} strokeWidth={6} />
                    {[90, 120, 150].map((y) => <line key={y} x1={140} y1={y} x2={340} y2={y} stroke="#B8A882" strokeWidth={8} strokeLinecap="round" />)}
                  </WorldSvg>
                  <Txt x={240} y={175} size={120} color={RED}>?</Txt>
                </>
              ) : null}
              {i === 2 ? <Canopy x={240} y={120} w={300} fill={clamp01((t - at[2]) / 0.6)} lines={{x: 240, y: 250}} /> : null}
              {i === 3 ? (
                <>
                  <Earth x={240} y={180} r={90} />
                  <WorldSvg box={[0, 0, 480, 370]}>
                    <ellipse cx={240} cy={180} rx={170} ry={120} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeDasharray="10 10" opacity={0.0} />
                    <circle cx={240} cy={180} r={140} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="12 10" />
                  </WorldSvg>
                  <Cutout sp={S.station} x={240 + 140 * Math.cos(t * 1.2)} y={180 + 140 * Math.sin(t * 1.2)} w={70} rot={90} />
                </>
              ) : null}
              <Txt x={240} y={320} size={44}>{c.label}</Txt>
            </div>
          </Card>
        );
      })}
    </>
  );
};

// ================================================================================================ 1 Everything falls
export const S1: React.FC<P> = ({t}) => {
  const bleed = useBleedBox();
  const rain = cue(1, 'Raindrops');
  const sky = cue(1, 'skydivers');
  const iss = cue(1, 'International Space Station');
  const letGo = cue(1, 'You let go');
  const down = cue(1, 'you go down');
  const speed = cue(1, "There's a speed");
  const record = cue(1, 'famous record');
  const fabric = cue(1, 'piece of fabric');
  const station = cue(1, "space station that's");
  const find = cue(1, "So let's find out");
  if (t < speed - 0.2) {
    const planeX = lerp(-500, 1600, progress(t, sky - 0.6, sky + 4));
    const jumpAt = sky + 0.9;
    const fallU = clamp01((t - jumpAt) / 2.6);
    const ballY = t < letGo ? 520 : Math.min(FLOOR - 30, 520 + 0.5 * 1800 * Math.pow(t - letGo, 2));
    const bounce = t > down ? -Math.abs(Math.sin(2 * Math.PI * 1.2 * (t - down))) * 60 * Math.exp(-2 * (t - down)) : 0;
    const spaceU = easeInOutCubic(progress(t, iss - 0.4, iss + 0.8));
    return (
      <>
        <Sky t={t} space={0.85 * spaceU} ground={FLOOR} />
        {/* rain */}
        <WorldSvg box={bleed}>
          {t > rain - 0.2
            ? Array.from({length: 40}, (_, i) => {
                const x = -600 + rand(i + 3) * 2280;
                const y = -200 + ((t * 900 + rand(i) * 1100) % 1100);
                return y < FLOOR ? <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 34} stroke={BLUE} strokeWidth={6} strokeLinecap="round" opacity={0.8} /> : null;
              })
            : null}
        </WorldSvg>
        {t > iss - 0.4 ? <Cutout sp={S.station} x={lerp(-200, 1300, progress(t, iss - 0.4, iss + 6))} y={140} w={220} rot={90} /> : null}
        {t > sky - 0.6 && t < sky + 4.2 ? <Cutout sp={S.plane} x={planeX} y={300} w={420} /> : null}
        {t > jumpAt && fallU < 1 ? <Cutout sp={S.dot_freefall} x={lerp(planeX - 60, 980, fallU)} y={330 + 700 * fallU * fallU} w={240} rot={-8} /> : null}
        <DotRig t={t} swaps={[{at: 0, pose: 'dot_lookup'}, {at: letGo - 0.05, pose: 'dot_aha', style: 'squash'}]} x={250} y={FLOOR} headR={70} />
        {t > letGo - 0.4 ? (
          <WorldSvg box={[300, 400, 520, 900]}>
            <circle cx={400} cy={ballY + bounce} r={30} fill={RED} stroke={INK} strokeWidth={7} />
            <circle cx={390} cy={ballY + bounce - 10} r={8} fill="#FFFFFF" opacity={0.7} />
          </WorldSvg>
        ) : null}
        <Tag t={t} t0={cue(1, 'Everything falls') - 0.05} t1={rain + 1.2} x={540} y={150} size={92}>Everything falls.</Tag>
      </>
    );
  }
  if (t < find - 0.2) {
    return (
      <>
        <Paper />
        <Promise t={t} at={[speed, record, fabric, station]} />
      </>
    );
  }
  return (
    <>
      <Sky t={t} rise={60} ground={FLOOR} />
      <Tag t={t} t0={find} x={540} y={250} size={96}>What actually happens</Tag>
      <Tag t={t} t0={find + 0.4} x={540} y={370} size={110} color={GOLD}>when you fall</Tag>
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_aha'}]} x={540} y={FLOOR} headR={78} bounces={[find + 0.4]} />
    </>
  );
};

// ================================================================================================ 2 How fast do you fall?
const VT = 200; // belly-down terminal speed, km/h
const vAt = (tau: number) => VT * Math.tanh((9.81 * 3.6 * tau) / VT); // speed after tau seconds of falling (shape)

const SpeedGraph: React.FC<{t: number; t0: number; tEnd: number; terminal: number; twelve: number; marks: boolean}> = ({t, t0, tEnd, terminal, twelve, marks}) => {
  const X0 = 120;
  const X1 = 940;
  const Y0 = 760;
  const Y1 = 160;
  const xOf = (s: number) => X0 + (s / 30) * (X1 - X0);
  const yOf = (v: number) => Y0 - (v / 240) * (Y0 - Y1);
  const shown = lerp(0, 30, easeInOutCubic(progress(t, t0, tEnd)));
  const pts = Array.from({length: 61}, (_, i) => (i / 60) * shown).map((s) => `${xOf(s)},${yOf(vAt(s))}`);
  return (
    <>
      <WorldSvg box={[0, 0, 1080, 1080]}>
        <rect x={40} y={60} width={1000} height={800} rx={28} fill="#FFFDF6" stroke={INK} strokeWidth={8} />
        <path d={`M${X0},${Y1 - 30} L${X0},${Y0} L${X1 + 30},${Y0}`} fill="none" stroke={INK} strokeWidth={8} />
        {[0, 10, 20, 30].map((s) => <line key={s} x1={xOf(s)} y1={Y0} x2={xOf(s)} y2={Y0 + 16} stroke={INK} strokeWidth={5} />)}
        {shown > 0.05 ? (
          <>
            <path d={'M' + pts.join(' L')} fill="none" stroke={INK} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
            <path d={'M' + pts.join(' L')} fill="none" stroke={RED} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : null}
        {marks && t > twelve - 0.1 ? <line x1={xOf(12)} y1={Y0} x2={xOf(12)} y2={yOf(VT) - 30} stroke={INK} strokeWidth={5} strokeDasharray="12 10" /> : null}
        {marks && t > terminal - 0.1 ? <line x1={X0} y1={yOf(VT)} x2={X1} y2={yOf(VT)} stroke={GOLD} strokeWidth={6} strokeDasharray="16 10" /> : null}
      </WorldSvg>
      <Txt x={xOf(15)} y={Y0 + 60} size={40}>seconds of falling</Txt>
      <div style={{position: 'absolute', left: 30, top: 470, transformOrigin: '0 0', transform: 'rotate(-90deg)', fontFamily, fontSize: 40, color: INK, whiteSpace: 'nowrap'}}>speed</div>
      {marks ? <Tag t={t} t0={twelve} x={xOf(12)} y={Y0 - 40} size={44} color={GOLD}>12 s</Tag> : null}
      {marks ? <Tag t={t} t0={terminal} x={xOf(22)} y={yOf(VT) - 60} size={56} color={GOLD}>terminal velocity</Tag> : null}
    </>
  );
};

export const S2: React.FC<P> = ({t}) => {
  const jump = cue(2, 'Jump out of a plane');
  const think = cue(2, "You'd think");
  const notHow = cue(2, "But that's not how");
  const first = cue(2, 'When you first jump');
  const gravity = cue(2, 'gravity speeds');
  const harder = cue(2, 'harder the air');
  const twelve = cue(2, 'After about 12 seconds');
  const matches = cue(2, 'matches the pull');
  const stop = cue(2, 'you stop speeding up');
  const terminal = cue(2, 'terminal velocity');
  const lying = cue(2, 'Lying flat');
  const k200 = cue(2, 'about 200');
  const headDown = cue(2, 'Turn head down');
  const dart = cue(2, 'narrow like a dart');
  const k240 = cue(2, 'about 240');
  const speedSky = cue(2, 'Speed skydivers');
  const thinner = cue(2, 'where the air is thinner');
  const tuck = cue(2, 'tuck in tight');
  const august = cue(2, 'In August 2025');
  const k537 = cue(2, 'about 537');
  const october = cue(2, 'At the World Championships');
  const pending = cue(2, "though that's still");
  const once = cue(2, "So once you've been");
  const airSets = cue(2, 'The air sets');
  if (t < first - 0.2) {
    const planeX = lerp(-450, 640, easeOutCubic(progress(t, secStart(2) - 0.5, jump + 0.6)));
    const out = clamp01((t - (jump + 0.7)) / 0.6);
    return (
      <>
        <Sky t={t} rise={t > jump + 0.7 ? 260 : 0} />
        <Cutout sp={S.plane} x={planeX - 900 * out * out} y={260 - 300 * out * out} w={520} />
        {t > jump + 0.5 ? <Cutout sp={S.dot_freefall} x={540} y={lerp(300, 560, easeOutCubic(clamp01((t - jump - 0.5) / 1.2)))} w={360} rot={-6 + 3 * Math.sin(t * 2)} /> : null}
        {t > jump + 0.9 ? <Streaks t={t} x={540} w={420} /> : null}
        <Tag t={t} t0={think} x={540} y={140} size={64}>higher start = faster?</Tag>
        {t > notHow - 0.05 ? (
          <WorldSvg box={[200, 60, 880, 220]}>
            <path d="M260,90 L820,190 M820,90 L260,190" stroke={INK} strokeWidth={26} strokeLinecap="round" opacity={clamp01((t - notHow) / 0.15)} />
            <path d="M260,90 L820,190 M820,90 L260,190" stroke={RED} strokeWidth={14} strokeLinecap="round" opacity={clamp01((t - notHow) / 0.15)} />
          </WorldSvg>
        ) : null}
      </>
    );
  }
  if (t < lying - 0.2) {
    const tau = 30 * easeInOutCubic(progress(t, first, stop + 1));
    const v = vAt(tau);
    const air = (v / VT) * (v / VT);
    return (
      <>
        <Paper color="#CDEBFA" />
        <SpeedGraph t={t} t0={first} tEnd={stop + 1} terminal={terminal} twelve={twelve} marks />
        {/* the forces on a little falling Dot, top right of the graph */}
        <Cutout sp={S.dot_freefall} x={820} y={330} w={170} />
        {t > gravity - 0.1 ? <Arrow x0={820} y0={390} x1={820} y1={540} color={RED} w={14} /> : null}
        {t > harder - 0.1 ? <Arrow x0={820} y0={270} x1={820} y1={270 - 150 * air} color={BLUE} w={14} /> : null}
        <Tag t={t} t0={gravity} x={720} y={520} size={40} color={RED}>gravity</Tag>
        <Tag t={t} t0={harder} x={700} y={190} size={40} color={BLUE}>air</Tag>
        {t > matches ? <Tag t={t} t0={matches} x={540} y={120} size={52}>air push = gravity pull</Tag> : null}
      </>
    );
  }
  if (t < speedSky - 0.2) {
    const head = t > headDown - 0.05;
    const kmh = head ? lerp(200, 265, easeInOutCubic(progress(t, headDown, k240))) + (t > k240 ? 25 * Math.sin(t * 2.2) : 0) : lerp(150, 200, easeOutCubic(progress(t, lying - 0.2, k200)));
    return (
      <>
        <Sky t={t} rise={head ? 520 : 380} />
        <Streaks t={t} x={430} w={head ? 260 : 420} speed={head ? 1300 : 950} n={head ? 10 : 16} />
        {head ? <Cutout sp={S.dot_headdown} x={430} y={460} w={200} rot={2 * Math.sin(t * 3)} /> : <Cutout sp={S.dot_freefall} x={430} y={460} w={420} rot={-4 + 2 * Math.sin(t * 2)} />}
        <Gauge x={850} y={720} r={170} kmh={kmh} band={head && t > k240 ? [240, 290] : undefined} />
        <Tag t={t} t0={k200 - 0.05} t1={headDown - 0.1} x={850} y={820} size={60} color={GOLD}>~200 km/h</Tag>
        <Tag t={t} t0={k240 - 0.05} x={850} y={820} size={60} color={GOLD}>240-290 km/h</Tag>
        <Tag t={t} t0={dart} x={430} y={110} size={56}>narrow like a dart</Tag>
      </>
    );
  }
  if (t < once - 0.2) {
    // speed skydiving: a tall column of air that thins out with height, then the record
    const diveY = lerp(150, 740, easeInOutCubic(progress(t, tuck - 0.2, august + 0.4)));
    const rec = t > august - 0.1;
    return (
      <>
        <Sky t={t} rise={0} />
        <WorldSvg box={[60, 60, 560, 900]}>
          <rect x={80} y={80} width={460} height={800} rx={30} fill="#FFFFFF" opacity={0.25} stroke={INK} strokeWidth={6} />
          {t > thinner - 0.1
            ? Array.from({length: 120}, (_, i) => {
                const y = 100 + Math.pow(rand(i + 1), 0.45) * 760; // denser low down
                return <circle key={i} cx={100 + rand(i + 9) * 420} cy={y} r={5} fill={BLUE} opacity={clamp01((t - thinner) / 0.6)} />;
              })
            : null}
        </WorldSvg>
        <Tag t={t} t0={thinner} x={310} y={130} size={40}>thin air</Tag>
        <Tag t={t} t0={thinner + 0.3} x={310} y={840} size={40}>thick air</Tag>
        <Cutout sp={S.dot_headdown} x={310} y={diveY} w={110} />
        {rec ? (
          <Card x={600} y={170} w={440} h={500} s={pop(t, august - 0.1)}>
            <Txt x={220} y={70} size={44}>official record</Txt>
            <Txt x={220} y={180} size={120} color={RED}>537</Txt>
            <Txt x={220} y={280} size={52}>km/h average</Txt>
            <Txt x={220} y={370} size={40}>August 2025</Txt>
          </Card>
        ) : null}
        <Tag t={t} t0={october} x={820} y={760} size={44} color={GOLD}>Oct 2026: faster still</Tag>
        <Tag t={t} t0={pending} x={820} y={830} size={36}>(waiting to be made official)</Tag>
        {t > k537 - 0.05 ? <Glint t={t} t0={k537} x={1000} y={260} r={30} ink={4} /> : null}
      </>
    );
  }
  return (
    <>
      <Paper color="#CDEBFA" />
      <SpeedGraph t={t} t0={once - 2} tEnd={once} terminal={secStart(2)} twelve={secStart(2)} marks />
      {t > cue(2, 'falling further') - 0.1 ? <DrawnCircle t={t} t0={cue(2, 'falling further')} t1={cue(2, 'falling further') + 0.6} x={760} y={290} r={150} color={GOLD} ink={7} /> : null}
      <Tag t={t} t0={airSets - 0.05} x={540} y={120} size={64} color={GOLD}>the air sets your speed</Tag>
      <DotRig t={t} swaps={[{at: 0, pose: 'dot_aha'}]} x={960} y={1000} headR={46} shadow={false} />
    </>
  );
};

// ================================================================================================ 3 The record (told calmly)
const RULER = {x: 180, top: 120, bottom: 820, max: 11000};
const yAlt = (m: number) => RULER.bottom - (m / RULER.max) * (RULER.bottom - RULER.top);

const Ruler: React.FC<{t: number}> = ({t}) => (
  <WorldSvg box={[60, 60, 420, 900]}>
    <rect x={RULER.x - 26} y={RULER.top - 20} width={52} height={RULER.bottom - RULER.top + 40} rx={14} fill="#E9E2D0" stroke={INK} strokeWidth={6} />
    {Array.from({length: 12}, (_, i) => (
      <line key={i} x1={RULER.x - 26} y1={yAlt(i * 1000)} x2={RULER.x + (i % 5 === 0 ? 10 : -4)} y2={yAlt(i * 1000)} stroke={INK} strokeWidth={4} />
    ))}
  </WorldSvg>
);

const Marker: React.FC<{y: number; color: string; s: number}> = ({y, color, s}) =>
  s > 0.01 ? (
    <WorldSvg box={[200, y - 40, 300, y + 40]}>
      <g transform={`translate(214 ${y}) scale(${s})`}>
        <path d="M0,0 L40,-24 L40,24 Z" fill={color} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g>
    </WorldSvg>
  ) : null;

export const S3: React.FC<P> = ({t}) => {
  const guinness = cue(3, 'According to Guinness');
  const h10160 = cue(3, '10,160 metres');
  const jan = cue(3, 'In January 1972');
  const airliner = cue(3, 'Yugoslav airliner');
  const apart = cue(3, 'broke apart');
  const bomb = cue(3, 'blamed a bomb');
  const twentyEight = cue(3, 'Twenty-eight people');
  const died = cue(3, 'twenty-seven of them died');
  const survivor = cue(3, 'The one survivor');
  const vesna = cue(3, 'Vesna');
  const village = cue(3, 'A man from a nearby village');
  const coma = cue(3, 'coma for three days');
  const months = cue(3, 'months to walk again');
  const books = cue(3, 'record books');
  const y2009 = cue(3, 'Then, in 2009');
  const lower = cue(3, 'broke up much lower');
  const fewHundred = cue(3, 'a few hundred metres');
  const descent = cue(3, 'fast emergency descent');
  const area = cue(3, 'how small an area');
  const people = cue(3, 'people on the ground');
  const shot = cue(3, 'shot down by mistake');
  const hide = cue(3, 'invented to hide it');
  const admitted = cue(3, 'But one of the journalists');
  const circ = cue(3, 'only circumstantial');
  const never = cue(3, 'never been proved');
  const still = cue(3, 'Guinness still lists');
  const tenKm = cue(3, 'So was it 10 kilometres');
  const either = cue(3, 'Either way');
  const mayNever = cue(3, 'We just may never know');
  const swaps: Swap[] = [
    {at: 0, pose: 'dot_lookup'},
    {at: y2009, pose: 'dot_scratch', style: 'squash'},
    {at: tenKm, pose: 'dot_lookup', style: 'squash'},
    {at: either, pose: 'dot_shrug', style: 'squash'},
  ];
  const topMark = popScale(t, h10160 - 0.1, secEnd(3) + 2, 0.4, 0.2);
  const lowMark = t > lower - 0.1 ? popScale(t, fewHundred - 0.1, secEnd(3) + 2, 0.4, 0.2) : 0;
  const pulse = t > tenKm ? 1 + 0.12 * Math.sin(2 * Math.PI * 1.2 * (t - tenKm)) : 1;
  const planeFade = t < apart ? 1 : Math.max(0.25, 1 - (t - apart) / 1.2);
  return (
    <>
      <Sky t={t} dusk ground={880} />
      <Ruler t={t} />
      <Marker y={yAlt(10160)} color={GOLD} s={topMark * pulse} />
      <Marker y={yAlt(300)} color="#C9C2D8" s={lowMark * pulse} />
      <Tag t={t} t0={guinness} t1={jan - 0.2} x={640} y={300} size={48}>Guinness World Records</Tag>
      <Tag t={t} t0={h10160 - 0.05} x={420} y={yAlt(10160)} size={64} color={GOLD}>10,160 m</Tag>
      {t > lower ? <Tag t={t} t0={fewHundred - 0.05} x={470} y={yAlt(300) - 10} size={48} color="#E6E0F2">a few hundred m?</Tag> : null}
      {/* the airliner as a plain silhouette at cruising height; it fades to an outline on "broke apart" */}
      {t > airliner - 0.1 && t < y2009 ? (
        <WorldSvg box={[260, yAlt(10160) + 20, 700, yAlt(10160) + 140]}>
          <g transform={`translate(300 ${yAlt(10160) + 80})`} opacity={planeFade}>
            <path d="M0,0 L320,-8 Q350,0 320,8 Z M140,-4 L200,-46 L222,-46 L196,-2 Z M140,4 L200,46 L222,46 L196,2 Z M20,-2 L30,-30 L44,-30 L46,-2 Z" fill="#C9C2D8" stroke={INK} strokeWidth={4} strokeDasharray={t > apart ? '8 6' : undefined} />
          </g>
        </WorldSvg>
      ) : null}
      {t > jan - 0.1 && t < y2009 ? (
        <>
          <Tag t={t} t0={jan} x={760} y={140} size={52}>January 1972</Tag>
          <Tag t={t} t0={bomb - 0.05} x={760} y={220} size={40}>official report: a bomb</Tag>
        </>
      ) : null}
      {/* 28 aboard: 27 dots grey out, one stays gold (abstract, respectful) */}
      {t > twentyEight - 0.1 && t < y2009 ? (
        <WorldSvg box={[520, 280, 1040, 560]}>
          {Array.from({length: 28}, (_, i) => {
            const s = popScale(t, twentyEight + i * 0.025, y2009 + 1, 0.25, 0.2);
            const greyU = clamp01((t - died - i * 0.02) / 0.5);
            const alive = i === 17;
            const fill = alive ? (t > survivor ? GOLD : '#E9E2D0') : `rgba(${lerp(233, 120, greyU)},${lerp(226, 116, greyU)},${lerp(208, 130, greyU)},1)`;
            return <circle key={i} cx={560 + (i % 7) * 66} cy={320 + Math.floor(i / 7) * 62} r={22 * s * (alive && t > survivor ? 1 + 0.08 * Math.sin(t * 4) : 1)} fill={fill} stroke={INK} strokeWidth={4} />;
          })}
        </WorldSvg>
      ) : null}
      {t > vesna - 0.1 && t < y2009 ? (
        <>
          <Tag t={t} t0={vesna} x={740} y={600} size={48} color={GOLD}>Vesna Vulović, 22</Tag>
          <Tag t={t} t0={village} t1={coma - 0.1} x={700} y={670} size={38}>found by a villager</Tag>
          <Tag t={t} t0={coma - 0.05} x={700} y={670} size={38}>3 days in a coma</Tag>
          <Tag t={t} t0={months - 0.05} x={700} y={730} size={38}>months to walk again</Tag>
        </>
      ) : null}
      {t > books - 0.2 && t < y2009 ? (
        <Card x={620} y={300} w={360} h={250} s={pop(t, books - 0.1)} fill="#FFF1C9">
          <Txt x={180} y={70} size={40}>RECORD</Txt>
          <Txt x={180} y={150} size={64} color={RED}>10,160 m</Txt>
          <Txt x={180} y={210} size={30}>highest fall survived</Txt>
        </Card>
      ) : null}
      {/* 2009: two faceless pictograms (real people), the lower break-up theory */}
      {t > y2009 - 0.1 ? (
        <>
          <WorldSvg box={[600, 400, 1060, 900]}>
            <Pictogram x={700} y={880} h={180} color="#8E7CC3" hold="pencil" scale={popScale(t, y2009 + 0.2, admitted, 0.3, 0.3)} />
            <Pictogram x={830} y={880} h={170} color="#6C8EBF" hold="pencil" scale={popScale(t, y2009 + 0.35, admitted, 0.3, 0.3)} />
            {t > descent - 0.1 ? (
              <path d={`M260,${yAlt(10160) + 10} C420,${yAlt(8000)} 330,${yAlt(2500)} 262,${yAlt(300)}`} fill="none" stroke="#E6E0F2" strokeWidth={5} strokeDasharray="14 12"
                opacity={clamp01((t - descent) / 0.6)} />
            ) : null}
          </WorldSvg>
          <Tag t={t} t0={y2009} t1={admitted} x={765} y={150} size={60}>2009</Tag>
          <Tag t={t} t0={area - 0.05} t1={admitted} x={765} y={240} size={40}>small wreckage area</Tag>
          <Tag t={t} t0={people - 0.05} t1={admitted} x={765} y={300} size={40}>witnesses on the ground</Tag>
          <Tag t={t} t0={shot - 0.05} t1={admitted} x={765} y={380} size={44} color="#E6E0F2">shot down by mistake?</Tag>
          <Tag t={t} t0={hide - 0.05} t1={admitted} x={765} y={450} size={44} color="#E6E0F2">a cover story?</Tag>
          <Tag t={t} t0={circ - 0.05} x={765} y={240} size={48}>only circumstantial</Tag>
          <Tag t={t} t0={never - 0.05} x={765} y={320} size={48}>never proved</Tag>
          <Tag t={t} t0={still - 0.05} x={765} y={420} size={44} color={GOLD}>record still listed</Tag>
        </>
      ) : null}
      {t > tenKm ? <Tag t={t} t0={tenKm + 0.6} x={330} y={yAlt(5200)} size={120} color="#E6E0F2">?</Tag> : null}
      <DotRig t={t} swaps={swaps} x={1000} y={880} headR={54} />
      <Tag t={t} t0={mayNever} x={640} y={560} size={48}>we may never know</Tag>
    </>
  );
};

// ================================================================================================ 4 How a parachute works
const Malfunction: React.FC<{t: number; t0: number; x: number; kind: 'twist' | 'lopsided' | 'bag'; label: string}> = ({t, t0, x, kind, label}) => (
  <Card x={x} y={430} w={320} h={400} s={pop(t, t0)}>
    {kind === 'twist' ? <Canopy x={160} y={110} w={220} lines={{x: 160, y: 300}} twist /> : null}
    {kind === 'lopsided' ? <Canopy x={150} y={130} w={200} fill={0.65} tilt={-22} lines={{x: 160, y: 300}} /> : null}
    {kind === 'bag' ? (
      <WorldSvg box={[0, 0, 320, 400]}>
        <rect x={120} y={70} width={80} height={60} rx={10} fill="#4A4F58" stroke={INK} strokeWidth={6} />
        {[-10, 0, 10].map((d) => <line key={d} x1={160 + d} y1={130} x2={160 + d * 0.5} y2={300} stroke="#4A4F58" strokeWidth={3} />)}
        <path d="M160,70 Q150,30 160,10" stroke={INK} strokeWidth={4} fill="none" />
      </WorldSvg>
    ) : null}
    <WorldSvg box={[0, 0, 320, 400]}>
      <circle cx={160} cy={318} r={22} fill="#FFF1D6" stroke={INK} strokeWidth={5} />
    </WorldSvg>
    <Txt x={160} y={370} size={36}>{label}</Txt>
  </Card>
);

export const S4: React.FC<P> = ({t}) => {
  const bigger = cue(4, 'something much bigger');
  const here = cue(4, "Here's what happens");
  const pilot = cue(4, 'pilot chute');
  const pin = cue(4, 'pulls a pin');
  const container = cue(4, 'opens the container');
  const bag = cue(4, 'drags out a bag');
  const lines = cue(4, 'The lines stretch out');
  const letsGo = cue(4, 'the bag lets go');
  const fills = cue(4, 'the canopy fills with air');
  const slider = cue(4, 'called a slider');
  const jolt = cue(4, 'jolt you');
  const modern = cue(4, 'And modern canopies');
  const wings = cue(4, "They're wings");
  const cells = cue(4, 'made of cells');
  const steer = cue(4, 'can steer');
  const slow = cue(4, 'slow right down');
  const ground = cue(4, 'touching the ground');
  const most = cue(4, 'Most of the time');
  const thousand = cue(4, 'one jump in a thousand');
  const twist = cue(4, 'The lines can twist');
  const lopsided = cue(4, 'open lopsided');
  const stuck = cue(4, 'stuck in its bag');
  const two = cue(4, 'two parachutes');
  const cut = cue(4, 'to cut it away');
  const reserve = cue(4, 'to open the reserve');
  const us = cue(4, 'In the US');
  const rigger = cue(4, 'certified rigger');
  const d180 = cue(4, 'every 180 days');
  const computer = cue(4, 'small computer');
  const close = cue(4, 'too close to the ground');
  const fires = cue(4, 'it fires');
  const chain = cue(4, 'chain of backups');
  if (t < here - 0.2) {
    const open = t > bigger - 0.1;
    return (
      <>
        <Sky t={t} rise={open ? 40 : 380} />
        {!open ? (
          <>
            <Streaks t={t} x={540} w={420} />
            <Cutout sp={S.dot_freefall} x={540} y={520} w={420} rot={-4 + 2 * Math.sin(t * 2)} />
            <Arrow x0={540} y0={380} x1={540} y1={330} color={BLUE} w={12} />
          </>
        ) : (
          <>
            <Canopy x={540} y={200} w={620} lines={{x: 540, y: 470}} />
            <Cutout sp={S.dot_canopy} x={540} y={600} w={200} />
            {[340, 540, 740].map((x, i) => <Arrow key={i} x0={x} y0={330} x1={x} y1={230 - 30 * Math.sin(t * 3 + i)} color={BLUE} w={16} />)}
            <Tag t={t} t0={bigger} x={540} y={840} size={52}>much more to push against</Tag>
          </>
        )}
      </>
    );
  }
  if (t < modern - 0.2) {
    // the opening sequence, in order
    const back = {x: 520, y: 520};
    const pcU = easeOutCubic(progress(t, pilot, pilot + 0.8));
    const pc = {x: lerp(back.x, 860, pcU), y: lerp(back.y, 220, pcU)};
    const bagU = easeInOutCubic(progress(t, bag, lines + 0.4));
    const bagPos = {x: lerp(back.x, 700, bagU), y: lerp(back.y, 260, bagU)};
    const gone = clamp01((t - letsGo) / 0.8);
    const canopyOn = t > fills - 0.15;
    const sliderU = easeInOutCubic(progress(t, slider, jolt + 0.6));
    const steps = ['pilot chute', 'pin', 'container', 'bag', 'lines', 'canopy'];
    const stepAt = [pilot, pin, container, bag, lines, fills];
    let step = -1;
    stepAt.forEach((s, i) => {
      if (t >= s - 0.05) step = i;
    });
    return (
      <>
        <Sky t={t} rise={canopyOn ? 30 : 300} />
        {!canopyOn ? (
          <>
            <Streaks t={t} x={520} w={380} />
            <Cutout sp={S.dot_freefall} x={520} y={600} w={400} rot={-4} />
            {t > pilot - 0.05 ? (
              <WorldSvg box={[300, 0, 1080, 800]}>
                <path d={`M${back.x},${back.y} L${pc.x},${pc.y + 40}`} stroke="#E8E2D2" strokeWidth={5} />
                <g transform={`translate(${pc.x} ${pc.y})`}>
                  <path d="M-50,30 Q0,-50 50,30 Z" fill={GOLD} stroke={INK} strokeWidth={6} />
                  <path d="M-30,30 L0,60 L30,30" fill="none" stroke={INK} strokeWidth={4} />
                </g>
                {t > bag - 0.05 && gone < 1 ? (
                  <g transform={`translate(${bagPos.x + 200 * gone} ${bagPos.y - 260 * gone})`} opacity={1 - gone}>
                    <rect x={-40} y={-28} width={80} height={56} rx={10} fill="#4A4F58" stroke={INK} strokeWidth={6} />
                  </g>
                ) : null}
                {t > lines - 0.05 ? <path d={`M${back.x},${back.y} L${bagPos.x},${bagPos.y + 28}`} stroke="#4A4F58" strokeWidth={4} /> : null}
              </WorldSvg>
            ) : null}
            {t > pin - 0.05 && t < pin + 0.5 ? <Glint t={t} t0={pin} x={back.x + 20} y={back.y - 20} r={26} ink={4} /> : null}
          </>
        ) : (
          <>
            <Canopy x={540} y={300} w={lerp(280, 540, easeOutCubic(progress(t, fills - 0.15, fills + 0.6)))} fill={easeOutCubic(progress(t, fills - 0.15, fills + 0.6))} lines={{x: 540, y: 560}} />
            {/* the slider sliding down the lines */}
            {t > slider - 0.1 ? (
              <WorldSvg box={[380, 300, 700, 560]}>
                <rect x={540 - lerp(130, 36, sliderU)} y={lerp(330, 515, sliderU)} width={2 * lerp(130, 36, sliderU)} height={22} rx={6} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
              </WorldSvg>
            ) : null}
            <Cutout sp={S.dot_canopy} x={540} y={690} w={170} rot={wobble(t, fills, 6, 1.4, 2)} />
            <Tag t={t} t0={slider} x={800} y={480} size={48} color={GOLD}>slider</Tag>
          </>
        )}
        {step >= 0 ? (
          <Tag t={t} t0={stepAt[step]} x={540} y={90} size={60}>{`${step + 1}. ${steps[step]}`}</Tag>
        ) : null}
      </>
    );
  }
  if (t < most - 0.2) {
    const glide = easeInOutCubic(progress(t, steer - 0.3, ground + 0.4));
    const flare = clamp01((t - (slow - 0.1)) / 0.5) * (1 - clamp01((t - ground - 0.6) / 0.4));
    const land = t > ground ? 0 : 1;
    return (
      <>
        <Sky t={t} ground={860} />
        {t < steer - 0.3 ? (
          <>
            <Card x={70} y={160} w={420} h={420} s={pop(t, modern - 0.1)}>
              <WorldSvg box={[0, 0, 420, 420]}>
                <path d="M60,200 Q210,20 360,200 Z" fill="#C9C2D8" stroke={INK} strokeWidth={6} />
                {[90, 150, 210, 270, 330].map((x) => <line key={x} x1={x} y1={200} x2={210} y2={340} stroke="#4A4F58" strokeWidth={3} />)}
                <path d="M60,60 L360,360 M360,60 L60,360" stroke={RED} strokeWidth={14} strokeLinecap="round" opacity={clamp01((t - modern - 0.6) / 0.2)} />
              </WorldSvg>
              <Txt x={210} y={385} size={40}>a dome</Txt>
            </Card>
            <Card x={590} y={160} w={420} h={420} s={pop(t, wings - 0.1)}>
              <WorldSvg box={[0, 0, 420, 420]}>
                <path d="M40,220 C80,110 300,90 390,190 C300,215 120,240 40,220 Z" fill={RED} stroke={INK} strokeWidth={7} />
                {t > cells - 0.1 ? [120, 190, 260, 330].map((x) => <line key={x} x1={x} y1={130 - (x - 220) * (x - 220) * 0.0006} x2={x - 6} y2={220} stroke={INK} strokeWidth={4} />) : null}
                {t > cells
                  ? [0, 1, 2].map((i) => {
                      const u = ((t * 1.4 + i / 3) % 1);
                      return <path key={i} d={`M${-20 + 70 * u},${190 + i * 14} l40,0`} stroke={BLUE} strokeWidth={8} strokeLinecap="round" opacity={1 - u} />;
                    })
                  : null}
              </WorldSvg>
              <Txt x={210} y={385} size={40}>a wing</Txt>
            </Card>
            <Tag t={t} t0={cells} x={800} y={120} size={48} color={GOLD}>cells fill with air</Tag>
          </>
        ) : (
          <>
            <Canopy x={lerp(860, 420, glide)} y={lerp(160, 470, glide) - 0} w={360} tilt={-12 * flare} lines={{x: lerp(860, 420, glide), y: lerp(160, 470, glide) + 210}} />
            <Cutout sp={S.dot_canopy} x={lerp(860, 420, glide)} y={lerp(160, 470, glide) + 300 - 6 * land * Math.sin(t * 2)} w={150} />
            <Tag t={t} t0={steer} t1={slow - 0.1} x={540} y={110} size={56}>steer</Tag>
            <Tag t={t} t0={slow - 0.05} x={540} y={110} size={56} color={GOLD}>slow right down</Tag>
          </>
        )}
      </>
    );
  }
  if (t < two - 0.2) {
    return (
      <>
        <Paper />
        {t < twist - 0.2 ? (
          <Card x={140} y={90} w={800} h={640} s={pop(t, thousand - 0.2)}>
            <WorldSvg box={[0, 0, 800, 640]}>
              {Array.from({length: 1000}, (_, i) => {
                const c = i % 40;
                const r = Math.floor(i / 40);
                const odd = i === 613;
                return <circle key={i} cx={30 + c * 18.5} cy={40 + r * 20} r={odd ? 9 : 6} fill={odd ? RED : '#9CC9E6'} stroke={odd ? INK : 'none'} strokeWidth={3} />;
              })}
            </WorldSvg>
            <Txt x={400} y={590} size={52}>about 1 jump in 1,000</Txt>
          </Card>
        ) : (
          <>
            <Malfunction t={t} t0={twist - 0.1} x={20} kind="twist" label="line twist" />
            <Malfunction t={t} t0={lopsided - 0.1} x={380} kind="lopsided" label="lopsided" />
            <Malfunction t={t} t0={stuck - 0.1} x={740} kind="bag" label="stuck in bag" />
          </>
        )}
        <Tag t={t} t0={most - 0.05} t1={thousand - 0.3} x={540} y={420} size={72}>it all works</Tag>
      </>
    );
  }
  if (t < computer - 0.2) {
    const cutU = clamp01((t - cut - 0.2) / 1.4);
    const resU = easeOutCubic(progress(t, reserve, reserve + 0.8));
    const rig = t > us - 0.1;
    return (
      <>
        <Sky t={t} rise={20} />
        {!rig ? (
          <>
            {/* the main drifts away after the cutaway, the reserve opens */}
            {cutU < 1 ? <Canopy x={540 + 600 * cutU * cutU} y={200 - 300 * cutU * cutU} w={480} color={RED} tilt={40 * cutU} lines={{x: 540 + 500 * cutU * cutU, y: 470 - 250 * cutU * cutU}} /> : null}
            {t > reserve - 0.1 ? <Canopy x={540} y={190} w={lerp(260, 500, resU)} fill={resU} color="#F4F1E4" lines={{x: 540, y: 470}} /> : null}
            <Cutout sp={S.dot_canopy} x={540} y={600} w={190} />
            <Tag t={t} t0={two - 0.05} x={540} y={90} size={60}>two parachutes</Tag>
            {/* the two handles */}
            <WorldSvg box={[700, 600, 1000, 820]}>
              <rect x={740} y={620} width={110} height={60} rx={20} fill={RED} stroke={INK} strokeWidth={6} opacity={t > cut - 0.2 ? 1 : 0.35} />
              <rect x={740} y={720} width={110} height={44} rx={10} fill="#C9CDD3" stroke={INK} strokeWidth={6} opacity={t > reserve - 0.2 ? 1 : 0.35} />
            </WorldSvg>
            <Tag t={t} t0={cut - 0.05} x={920} y={650} size={36}>cut away</Tag>
            <Tag t={t} t0={reserve - 0.05} x={920} y={745} size={36}>reserve</Tag>
          </>
        ) : (
          <>
            <Paper />
            <WorldSvg box={[0, 0, 1080, 1080]}>
              <rect x={120} y={520} width={640} height={40} rx={8} fill="#B07A4A" stroke={INK} strokeWidth={6} />
              <rect x={200} y={470} width={300} height={50} rx={12} fill="#F4F1E4" stroke={INK} strokeWidth={6} />
              <Pictogram x={600} y={520} h={300} color="#4E5E8C" scale={pop(t, rigger - 0.1)} />
            </WorldSvg>
            <Card x={700} y={160} w={300} h={300} s={pop(t, d180 - 0.1)} fill="#FFFFFF">
              <WorldSvg box={[0, 0, 300, 300]}>
                <rect x={0} y={0} width={300} height={80} fill={RED} />
              </WorldSvg>
              <Txt x={150} y={45} size={36} color="#FFFFFF">every</Txt>
              <Txt x={150} y={170} size={110}>180</Txt>
              <Txt x={150} y={255} size={44}>days</Txt>
            </Card>
            <Tag t={t} t0={rigger - 0.05} x={330} y={250} size={48}>certified rigger</Tag>
            <Tag t={t} t0={cue(4, 'even if')} x={540} y={700} size={48} color={GOLD}>even if never used</Tag>
          </>
        )}
      </>
    );
  }
  // the automatic opener, then the chain of backups
  const alt = Math.max(0, lerp(1200, 180, easeInOutCubic(progress(t, computer + 0.6, close + 0.3))));
  const fired = t > fires - 0.05;
  const resU = easeOutCubic(progress(t, fires, fires + 0.8));
  return (
    <>
      <Sky t={t} rise={fired ? 30 : 280} />
      {t < chain - 0.3 ? (
        <>
          {!fired ? <Streaks t={t} x={360} w={300} /> : null}
          {fired ? <Canopy x={360} y={180} w={lerp(220, 440, resU)} fill={resU} color="#F4F1E4" lines={{x: 360, y: 450}} /> : null}
          {fired ? <Cutout sp={S.dot_canopy} x={360} y={580} w={180} /> : <Cutout sp={S.dot_freefall} x={360} y={500} w={360} rot={-4} />}
          <Card x={640} y={180} w={380} h={420} s={pop(t, computer - 0.1)} fill="#2B2F38">
            <WorldSvg box={[0, 0, 380, 420]}>
              <rect x={40} y={40} width={300} height={180} rx={14} fill="#B8F0C0" stroke={INK} strokeWidth={6} />
              <rect x={40} y={260} width={300} height={40} rx={10} fill="#4A4F58" />
              <rect x={40} y={260} width={300 * (alt / 1200)} height={40} rx={10} fill={alt < 300 ? RED : GOLD} />
              {fired ? <circle cx={300} cy={360} r={30 * (1 - clamp01((t - fires) / 0.5)) + 6} fill="#FFE27A" /> : null}
            </WorldSvg>
            <Txt x={190} y={105} size={48}>{`${Math.round(alt)} m`}</Txt>
            <Txt x={190} y={175} size={40}>{fired ? 'OPEN' : 'falling fast'}</Txt>
          </Card>
          <Tag t={t} t0={cue(4, 'height and speed')} x={830} y={660} size={40}>height + speed</Tag>
          <Tag t={t} t0={close - 0.05} x={830} y={720} size={40} color={RED}>too low</Tag>
          <Tag t={t} t0={cue(4, 'by itself') - 0.05} x={830} y={790} size={44} color={GOLD}>opens by itself</Tag>
        </>
      ) : (
        <>
          <WorldSvg box={[0, 0, 1080, 1080]}>
            {[220, 540, 860].map((x, i) => (
              <g key={i} transform={`scale(${pop(t, chain - 0.3 + i * 0.15)})`} style={{transformOrigin: `${x}px 430px`}}>
                <ellipse cx={x} cy={430} rx={150} ry={80} fill="none" stroke={INK} strokeWidth={34} />
                <ellipse cx={x} cy={430} rx={150} ry={80} fill="none" stroke={GOLD} strokeWidth={20} />
              </g>
            ))}
          </WorldSvg>
          {['main', 'reserve', 'auto opener'].map((s, i) => <Tag key={s} t={t} t0={chain - 0.2 + i * 0.15} x={220 + i * 320} y={590} size={48}>{s}</Tag>)}
          <Tag t={t} t0={chain} x={540} y={250} size={72} color={GOLD}>a chain of backups</Tag>
          <DotRig t={t} swaps={[{at: 0, pose: 'dot_aha'}]} x={540} y={900} headR={44} shadow={false} />
        </>
      )}
    </>
  );
};

// ================================================================================================ 5 Why the station is falling
const EARTH = {x: 540, y: 540, r: 250};
const ORBIT = 360;

export const S5: React.FC<P> = ({t}) => {
  const years = cue(5, 'more than 25 years');
  const why = cue(5, "So why doesn't");
  const upThere = cue(5, 'Up there');
  const k400 = cue(5, 'about 400 kilometres');
  const g90 = cue(5, 'about 90%');
  const stopped = cue(5, 'If the station just stopped');
  const straight = cue(5, 'straight down');
  const trick = cue(5, 'The trick is');
  const sideways = cue(5, 'moving sideways');
  const k8 = cue(5, 'About 8 kilometres');
  const ball = cue(5, 'Picture throwing a ball');
  const harder = cue(5, 'Throw it harder');
  const enough = cue(5, 'Throw it hard enough');
  const missing = cue(5, 'keeps missing');
  const orbit = cue(5, "That's an orbit");
  const goes = cue(5, 'The station goes all the way');
  const m90 = cue(5, 'every 90 minutes');
  const day16 = cue(5, '16 times a day');
  const float = cue(5, 'And the astronauts float');
  const same = cue(5, 'same rate');
  const evenSo = cue(5, 'Even so');
  const drags = cue(5, 'drags the station lower');
  const push = cue(5, 'gives it a push');
  const y2030 = cue(5, 'Around 2030');
  const ocean = cue(5, 'remote part of the ocean');
  if (t < upThere - 0.2) {
    return (
      <>
        <Space t={t} />
        <BigEarth cx={540} cy={2050} r={1250} />
        <Cutout sp={S.station} x={lerp(-150, 1250, progress(t, secStart(5) - 0.5, upThere))} y={420} w={300} rot={90} />
        <Tag t={t} t0={cue(5, 'is falling right now')} x={540} y={150} size={64} color={GOLD}>falling right now</Tag>
        <Tag t={t} t0={years - 0.05} x={540} y={230} size={52}>for 25+ years</Tag>
        <DotRig t={t} swaps={[{at: 0, pose: 'dot_lookup'}, {at: why - 0.05, pose: 'dot_scratch', style: 'squash'}]} x={300} y={820} headR={62} />
      </>
    );
  }
  if (t < ball - 0.2) {
    const ghost = t > stopped && t < trick ? easeInOutCubic(progress(t, straight - 0.3, straight + 0.6)) : 0;
    const slide = t > sideways - 0.2 ? ((t - sideways) * 90) % 1400 : 0;
    return (
      <>
        <Space t={t} />
        <BigEarth cx={540} cy={2050} r={1250} />
        <WorldSvg box={[0, 0, 1080, 1080]}>
          <line x1={140} y1={300} x2={140} y2={800} stroke="#FFFFFF" strokeWidth={5} strokeDasharray="14 12" />
          <path d="M120,300 L160,300 M120,800 L160,800" stroke="#FFFFFF" strokeWidth={6} />
        </WorldSvg>
        <Tag t={t} t0={k400 - 0.05} x={300} y={550} size={52}>400 km</Tag>
        <Cutout sp={S.station} x={540 + slide} y={300} w={260} rot={90} />
        {slide > 600 ? <Cutout sp={S.station} x={540 + slide - 1400} y={300} w={260} rot={90} /> : null}
        {ghost > 0 ? <Cutout sp={S.station} x={540} y={lerp(300, 760, ghost)} w={260} rot={90} opacity={0.45} /> : null}
        {t > g90 - 0.1 && t < trick ? <Arrow x0={540} y0={400} x1={540} y1={560} color={RED} w={16} /> : null}
        <Tag t={t} t0={g90 - 0.05} t1={trick} x={720} y={480} size={48} color={RED}>90% of gravity</Tag>
        {t > sideways - 0.1 ? <Arrow x0={380} y0={170} x1={760} y1={170} color={GOLD} w={20} /> : null}
        <Tag t={t} t0={k8 - 0.05} x={540} y={90} size={60} color={GOLD}>8 km every second</Tag>
      </>
    );
  }
  if (t < goes - 0.2) {
    // throwing balls off a tall hill: short, longer, all the way around
    const top = {x: EARTH.x, y: EARTH.y - EARTH.r - 70};
    const throws = [
      {t0: ball + 0.6, t1: ball + 1.8, reach: 0.35},
      {t0: harder + 0.2, t1: harder + 1.6, reach: 0.8},
      {t0: enough + 0.3, t1: enough + 3.2, reach: 6.283},
    ];
    const path = (reach: number, u: number) => {
      // angle swept around the Earth, radius sinking from the hilltop to the ground unless reach is a full orbit
      const a = reach * u;
      const full = reach > 6;
      const r = full ? EARTH.r + 70 : EARTH.r + 70 - 70 * Math.pow(u, 1.6);
      return {x: EARTH.x + r * Math.sin(a), y: EARTH.y - r * Math.cos(a)};
    };
    return (
      <>
        <Space t={t} />
        <Earth x={EARTH.x} y={EARTH.y} r={EARTH.r} />
        <WorldSvg box={[0, 0, 1080, 1080]}>
          <path d={`M${top.x - 40},${EARTH.y - EARTH.r + 6} L${top.x},${top.y} L${top.x + 40},${EARTH.y - EARTH.r + 6} Z`} fill="#8C6B5A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          {throws.map((th, i) => {
            if (t < th.t0) return null;
            const full = th.reach > 6;
            const u = full ? (t - th.t0) / (th.t1 - th.t0) : clamp01((t - th.t0) / (th.t1 - th.t0));
            const uu = full ? u % 1 : u;
            const pts = Array.from({length: 40}, (_, k) => path(th.reach, (k / 39) * (full ? Math.min(1, u) : u))).map((p) => `${p.x},${p.y}`);
            const b = path(th.reach, uu);
            return (
              <g key={i}>
                <path d={'M' + pts.join(' L')} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeDasharray="10 10" opacity={0.8} />
                <circle cx={b.x} cy={b.y} r={14} fill={RED} stroke={INK} strokeWidth={5} />
              </g>
            );
          })}
        </WorldSvg>
        <Tag t={t} t0={harder - 0.05} t1={enough} x={540} y={100} size={56}>harder</Tag>
        <Tag t={t} t0={enough - 0.05} t1={missing} x={540} y={100} size={56}>hard enough</Tag>
        <Tag t={t} t0={missing - 0.05} t1={orbit} x={540} y={100} size={56} color={GOLD}>falling, and missing</Tag>
        <Tag t={t} t0={orbit - 0.05} x={540} y={100} size={72} color={GOLD}>an orbit</Tag>
      </>
    );
  }
  if (t < evenSo - 0.2) {
    const a = (t - goes) * 0.9;
    const inside = t > float - 0.1;
    return (
      <>
        <Space t={t} />
        <Earth x={EARTH.x} y={EARTH.y} r={EARTH.r} />
        <WorldSvg box={[0, 0, 1080, 1080]}>
          <circle cx={EARTH.x} cy={EARTH.y} r={ORBIT} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeDasharray="12 12" opacity={0.7} />
        </WorldSvg>
        <Cutout sp={S.station} x={EARTH.x + ORBIT * Math.sin(a)} y={EARTH.y - ORBIT * Math.cos(a)} w={150} rot={90 + (a * 180) / Math.PI} />
        <Tag t={t} t0={m90 - 0.05} x={220} y={110} size={56}>90 min</Tag>
        <Tag t={t} t0={day16 - 0.05} x={860} y={110} size={56} color={GOLD}>16 a day</Tag>
        {inside ? (
          <Card x={560} y={600} w={480} h={340} s={pop(t, float - 0.1)} fill="#DDE3EA">
            <WorldSvg box={[0, 0, 480, 340]}>
              {[60, 160, 260, 360].map((x) => <rect key={x} x={x} y={30} width={60} height={40} rx={6} fill="#B8C2CC" stroke={INK} strokeWidth={4} />)}
            </WorldSvg>
            <Cutout sp={S.dot_surprised} x={240 + 30 * Math.sin(t * 0.8)} y={200 + 14 * Math.sin(t * 1.1)} w={110} rot={25 * Math.sin(t * 0.6)} />
            <Txt x={240} y={310} size={34}>falling together</Txt>
          </Card>
        ) : null}
        <Tag t={t} t0={same - 0.05} x={300} y={980} size={44} color={GOLD}>same rate as the station</Tag>
      </>
    );
  }
  // drag, the reboost, and the planned end around 2030
  const sink = easeInOutCubic(progress(t, drags - 0.2, push)) * 40;
  const boost = easeInOutCubic(progress(t, push, push + 1.4)) * 40;
  const end = easeInOutCubic(progress(t, cue(5, 'steer it down'), ocean + 1.2));
  const a = (t - evenSo) * 0.9;
  const r = ORBIT - sink + boost - end * (ORBIT - EARTH.r);
  const sx = EARTH.x + r * Math.sin(a);
  const sy = EARTH.y - r * Math.cos(a);
  const firing = t > push - 0.1 && t < push + 1.4;
  return (
    <>
      <Space t={t} />
      <Earth x={EARTH.x} y={EARTH.y} r={EARTH.r} />
      <WorldSvg box={[0, 0, 1080, 1080]}>
        <circle cx={EARTH.x} cy={EARTH.y} r={ORBIT} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeDasharray="12 12" opacity={0.5} />
        {t > cue(5, 'tiny bit of air') - 0.1 && t < y2030
          ? Array.from({length: 30}, (_, i) => {
              const aa = rand(i + 1) * Math.PI * 2;
              const rr = ORBIT - 30 + rand(i + 4) * 60;
              return <circle key={i} cx={EARTH.x + rr * Math.cos(aa + t * 0.2)} cy={EARTH.y + rr * Math.sin(aa + t * 0.2)} r={3} fill="#C9E7FF" opacity={0.6} />;
            })
          : null}
        {firing ? <circle cx={sx - 40 * Math.cos(a)} cy={sy - 40 * Math.sin(a)} r={16 + 6 * Math.sin(t * 30)} fill="#FFB347" stroke={INK} strokeWidth={4} /> : null}
        {t > ocean - 0.2 ? <circle cx={EARTH.x + (EARTH.r - 6) * Math.sin(a)} cy={EARTH.y - (EARTH.r - 6) * Math.cos(a)} r={18} fill="none" stroke={GOLD} strokeWidth={6} /> : null}
      </WorldSvg>
      {end < 0.98 ? <Cutout sp={S.station} x={sx} y={sy} w={150 * (1 - 0.5 * end)} rot={90 + (a * 180) / Math.PI} /> : null}
      <Tag t={t} t0={cue(5, 'tiny bit of air') - 0.05} t1={push} x={540} y={100} size={52}>a tiny bit of air</Tag>
      <Tag t={t} t0={push - 0.05} t1={y2030} x={540} y={100} size={52} color={GOLD}>a push back up</Tag>
      <Tag t={t} t0={y2030 - 0.05} x={540} y={100} size={64} color={GOLD}>around 2030</Tag>
      <Tag t={t} t0={ocean - 0.05} x={540} y={980} size={48}>a remote part of the ocean</Tag>
    </>
  );
};

// ================================================================================================ 6 Everything is falling
export const S6: React.FC<P> = ({t}) => {
  const speed = cue(6, 'You speed up');
  const record = cue(6, 'A record can be');
  const fabric = cue(6, 'A few square metres');
  const sideways = cue(6, 'And if you move sideways');
  const everything = cue(6, 'Everything is falling');
  if (t < speed - 0.2) {
    return (
      <>
        <Sky t={t} rise={60} ground={FLOOR} />
        <Tag t={t} t0={secStart(6) - 0.3} x={540} y={250} size={96}>What actually happens</Tag>
        <Tag t={t} t0={secStart(6) + 0.1} x={540} y={370} size={110} color={GOLD}>when you fall</Tag>
        <DotRig t={t} swaps={[{at: 0, pose: 'dot_aha'}]} x={540} y={FLOOR} headR={78} />
      </>
    );
  }
  if (t < everything - 0.2) {
    return (
      <>
        <Paper />
        <Promise t={t} at={[speed, record, fabric, sideways]} />
      </>
    );
  }
  const a = (t - everything) * 0.9;
  return (
    <>
      <Space t={t} />
      <Earth x={EARTH.x} y={EARTH.y} r={EARTH.r} />
      <WorldSvg box={[0, 0, 1080, 1080]}>
        <circle cx={EARTH.x} cy={EARTH.y} r={ORBIT} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeDasharray="12 12" opacity={0.6} />
      </WorldSvg>
      <Cutout sp={S.station} x={EARTH.x + ORBIT * Math.sin(a)} y={EARTH.y - ORBIT * Math.cos(a)} w={150} rot={90 + (a * 180) / Math.PI} />
      <Tag t={t} t0={everything} x={540} y={110} size={72} color={GOLD}>Everything is falling.</Tag>
      <Tag t={t} t0={cue(6, 'very good at missing') - 0.05} x={540} y={980} size={52}>some things just keep missing</Tag>
    </>
  );
};

export const PARTS = [S1, S2, S3, S4, S5, S6];
