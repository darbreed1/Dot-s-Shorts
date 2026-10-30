import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, easeInOutCubic, easeOutBack, easeOutCubic, kick, lerp, popScale, progress} from '../../kit/anim';
import {DesignSpace} from '../../kit/DesignSpace';
import {Label} from '../../kit/Label';
import {Fingerprint} from '../../kit/effects/Fingerprint';
import {Glint} from '../../kit/effects/small';
import {WorldSvg} from '../../kit/effects/WorldSvg';
import {SHOT, T} from './beats';
import {S} from './sprites';

// The workshop 2,200 years ago, the fingertip comparison and the 79 prints, drawn in a 1080x1920 design space.
const INK = '#15151C';
const GOLD = '#F2C14E';
const CLAY = '#9C5530';

type Sprite = {src: string; w: number; h: number; feet: readonly number[]};
/** A cut-out standing with its feet at (x, y), `height` tall, with an optional pop / bounce scale about the feet. */
const Stand: React.FC<{sp: Sprite; x: number; y: number; height: number; sx?: number; sy?: number; flip?: boolean; filter?: string}> = ({
  sp, x, y, height, sx = 1, sy = 1, flip = false, filter,
}) => {
  const s = height / sp.h;
  return (
    <div style={{position: 'absolute', left: x, top: y, transformOrigin: '0 0', transform: `scale(${sx * (flip ? -1 : 1)}, ${sy})`}}>
      <Img src={staticFile(sp.src)} style={{position: 'absolute', left: -sp.feet[0] * s, top: -sp.feet[1] * s, width: sp.w * s, height: sp.h * s, filter}} />
    </div>
  );
};

// ------------------------------------------------------------------------------------------- the workshop
// A warm clay workshop: the unfinished warrior in the middle, the man, the woman and the child working on it.
const WARRIOR = {x: 540, y: 1180, h: 760};
const PRINTS = [
  {x: 470, y: 760, by: 'man', at: T.left},
  {x: 600, y: 900, by: 'woman', at: T.left + 0.22},
  {x: 520, y: 1010, by: 'child', at: T.left + 0.44},
] as const;
const WORKERS = [
  {sp: S.worker_man, x: 250, y: 1200, h: 700, at: T.makers},
  {sp: S.worker_woman, x: 840, y: 1210, h: 670, at: T.makers + 0.12, flip: true},
  {sp: S.worker_child, x: 760, y: 1330, h: 470, at: T.makers + 0.24, flip: true},
];

export const Workshop: React.FC<{t: number}> = ({t}) => {
  // slow push toward the prints on "in the clay"
  const z = 1 + 0.55 * easeInOutCubic(progress(t, 8.95, SHOT.ridges));
  const focus = {x: 530, y: 880};
  return (
    <DesignSpace background="#F3DDB2">
      <div style={{position: 'absolute', inset: 0, transformOrigin: `${focus.x}px ${focus.y}px`, transform: `scale(${z})`}}>
        <WorldSvg box={[-200, 0, 1280, 1920]}>
          {/* wall with drying shelves, floor */}
          <rect x={-200} y={0} width={1480} height={1240} fill="#F3DDB2" />
          {[300, 520].map((y) => (
            <g key={y}>
              <rect x={-200} y={y} width={1480} height={22} fill="#B97C4E" stroke={INK} strokeWidth={6} />
              {[-60, 120, 820, 1000].map((x, i) => (
                <path key={i} d={`M${x},${y} q10,-70 50,-80 q40,10 50,80 Z`} fill="#C9774A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
              ))}
            </g>
          ))}
          <rect x={-200} y={1180} width={1480} height={740} fill="#C99A6B" />
          <line x1={-200} y1={1180} x2={1280} y2={1180} stroke={INK} strokeWidth={8} />
          {[1300, 1460, 1660].map((y) => (
            <line key={y} x1={-200} y1={y} x2={1280} y2={y} stroke="#B3845A" strokeWidth={6} />
          ))}
        </WorldSvg>
        <Stand sp={S.warrior} x={WARRIOR.x} y={WARRIOR.y} height={WARRIOR.h} />
        {PRINTS.map((p, i) => {
          const r = clamp01((t - p.at) / 0.25);
          return r > 0 ? (
            <div key={i} style={{position: 'absolute', left: 0, top: 0, transform: `scale(${1 + kick(t, p.at, 0.25, 4, 8)})`, transformOrigin: `${p.x}px ${p.y}px`}}>
              <Fingerprint x={p.x} y={p.y} rx={p.by === 'child' ? 34 : p.by === 'woman' ? 41 : 48} ry={p.by === 'child' ? 44 : p.by === 'woman' ? 53 : 62}
                ridges={8} color="#6E3418" width={4.5} reveal={r} rot={-12 + i * 14} seed={i + 2} />
            </div>
          ) : null;
        })}
        {WORKERS.map((w, i) => {
          const pop = popScale(t, w.at, 99, 0.3);
          // a little lean-in press on "left fingerprints"
          const press = kick(t, PRINTS[i].at - 0.08, -0.05, 4, 7);
          return pop > 0 ? <Stand key={i} sp={w.sp} x={w.x} y={w.y} height={w.h} sx={pop * (1 - press * 0.6)} sy={pop * (1 + press)} flip={w.flip} /> : null;
        })}
        <Glint t={t} t0={T.clay - 0.05} x={PRINTS[0].x + 55} y={PRINTS[0].y - 55} r={38} />
      </div>
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- tighter ridges
// Two fingertips with the SAME number of ridges: the smaller tip packs them tighter. A same-size square on each
// shows more ridge lines crossing it on the small one.
const BIG = {x: 330, y: 640, rx: 190, ry: 245};
const SMALL = {x: 790, y: 690, rx: 118, ry: 152};
const SQ = 70; // half size of the comparison square

export const Ridges: React.FC<{t: number}> = ({t}) => {
  const bigIn = popScale(t, SHOT.ridges + 0.05, 99, 0.3);
  const smallIn = popScale(t, T.hands, 99, 0.3);
  const reveal = (t0: number) => easeOutCubic(clamp01((t - t0) / 0.6));
  const sq = popScale(t, T.tighter, 99, 0.25);
  const flash = 1 + kick(t, T.ridges, 0.12, 4, 7);
  const square = (c: {x: number; y: number}) => (
    <WorldSvg box={[c.x - SQ - 12, c.y - SQ - 12, c.x + SQ + 12, c.y + SQ + 12]}>
      <g transform={`translate(${c.x} ${c.y}) scale(${sq * flash})`}>
        <rect x={-SQ} y={-SQ} width={SQ * 2} height={SQ * 2} fill="none" stroke={INK} strokeWidth={14} rx={8} />
        <rect x={-SQ} y={-SQ} width={SQ * 2} height={SQ * 2} fill="none" stroke={GOLD} strokeWidth={7} rx={8} strokeDasharray="16 10" />
      </g>
    </WorldSvg>
  );
  return (
    <DesignSpace background="#F6E7C8">
      {bigIn > 0 ? (
        <div style={{position: 'absolute', inset: 0, transform: `scale(${bigIn})`, transformOrigin: `${BIG.x}px ${BIG.y}px`}}>
          <Fingerprint x={BIG.x} y={BIG.y} rx={BIG.rx} ry={BIG.ry} ridges={11} fill="#F2C9A0" outline={10} color="#A0603E" reveal={reveal(SHOT.ridges)} seed={4} />
        </div>
      ) : null}
      {smallIn > 0 ? (
        <div style={{position: 'absolute', inset: 0, transform: `scale(${smallIn})`, transformOrigin: `${SMALL.x}px ${SMALL.y}px`}}>
          <Fingerprint x={SMALL.x} y={SMALL.y} rx={SMALL.rx} ry={SMALL.ry} ridges={11} fill="#F2C9A0" outline={9} color="#A0603E" reveal={reveal(T.hands)} seed={6} />
        </div>
      ) : null}
      {sq > 0 ? square({x: BIG.x, y: BIG.y + 40}) : null}
      {sq > 0 ? square({x: SMALL.x, y: SMALL.y + 25}) : null}
      {/* who the hands belong to */}
      <Stand sp={S.worker_man} x={BIG.x} y={1110} height={260} sx={popScale(t, SHOT.ridges + 0.15, 99, 0.3)} sy={popScale(t, SHOT.ridges + 0.15, 99, 0.3)} />
      <Stand sp={S.worker_woman} x={SMALL.x - 75} y={1110} height={235} sx={popScale(t, T.women, 99, 0.3)} sy={popScale(t, T.women, 99, 0.3)} flip />
      <Stand sp={S.worker_child} x={SMALL.x + 80} y={1110} height={175} sx={popScale(t, T.children, 99, 0.3)} sy={popScale(t, T.children, 99, 0.3)} flip />
      <Label t={t} t0={T.ridges - 0.05} x={BIG.x} y={330} size={58}>
        wider ridges
      </Label>
      <Label t={t} t0={T.ridges + 0.1} x={SMALL.x} y={460} size={58} color={GOLD}>
        tighter ridges
      </Label>
    </DesignSpace>
  );
};

// ------------------------------------------------------------------------------------------- 79 prints
// 79 print tokens pop into a grid, then sort into three groups: 35 men, 26 women (about a third), 18 children
// (about a fifth). Shares of prints, as the study reports them.
const N = {men: 35, women: 26, children: 18};
const GROUPS = [
  {key: 'women', n: N.women, x: 540, color: '#7FB77E', sp: S.worker_woman, at: T.women2 - 0.35, label: 'about 1/3'},
  {key: 'children', n: N.children, x: 870, color: '#7FB0E0', sp: S.worker_child, at: T.children2 - 0.3, label: 'about 1/5'},
  {key: 'men', n: N.men, x: 210, color: '#C08A5A', sp: S.worker_man, at: T.fifteen + 0.05, label: 'the rest'},
] as const;
// token order: which group each of the 79 belongs to, interleaved so the grid looks mixed
const OWNER: number[] = (() => {
  const out: number[] = [];
  const left = [N.women, N.children, N.men];
  for (let i = 0; out.length < 79; i++) {
    const g = [0, 2, 1, 2, 0, 2][i % 6];
    if (left[g] > 0) {
      out.push(g);
      left[g]--;
    } else {
      const k = left.findIndex((v) => v > 0);
      out.push(k);
      left[k]--;
    }
  }
  return out;
})();

export const Count: React.FC<{t: number}> = ({t}) => {
  const grid = (i: number) => ({x: 160 + (i % 10) * 84, y: 300 + Math.floor(i / 10) * 84});
  const rankIn = (i: number) => OWNER.slice(0, i).filter((g) => g === OWNER[i]).length;
  const slot = (g: number, k: number) => ({x: GROUPS[g].x - 116 + (k % 5) * 58, y: 1000 - Math.floor(k / 5) * 66});
  const stackTop = (n: number) => 1000 - (Math.ceil(n / 5) - 1) * 66 - 32;
  const shown = Math.floor(79 * easeInOutCubic(progress(t, SHOT.count + 0.1, T.seventyNine + 0.35)));
  const counter = Math.min(79, shown);
  return (
    <DesignSpace background="#F6E7C8">
      <WorldSvg box={[0, 0, 1080, 1920]}>
        {OWNER.map((g, i) => {
          if (i >= shown) return null;
          const gr = GROUPS[g];
          const k = rankIn(i);
          const move = easeInOutCubic(clamp01((t - gr.at - k * 0.012) / 0.55));
          const a = grid(i);
          const b = slot(g, k);
          const x = lerp(a.x, b.x, move);
          const y = lerp(a.y, b.y, move);
          const pop = easeOutBack(clamp01((t - (SHOT.count + 0.1 + (i / 79) * (T.seventyNine + 0.25 - SHOT.count))) / 0.15), 2.5);
          const col = move > 0.5 ? gr.color : '#E7B98F';
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${pop})`}>
              <ellipse rx={26} ry={32} fill={col} stroke={INK} strokeWidth={5} />
              <ellipse rx={15} ry={19} fill="none" stroke={CLAY} strokeWidth={3.5} />
              <ellipse rx={7} ry={9} fill="none" stroke={CLAY} strokeWidth={3.5} />
            </g>
          );
        })}
      </WorldSvg>
      {/* the counter, then "one pit" */}
      <Label t={t} t0={SHOT.count + 0.1} t1={T.about - 0.1} x={540} y={1000} size={120} color={GOLD}>
        {`${counter} prints`}
      </Label>
      <Label t={t} t0={T.one} t1={T.about - 0.1} x={540} y={1110} size={60}>
        from one pit
      </Label>
      {GROUPS.map((g, i) => {
        const pop = popScale(t, g.at + 0.35, 99, 0.3);
        return pop > 0 ? (
          <React.Fragment key={i}>
            <Stand sp={g.sp} x={g.x} y={stackTop(g.n) - 12} height={g.key === 'children' ? 215 : g.key === 'women' ? 285 : 300} sx={pop} sy={pop} />
            <Label t={t} t0={g.at + 0.45} x={g.x} y={1085} size={50} color={g.key === 'men' ? '#FFFFFF' : GOLD}>
              {g.label}
            </Label>
          </React.Fragment>
        ) : null;
      })}
    </DesignSpace>
  );
};
