import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Label} from '../../kit/Label';
import {Stage} from '../../kit/Stage';
import {Cutout, GOLD, Sky, Streaks} from './parts';
import {S} from './sprites';

// YouTube thumbnail (16:9): the space station high up where the sky turns to space, Dot in freefall below it,
// "THE ISS IS FALLING / and so are you". Rendered with images/lib/still.mjs, saved as
// out/falling-longform-thumbnail.jpg (1280x720).
export const FallingThumbnail: React.FC = () => {
  const t = 2.4; // a frozen moment of the cloud drift and streaks
  return (
    <AbsoluteFill style={{backgroundColor: '#101A3A'}}>
      <Stage background="#101A3A">
        <Sky t={t} space={1} />
        <Streaks t={t} x={1060} w={420} n={16} />
        <Cutout sp={S.station} x={1230} y={245} w={400} rot={18} />
        <Cutout sp={S.dot_freefall} x={1020} y={700} w={760} rot={-10} />
        <Label t={t} t0={-5} x={150} y={250} size={200} color="#FFFFFF">THE ISS</Label>
        <Label t={t} t0={-5} x={150} y={470} size={200} color={GOLD}>IS FALLING</Label>
        <Label t={t} t0={-5} x={150} y={680} size={110} color="#FFFFFF">and so are you</Label>
      </Stage>
    </AbsoluteFill>
  );
};
