import React from 'react';
import {clamp01, easeOutBack} from './anim';
import {fontFamily} from './font';

// Chunky outlined label in the caption font (white or coloured fill, thick black outline), centred on (x, y),
// popping in with an overshoot at t0. Units are those of the layer / DesignSpace it sits in.

export const Label: React.FC<{
  t: number;
  t0: number;
  t1?: number;
  x: number;
  y: number;
  size: number;
  color?: string;
  children: React.ReactNode;
}> = ({t, t0, t1 = Infinity, x, y, size, color = '#FFFFFF', children}) => {
  if (t < t0 || t > t1) return null;
  const pop = easeOutBack(clamp01((t - t0) / 0.25), 2.4);
  const out = t1 === Infinity ? 1 : 1 - clamp01((t - (t1 - 0.15)) / 0.15);
  const s = pop * out;
  if (s <= 0.01) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 1000,
        top: y - size * 0.6,
        width: 2000,
        textAlign: 'center',
        fontFamily,
        fontSize: size,
        lineHeight: 1.1,
        color,
        WebkitTextStroke: `${size * 0.17}px #15151C`,
        paintOrder: 'stroke fill',
        whiteSpace: 'nowrap',
        transform: `scale(${s})`,
        transformOrigin: '50% 50%',
      }}
    >
      {children}
    </div>
  );
};
