import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions} from '../../kit/Captions';
import {Mixer} from '../../kit/audio';
import {Label} from '../../kit/Label';
import {Stage} from '../../kit/Stage';
import {CUES} from './cues';
import {PARTS} from './sections';
import {END, SECTIONS, WORDS} from './timeline';

// "How a computer actually works": six voice sections laid end to end (images/computer/timeline.py). Every
// shot is drawn on the kit Stage, so the same code renders the 16:9 long-form (ComputerLongform) and each chapter as
// a vertical Short (ComputerChapter, chapter n = section n) with its own captions and audio window.
export const FPS = 60;
const LEAD = 0.55; // a section's pictures start a little before its voice
const TAIL = 1.2; // a chapter Short holds a moment after its last word

const Body: React.FC<{t: number; k: number}> = ({t, k}) => {
  const Part = PARTS[k];
  return (
    <Stage background="#2C3150">
      <Part t={t} />
    </Stage>
  );
};

export const ComputerLongform: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const {width} = useVideoConfig();
  let k = 0;
  SECTIONS.forEach((s, i) => {
    if (t >= s.at - LEAD) k = i;
  });
  const sec = SECTIONS[k];
  return (
    <AbsoluteFill style={{backgroundColor: '#2C3150'}}>
      <Body t={t} k={k} />
      {/* chapter chip, top left of the frame, for the first few seconds of each chapter */}
      {k >= 0 ? (
        <Label t={t} t0={sec.at - 0.3} t1={sec.at + 3.4} x={width * 0.04 + sec.title.length * 14} y={70} size={46}>
          {sec.title}
        </Label>
      ) : null}
      <Captions t={t} words={WORDS} />
      <Mixer cues={CUES} />
    </AbsoluteFill>
  );
};
export const LONGFORM_END = END;

/** Start and end (absolute long-form seconds) of chapter n's window. */
export const chapterWindow = (n: number) => {
  const s = SECTIONS[n - 1];
  return {from: s.at - LEAD, to: s.at + s.dur + TAIL};
};

export const ComputerChapter: React.FC<{chapter: number}> = ({chapter}) => {
  const {from, to} = chapterWindow(chapter);
  const t = from + useCurrentFrame() / FPS;
  const {width, height} = useVideoConfig();
  const sec = SECTIONS[chapter - 1];
  const words = React.useMemo(() => WORDS.filter((w) => w.s >= sec.at - 0.05 && w.s <= sec.at + sec.dur + 0.05).map((w) => ({...w, s: w.s - from, e: w.e - from})), [sec, from]);
  return (
    <AbsoluteFill style={{backgroundColor: '#2C3150'}}>
      <Body t={t} k={chapter - 1} />
      {/* the chapter's question stays up as the Short's title, above the stage */}
      <Label t={t} t0={from} x={width / 2} y={height * 0.05} size={Math.round(height * 0.032)} color="#FFFFFF">
        {sec.title}
      </Label>
      <Captions t={t - from} words={words} y={0.78} />
      <Mixer cues={CUES} offset={from} end={to} />
    </AbsoluteFill>
  );
};
