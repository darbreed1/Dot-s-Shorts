import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01, kick, lastAt} from './anim';

// Dot rig: one cut-out picture per pose, swapped (never cross-faded) on a frame where motion hides it.
// Every pose is scaled so its head radius is the same in the world, and stands on the same feet point.

export type DotSprite = {
  src: string;
  w: number;
  h: number;
  head: readonly number[]; // x, y, r (sprite px)
  feet: readonly number[]; // x, y (sprite px)
  ball?: readonly number[]; // antenna ball x, y, r
};

/** turn = squash scaleX to 0.8 and swap on the narrowest frame; squash = anticipation then stretch; cut = plain swap. */
export type Swap = {at: number; pose: string; style?: 'turn' | 'squash' | 'cut'};

export type DotOverlay = (p: {sprite: DotSprite; s: number; pt: (x: number, y: number) => {x: number; y: number}}) => React.ReactNode;

export const Dot: React.FC<{
  t: number;
  sprites: Record<string, DotSprite>;
  swaps: readonly Swap[];
  feet: {x: number; y: number}; // world
  headR: number; // world head radius
  bounces?: readonly number[]; // small key-word bounces
  rock?: number; // extra rotation (deg) about the feet
  breathe?: boolean;
  shadow?: boolean;
  overlay?: DotOverlay;
}> = ({t, sprites, swaps, feet, headR, bounces = [], rock = 0, breathe = true, shadow = true, overlay}) => {
  const cur = lastAt(swaps, t);
  const next = swaps.find((s) => s.at > t);
  const sp = sprites[cur.pose];
  const s = headR / sp.head[2];

  let sx = 1;
  let sy = 1;
  // turn: narrow into the swap, widen out of it
  const turnDist = (sw: Swap | undefined) => (sw && sw.style === 'turn' ? Math.abs(t - sw.at) : Infinity);
  const dTurn = Math.min(turnDist(cur), turnDist(next));
  if (dTurn < 0.09) {
    const u = 1 - dTurn / 0.09;
    sx *= 1 - 0.2 * u * u;
    sy *= 1 + 0.03 * u * u;
  }
  // squash: anticipation 0.12 s before the swap, then a stretch that settles
  if (next && next.style === 'squash' && next.at - t < 0.12) {
    const u = clamp01(1 - (next.at - t) / 0.12);
    sy *= 1 - 0.06 * u;
    sx *= 1 + 0.04 * u;
  }
  if (cur.style === 'squash') {
    const k = kick(t, cur.at, 0.035, 3.5, 7);
    sy *= 1 + k;
    sx *= 1 - k * 0.6;
  }
  for (const b of bounces) {
    const k = kick(t, b, -0.025, 4, 8);
    sy *= 1 + k;
    sx *= 1 - k * 0.5;
  }
  if (breathe) sy *= 1 + 0.009 * Math.sin(2 * Math.PI * 0.6 * t);

  const pt = (x: number, y: number) => ({x: (x - sp.feet[0]) * s, y: (y - sp.feet[1]) * s});

  return (
    <>
      {shadow ? (
        <div
          style={{
            position: 'absolute',
            left: feet.x - headR * 1.15 * sx,
            top: feet.y - headR * 0.13,
            width: headR * 2.3 * sx,
            height: headR * 0.26,
            borderRadius: '50%',
            background: 'rgba(72, 54, 42, 0.26)',
            filter: 'blur(3px)',
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: feet.x,
          top: feet.y,
          transformOrigin: '0 0',
          transform: `rotate(${rock}deg) scale(${sx}, ${sy})`,
        }}
      >
        <Img
          src={staticFile(sp.src)}
          style={{position: 'absolute', left: -sp.feet[0] * s, top: -sp.feet[1] * s, width: sp.w * s, height: sp.h * s}}
        />
        {overlay ? overlay({sprite: sp, s, pt}) : null}
      </div>
    </>
  );
};
