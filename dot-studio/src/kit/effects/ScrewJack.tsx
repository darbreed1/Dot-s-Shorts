import React from 'react';

// A cartoon screw jack drawn in code: a wide iron foot, a threaded column whose length follows the lift, a flat top
// plate. Sits in any SVG (WorldSvg / DesignSpace svg). (x, yBottom) = centre of the foot on the ground, yTop = the
// underside it pushes against; w = the foot width. `turn` (0..1, wraps) slides the thread lines so it reads as turning.
const INK = '#15151C';

export const ScrewJack: React.FC<{x: number; yTop: number; yBottom: number; w: number; turn?: number; ink?: number}> = ({
  x, yTop, yBottom, w, turn = 0, ink,
}) => {
  const h = yBottom - yTop;
  if (h < w * 0.25) return null;
  const k = ink ?? w * 0.07;
  const foot = w * 0.32;
  const plate = w * 0.12;
  const col = w * 0.28;
  const y0 = yTop + plate;
  const y1 = yBottom - foot;
  const pitch = w * 0.16;
  const off = (((turn % 1) + 1) % 1) * pitch;
  const threads: number[] = [];
  for (let y = y0 + off; y < y1; y += pitch) threads.push(y);
  return (
    <g>
      {/* foot */}
      <path
        d={`M${x - w / 2},${yBottom} L${x - w * 0.3},${yBottom - foot} L${x + w * 0.3},${yBottom - foot} L${x + w / 2},${yBottom} Z`}
        fill="#4A4F58"
        stroke={INK}
        strokeWidth={k}
        strokeLinejoin="round"
      />
      {/* threaded column */}
      {y1 > y0 ? <rect x={x - col / 2} y={y0} width={col} height={y1 - y0} fill="#6C727D" stroke={INK} strokeWidth={k} /> : null}
      {threads.map((y, i) => (
        <line key={i} x1={x - col / 2} y1={y + pitch * 0.3} x2={x + col / 2} y2={y} stroke={INK} strokeWidth={k * 0.6} />
      ))}
      {/* top plate */}
      <rect x={x - w * 0.36} y={yTop} width={w * 0.72} height={plate} rx={plate * 0.3} fill="#4A4F58" stroke={INK} strokeWidth={k} />
    </g>
  );
};
