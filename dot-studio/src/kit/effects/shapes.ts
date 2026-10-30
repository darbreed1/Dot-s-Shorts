// SVG path builders for code-drawn cartoon bits.

/** Five-point star centred on (cx, cy). */
export const starPath = (cx: number, cy: number, r: number, inner = 0.48) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * inner;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
};

/** Four-point sparkle (a twinkle) centred on (cx, cy). */
export const sparklePath = (cx: number, cy: number, r: number) => {
  const q = r * 0.22;
  return `M${cx},${cy - r} Q${cx + q},${cy - q} ${cx + r},${cy} Q${cx + q},${cy + q} ${cx},${cy + r} Q${cx - q},${cy + q} ${cx - r},${cy} Q${cx - q},${cy - q} ${cx},${cy - r}Z`;
};

/** Crescent moon: the outer circle's arc outside a second circle (bite) of radius r2 offset by `off`*r toward
 *  `deg` (0 = right, -90 = up), closed by the bite's arc. One closed outline, so it can be stroked. */
export const crescentPath = (cx: number, cy: number, r: number, off = 0.45, r2 = 0.85, deg = -30) => {
  const d = off * r;
  const R2 = r2 * r;
  const a = (r * r - R2 * R2 + d * d) / (2 * d); // distance from the centre to the chord through both tips
  const h = Math.sqrt(Math.max(r * r - a * a, 0));
  const th = (deg * Math.PI) / 180;
  const rot = (x: number, y: number) => `${(cx + x * Math.cos(th) - y * Math.sin(th)).toFixed(2)},${(cy + x * Math.sin(th) + y * Math.cos(th)).toFixed(2)}`;
  const p1 = rot(a, h);
  const p2 = rot(a, -h);
  const bigOuter = a > 0 ? 1 : 0;
  const bigInner = a - d > 0 ? 1 : 0;
  return `M${p1} A${r},${r} 0 ${bigOuter},1 ${p2} A${R2},${R2} 0 ${bigInner},0 ${p1} Z`;
};

/** Teardrop pointing up, centred on the round part (cx, cy). */
export const dropPath = (cx: number, cy: number, r: number) =>
  `M${cx},${cy - r * 2} C${cx + r * 0.35},${cy - r * 1.2} ${cx + r},${cy - r * 0.6} ${cx + r},${cy} ` +
  `A${r},${r} 0 1,1 ${cx - r},${cy} C${cx - r},${cy - r * 0.6} ${cx - r * 0.35},${cy - r * 1.2} ${cx},${cy - r * 2}Z`;
