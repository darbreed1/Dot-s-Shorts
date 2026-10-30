import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {Layer, camAt} from '../../kit/camera';
import {Dot, DotSprite} from '../../kit/Dot';
import {Mixer} from '../../kit/audio';
import {Captions} from '../../kit/Captions';
import {Glint} from '../../kit/effects/small';
import {CAMERA, DOT_SWAPS, FPS, SHOT, T, inCross, inHigh, inPanes} from './beats';
import {CabinWall, HOLE} from './Cabin';
import {CUES} from './cues';
import {WORDS} from './captions';
import {Cross, Panes, UpHigh} from './Inserts';
import {S} from './sprites';

// World layout (world px; a layer at Z 1000 is 1:1 at the wide camera). A cabin wall with one big window; Dot
// stands on the front edge of a seat (flipped so its back is behind him) and studies the window.
const Z = {wall: 1060, seat: 1000};
const HEAD_R = 100;
const SEAT_H = 560;
const SEAT_S = SEAT_H / S.seat.h;
const DOT_FEET = {x: 380, y: 1560};
// the seat is drawn mirrored: its cushion point (sprite px) lands under Dot's feet
const SEAT_POS = {x: DOT_FEET.x - (S.seat.w - S.seat.cushion[0]) * SEAT_S, y: DOT_FEET.y - S.seat.cushion[1] * SEAT_S};

const dots = S as unknown as Record<string, DotSprite>;

export const AirplaneWindow: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const cam = camAt(CAMERA, t);
  const insert = inPanes(t) ? <Panes t={t} /> : inHigh(t) ? <UpHigh t={t} /> : inCross(t) ? <Cross t={t} /> : null;
  // a gentle cabin bump now and then
  const bump = 3 * Math.sin(2 * Math.PI * 0.21 * t) * Math.sin(2 * Math.PI * 0.07 * t);
  const camB = {...cam, y: cam.y + bump};
  return (
    <AbsoluteFill style={{backgroundColor: '#EFE8DA'}}>
      {insert ?? (
        <>
          <Layer cam={camB} z={Z.wall} minDepth={150}>
            <CabinWall t={t} />
            <Glint t={t} t0={T.hole} x={HOLE.x + 26} y={HOLE.y - 26} r={22} ink={3} />
          </Layer>
          <Layer cam={camB} z={Z.seat} minDepth={150}>
            <Img src={staticFile(S.seat.src)} style={{position: 'absolute', left: SEAT_POS.x, top: SEAT_POS.y, width: S.seat.w * SEAT_S, height: S.seat.h * SEAT_S, transform: 'scaleX(-1)'}} />
            <Dot t={t} sprites={dots} swaps={DOT_SWAPS} feet={DOT_FEET} headR={HEAD_R} shadow={false} bounces={[T.tiny, T.purpose, T.fog]} />
          </Layer>
        </>
      )}
      <Captions t={t} words={WORDS} y={inPanes(t) || inCross(t) ? 0.66 : inHigh(t) ? 0.6 : 0.72} />
      <Mixer cues={CUES} />
    </AbsoluteFill>
  );
};
