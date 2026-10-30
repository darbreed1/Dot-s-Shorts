import React from 'react';

// An SVG whose user units are exactly the units of the layer it sits in, over an explicit box.
// (A 1x1 svg with overflow:visible drew its content at the wrong scale in the headless renderer.)
export type Box = readonly [number, number, number, number]; // x0, y0, x1, y1

export const WorldSvg: React.FC<{box: Box; children: React.ReactNode}> = ({box: [x0, y0, x1, y1], children}) => {
  const w = Math.max(1, x1 - x0);
  const h = Math.max(1, y1 - y0);
  return (
    <svg
      style={{position: 'absolute', left: x0, top: y0, overflow: 'visible'}}
      width={w}
      height={h}
      viewBox={`${x0} ${y0} ${w} ${h}`}
    >
      {children}
    </svg>
  );
};
