import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Mixer} from '../../kit/audio';
import {Captions} from '../../kit/Captions';
import {FPS, inFossils, inRiver} from './beats';
import {CUES} from './cues';
import {WORDS} from './captions';
import {Fossils, Globe, River} from './Scenes';

// Three screen-space scenes: the prehistoric river (start and end), the fossil count, and the climate globe before
// and after the impact. Captions sit below the bank line in every scene.
export const Crocodiles: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const scene = inRiver(t) ? <River t={t} /> : inFossils(t) ? <Fossils t={t} /> : <Globe t={t} />;
  return (
    <AbsoluteFill style={{background: '#F6D7A7'}}>
      {scene}
      <Captions t={t} words={WORDS} y={0.74} />
      <Mixer cues={CUES} />
    </AbsoluteFill>
  );
};
