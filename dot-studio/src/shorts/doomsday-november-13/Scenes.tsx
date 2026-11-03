import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeInOutCubic, easeOutBack, lerp, popScale, progress, rand, wobble} from '../../kit/anim';
import {DesignSpace} from '../../kit/DesignSpace';
import {Dot, DotSprite} from '../../kit/Dot';
import {Label} from '../../kit/Label';
import {fontFamily} from '../../kit/font';
import {watchTaps} from '../../kit/moves';
import {Pictogram} from '../../kit/effects/Pictogram';
import {DrawnCircle, Glint} from '../../kit/effects/small';
import {DOT_SWAPS, SHOT, T} from './beats';
import {S} from './sprites';

// Every scene is drawn in a 1080x1920 design space; Dot stands on a floor line at FLOOR (captions sit below it).
const INK = '#15151C';
const GOLD = '#F2C14E';
const RED = '#E8483F';
const FLOOR = 1250;
const dots = S as unknown as Record<string, DotSprite>;

const Text: React.FC<{x: number; y: number; size: number; color?: string; stroke?: number; children: React.ReactNode; w?: number; align?: 'left' | 'center'}> = ({
  x, y, size, color = INK, stroke = 0, children, w = 1000, align = 'center',
}) => (
  <div
    style={{
      position: 'absolute', left: align === 'center' ? x - w / 2 : x, top: y - size * 0.6, width: w, textAlign: align,
      fontFamily, fontSize: size, lineHeight: 1.1, color, whiteSpace: 'nowrap',
      WebkitTextStroke: stroke ? `${stroke}px ${INK}` : undefined, paintOrder: 'stroke fill',
    }}
  >
    {children}
  </div>
);

/** The black cat strolling along the floor between t0 and t1 (feet on y). */
const Cat: React.FC<{t: number; t0: number; t1: number; x0: number; x1: number; y: number; h: number}> = ({t, t0, t1, x0, x1, y, h}) => {
  if (t < t0 || t > t1) return null;
  const u = (t - t0) / (t1 - t0);
  const sp = S.black_cat;
  const s = h / sp.h;
  const bob = 5 * Math.abs(Math.sin(2 * Math.PI * 1.6 * (t - t0)));
  return (
    <Img
      src={staticFile(sp.src)}
      style={{position: 'absolute', left: lerp(x0, x1, u) - sp.feet[0] * s, top: y - sp.feet[1] * s - bob, width: sp.w * s, height: sp.h * s}}
    />
  );
};

// ------------------------------------------------------------------------------------------- the room
const CAL = {x: 500, y: 250, w: 500, h: 760};

export const Room: React.FC<{t: number}> = ({t}) => {
  // doom: the window sky turns stormy on "2026", one lightning flash, the room dims, then recovers
  const doom = easeInOutCubic(progress(t, T.y2026 - 0.1, T.y2026 + 0.3)) * (1 - easeInOutCubic(progress(t, T.that - 0.6, T.that)));
  const flash = t > T.y2026 + 0.05 && t < T.y2026 + 0.13 ? 1 : t > T.y2026 + 0.22 && t < T.y2026 + 0.27 ? 0.6 : 0;
  const tremble = t < T.that ? 1.6 * Math.sin(2 * Math.PI * 9 * t) + 0.8 * Math.sin(2 * Math.PI * 5.3 * t) : 0;
  const sky = (a: number[], b: number[]) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], doom))).join(',')})`;
  return (
    <DesignSpace background="#E9DCC9">
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {/* window */}
        <rect x={60} y={250} width={300} height={330} fill={sky([140, 203, 240], [58, 42, 92])} stroke={INK} strokeWidth={10} />
        {doom > 0.3 ? (
          <path d="M230,262 L190,380 L225,380 L180,500" fill="none" stroke="#FFE27A" strokeWidth={8} strokeLinejoin="round" opacity={flash > 0 ? 1 : 0.25 * doom} />
        ) : null}
        <line x1={210} y1={250} x2={210} y2={580} stroke={INK} strokeWidth={8} />
        <line x1={60} y1={415} x2={360} y2={415} stroke={INK} strokeWidth={8} />
        <rect x={40} y={575} width={340} height={26} fill="#C9B79A" stroke={INK} strokeWidth={8} />
        {/* floor */}
        <rect x={0} y={FLOOR} width={1080} height={700} fill="#B07A4A" />
        <line x1={0} y1={FLOOR} x2={1080} y2={FLOOR} stroke={INK} strokeWidth={8} />
        {Array.from({length: 7}, (_, i) => (
          <line key={i} x1={0} y1={FLOOR + 70 + i * 90} x2={1080} y2={FLOOR + 70 + i * 90} stroke="#94633A" strokeWidth={5} />
        ))}
        {/* the calendar */}
        <rect x={CAL.x + 14} y={CAL.y + 14} width={CAL.w} height={CAL.h} rx={18} fill="#CDBFA8" />
        <rect x={CAL.x} y={CAL.y} width={CAL.w} height={CAL.h} rx={18} fill="#FFFDF6" stroke={INK} strokeWidth={10} />
        <path d={`M${CAL.x},${CAL.y + 170} L${CAL.x},${CAL.y + 18} Q${CAL.x},${CAL.y} ${CAL.x + 18},${CAL.y} L${CAL.x + CAL.w - 18},${CAL.y} Q${CAL.x + CAL.w},${CAL.y} ${CAL.x + CAL.w},${CAL.y + 18} L${CAL.x + CAL.w},${CAL.y + 170} Z`} fill={RED} stroke={INK} strokeWidth={10} />
        {Array.from({length: 6}, (_, i) => (
          <rect key={i} x={CAL.x + 50 + i * 78} y={CAL.y - 34} width={22} height={64} rx={11} fill="#B9BFC7" stroke={INK} strokeWidth={6} />
        ))}
      </svg>
      <Text x={CAL.x + CAL.w / 2} y={CAL.y + 92} size={64} color="#FFFFFF" stroke={9}>
        NOVEMBER 2026
      </Text>
      <Text x={CAL.x + CAL.w / 2} y={CAL.y + 420} size={330}>
        13
      </Text>
      <Text x={CAL.x + CAL.w / 2} y={CAL.y + 660} size={92} color={RED}>
        FRIDAY
      </Text>
      <DrawnCircle t={t} t0={T.th13 - 0.05} t1={T.th13 + 0.5} x={CAL.x + CAL.w / 2} y={CAL.y + 430} r={185} color={RED} ink={9} />
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${tremble}px, 0)`}}>
        <Dot t={t} sprites={dots} swaps={DOT_SWAPS} feet={{x: 250, y: FLOOR}} headR={92} bounces={watchTaps(T.that + 0.1)} />
      </div>
      <Cat t={t} t0={T.friday - 0.2} t1={T.that + 0.2} x0={-260} x1={1360} y={FLOOR + 40} h={270} />
      <Label t={t} t0={T.y1960 - 0.1} x={290} y={500} size={96} color={GOLD}>
        1960
      </Label>
      {/* dim the room on the doom beat, plus the lightning flash */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, background: '#1B1530', opacity: 0.32 * doom}} />
      {flash > 0 ? <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, background: '#FFFFFF', opacity: 0.35 * flash}} /> : null}
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- the paper
export const Paper: React.FC<{t: number}> = ({t}) => {
  const pop = easeOutBack(clamp01((t - SHOT.paper - 0.05) / 0.35), 1.6);
  const push = lerp(1, 1.07, easeInOutCubic(progress(t, SHOT.paper, SHOT.chart)));
  return (
    <DesignSpace background="#5B4636">
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '540px 620px', transform: `scale(${push})`}}>
        <div style={{position: 'absolute', left: 540, top: 620, transformOrigin: '0 0', transform: `rotate(-2.5deg) scale(${0.6 + 0.4 * pop})`, opacity: clamp01(pop * 3)}}>
          <svg width={860} height={980} style={{position: 'absolute', left: -430, top: -490, overflow: 'visible'}}>
            <rect x={14} y={16} width={840} height={960} fill="#3E2F25" />
            <rect x={0} y={0} width={840} height={960} fill="#F4E8C8" stroke={INK} strokeWidth={8} />
            <line x1={60} y1={110} x2={780} y2={110} stroke="#8C7B5E" strokeWidth={4} />
            {Array.from({length: 11}, (_, i) => (
              <rect key={i} x={70} y={430 + i * 34} width={i % 4 === 3 ? 380 : 700} height={12} rx={6} fill="#B8A882" />
            ))}
            {/* a little hand-drawn curve in the corner of the page */}
            <path d="M560,900 L560,820 M560,900 L790,900" stroke={INK} strokeWidth={4} fill="none" />
            <path d="M565,895 C650,893 710,880 742,850 C760,830 770,800 774,790" stroke={RED} strokeWidth={5} fill="none" />
          </svg>
          <Text x={0} y={-418} size={40} color="#6B5A3E">
            1960
          </Text>
          <Text x={0} y={-300} size={96}>
            DOOMSDAY:
          </Text>
          <Text x={0} y={-190} size={50}>
            Friday, 13 November,
          </Text>
          <Text x={0} y={-128} size={50}>
            A.D. 2026
          </Text>
        </div>
      </div>
      <Glint t={t} t0={T.paper + 0.05} x={850} y={210} r={34} ink={4} />
      <Label t={t} t0={T.journal - 0.05} x={540} y={1170} size={84} color={GOLD}>
        the journal Science
      </Label>
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- the chart
const CX0 = 130;
const CX1 = 800;
const CY0 = 900; // the x axis
const CY1 = 170; // the chart's top edge
const T_INF = 2026.87; // where the 1960 curve reaches infinity
const K = 200.6; // billions x years: the curve passes ~3 billion in 1960 (shape only)
const curveBn = (year: number) => K / (T_INF - year);
const yOf = (bn: number) => CY0 - (bn / 12) * (CY0 - CY1);
type Range = readonly [number, number];
/** The x axis shows year 1-2030 at first; on the return it zooms into 1880-2030 so the last decades are readable. */
const rangeAt = (t: number): Range => {
  if (t < SHOT.chart2) return [0, 2030];
  const u = easeInOutCubic(progress(t, SHOT.chart2 + 0.05, SHOT.chart2 + 0.75));
  return [lerp(0, 1880, u), 2030];
};
const xOf = (r: Range, year: number) => CX0 + ((year - r[0]) / (r[1] - r[0])) * (CX1 - CX0);
// world population, billions (UN estimates), for the "real numbers" line
const REAL: readonly (readonly [number, number])[] = [
  [1900, 1.6], [1920, 1.9], [1940, 2.3], [1950, 2.5], [1960, 3.0], [1970, 3.7], [1980, 4.4], [1990, 5.3], [2000, 6.1], [2010, 6.9], [2020, 7.8], [2026, 8.2],
];
const ESTIMATES = [1, 200, 400, 600, 800, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1650, 1700, 1750, 1800, 1850, 1880, 1900, 1920, 1930, 1940, 1950, 1958];

const curvePath = (r: Range, yearEnd: number) => {
  const years: number[] = [];
  const y0 = Math.max(1, r[0]);
  const coarse = (r[1] - r[0]) / 80;
  for (let y = y0; y < Math.min(yearEnd, 2000); y += coarse) years.push(y);
  for (let y = Math.max(y0, 2000); y < Math.min(yearEnd, 2020); y += 0.5) years.push(y);
  for (let y = 2020; y < yearEnd; y += 0.1) years.push(y);
  years.push(yearEnd);
  return 'M' + years.filter((y) => y <= yearEnd).map((y) => `${xOf(r, y).toFixed(1)},${yOf(curveBn(y)).toFixed(1)}`).join(' L');
};

const realPath = (r: Range, yearEnd: number) => {
  const pts: string[] = [];
  for (let i = 0; i < REAL.length; i++) {
    const [y, v] = REAL[i];
    if (y <= yearEnd) pts.push(`${xOf(r, y)},${yOf(v)}`);
    else {
      const [py, pv] = REAL[i - 1];
      pts.push(`${xOf(r, yearEnd)},${yOf(lerp(pv, v, (yearEnd - py) / (y - py)))}`);
      break;
    }
  }
  return 'M' + pts.join(' L');
};

const Stroke: React.FC<{d: string; color: string; w: number; dash?: string}> = ({d, color, w, dash}) => (
  <>
    <path d={d} fill="none" stroke={INK} strokeWidth={w + 8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
  </>
);

const FAMILY_AT = T.families - 0.45;

export const Chart: React.FC<{t: number}> = ({t}) => {
  const second = t >= SHOT.chart2;
  const r = rangeAt(t);
  // how far along the 1960 curve has been drawn (year)
  const yearEnd = second
    ? 2026.6
    : t < T.one - 0.05
      ? 0
      : t < T.growth
        ? lerp(1, 1960, easeInOutCubic(progress(t, T.one - 0.05, T.curve + 0.55)))
        : t < T.so
          ? lerp(1960, 2010, easeInOutCubic(progress(t, T.growth, T.up + 0.5)))
          : lerp(2010, 2026.6, easeInOutCubic(progress(t, T.so, T.hit + 0.15)));
  // the real numbers: ride the curve up to ~1990, then fall behind
  const realEnd = !second
    ? 0
    : t < FAMILY_AT
      ? lerp(1900, 2000, easeInOutCubic(progress(t, T.and - 0.1, T.hold + 0.45)))
      : lerp(2000, 2026, easeInOutCubic(progress(t, T.real - 0.1, T.behind + 0.3)));
  const shake = second ? 0 : wobble(t, T.hit, 9, 7, 5);
  const asym = second ? 1 : t > T.exact - 0.1 ? clamp01((t - (T.exact - 0.1)) / 0.3) : 0;
  const researchers = (i: number) => popScale(t, T.three + i * 0.12, T.growth - 0.2, 0.3, 0.25);
  const zoomed = clamp01(r[0] / 1880);
  return (
    <DesignSpace background="#FBF6E9">
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${shake * 0.6}px, ${shake}px)`}}>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <defs>
            <clipPath id="plot">
              <rect x={CX0 + 4} y={-600} width={CX1 - CX0 + 200} height={CY0 + 600 - 4} />
            </clipPath>
          </defs>
          {/* graph paper */}
          {Array.from({length: 23}, (_, i) => (
            <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={1920} stroke="#D9E6EE" strokeWidth={3} />
          ))}
          {Array.from({length: 39}, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 50} x2={1080} y2={i * 50} stroke="#D9E6EE" strokeWidth={3} />
          ))}
          {/* floor */}
          <rect x={0} y={FLOOR} width={1080} height={700} fill="#E9DCC9" />
          <line x1={0} y1={FLOOR} x2={1080} y2={FLOOR} stroke={INK} strokeWidth={8} />
          {/* axes */}
          <path d={`M${CX0},${CY1 - 40} L${CX0},${CY0} L${CX1 + 60},${CY0}`} fill="none" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <path d={`M${CX0 - 16},${CY1 - 20} L${CX0},${CY1 - 48} L${CX0 + 16},${CY1 - 20}`} fill="none" stroke={INK} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
          {/* "2,000 years" bracket */}
          {t > T.k2000 - 0.05 && !second ? (
            <g opacity={clamp01((t - T.k2000 + 0.05) / 0.25)}>
              <Stroke d={`M${xOf(r, 1)},${CY0 + 34} L${xOf(r, 2000)},${CY0 + 34}`} color={GOLD} w={7} />
            </g>
          ) : null}
          <g clipPath="url(#plot)">
            {/* the estimates */}
            {ESTIMATES.map((yr, i) => {
              const s = second ? 1 : popScale(t, T.fitted + (i / ESTIMATES.length) * (T.estimates + 0.5 - T.fitted), T.end + 1, 0.22, 0.2);
              if (s <= 0.01) return null;
              const v = curveBn(yr) * (1 + 0.12 * (rand(i + 5) - 0.5));
              return <circle key={i} cx={xOf(r, yr)} cy={yOf(v)} r={11 * s} fill="#4E5E8C" stroke={INK} strokeWidth={4} />;
            })}
            {/* the 1960 curve (dashed once the real numbers come in) */}
            {yearEnd > 1 ? <Stroke d={curvePath(r, yearEnd)} color={RED} w={10} dash={second && zoomed > 0.99 ? '26 18' : undefined} /> : null}
            {/* the real numbers */}
            {realEnd > 1900 ? <Stroke d={realPath(r, realEnd)} color={GOLD} w={14} /> : null}
          </g>
          {asym > 0 ? (
            <line x1={xOf(r, T_INF)} y1={CY0} x2={xOf(r, T_INF)} y2={lerp(CY0, -100, asym)} stroke={RED} strokeWidth={5} strokeDasharray="14 12" opacity={0.8} />
          ) : null}
          {/* the three researchers, then a family */}
          {[0, 1, 2].map((i) => (
            <Pictogram key={i} x={300 + i * 150} y={FLOOR} h={200} color="#4E5E8C" coat hold="pencil" scale={researchers(i)} />
          ))}
          {second
            ? [0, 1, 2, 3, 4, 5].map((i) => {
                const adult = i < 2;
                const s = popScale(t, FAMILY_AT + i * 0.06, i >= 4 ? T.smaller + 0.15 : T.end + 1, 0.28, 0.25);
                return <Pictogram key={i} x={250 + i * 66 + (adult ? 0 : 24)} y={470} h={adult ? 180 : 115} color={['#4E5E8C', RED, GOLD, '#6DBE45', '#9B6ED1', '#3FA7C9'][i]} scale={s} />;
              })
            : null}
        </svg>
        {second ? (
          zoomed > 0.97 ? (
            <>
              <Text x={xOf(r, 1900)} y={CY0 + 60} size={40} w={200}>1900</Text>
              <Text x={xOf(r, 1960)} y={CY0 + 60} size={40} w={200}>1960</Text>
            </>
          ) : null
        ) : (
          <Text x={CX0 + 20} y={CY0 + 80} size={40} w={200}>year 1</Text>
        )}
        <Text x={xOf(r, 2026)} y={CY0 + 60} size={40} w={200} color={RED}>
          2026
        </Text>
        <div style={{position: 'absolute', left: CX0 - 88, top: CY1 + 180, transformOrigin: '0 0', transform: 'rotate(-90deg)', fontFamily, fontSize: 44, color: INK, whiteSpace: 'nowrap'}}>
          people
        </div>
        <Label t={t} t0={T.k2000 - 0.05} t1={SHOT.warning} x={xOf(r, 1000)} y={CY0 + 92} size={64} color={GOLD}>
          2,000 years
        </Label>
        <Label t={t} t0={second ? SHOT.chart2 - 1 : T.infinite - 0.05} x={xOf(r, T_INF) + 70} y={130} size={150} color={RED}>
          ∞
        </Label>
        <Label t={t} t0={second ? SHOT.chart2 - 1 : T.friday2 - 0.1} x={xOf(r, T_INF) + 110} y={CY0 - 50} size={44}>
          Fri 13 Nov
        </Label>
        {second ? (
          <>
            <Label t={t} t0={T.real - 0.05} x={xOf(r, 2026) - 40} y={yOf(8.2) + 80} size={64} color={GOLD}>
              real
            </Label>
            <Label t={t} t0={T.curve3 - 0.05} x={xOf(r, 1995) - 150} y={yOf(10)} size={60} color={RED}>
              1960 curve
            </Label>
          </>
        ) : null}
        <Dot t={t} sprites={dots} swaps={DOT_SWAPS} feet={{x: 945, y: FLOOR}} headR={64} bounces={[T.hold, T.behind]} />
        <Cat t={t} t0={T.fell - 0.2} t1={T.end + 0.4} x0={-260} x1={1250} y={FLOOR + 30} h={170} />
      </div>
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- warning, not prophecy
export const Warning: React.FC<{t: number}> = ({t}) => {
  const sign = easeOutBack(clamp01((t - (T.warning - 0.08)) / 0.32), 2.2);
  const ball = easeOutBack(clamp01((t - (T.not - 0.05)) / 0.32), 2.2);
  const stamp = clamp01((t - (T.prophecy - 0.02)) / 0.14);
  const sparkle = t < T.prophecy ? 0.5 + 0.5 * Math.sin(2 * Math.PI * 2.2 * t) : 0.15;
  return (
    <DesignSpace background="#F6E7C8">
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        <rect x={0} y={FLOOR} width={1080} height={700} fill="#E2CFA8" />
        <line x1={0} y1={FLOOR} x2={1080} y2={FLOOR} stroke={INK} strokeWidth={8} />
        {/* warning sign on a post */}
        {sign > 0.01 ? (
          <g transform={`translate(250 ${FLOOR}) scale(${sign}) translate(-250 ${-FLOOR})`}>
            <rect x={238} y={720} width={24} height={FLOOR - 720} fill="#8C8C94" stroke={INK} strokeWidth={6} />
            <path d="M250,440 L420,740 L80,740 Z" fill={GOLD} stroke={INK} strokeWidth={12} strokeLinejoin="round" />
            <rect x={238} y={540} width={24} height={110} rx={10} fill={INK} />
            <circle cx={250} cy={690} r={16} fill={INK} />
          </g>
        ) : null}
        {/* crystal ball on a stand */}
        {ball > 0.01 ? (
          <g transform={`translate(830 ${FLOOR}) scale(${ball}) translate(-830 ${-FLOOR})`}>
            <path d={`M740,${FLOOR} L770,${FLOOR - 90} L890,${FLOOR - 90} L920,${FLOOR} Z`} fill="#C9962E" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
            <circle cx={830} cy={FLOOR - 230} r={150} fill="#8E7CC3" stroke={INK} strokeWidth={10} />
            <circle cx={790} cy={FLOOR - 290} r={40} fill="#FFFFFF" opacity={0.35} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={830 + 60 * Math.cos(i * 2.1 + t * 2)} cy={FLOOR - 230 + 50 * Math.sin(i * 2.1 + t * 2)} r={10} fill="#FFFFFF" opacity={sparkle} />
            ))}
          </g>
        ) : null}
        {/* the big red X */}
        {stamp > 0 ? (
          <g transform={`translate(830 ${FLOOR - 230}) scale(${lerp(1.6, 1, stamp)})`} opacity={stamp}>
            <path d="M-130,-130 L130,130 M130,-130 L-130,130" stroke={INK} strokeWidth={62} strokeLinecap="round" />
            <path d="M-130,-130 L130,130 M130,-130 L-130,130" stroke={RED} strokeWidth={42} strokeLinecap="round" />
          </g>
        ) : null}
      </svg>
      <Label t={t} t0={T.warning} x={250} y={380} size={76} color={GOLD}>
        warning
      </Label>
      <Label t={t} t0={T.not + 0.05} x={830} y={380} size={76}>
        prophecy
      </Label>
      <Dot t={t} sprites={dots} swaps={DOT_SWAPS} feet={{x: 540, y: FLOOR}} headR={80} bounces={[T.warning, T.prophecy]} />
    </DesignSpace>
  );
};
