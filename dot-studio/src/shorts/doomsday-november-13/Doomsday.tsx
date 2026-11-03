import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Mixer} from '../../kit/audio';
import {Captions} from '../../kit/Captions';
import {FPS, inChart, inPaper, inRoom} from './beats';
import {CUES} from './cues';
import {WORDS} from './captions';
import {Chart, Paper, Room, Warning} from './Scenes';

// Four screen-space scenes: the room with the calendar, the 1960 paper, the population chart (twice) and the
// warning-vs-prophecy beat. Captions sit below the floor line in every scene.
export const Doomsday: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const scene = inRoom(t) ? <Room t={t} /> : inPaper(t) ? <Paper t={t} /> : inChart(t) ? <Chart t={t} /> : <Warning t={t} />;
  return (
    <AbsoluteFill style={{background: '#FBF6E9'}}>
      {scene}
      <Captions t={t} words={WORDS} y={0.72} />
      <Mixer cues={CUES} />
    </AbsoluteFill>
  );
};
