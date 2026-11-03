import React from 'react';

// A faceless sign-style figure (round head, rounded body, stick arms) for people who should not be drawn as
// characters: real people (researchers, officials) or anonymous crowds and families. SVG group; (x, y) = the feet
// centre, h = total height. `coat` draws a white open lab coat over the body; `hold` = 'pencil' adds a pencil.
const INK = '#15151C';

export const Pictogram: React.FC<{
  x: number;
  y: number;
  h: number;
  color: string;
  coat?: boolean;
  hold?: 'pencil';
  scale?: number; // pop / bounce about the feet
  ink?: number;
}> = ({x, y, h, color, coat = false, hold, scale = 1, ink}) => {
  if (scale <= 0.01) return null;
  const k = ink ?? h * 0.022;
  const r = h * 0.17;
  const bw = h * 0.42;
  const bh = h * 0.6;
  const headY = -h + r;
  const bodyTop = -h + r * 2 + h * 0.03;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* arms */}
      <path d={`M${-bw * 0.45},${bodyTop + bh * 0.2} L${-bw * 0.75},${bodyTop + bh * 0.62}`} stroke={INK} strokeWidth={k * 3.4} strokeLinecap="round" />
      <path d={`M${bw * 0.45},${bodyTop + bh * 0.2} L${bw * 0.78},${bodyTop + bh * (hold ? 0.3 : 0.62)}`} stroke={INK} strokeWidth={k * 3.4} strokeLinecap="round" />
      <path d={`M${-bw * 0.45},${bodyTop + bh * 0.2} L${-bw * 0.75},${bodyTop + bh * 0.62}`} stroke={coat ? '#FFFFFF' : color} strokeWidth={k * 1.6} strokeLinecap="round" />
      <path d={`M${bw * 0.45},${bodyTop + bh * 0.2} L${bw * 0.78},${bodyTop + bh * (hold ? 0.3 : 0.62)}`} stroke={coat ? '#FFFFFF' : color} strokeWidth={k * 1.6} strokeLinecap="round" />
      {hold === 'pencil' ? (
        <g transform={`translate(${bw * 0.8} ${bodyTop + bh * 0.28}) rotate(-35)`}>
          <rect x={-k * 1.2} y={-h * 0.2} width={k * 2.4} height={h * 0.2} fill="#F2C14E" stroke={INK} strokeWidth={k * 0.8} />
          <path d={`M${-k * 1.2},0 L0,${h * 0.05} L${k * 1.2},0 Z`} fill="#E8C9A0" stroke={INK} strokeWidth={k * 0.8} strokeLinejoin="round" />
        </g>
      ) : null}
      {/* body */}
      <rect x={-bw / 2} y={bodyTop} width={bw} height={bh} rx={bw * 0.42} fill={color} stroke={INK} strokeWidth={k} />
      {coat ? (
        <>
          <path d={`M${-bw / 2},${bodyTop + bw * 0.4} Q${-bw / 2},${bodyTop} ${-bw * 0.12},${bodyTop} L${-bw * 0.04},${bodyTop + bh} L${-bw / 2 + bw * 0.08},${bodyTop + bh} Z`} fill="#FFFFFF" stroke={INK} strokeWidth={k} strokeLinejoin="round" />
          <path d={`M${bw / 2},${bodyTop + bw * 0.4} Q${bw / 2},${bodyTop} ${bw * 0.12},${bodyTop} L${bw * 0.04},${bodyTop + bh} L${bw / 2 - bw * 0.08},${bodyTop + bh} Z`} fill="#FFFFFF" stroke={INK} strokeWidth={k} strokeLinejoin="round" />
        </>
      ) : null}
      {/* head */}
      <circle cx={0} cy={headY} r={r} fill={color} stroke={INK} strokeWidth={k} />
    </g>
  );
};
