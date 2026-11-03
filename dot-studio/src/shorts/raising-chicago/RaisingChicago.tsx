import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Layer, camAt} from '../../kit/camera';
import {Dot, DotSprite} from '../../kit/Dot';
import {Mixer} from '../../kit/audio';
import {Captions} from '../../kit/Captions';
import {Label} from '../../kit/Label';
import {watchTaps} from '../../kit/moves';
import {CAMERA, DOT_SWAPS, FPS, SHOT, T, inJacks, inRow, inSwamp} from './beats';
import {CUES} from './cues';
import {WORDS} from './captions';
import {Jacks, Row, Swamp} from './Inserts';
import {BuildingA, DOT_X, Skyline, StreetFront, dotFeet} from './Street';
import {S} from './sprites';

// World layout (world px; a layer at Z 1000 is 1:1 at camera z 0). A Chicago street: Dot on a plank walk at the
// left, a big brick building beside him, a far skyline behind. Inserts cut in for the swamp, the jacks and the row.
const Z = {skyline: 2400, street: 1000};
const HEAD_R = 85;

const dots = S as unknown as Record<string, DotSprite>;

export const RaisingChicago: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const cam = camAt(CAMERA, t);
  const insert = inSwamp(t) ? <Swamp t={t} /> : inJacks(t) ? <Jacks t={t} /> : inRow(t) ? <Row t={t} /> : null;
  const feet = dotFeet(t);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(#8CCBF0, #E6F5FA 70%)'}}>
      {insert ?? (
        <>
          <Layer cam={cam} z={Z.skyline}>
            <Skyline />
          </Layer>
          <Layer cam={cam} z={Z.street}>
            <BuildingA t={t} />
            <StreetFront t={t} />
            <Dot
              t={t}
              sprites={dots}
              swaps={DOT_SWAPS}
              feet={feet}
              headR={HEAD_R}
              bounces={[T.chicago, ...watchTaps(T.in2 + 0.1)]}
            />
            <Label t={t} t0={T.y1860 + 0.2} t1={SHOT.jacks + 0.3} x={DOT_X + 60} y={feet.y - HEAD_R * 7.2} size={86}>
              1860
            </Label>
          </Layer>
        </>
      )}
      <Captions t={t} words={WORDS} y={insert ? 0.66 : 0.69} />
      <Mixer cues={CUES} />
    </AbsoluteFill>
  );
};
