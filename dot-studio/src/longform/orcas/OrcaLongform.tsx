import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Captions} from '../../kit/Captions';
import {DesignSpace} from '../../kit/DesignSpace';
import {Mixer} from '../../kit/audio';
import {Label} from '../../kit/Label';
import {CUES} from './cues';
import {H, W} from './parts';
import {S1, S10, S2, S3, S4, S5, S6, S7, S8, S9} from './sections';
import {SECTIONS, WORDS} from './timeline';

// "Why don't wild orcas kill people?" - a 16:9 long-form with Dot, built from ten voice sections laid end to end
// (images/orcas/timeline.py). Each section draws its own shots from its voice cues; a chapter chip names the section.
export const FPS = 60;
const PARTS = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
const LEAD = 0.55; // a section's pictures start a little before its voice

export const OrcaLongform: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let k = 0;
  SECTIONS.forEach((s, i) => {
    if (t >= s.at - LEAD) k = i;
  });
  const Part = PARTS[k];
  const sec = SECTIONS[k];
  return (
    <AbsoluteFill style={{backgroundColor: '#10427A'}}>
      <DesignSpace w={W} h={H}>
        <Part t={t} />
        {/* chapter chip, top left, for the first few seconds of each section */}
        <Label t={t} t0={sec.at - 0.3} t1={sec.at + 3.2} x={60 + sec.title.length * 15} y={70} size={44} color="#FFFFFF">
          {sec.title}
        </Label>
      </DesignSpace>
      <Captions t={t} words={WORDS} />
      <Mixer cues={CUES} />
    </AbsoluteFill>
  );
};
