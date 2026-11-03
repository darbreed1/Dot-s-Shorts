import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Mixer} from '../../kit/audio';
import {Captions} from '../../kit/Captions';
import {FPS, SHOT} from './beats';
import {CUES} from './cues';
import {WORDS} from './captions';
import {Cutaway, Gas, Outside, Source, Squeeze} from './Scenes';

// Five screen-space scenes: the mountain in the desert (start and end), where fallout comes from, the squeeze and the
// ordinary blast, the enrichment gas, and the gas inside the mountain. Captions sit below the ground line.
export const Pickaxe: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const scene =
    t < SHOT.source || t >= SHOT.mountain2 ? <Outside t={t} /> :
    t < SHOT.squeeze ? <Source t={t} /> :
    t < SHOT.gas ? <Squeeze t={t} /> :
    t < SHOT.cutaway ? <Gas t={t} /> : <Cutaway t={t} />;
  return (
    <AbsoluteFill style={{background: '#F6EBD6'}}>
      {scene}
      <Captions t={t} words={WORDS} y={0.74} />
      <Mixer cues={CUES} />
    </AbsoluteFill>
  );
};
