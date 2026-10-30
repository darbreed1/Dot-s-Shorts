import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/LilitaOne';
import {clamp01, easeOutBack} from './anim';

// Burned-in captions: 1-3 words per group (split at punctuation, after 3 words, or at a pause), the spoken word
// highlighted, a small pop-in per group. Sizes derive from the composition size. Words come from
// images/lib/captions.py (script spelling, voice timing).
const {fontFamily} = loadFont('normal', {weights: ['400'], subsets: ['latin']});

export type CapWord = {readonly w: string; readonly s: number; readonly e: number};

const groupWords = (words: readonly CapWord[]) => {
  const groups: CapWord[][] = [];
  let cur: CapWord[] = [];
  words.forEach((w, i) => {
    const prev = words[i - 1];
    if (cur.length && (cur.length >= 3 || /[.,?!]$/.test(prev.w) || w.s - prev.e > 0.25)) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
  });
  if (cur.length) groups.push(cur);
  return groups;
};

export const Captions: React.FC<{
  t: number;
  words: readonly CapWord[];
  enabled?: boolean;
  /** vertical centre as a fraction of the height (default 0.62, inside the 55-72 % band) - may vary per beat */
  y?: number;
  highlight?: string;
}> = ({t, words, enabled = true, y = 0.62, highlight = '#F2C14E'}) => {
  const {width, height} = useVideoConfig();
  const groups = React.useMemo(() => groupWords(words), [words]);
  if (!enabled) return null;
  let gi = -1;
  groups.forEach((g, i) => {
    if (g[0].s <= t) gi = i;
  });
  if (gi < 0) return null;
  const g = groups[gi];
  const next = groups[gi + 1];
  const last = g[g.length - 1];
  // stay up until the next group, but not across a long silence
  const until = next && next[0].s - last.e < 0.6 ? next[0].s : last.e + 0.35;
  if (t >= until) return null;

  const vertical = height >= width;
  const size = (vertical ? 84 / 1920 : 64 / 1080) * height;
  const pop = 0.85 + 0.15 * easeOutBack(clamp01((t - g[0].s) / 0.16), 2.4);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          // keep clear of the right ~14 % (platform buttons): centre the text a little left of the middle
          left: vertical ? width * 0.07 : width * 0.15,
          width: vertical ? width * 0.79 : width * 0.7,
          top: (vertical ? y : 0.84) * height - size * 0.7,
          textAlign: 'center',
          fontFamily,
          fontSize: size,
          lineHeight: 1.1,
          letterSpacing: size * 0.01,
          transform: `scale(${pop})`,
          transformOrigin: '50% 50%',
        }}
      >
        {g.map((w, i) => (
          <span
            key={i}
            style={{
              color: t >= w.s && (t < w.e + 0.05 || i === g.length - 1) && t >= w.s ? highlight : '#FFFFFF',
              WebkitTextStroke: `${size * 0.17}px #15151C`,
              paintOrder: 'stroke fill',
              marginRight: i < g.length - 1 ? size * 0.25 : 0,
              display: 'inline-block',
            }}
          >
            {w.w}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
