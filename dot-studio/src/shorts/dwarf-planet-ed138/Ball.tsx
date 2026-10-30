import React from 'react';
import {Img, staticFile} from 'remotion';
import {Brow, Mouth, ObjectFace} from '../../kit/effects/ObjectFace';

// A round cut-out ball (Pluto, the new object) drawn at centre (x, y) with outer radius R, a code face on top,
// and squash/stretch about its centre. Sprite `outer` = [cx, cy, r] of the drawn ball in sprite px.

export type FaceState = {open: number; brow: Brow; mouth: Mouth; look: {x: number; y: number}; squeeze?: boolean};

export const Ball: React.FC<{
  id: string;
  sprite: {src: string; w: number; h: number; outer: readonly number[]};
  x: number;
  y: number;
  R: number;
  sx?: number;
  sy?: number;
  face?: FaceState;
  facePop?: number;
}> = ({id, sprite, x, y, R, sx = 1, sy = 1, face, facePop = 1}) => {
  const s = R / sprite.outer[2];
  return (
    <div style={{position: 'absolute', left: x, top: y, transformOrigin: '0 0', transform: `scale(${sx}, ${sy})`}}>
      <Img
        src={staticFile(sprite.src)}
        style={{position: 'absolute', left: -sprite.outer[0] * s, top: -sprite.outer[1] * s, width: sprite.w * s, height: sprite.h * s}}
      />
      {face ? (
        <div style={{position: 'absolute', left: -x, top: -y}}>
          <ObjectFace id={id} x={x} y={y - R * 0.05} r={R * 0.95} open={face.open} brow={face.brow} mouth={face.mouth} look={face.look}
            squeeze={face.squeeze} pop={facePop} />
        </div>
      ) : null}
    </div>
  );
};
